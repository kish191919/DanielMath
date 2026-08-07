import { z } from "zod";

export const SolvedReferenceItemSchema = z.object({
  // Echoes reference_problems.id back so the caller can match by id
  // (same pattern as reference-translation-schema.ts) instead of relying on
  // array order surviving the round trip.
  id: z.string().uuid(),
  // Never null — unlike translated_answer, this is a required best-effort
  // guess (see solve-reference-problems.ts PERSONA: coverage over accuracy).
  solved_answer: z.string().min(1),
  // Unlike solved_answer, this MAY stay null — only filled when the computed
  // value confidently matches one of the given options. A wrong/fabricated
  // letter is worse than none, so the model is told never to force a match.
  solved_correct_option: z.string().nullable(),
});

export const ReferenceSolveSchema = z.object({
  items: z.array(SolvedReferenceItemSchema),
});

export type SolvedReferenceItem = z.infer<typeof SolvedReferenceItemSchema>;
