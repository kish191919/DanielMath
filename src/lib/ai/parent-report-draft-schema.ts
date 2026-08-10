import { z } from "zod";

export const ParentReportDraftSchema = z.object({
  results: z.string().min(1),
  strengths: z.array(z.string().min(1)).default([]),
  areas_to_improve: z.array(z.string().min(1)).default([]),
  // No .min(1): Claude returns "" (not an omitted key) when there's no
  // homework to report — assembleParentReport() already treats a blank
  // string as "no homework section", so this just has to accept it.
  homework: z.string().optional(),
});
