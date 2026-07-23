import "server-only";
import type { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, PRACTICE_GEN_MODEL, PRACTICE_GEN_EFFORT } from "./claude";
import { GeneratePracticeSchema } from "./practice-problem-schema";
import { ERROR_TYPE_LABELS } from "@/lib/learning-history/schema";
import type { Concept, LearningItem } from "@/lib/supabase/types";

const INSTRUCTIONS = `당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 연습문제 출제 보조입니다.
학생이 틀린 문제들이 아래에 제공됩니다. 각 문제마다 요청된 개수만큼, 같은 개념·같은 난이도의 유사 문제를 새로 만들어주세요.

1. 숫자나 표현만 바꾸고 풀이 구조와 난이도는 원래 문제와 같게 유지하세요.
2. 원래 문제를 그대로 복사하지 마세요 — 반드시 값을 바꾼 새 문제여야 합니다.
3. answer_text에는 최종 정답만 간결하게 적으세요(풀이 과정 없이).
4. 정답이 틀리면 이 기능의 목적 자체가 무너지니, 직접 계산해서 정답을 검산한 뒤 답을 작성하세요.
5. source_item_id는 입력에 주어진 값을 그대로 돌려주세요.
6. 각 항목에 대해 요청된 개수만큼 정확히 생성하세요.`;

function buildItemPromptText(
  item: LearningItem,
  count: number,
  conceptById: Map<string, Concept>,
): string {
  const concept = item.concept_id ? conceptById.get(item.concept_id) : undefined;
  const conceptLine = concept ? `${concept.strand} · ${concept.label_ko}` : "미분류";
  const errorLine = item.error_type ? ERROR_TYPE_LABELS[item.error_type] : "미상";

  return `- source_item_id: ${item.id}
  원래 문제: ${item.transcribed_problem}
  개념: ${conceptLine}
  오답 유형: ${errorLine}
  요청 개수: ${count}개`;
}

export async function generateSimilarProblems(
  items: LearningItem[],
  countByItemId: Map<string, number>,
  concepts: Concept[],
): Promise<z.infer<typeof GeneratePracticeSchema>> {
  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  const itemsText = items
    .map((item) => buildItemPromptText(item, countByItemId.get(item.id) ?? 1, conceptById))
    .join("\n\n");

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
        content: `${INSTRUCTIONS}\n\n${itemsText}`,
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
