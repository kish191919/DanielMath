import { z } from "zod";

export const TranslatedReferenceItemSchema = z.object({
  // Echoes reference_problems.id back so the caller can match by id
  // (same pattern as source_id in generate-similar-problems.ts) instead of
  // relying on array order surviving the round trip.
  id: z.string().uuid(),
  translated_problem: z.string(),
  translated_answer: z.string().nullable(),
});

export const ReferenceTranslationSchema = z.object({
  items: z.array(TranslatedReferenceItemSchema),
});

export type TranslatedReferenceItem = z.infer<typeof TranslatedReferenceItemSchema>;
