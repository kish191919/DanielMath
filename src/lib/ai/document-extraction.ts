import "server-only";
import { PDFDocument } from "pdf-lib";
import type { z, ZodType } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient } from "./claude";
import { createAdminSupabase } from "@/lib/supabase/admin";

export type DocumentMimeType = "image/jpeg" | "image/png" | "application/pdf";

// 문항이 많은 문서는 adaptive thinking이 max_tokens 예산을 대부분 소진해버려
// 정작 JSON 출력이 중간에 잘리는 경우가 있다. 이를 막기 위해 페이지 수가 많은
// PDF는 여러 개의 작은 호출로 나눠 보낸다. (원래 grade-worksheet.ts에 있던
// 청킹 로직을 문서 종류에 상관없이 재사용할 수 있게 그대로 옮겨온 것.)
const CHUNK_THRESHOLD_PAGES = 6;
const PAGES_PER_CHUNK = 4;
const MAX_TOKENS_PER_CALL = 32000;

interface PdfChunk {
  base64: string;
  startPage: number; // 1-indexed, inclusive
  endPage: number; // 1-indexed, inclusive
  totalPages: number;
}

async function downloadBuffer(bucket: string, storagePath: string): Promise<Buffer> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.storage.from(bucket).download(storagePath);
  if (error || !data) {
    throw new Error(error?.message ?? "파일을 다운로드할 수 없습니다.");
  }
  return Buffer.from(await data.arrayBuffer());
}

function buildFileContentBlock(mimeType: DocumentMimeType, base64: string) {
  if (mimeType === "application/pdf") {
    return {
      type: "document" as const,
      source: { type: "base64" as const, media_type: "application/pdf" as const, data: base64 },
    };
  }
  return {
    type: "image" as const,
    source: { type: "base64" as const, media_type: mimeType, data: base64 },
  };
}

async function buildPdfChunks(
  buffer: Buffer,
  pagesPerChunk: number,
  chunkThresholdPages: number,
): Promise<PdfChunk[]> {
  const srcDoc = await PDFDocument.load(buffer);
  const totalPages = srcDoc.getPageCount();

  if (totalPages <= chunkThresholdPages) {
    return [{ base64: buffer.toString("base64"), startPage: 1, endPage: totalPages, totalPages }];
  }

  const chunks: PdfChunk[] = [];
  for (let start = 0; start < totalPages; start += pagesPerChunk) {
    const end = Math.min(start + pagesPerChunk, totalPages);
    const chunkDoc = await PDFDocument.create();
    const pageIndices = Array.from({ length: end - start }, (_, i) => start + i);
    const copiedPages = await chunkDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => chunkDoc.addPage(page));
    const bytes = await chunkDoc.save();
    chunks.push({
      base64: Buffer.from(bytes).toString("base64"),
      startPage: start + 1,
      endPage: end,
      totalPages,
    });
  }
  return chunks;
}

function isWholeDocument(chunk: PdfChunk): boolean {
  return chunk.startPage === 1 && chunk.endPage === chunk.totalPages;
}

function describeChunkRange(chunk: PdfChunk): string {
  return isWholeDocument(chunk) ? "전체" : `${chunk.startPage}-${chunk.endPage}페이지`;
}

// 청크가 전체 문서가 아닐 때만 안내를 추가한다. system 프롬프트 캐시 프리픽스
// 뒤(messages)에 붙기 때문에 청크마다 달라져도 캐시 히트에는 영향이 없다.
function buildChunkContextNote(chunk: PdfChunk): string | null {
  if (isWholeDocument(chunk)) return null;
  return `참고: 이 파일은 전체 문서(총 ${chunk.totalPages}페이지) 중 ${chunk.startPage}~${chunk.endPage}페이지입니다. 이 범위 안에 있는 내용만 처리하세요. 문제 번호가 1번부터 시작하지 않거나 이 범위 끝에서 내용이 끝나 보여도 정상입니다 — 다른 페이지의 내용은 신경 쓰지 않아도 됩니다.`;
}

