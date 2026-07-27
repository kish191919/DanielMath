import { z } from "zod";
import { SCAN_MIME_TYPES } from "@/lib/storage/mime";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const referenceUploadMetaSchema = z.object({
  original_filename: z.string().min(1),
  mime_type: z.enum(SCAN_MIME_TYPES),
  file_size_bytes: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_UPLOAD_BYTES, "파일 크기는 20MB를 초과할 수 없습니다."),
});

// concept_id is required (not nullable) here, unlike learning_items — a
// reference problem must be tagged with exactly one concept before it can be
// confirmed into the reusable catalog (see 확정된 결정: single concept tag).
export const referenceProblemInputSchema = z.object({
  id: z.string().uuid().optional(),
  problem_number: z.string().max(20).optional().or(z.literal("")),
  transcribed_problem: z.string().min(1, "문제 내용을 입력해주세요."),
  transcribed_answer: z.string().max(500).optional().or(z.literal("")),
  concept_id: z.string().uuid("개념을 선택해주세요."),
  source: z.enum(["ai", "teacher"]),
  edited_by_teacher: z.boolean(),
});

export type ReferenceProblemInputValues = z.infer<typeof referenceProblemInputSchema>;

export const referenceReviewSubmissionSchema = z.object({
  scan_id: z.string().uuid(),
  items: z.array(referenceProblemInputSchema).min(1, "최소 1개 이상의 문항이 필요합니다."),
});

export const updateReferenceProblemSchema = z.object({
  id: z.string().uuid(),
  transcribed_problem: z.string().min(1, "문제 내용을 입력해주세요."),
  transcribed_answer: z.string().max(500).optional().or(z.literal("")),
  concept_id: z.string().uuid("개념을 선택해주세요."),
});
