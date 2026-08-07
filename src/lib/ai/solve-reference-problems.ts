import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClaudeClient, REFERENCE_SOLVE_MODEL, REFERENCE_SOLVE_EFFORT } from "./claude";
import { ReferenceSolveSchema } from "./reference-solve-schema";
import type { ReferenceProblem } from "@/lib/supabase/types";

const PERSONA =
  "당신은 미국 북버지니아(NoVa) K-6 AAP 준비 수학 공부방의 문제 보관함 정답 풀이 보조입니다. " +
  "아래 문제들은 원본 스캔에 정답이 인쇄되어 있지 않아서(예: 정답이 책의 다른 페이지에 있음) " +
  "정답을 직접 계산해서 채워야 합니다. " +
  "이것은 번역이 아니라 실제로 문제를 풀어 최종 정답을 구하는 작업입니다 — " +
  "확신이 없어도 반드시 최선의 답을 제시하세요. solved_answer를 비워두거나 '모르겠다'는 식으로 " +
  "답하는 것은 금지됩니다 — 이 답은 선생님이 나중에 검토하고 필요하면 고칠 것이므로, " +
  "정확도보다 빈칸 없이 커버리지를 채우는 것이 더 중요합니다. answer만 간결하게 적으세요(풀이 과정 없이). " +
  "문제에 보기(options)가 주어져 있으면, 계산한 답과 일치하는 보기의 label을 solved_correct_option에 넣으세요. " +
  "계산한 값이 주어진 보기들의 text와 정확히 일치하지 않으면(반올림/표기 차이, 또는 보기 자체가 이상해 보이는 경우 등) " +
  "solved_correct_option은 반드시 null로 두세요 — 억지로 가장 비슷한 보기를 고르지 마세요. " +
  "solved_answer에는 그래도 계산한 최선의 값을 채우세요(이 필드는 여전히 비워둘 수 없습니다). " +
  "틀린 '값'은 선생님이 숫자만 보고도 바로잡기 쉽지만, 틀린 '보기 알파벳'은 원본 보기와 조용히 어긋난 채 " +
  "학생에게 잘못 전달될 위험이 훨씬 크므로, 확신이 없는 letter는 절대 지어내지 마세요.";

type SolveInputItem = Pick<ReferenceProblem, "id" | "translated_problem" | "has_diagram" | "translated_options">;

function buildItemText(item: SolveInputItem): string {
  const diagramNote = item.has_diagram
    ? " (주의: 이 문제는 도형/그래프/표가 필요하지만 이미지가 제공되지 않았습니다 — 텍스트만으로 최선을 다해 추정하세요.)"
    : "";
  const optionsLines = item.translated_options
    ? `\n  보기: ${item.translated_options.map((o) => `${o.label} ${o.text}`).join(", ")}`
    : "";
  return `- id: ${item.id}
  문제: ${item.translated_problem}${diagramNote}${optionsLines}`;
}

type SolveResult = { solved_answer: string; solved_correct_option: string | null };

export async function solveReferenceProblems(items: SolveInputItem[]): Promise<Map<string, SolveResult>> {
  const result = new Map<string, SolveResult>();
  if (items.length === 0) return result;

  const itemsText = items.map(buildItemText).join("\n\n");

  const client = getClaudeClient();
  // Unlike translate-reference-problems.ts, thinking is left on (Claude
  // Sonnet 5's default when the param is omitted) — this is genuine
  // problem-solving on competition-style math, not literal transcription.
  const response = await client.messages.parse({
    model: REFERENCE_SOLVE_MODEL,
    max_tokens: 8192,
    output_config: {
      format: zodOutputFormat(ReferenceSolveSchema),
      effort: REFERENCE_SOLVE_EFFORT,
    },
    messages: [
      {
        role: "user",
        content: `${PERSONA}\n\n${itemsText}`,
      },
    ],
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error("정답 풀이 응답이 잘렸습니다 (max_tokens 도달).");
  }
  if (!response.parsed_output) {
    throw new Error(`정답 풀이 결과를 파싱하지 못했습니다 (stop_reason: ${response.stop_reason}).`);
  }

  for (const item of response.parsed_output.items) {
    result.set(item.id, { solved_answer: item.solved_answer, solved_correct_option: item.solved_correct_option });
  }
  return result;
}