export interface ExtractStructuredItemsOptions<T> {
  bucket: string;
  storagePath: string;
  mimeType: DocumentMimeType;
  // 지침 + 참고 데이터(개념 코드 목록 등)를 합쳐 미리 만들어진 시스템 프롬프트
  // 텍스트. 청크마다 동일하므로 호출부에서 cache_control로 캐싱된다.
  systemText: string;
  itemsSchema: ZodType<{ items: T[] }>;
  model: string;
  effort: "low" | "medium" | "high" | "xhigh" | "max";
  // 에러 메시지/로그에 쓰이는 이 작업의 이름 (예: "AI 채점", "문제 추출").
  label: string;
  // 로그에 남길 식별자 (예: scanId) — 실패 원인 추적용.
  logId: string;
  // PDF 청킹 시 청크당 페이지 수. 기본 PAGES_PER_CHUNK(4) — 재시도 시 더 작은
  // 값을 넘겨 청크당 처리 시간을 줄이는 용도로 쓰인다 (grade-worksheet.ts 참고).
  pagesPerChunk?: number;
  // 이 페이지 수 이하면 청킹 없이 한 번의 호출로 처리한다. 기본
  // CHUNK_THRESHOLD_PAGES(6) — extractReferenceProblems처럼 사진 몇 장짜리
  // 업로드도 페이지별로 병렬 처리하고 싶을 때 더 낮은 값(예: 1)을 넘긴다.
  chunkThresholdPages?: number;
  // "staged"(기본) — 첫 청크를 단독으로 기다려 프롬프트 캐시를 데운 뒤
  // 나머지를 동시에 실행. 청크가 많은 문서(채점)에서는 캐시 적중으로 비용을
  // 아끼면서도 대기 시간은 청크1 + max(나머지)로 줄어들지만, 청크가 정확히
  // 2개일 때는 사실상 완전 순차 실행과 같아진다 — 사진 2장짜리 업로드처럼
  // 청크 수가 적고 지연시간이 비용보다 중요할 땐 "full"을 넘겨 모든 청크를
  // 처음부터 동시에 실행한다 (캐시 적중은 못 받지만 전체 지연시간이
  // max(모든 청크)로 줄어든다).
  chunkConcurrency?: "staged" | "full";
  // "adaptive"(기본) — extended thinking을 켜서 모델이 스스로 얼마나
  // 생각할지 정하게 한다. effort를 낮춰도 thinking 자체는 켜져 있으므로
  // (Claude Sonnet 5는 adaptive가 유일한 on-mode) 여전히 추론 단계를 거친다.
  // 채점처럼 정확한 판단이 필요한 작업엔 유지하되, 단순 전사 작업은
  // "disabled"로 꺼서 추론 단계를 아예 건너뛰면 지연시간이 크게 줄어든다.
  thinking?: "adaptive" | "disabled";
}

