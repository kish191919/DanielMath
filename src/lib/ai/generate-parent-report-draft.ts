import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import { getClaudeClient, PARENT_REPORT_MODEL, PARENT_REPORT_EFFORT } from "./claude";
import { ParentReportDraftSchema } from "./parent-report-draft-schema";

const PERSONA =
  "당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방 'Daniel Math'의 학부모 안내문 작성 보조입니다. " +
  "아래는 선생님이 간단히 한국어로 적은 오늘의 학습 리포트 메모입니다. " +
  "이 내용을 구조화된 필드로 추출/번역하세요. " +
  "규칙: " +
  "1) 원본에 없는 정보를 지어내지 마세요 — 숫자, 정답률, 개념명 등은 정확히 반영하고, 언급 없는 항목(잘한 점/보완할 점/숙제)은 빈 값으로 두세요. " +
  "2) 어조는 따뜻하고 전문적이며 격려하는 톤을 유지하세요. " +
  "3) results는 오늘 무엇을 했는지 요약하는 한두 문장의 영어 문단으로 작성하세요. " +
  "4) strengths와 areas_to_improve는 각각 짧은 영어 구/문장의 배열로, 소제목이나 불릿 기호(-, *) 없이 항목 텍스트만 반환하세요. " +
  "5) homework는 지시문 한 줄로 작성하고, 없으면 비워두세요. " +
  "6) 절대 섹션 제목, 인사말, 맺음말을 스스로 만들지 마세요 — 그것은 코드에서 처리합니다. 필드에는 순수 내용만 담으세요.";

// Fixed English headers/order/bullet formatting so every parent report has
// the same shape regardless of how loosely the teacher's Korean note was
// structured — the model only supplies field content, never layout.
function assembleParentReport(parsed: z.infer<typeof ParentReportDraftSchema>): string {
  const sections: string[] = [`Today's Results\n${parsed.results.trim()}`];

  if (parsed.strengths.length > 0) {
    sections.push(`Strengths\n${parsed.strengths.map((s) => `- ${s.trim()}`).join("\n")}`);
  }
  if (parsed.areas_to_improve.length > 0) {
    sections.push(
      `Areas to Improve\n${parsed.areas_to_improve.map((s) => `- ${s.trim()}`).join("\n")}`,
    );
  }
  if (parsed.homework?.trim()) {
    sections.push(`Homework\n${parsed.homework.trim()}`);
  }

  return sections.join("\n\n");
}

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
  return assembleParentReport(response.parsed_output);
}
