import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, PARENT_REPORT_MODEL, PARENT_REPORT_EFFORT } from "./claude";
import { ParentReportDraftSchema } from "./parent-report-draft-schema";

const PERSONA =
  "당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방 'Daniel Math'의 학부모 안내문 작성 보조입니다. " +
  "아래는 선생님이 간단히 한국어로 적은 오늘의 학습 리포트 메모입니다. " +
  "이 내용을 바탕으로 학부모에게 보낼 정중하고 자연스러운 영어 안내문을 작성하세요. " +
  "규칙: " +
  "1) 원본에 없는 정보를 지어내지 마세요 — 숫자, 정답률, 개념명 등은 정확히 반영하세요. " +
  "2) 어조는 따뜻하고 전문적이며 격려하는 톤을 유지하세요. " +
  "3) 원본에 소제목 구조(예: 학습 결과 / 잘한 점 / 보완할 점 / 숙제)가 있다면 자연스러운 영어 소제목으로 유지하세요 " +
  "(예: Today's Results / Strengths / Areas to Improve / Homework). " +
  "4) 불필요하게 늘리지 말고 원문과 비슷한 분량으로 간결하게 작성하세요. " +
  "5) 인사말이나 맺음말(Dear parent, Best regards 등)은 추가하지 말고 본문 내용만 반환하세요.";

export async function generateParentReportDraft(koreanNote: string): Promise<string> {
  const client = getClaudeClient();
  const response = await client.messages.parse({
    model: PARENT_REPORT_MODEL,
    max_tokens: 2048,
    output_config: {
      format: zodOutputFormat(ParentReportDraftSchema),
      effort: PARENT_REPORT_EFFORT,
    },
    messages: [{ role: "user", content: `${PERSONA}\n\n---\n${koreanNote}` }],
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error("초안 생성 응답이 잘렸습니다 (max_tokens 도달).");
  }
  if (!response.parsed_output) {
    throw new Error(`초안을 파싱하지 못했습니다 (stop_reason: ${response.stop_reason}).`);
  }
  return response.parsed_output.translated_note;
}
