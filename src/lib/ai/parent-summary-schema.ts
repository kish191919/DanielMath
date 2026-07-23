import { z } from "zod";

// Numbers (totals, accuracy rate) are computed in code from confirmed
// learning_items, never by the model — only these two prose fields are
// AI-authored, and they get slotted into a fixed template (see
// generate-parent-summary.ts) so the parent-facing format never drifts.
export const ParentSummaryFieldsSchema = z.object({
  strengths: z.string(),
  improvements: z.string().nullable(),
});

export type ParentSummaryFields = z.infer<typeof ParentSummaryFieldsSchema>;
