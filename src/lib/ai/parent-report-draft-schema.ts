import { z } from "zod";

export const ParentReportDraftSchema = z.object({
  translated_note: z.string().min(1),
});
