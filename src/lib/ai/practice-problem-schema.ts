import { z } from "zod";

export const GeneratedProblemSchema = z.object({
  problem_text: z.string().describe(
    "The newly generated problem statement. Must be written entirely in English, regardless of what language the source problem was in.",
  ),
  answer_text: z.string().describe(
    "The final answer only, no work shown. Must be written entirely in English, regardless of what language the source problem was in.",
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
