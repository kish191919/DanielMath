import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, GRADING_MODEL, GRADING_EFFORT } from "./claude";
import { WorksheetGradingSchema } from "./grading-schema";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { Concept, WorksheetScan } from "@/lib/supabase/types";

const BUCKET = "worksheet-scans";

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

async function downloadScanAsBase64(storagePath: string): Promise<string> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.storage.from(BUCKET).download(storagePath);
  if (error || !data) {
    throw new Error(error?.message ?? "스캔 파일을 다운로드할 수 없습니다.");
  }
  const buffer = Buffer.from(await data.arrayBuffer());
  return buffer.toString("base64");
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

  const base64 = await downloadScanAsBase64(scan.storage_path);
  const fileBlock = buildFileContentBlock(scan.mime_type, base64);

  const client = getClaudeClient();
  // Adaptive thinking tokens count against max_tokens too, and a dense
  // multi-page worksheet can burn through a lot of that budget before the
  // JSON output even starts — 8192, then 16000, both got cut off mid-response
  // on real worksheets. Streaming (+ a generous max_tokens) removes the SDK
  // HTTP timeout risk of waiting on one huge non-streamed response, and only
  // the tokens actually generated are billed either way.
  const stream = client.messages.stream({
    model: GRADING_MODEL,
    max_tokens: 32000,
    thinking: { type: "adaptive" },
    output_config: {
      format: zodOutputFormat(WorksheetGradingSchema),
      effort: GRADING_EFFORT,
    },
    messages: [
      {
        role: "user",
        content: [
          fileBlock,
          {
            type: "text",
            text: `${GRADING_INSTRUCTIONS}\n\n사용 가능한 개념 코드 목록:\n${buildConceptListText(conceptList)}`,
          },
        ],
      },
    ],
  });
  const response = await stream.finalMessage();

  if (response.stop_reason === "max_tokens") {
    throw new Error(
      "AI 채점 응답이 잘렸습니다 (max_tokens 도달). 문제 수가 많은 워크시트일 수 있습니다.",
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
      `[gradeWorksheetScan] scan ${scanId}: parsed_output missing (stop_reason=${response.stop_reason})\n${rawContent.slice(0, 4000)}`,
    );
    throw new Error(
      `AI 채점 결과를 파싱하지 못했습니다 (stop_reason: ${response.stop_reason}). 서버 콘솔에 상세 로그가 남았습니다.`,
    );
  }

  const items = response.parsed_output.items;

  if (items.length > 0) {
    const rows = items.map((item) => {
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
