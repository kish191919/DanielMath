import { z } from "zod";

export const ParentErrorSummarySchema = z.object({
  parent_summary: z.string().min(1),
});
