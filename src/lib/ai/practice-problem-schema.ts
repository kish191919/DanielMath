import { z } from "zod";
import { ProblemOptionsArraySchema } from "./problem-option-schema";
import { MATH_NOTATION_INSTRUCTIONS } from "./math-notation";

const CALCULATION_FORMAT_INSTRUCTIONS =
  '문제가 문장 설명 없이 순수한 계산식(사칙연산·분수·지수 등)만으로 이루어져 있다면 "Calculate:" 같은 접두어를 붙이지 말고, ' +
  '수식 LaTeX 블록 맨 끝에 "=" 를 붙여 풀어야 할 식임을 나타내세요 ' +
  '(예: "$(2\\times 3)^2 \\times (1\\frac{3}{4} - \\frac{1}{2}) + 4^2 =$"). ' +
  "문장 설명이 필요한 응용/서술형 문제에는 이 규칙을 적용하지 마세요.";

export const GeneratedProblemSchema = z.object({
  problem_text: z.string().describe(
    `The newly generated problem statement (stem only — never include multiple-choice options here, they go in \`options\`). Must be written entirely in English, regardless of what language the source problem was in. ${MATH_NOTATION_INSTRUCTIONS} ${CALCULATION_FORMAT_INSTRUCTIONS}`,
  ),
  answer_text: z.string().describe(
    `The final answer only, no work shown. If \`options\` is set, this must equal that option's text. Must be written entirely in English, regardless of what language the source problem was in. ${MATH_NOTATION_INSTRUCTIONS}`,
  ),
  options: ProblemOptionsArraySchema.describe(
    "Multiple-choice options if (and only if) the source problem was multiple choice — same choice count and label scheme as the source, with freshly invented values (including plausible-but-wrong distractors). Null if the source was free-response.",
  ),
  correct_option: z.string().nullable().describe(
    "The label of the correct option, matching one entry in `options`. Null if `options` is null.",
  ),
});

export const PracticeProblemSetSchema = z.object({
  // Echoes the source id back (a learning_items.id or a reference_problems.id,
  // disambiguated by source_kind) so results can be matched to the seed item
  // they were generated from.
  source_id: z.string(),
  source_kind: z.enum(["wrong_answer", "reference"]),
  problems: z.array(GeneratedProblemSchema).min(1),
});

export const GeneratePracticeSchema = z.object({
  sets: z.array(PracticeProblemSetSchema).min(1, "생성된 문제가 없습니다"),
});

export type GeneratedProblem = z.infer<typeof GeneratedProblemSchema>;
export type PracticeProblemSet = z.infer<typeof PracticeProblemSetSchema>;
