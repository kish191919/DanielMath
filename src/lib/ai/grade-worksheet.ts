import "server-only";
import { PDFDocument } from "pdf-lib";
import type Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, GRADING_MODEL, GRADING_EFFORT } from "./claude";
import { WorksheetGradingSchema, type GradedItem } from "./grading-schema";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Concept, WorksheetScan } from "@/lib/supabase/types";

const BUCKET = "worksheet-scans";

// 15270자 지점에서 JSON이 잘리는 등, 문항이 많은 워크시트는 adaptive thinking이
// max_tokens 예산을 대부분 소진해버려 정작 JSON 출력이 중간에 잘린다. 이를 막기
// 위해 페이지 수가 많은 PDF는 여러 개의 작은 호출로 나눠 보낸다.
const CHUNK_THRESHOLD_PAGES = 6;
const PAGES_PER_CHUNK = 4;
const MAX_TOKENS_PER_CALL = 32000;

const GRADING_INSTRUCTIONS = `당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 채점 보조입니다.
학생 한 명이 푼 프린트물 스캔/사진(여러 페이지일 수 있음)이 첨부되어 있습니다. 다음 지침에 따라 채점하세요.

1. 모든 페이지에 있는 모든 문제를 빠짐없이 개별 항목으로 추출하세요. 3a, 3b처럼 하위 문항이 있으면 각각을 별도 항목으로 다루세요.
2. 학생이 쓴 답을 있는 그대로 옮겨 적으세요(transcribed_answer). 답이 비어있거나 판독이 불가능하면 null로 두세요.
3. 문제와 학생 답을 근거로 정답 여부(is_correct)를 직접 판단하세요.
4. concept_code는 아래 제공된 개념 코드 목록 중 이 문제에 가장 가까운 것 하나를 선택하세요. 적절한 항목이 없으면 null로 두세요. 목록에 없는 코드를 만들어내지 마세요.
5. 오답인 경우에만 error_type을 아래 7개 중 하나로 선택하세요: calculation_mistake(계산 실수), place_value_error(자릿수 오류), fraction_concept(분수 개념), word_problem_interpretation(단어 문제 해석), unit_conversion(단위 변환), pattern_recognition(패턴 인식), time_pressure(시간 부족). 정답인 경우 error_type은 null입니다.
6. 이미지를 자르거나 좌표를 반환하지 마세요 — 문제 텍스트만 그대로 옮겨 적으면 됩니다.
7. 확신이 서지 않는 부분(글씨 판독 어려움 등)은 confidence_note에 짧게 남기세요. 없으면 null.
8. items를 절대 빈 배열로 반환하지 마세요. 페이지에 손글씨 말풍선, 캐릭터 낙서, 동그라미 표시 등이 섞여 있어 복잡해 보여도 그 안에 실제 문제와 학생 답이 있습니다. 문항을 찾기 어렵다고 느껴지면 페이지를 처음부터 다시 살펴보고 최소 1개 이상을 반드시 추출하세요.`;

function buildConceptListText(concepts: Concept[]): string {
  return concepts
    .map((c) => `${c.code}: ${c.label_ko}${c.label_en ? ` (${c.label_en})` : ""}`)
    .join("\n");
}

async function downloadScanBuffer(storagePath: string): Promise<Buffer> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.storage.from(BUCKET).download(storagePath);
  if (error || !data) {
    throw new Error(error?.message ?? "스캔 파일을 다운로드할 수 없습니다.");
  }
  return Buffer.from(await data.arrayBuffer());
}

