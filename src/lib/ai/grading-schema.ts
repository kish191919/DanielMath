import { z } from "zod";
import { ERROR_TYPES } from "@/lib/learning-history/schema";

export const GradedItemSchema = z.object({
  problem_number: z.string().nullable(),
  transcribed_problem: z.string(),
  transcribed_answer: z.string().nullable(),
  is_correct: z.boolean(),
  // Matched post-hoc against the concept list fetched at grading time
  // (concepts are teacher-editable, so this isn't a schema-level enum).
  concept_code: z.string().nullable(),
  error_type: z.enum(ERROR_TYPES).nullable(),
  confidence_note: z.string().nullable(),
});

export const WorksheetGradingSchema = z.object({
  // min(1) is deliberate: a genuinely empty response almost always means the
  // model gave up on a cluttered page rather than that the worksheet has no
  // problems, so treat it as a validation failure (surfaces as a clear
  // "grading failed") instead of silently succeeding with nothing to review.
  items: z.array(GradedItemSchema).min(1, "최소 1개 이상의 문항이 있어야 합니다"),
});

export type GradedItem = z.infer<typeof GradedItemSchema>;