// 파일을 다운로드해 (PDF면 필요시 청킹한 뒤) Claude 구조화 출력으로 보내고,
// 모든 청크의 items를 하나의 배열로 합쳐 반환하는 범용 엔진. 채점/참고문제
// 추출처럼 "문서 → 구조화된 항목 배열"을 뽑아내는 모든 파이프라인이 공유한다.
export async function extractStructuredItems<T>(
  options: ExtractStructuredItemsOptions<T>,
): Promise<T[]> {
  const {
    bucket,
    storagePath,
    mimeType,
    systemText,
    itemsSchema,
    model,
    effort,
    label,
    logId,
    pagesPerChunk = PAGES_PER_CHUNK,
    chunkThresholdPages = CHUNK_THRESHOLD_PAGES,
    chunkConcurrency = "staged",
    thinking = "adaptive",
  } = options;

  const buffer = await downloadBuffer(bucket, storagePath);
  const chunks: PdfChunk[] =
    mimeType === "application/pdf"
      ? await buildPdfChunks(buffer, pagesPerChunk, chunkThresholdPages)
      : [{ base64: buffer.toString("base64"), startPage: 1, endPage: 1, totalPages: 1 }];

  const client = getClaudeClient();
  // 지침/참고 데이터는 청크마다 완전히 동일한 텍스트이므로 system 파라미터에
  // cache_control로 표시해, 두 번째 청크부터는 캐시로 저렴하게 처리되도록
  // 한다. messages 쪽 콘텐츠(파일 바이트)는 청크마다 달라지므로 캐시
  // 프리픽스 밖(system과 분리된 자리)에 둬야 캐시가 매번 깨지지 않는다.
  const systemBlocks = [
    { type: "text" as const, text: systemText, cache_control: { type: "ephemeral" as const } },
  ];

  async function runChunk(chunk: PdfChunk): Promise<T[]> {
    const fileBlock = buildFileContentBlock(mimeType, chunk.base64);
    const note = buildChunkContextNote(chunk);
    const content = note ? [fileBlock, { type: "text" as const, text: note }] : [fileBlock];

    const stream = client.messages.stream({
      model,
      max_tokens: MAX_TOKENS_PER_CALL,
      thinking: { type: thinking },
      system: systemBlocks,
      output_config: { format: zodOutputFormat(itemsSchema), effort },
      messages: [{ role: "user", content }],
    });

    let response;
    try {
      response = await stream.finalMessage();
    } catch (err) {
      // finalMessage() awaits the stream's internal endPromise, which the SDK
      // rejects as soon as JSON parsing fails on message_stop — before our
      // own stop_reason check below ever runs. stream.currentMessage still
      // holds the last accumulated snapshot (including stop_reason from
      // message_delta) even after that rejection, so we can still detect a
      // max_tokens cutoff here.
      if (stream.currentMessage?.stop_reason === "max_tokens") {
        throw new Error(
          `${label} 응답이 잘렸습니다 (${describeChunkRange(chunk)} 처리 중, max_tokens 도달). 문항 수가 많을 수 있습니다.`,
        );
      }
      throw err;
    }

    if (response.stop_reason === "max_tokens") {
      throw new Error(
        `${label} 응답이 잘렸습니다 (${describeChunkRange(chunk)} 처리 중, max_tokens 도달). 문항 수가 많을 수 있습니다.`,
      );
    }
    if (!response.parsed_output) {
      const rawContent = response.content
        .map((block) => {
          if (block.type === "text") return `[text] ${block.text}`;
          if (block.type === "thinking") return `[thinking] ${block.thinking}`;
          return `[${block.type}]`;
        })
        .join("\n---\n");
      console.error(
        `[extractStructuredItems] ${logId} (${describeChunkRange(chunk)}): parsed_output missing (stop_reason=${response.stop_reason})\n${rawContent.slice(0, 4000)}`,
      );
      throw new Error(
        `${label} 결과를 파싱하지 못했습니다 (${describeChunkRange(chunk)}, stop_reason: ${response.stop_reason}). 서버 콘솔에 상세 로그가 남았습니다.`,
      );
    }

    return (response.parsed_output as z.infer<typeof itemsSchema>).items;
  }

  if (chunkConcurrency === "full") {
    const allChunkItems = await Promise.all(chunks.map(runChunk));
    return allChunkItems.flat();
  }

  // 첫 청크는 단독으로 기다려 프롬프트 캐시를 먼저 데운 뒤, 나머지 청크는
  // 그 캐시를 읽기만 하면 되므로 동시에 실행한다 — 전체 지연 시간을
  // sum(청크 시간)에서 대략 청크1 + max(나머지)로 줄인다. 청크 하나라도
  // 실패하면 Promise.all이 그 청크의 에러로 reject되어 전체 작업이
  // 실패하는 것은 기존과 동일한 all-or-nothing 동작이다.
  const [firstChunk, ...restChunks] = chunks;
  const firstItems = await runChunk(firstChunk);
  const restItems =
    restChunks.length > 0 ? await Promise.all(restChunks.map(runChunk)) : [];
  return [firstItems, ...restItems].flat();
}