function buildFileContentBlock(mimeType: WorksheetScan["mime_type"], base64: string) {
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

interface PdfChunk {
  base64: string;
  startPage: number; // 1-indexed, inclusive
  endPage: number; // 1-indexed, inclusive
  totalPages: number;
}

// PDF 전체를 한 번에 보내면 문항이 많을 때 max_tokens 예산을 넘기 쉬우므로,
// CHUNK_THRESHOLD_PAGES를 넘는 PDF는 PAGES_PER_CHUNK씩 잘라 여러 번 나눠 보낸다.
async function buildPdfChunks(buffer: Buffer): Promise<PdfChunk[]> {
  const srcDoc = await PDFDocument.load(buffer);
  const totalPages = srcDoc.getPageCount();

  if (totalPages <= CHUNK_THRESHOLD_PAGES) {
    return [{ base64: buffer.toString("base64"), startPage: 1, endPage: totalPages, totalPages }];
  }

  const chunks: PdfChunk[] = [];
  for (let start = 0; start < totalPages; start += PAGES_PER_CHUNK) {
    const end = Math.min(start + PAGES_PER_CHUNK, totalPages);
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
  return `참고: 이 파일은 전체 워크시트(총 ${chunk.totalPages}페이지) 중 ${chunk.startPage}~${chunk.endPage}페이지입니다. 이 범위 안에 있는 문제만 채점하세요. 문제 번호가 1번부터 시작하지 않거나 이 범위 끝에서 문제가 끝나 보여도 정상입니다 — 다른 페이지의 내용은 신경 쓰지 않아도 됩니다.`;
}

// 채점 지침과 개념 코드 목록은 청크마다 완전히 동일한 텍스트이므로 system
// 파라미터에 cache_control로 표시해, 두 번째 청크부터는 캐시로 저렴하게
// 처리되도록 한다. messages 쪽 콘텐츠(PDF 바이트)는 청크마다 달라지므로
// 캐시 프리픽스 밖(system과 분리된 자리)에 둬야 캐시가 매번 깨지지 않는다.
function buildSystemBlocks(conceptList: Concept[]) {
  return [
    {
      type: "text" as const,
      text: `${GRADING_INSTRUCTIONS}\n\n사용 가능한 개념 코드 목록:\n${buildConceptListText(conceptList)}`,
      cache_control: { type: "ephemeral" as const },
    },
  ];
}

async function gradeChunk(
  client: Anthropic,
  systemBlocks: ReturnType<typeof buildSystemBlocks>,
  mimeType: WorksheetScan["mime_type"],
  chunk: PdfChunk,
  scanId: string,
): Promise<GradedItem[]> {
  const fileBlock = buildFileContentBlock(mimeType, chunk.base64);
  const note = buildChunkContextNote(chunk);
  const content = note ? [fileBlock, { type: "text" as const, text: note }] : [fileBlock];

  const stream = client.messages.stream({
    model: GRADING_MODEL,
    max_tokens: MAX_TOKENS_PER_CALL,
    thinking: { type: "adaptive" },
    system: systemBlocks,
    output_config: {
      format: zodOutputFormat(WorksheetGradingSchema),
      effort: GRADING_EFFORT,
    },
    messages: [{ role: "user", content }],
  });

  let response;
  try {
    response = await stream.finalMessage();
  } catch (err) {
    // finalMessage() awaits the stream's internal endPromise, which the SDK
    // rejects as soon as JSON parsing fails on message_stop — before our own
    // stop_reason check below ever runs. stream.currentMessage still holds
    // the last accumulated snapshot (including stop_reason from message_delta)
    // even after that rejection, so we can still detect a max_tokens cutoff here.
    if (stream.currentMessage?.stop_reason === "max_tokens") {
      throw new Error(
        `AI 채점 응답이 잘렸습니다 (${describeChunkRange(chunk)} 채점 중, max_tokens 도달). 문제 수가 많은 워크시트일 수 있습니다.`,
      );
    }
    throw err;
  }

  if (response.stop_reason === "max_tokens") {
    throw new Error(
      `AI 채점 응답이 잘렸습니다 (${describeChunkRange(chunk)} 채점 중, max_tokens 도달). 문제 수가 많은 워크시트일 수 있습니다.`,
    );
  }
  if (!response.parsed_output) {
    // Log the raw content (text + thinking blocks) so a failure — including
    // the model validly returning zero items, which now fails schema
    // validation via WorksheetGradingSchema's items.min(1) — is diagnosable
    // from the server console instead of being a silent black box.
    const rawContent = response.content
      .map((block) => {
        if (block.type === "text") return `[text] ${block.text}`;
        if (block.type === "thinking") return `[thinking] ${block.thinking}`;
        return `[${block.type}]`;
      })
      .join("\n---\n");
    console.error(
      `[gradeWorksheetScan] scan ${scanId} (${describeChunkRange(chunk)}): parsed_output missing (stop_reason=${response.stop_reason})\n${rawContent.slice(0, 4000)}`,
    );
    throw new Error(
      `AI 채점 결과를 파싱하지 못했습니다 (${describeChunkRange(chunk)}, stop_reason: ${response.stop_reason}). 서버 콘솔에 상세 로그가 남았습니다.`,
    );
  }

  return response.parsed_output.items;
}

export async function gradeWorksheetScan(scanId: string): Promise<void> {
  const admin = createAdminSupabase();

  const { data: scan, error: scanError } = await admin
    .from("worksheet_scans")
    .select("*")
    .eq("id", scanId)
    .maybeSingle<WorksheetScan>();
  if (scanError) throw new Error(scanError.message);
  if (!scan) throw new Error("스캔 정보를 찾을 수 없습니다.");

  const { data: concepts, error: conceptsError } = await admin
    .from("concepts")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .returns<Concept[]>();
  if (conceptsError) throw new Error(conceptsError.message);

  const conceptList = concepts ?? [];
  const conceptByCode = new Map(conceptList.map((c) => [c.code, c]));

  const buffer = await downloadScanBuffer(scan.storage_path);
  const chunks: PdfChunk[] =
    scan.mime_type === "application/pdf"
      ? await buildPdfChunks(buffer)
      : [{ base64: buffer.toString("base64"), startPage: 1, endPage: 1, totalPages: 1 }];

  const client = getClaudeClient();
  const systemBlocks = buildSystemBlocks(conceptList);

  // Chunk 1 runs alone and awaited so it finishes writing the prompt cache
  // before any other chunk starts reading it. Chunks 2+ only need that
  // cache to already exist (not to run one-at-a-time themselves), so once
  // it's warm they fire concurrently via Promise.all — turning total
  // latency from sum(chunk times) into roughly chunk1 + max(rest). One
  // failing chunk still aborts the whole grading attempt (no partial writes
  // below): Promise.all rejects with that chunk's error, which still
  // reports its correct page range via the describeChunkRange() closure in
  // gradeChunk(), matching the previous all-or-nothing behavior.
  const [firstChunk, ...restChunks] = chunks;
  const firstItems = await gradeChunk(client, systemBlocks, scan.mime_type, firstChunk, scanId);
  const restItems =
    restChunks.length > 0
      ? await Promise.all(
          restChunks.map((chunk) => gradeChunk(client, systemBlocks, scan.mime_type, chunk, scanId)),
        )
      : [];
  const allItems: GradedItem[] = [firstItems, ...restItems].flat();

  if (allItems.length > 0) {
    const rows = allItems.map((item) => {
      const concept = item.concept_code ? conceptByCode.get(item.concept_code) : undefined;
      return {
        scan_id: scanId,
        student_id: scan.student_id,
        problem_number: item.problem_number,
        transcribed_problem: item.transcribed_problem,
        transcribed_answer: item.transcribed_answer,
        is_correct: item.is_correct,
        concept_id: concept?.id ?? null,
        error_type: item.is_correct ? null : item.error_type,
        ai_confidence_note: item.confidence_note,
        ai_suggested: item,
        source: "ai" as const,
        edited_by_teacher: false,
        confirmed: false,
        session_date: scan.session_date,
      };
    });

    const { error: insertError } = await admin.from("learning_items").insert(rows);
    if (insertError) throw new Error(insertError.message);
  }

  const { error: updateError } = await admin
    .from("worksheet_scans")
    .update({ status: "pending_review", graded_at: new Date().toISOString() })
    .eq("id", scanId);
  if (updateError) throw new Error(updateError.message);
}
