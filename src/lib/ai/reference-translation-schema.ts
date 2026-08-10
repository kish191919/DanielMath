import { z } from "zod";
import { ProblemOptionsArraySchema } from "./problem-option-schema";

const PRESERVE_MATH_NOTATION =
  "원본에 $...$ LaTeX 수식 구분자가 있으면 그대로 보존하세요 — 수식 자체를 새로 번역하거나 고쳐 쓰지 말고, 그 주변의 문장만 번역하세요.";

export const TranslatedReferenceItemSchema = z.object({
  // Echoes reference_problems.id back so the caller can match by id
  // (same pattern as source_id in generate-similar-problems.ts) instead of
  // relying on array order surviving the round trip.
  id: z.string().uuid(),
  translated_problem: z.string().describe(PRESERVE_MATH_NOTATION),
  translated_options: ProblemOptionsArraySchema,
  translated_correct_option: z.string().nullable(),
  translated_answer: z.string().nullable().describe(PRESERVE_MATH_NOTATION),
});

export const ReferenceTranslationSchema = z.object({
  items: z.array(TranslatedReferenceItemSchema),
});

export type TranslatedReferenceItem = z.infer<typeof TranslatedReferenceItemSchema>;
