import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, PARENT_ERROR_SUMMARY_MODEL, PARENT_ERROR_SUMMARY_EFFORT } from "./claude";
import { ParentErrorSummarySchema } from "./parent-error-summary-schema";

const PERSONA =
  "당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방 'Daniel Math'의 학부모 안내문 작성 보조입니다. " +
  "아래는 한 학생이 최근 오답 학습지에서 자주 틀린 수학 개념과 오답 유형입니다. " +
  "이를 바탕으로 학부모가 이해하기 쉽게 읽을 수 있는 설명 문구를 한국어로 작성하세요. " +
  "규칙: " +
  "1) 몇 문제 중 몇 개를 틀렸는지, 오답 개수, 정답률 등 숫자로 된 통계는 절대 언급하지 마세요 — 어떤 부분에서, 왜, 어떻게 틀리는지에만 집중하세요. " +
  "2) 학생이 어떤 수학 개념·분야에서 어려움을 겪고 있는지 구체적으로 설명하세요. " +
  "3) 그 개념과 오답 유형 조합에서 학생들이 일반적으로 왜 실수하는지 이유를 설명하세요. " +
  "4) 실수를 줄이려면 무엇이 필요한지, 어떤 점을 주의해야 하는지 안내하세요. " +
  "5) 이 부분과 관련해 학부모에게 전하고 싶은 조언이나 격려가 있다면 짧게 덧붙이세요. " +
  "6) 전체 분량은 2~3문장으로, 쉽고 따뜻한 어조로 작성하고 전문 용어는 풀어서 설명하세요. " +
  "7) 주어진 개념·오답 유형 목록에 없는 내용을 지어내지 마세요. " +
  "8) 인사말이나 맺음말(안녕하세요, 감사합니다 등)은 넣지 말고 본문 설명만 반환하세요.";

export async function generateParentErrorSummary(input: {
  conceptLabels: string[];
  errorTypeLabels: string[];
}): Promise<string> {
  const client = getClaudeClient();

  const facts =
    `자주 틀린 개념: ${input.conceptLabels.join(", ")}\n` +
    (input.errorTypeLabels.length > 0
      ? `오답 유형: ${input.errorTypeLabels.join(", ")}`
      : "오답 유형: 분류되지 않음");

  const response = await client.messages.parse({
    model: PARENT_ERROR_SUMMARY_MODEL,
    max_tokens: 512,
    output_config: {
      format: zodOutputFormat(ParentErrorSummarySchema),
      effort: PARENT_ERROR_SUMMARY_EFFORT,
    },
    messages: [{ role: "user", content: `${PERSONA}\n\n---\n${facts}` }],
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error("설명 생성 응답이 잘렸습니다 (max_tokens 도달).");
  }
  if (!response.parsed_output) {
    throw new Error(`설명을 파싱하지 못했습니다 (stop_reason: ${response.stop_reason}).`);
  }
  return response.parsed_output.parent_summary;
}
