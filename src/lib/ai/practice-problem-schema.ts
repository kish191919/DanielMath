import { z } from "zod";

export const GeneratedProblemSchema = z.object({
  problem_text: z.string(),
  answer_text: z.string(),
});

export const PracticeProblemSetSchema = z.object({
  // Echoes the source learning_items.id back so results can be matched to
  // the wrong-answer item they were generated from.
  source_item_id: z.string(),
  problems: z.array(GeneratedProblemSchema).min(1),
});

export const GeneratePracticeSchema = z.object({
  sets: z.array(PracticeProblemSetSchema).min(1, "생성된 문제가 없습니다"),
});

export type GeneratedProblem = z.infer<typeof GeneratedProblemSchema>;
export type PracticeProblemSet = z.infer<typeof PracticeProblemSetSchema>;
