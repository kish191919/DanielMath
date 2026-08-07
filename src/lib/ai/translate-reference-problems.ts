import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, TRANSLATION_MODEL, TRANSLATION_EFFORT } from "./claude";
import { ReferenceTranslationSchema } from "./reference-translation-schema";
import type { ProblemOption } from "./problem-option-schema";
import type { ReferenceProblem } from "@/lib/supabase/types";

const PERSONA =
  "당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 문제 보관함 번역 보조입니다. " +
  "아래 원본 문제들을 자연스러운 영어(English)로 번역하세요. " +
  "이것은 새 문제를 만드는 작업이 아니라 순수 번역입니다 — 숫자, 조건, 문제의 구조를 절대 바꾸지 마세요. " +
  "원본이 이미 영어라면 그대로(또는 문법만 다듬어) 반환하세요. " +
  "원본 정답이 null이면 번역할 대상이 없으므로 translated_answer도 반드시 null로 두세요(추측/계산 금지). " +
  "transcribed_options가 있으면, 각 보기의 text만 자연스러운 영어로 번역하고 label과 순서는 절대 바꾸지 마세요(label 자체는 번역하지 않고 원문 그대로 복사합니다). 보기를 추가/삭제/병합/재배열하지 마세요. " +
  "transcribed_options가 null이면 translated_options도 반드시 null로 두세요(객관식이 아닌 문제를 임의로 객관식으로 만들지 마세요). " +
  "transcribed_correct_option이 있으면 translated_correct_option에 동일한 label을 그대로 반환하세요. transcribed_correct_option이 null이면 translated_correct_option도 반드시 null입니다(추측 금지).";

type TranslationInputItem = Pick<
  ReferenceProblem,
  "id" | "transcribed_problem" | "transcribed_answer" | "transcribed_options" | "transcribed_correct_option"
>;

function buildItemText(item: TranslationInputItem): string {
  const answerLine = item.transcribed_answer
    ? `원본 정답: ${item.transcribed_answer}`
    : "원본 정답: (없음 — translated_answer는 null)";
  const optionsLines = item.transcribed_options
    ? `원본 보기:\n${item.transcribed_options.map((o) => `${o.label} ${o.text}`).join("\n")}\n원본 정답 보기 라벨: ${item.transcribed_correct_option ?? "(없음)"}`
    : "원본 보기: (객관식 아님 — translated_options는 null)";
  return `- id: ${item.id}
  원본 문제: ${item.transcribed_problem}
  ${answerLine}
  ${optionsLines}`;
}

type TranslationResult = {
  translated_problem: string;
  translated_options: ProblemOption[] | null;
  translated_correct_option: string | null;
  translated_answer: string | null;
};

export async function translateReferenceProblems(
  items: TranslationInputItem[],
): Promise<Map<string, TranslationResult>> {
  const result = new Map<string, TranslationResult>();
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
      translated_options: item.translated_options,
      translated_correct_option: item.translated_correct_option,
      translated_answer: item.translated_answer,
    });
  }
  return result;
}
