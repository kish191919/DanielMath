import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, TRANSLATION_MODEL, TRANSLATION_EFFORT } from "./claude";
import { ReferenceTranslationSchema } from "./reference-translation-schema";
import type { ReferenceProblem } from "@/lib/supabase/types";

const PERSONA =
  "당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 문제 보관함 번역 보조입니다. " +
  "아래 원본 문제들을 자연스러운 영어(English)로 번역하세요. " +
  "이것은 새 문제를 만드는 작업이 아니라 순수 번역입니다 — 숫자, 조건, 문제의 구조를 절대 바꾸지 마세요. " +
  "원본이 이미 영어라면 그대로(또는 문법만 다듬어) 반환하세요. " +
  "원본 정답이 null이면 번역할 대상이 없으므로 translated_answer도 반드시 null로 두세요(추측/계산 금지).";

type TranslationInputItem = Pick<ReferenceProblem, "id" | "transcribed_problem" | "transcribed_answer">;

function buildItemText(item: TranslationInputItem): string {
  const answerLine = item.transcribed_answer
    ? `원본 정답: ${item.transcribed_answer}`
    : "원본 정답: (없음 — translated_answer는 null)";
  return `- id: ${item.id}
  원본 문제: ${item.transcribed_problem}
  ${answerLine}`;
}

export async function translateReferenceProblems(
  items: TranslationInputItem[],
): Promise<Map<string, { translated_problem: string; translated_answer: string | null }>> {
  const result = new Map<string, { translated_problem: string; translated_answer: string | null }>();
  if (items.length === 0) return result;

  const itemsText = items.map(buildItemText).join("\n\n");

  const client = getClaudeClient();
  // Claude Sonnet 5 runs adaptive thinking by default when `thinking` is
  // omitted (it isn't optional-off like older models) — this is literal
  // translation with nothing to reason about, so disable it explicitly to
  // skip that extra pass rather than paying its latency for no benefit.
  const response = await client.messages.parse({
    model: TRANSLATION_MODEL,
    max_tokens: 8192,
    thinking: { type: "disabled" },
    output_config: {
      format: zodOutputFormat(ReferenceTranslationSchema),
      effort: TRANSLATION_EFFORT,
    },
    messages: [
      {
        role: "user",
        content: `${PERSONA}\n\n${itemsText}`,
      },
    ],
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error("번역 응답이 잘렸습니다 (max_tokens 도달).");
  }
  if (!response.parsed_output) {
    throw new Error(`번역 결과를 파싱하지 못했습니다 (stop_reason: ${response.stop_reason}).`);
  }

  for (const item of response.parsed_output.items) {
    result.set(item.id, {
      translated_problem: item.translated_problem,
      translated_answer: item.translated_answer,
    });
  }
  return result;
}
