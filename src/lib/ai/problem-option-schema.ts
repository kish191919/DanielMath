import { z } from "zod";

// A single multiple-choice option, as printed on the source — label is kept
// verbatim (e.g. "A", "1)", "①") and never renormalized to A-E, since source
// worksheets don't always use Latin letters.
export const ProblemOptionSchema = z.object({
  label: z.string().min(1).max(3),
  text: z.string().min(1),
});

// Shared by every stage that carries an options array (extraction,
// translation, AI generation, teacher edits). Null means "not multiple
// choice" — every consumer must branch on null vs. non-null, never infer
// MCQ-ness from problem_text content. Capped at 6; a source problem with
// more choices than that, or an ambiguous choice count, should stay null
// (choices left embedded in the stem text) rather than truncating options.
export const ProblemOptionsArraySchema = z
  .array(ProblemOptionSchema)
  .min(2)
  .max(6)
  .nullable()
  .refine(
    (opts) => !opts || new Set(opts.map((o) => o.label)).size === opts.length,
    "보기 라벨이 중복되었습니다",
  );

export type ProblemOption = z.infer<typeof ProblemOptionSchema>;
