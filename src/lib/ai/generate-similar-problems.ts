import "server-only";
import type { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, PRACTICE_GEN_MODEL, PRACTICE_GEN_EFFORT } from "./claude";
import { GeneratePracticeSchema } from "./practice-problem-schema";
import { ERROR_TYPE_LABELS } from "@/lib/learning-history/schema";
import type { Concept, LearningItem, ReferenceProblem } from "@/lib/supabase/types";

const PERSONA =
  "당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 연습문제 출제 보조입니다. " +
  "이 공부방의 학생들은 모두 미국인 학생입니다 — 아래 원본 문제가 어떤 언어로 되어 있든 상관없이, " +
  "당신이 생성하는 모든 problem_text와 answer_text는 반드시 자연스러운 영어(English)로만 작성해야 합니다. 한국어를 절대 사용하지 마세요.";

// 오답 기반: 숫자/표현만 바꿔 같은 구조·난이도의 문제를 재생성한다.
const WRONG_ANSWER_INSTRUCTIONS = `아래는 학생이 틀린 문제들입니다. 각 문제마다 요청된 개수만큼, 같은 개념·같은 난이도의 유사 문제를 새로 만들어주세요.

1. 숫자나 표현만 바꾸고 풀이 구조와 난이도는 원래 문제와 같게 유지하세요.
2. 원래 문제를 그대로 복사하지 마세요 — 반드시 값을 바꾼 새 문제여야 합니다.
3. answer_text에는 최종 정답만 간결하게 적으세요(풀이 과정 없이).
4. 정답이 틀리면 이 기능의 목적 자체가 무너지니, 직접 계산해서 정답을 검산한 뒤 답을 작성하세요.
5. source_id에는 입력에 주어진 source_id 값을, source_kind에는 "wrong_answer"를 그대로 돌려주세요.
6. 각 항목에 대해 요청된 개수만큼 정확히 생성하세요.
7. 아래 "원래 문제"가 한국어로 되어 있더라도, 새로 생성하는 problem_text와 answer_text는 반드시 영어로만 작성하세요.`;

// 참고문제(문제 보관함) 기반: 핵심 개념은 유지하되 소재/시나리오를 바꾼다 —
// 숫자만 바꾸는 오답 재생성과는 목적이 다르다 (원장님 요청사항).
const REFERENCE_INSTRUCTIONS = `아래는 선생님이 보관함에 저장해둔 참고문제입니다. 각 문제마다 요청된 개수만큼, 핵심 개념(연산·단원)은 그대로 유지하되 문제의 소재·상황·등장 요소를 바꾼 새 문제를 만들어주세요.

1. 숫자만 바꾸는 것은 허용되지 않습니다 — 문제의 배경/소재/캐릭터/맥락을 바꿔서 같은 개념을 다른 방식으로 묻는 문제를 만드세요.
2. 원래 문제를 그대로 복사하지 마세요.
3. answer_text에는 최종 정답만 간결하게 적으세요(풀이 과정 없이).
4. 원본 정답이 제공되어 있으면 그것이 맞는지 검산한 뒤 새 문제의 정답을 계산하세요. 원본 정답이 제공되지 않았으면 직접 계산해서 검산한 뒤 답을 작성하세요. 정답이 틀리면 이 기능의 목적 자체가 무너집니다.
5. source_id에는 입력에 주어진 source_id 값을, source_kind에는 "reference"를 그대로 돌려주세요.
6. 각 항목에 대해 요청된 개수만큼 정확히 생성하세요.
7. 아래 "원래 문제"가 한국어로 되어 있더라도, 새로 생성하는 problem_text와 answer_text는 반드시 영어로만 작성하세요.`;

function conceptLineFor(conceptId: string | null, conceptById: Map<string, Concept>): string {
  const concept = conceptId ? conceptById.get(conceptId) : undefined;
  return concept ? `${concept.strand} · ${concept.label_ko}` : "미분류";
}

function buildWrongAnswerItemText(
  item: LearningItem,
  count: number,
  conceptById: Map<string, Concept>,
): string {
  const errorLine = item.error_type ? ERROR_TYPE_LABELS[item.error_type] : "미상";
  return `- source_id: ${item.id}
  원래 문제: ${item.transcribed_problem}
  개념: ${conceptLineFor(item.concept_id, conceptById)}
  오답 유형: ${errorLine}
  요청 개수: ${count}개`;
}

function buildReferenceItemText(
  item: ReferenceProblem,
  count: number,
  conceptById: Map<string, Concept>,
): string {
  const answerLine = item.transcribed_answer
    ? `원본 정답: ${item.transcribed_answer}`
    : "원본 정답: (제공되지 않음 — 직접 계산)";
  return `- source_id: ${item.id}
  원래 문제: ${item.transcribed_problem}
  개념: ${conceptLineFor(item.concept_id, conceptById)}
  ${answerLine}
  요청 개수: ${count}개`;
}

export async function generateSimilarProblems(
  wrongAnswerItems: LearningItem[],
  referenceItems: ReferenceProblem[],
  countById: Map<string, number>,
  concepts: Concept[],
): Promise<z.infer<typeof GeneratePracticeSchema>> {
  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  const sections: string[] = [];
  if (wrongAnswerItems.length > 0) {
    const itemsText = wrongAnswerItems
      .map((item) => buildWrongAnswerItemText(item, countById.get(item.id) ?? 1, conceptById))
      .join("\n\n");
    sections.push(`${WRONG_ANSWER_INSTRUCTIONS}\n\n${itemsText}`);
  }
  if (referenceItems.length > 0) {
    const itemsText = referenceItems
      .map((item) => buildReferenceItemText(item, countById.get(item.id) ?? 1, conceptById))
      .join("\n\n");
    sections.push(`${REFERENCE_INSTRUCTIONS}\n\n${itemsText}`);
  }
  if (sections.length === 0) {
    throw new Error("생성할 문항이 없습니다.");
  }

  const client = getClaudeClient();
  const response = await client.messages.parse({
    model: PRACTICE_GEN_MODEL,
    max_tokens: 8192,
    output_config: {
      format: zodOutputFormat(GeneratePracticeSchema),
      effort: PRACTICE_GEN_EFFORT,
    },
    messages: [
      {
        role: "user",
        content: `${PERSONA}\n\n${sections.join("\n\n---\n\n")}`,
      },
    ],
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error("유사문제 생성 응답이 잘렸습니다 (max_tokens 도달). 선택한 문항 수를 줄여주세요.");
  }
  if (!response.parsed_output) {
    throw new Error(`유사문제 생성 결과를 파싱하지 못했습니다 (stop_reason: ${response.stop_reason}).`);
  }

  return response.parsed_output;
}
