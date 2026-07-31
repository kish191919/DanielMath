import { z } from "zod";
import { SCAN_MIME_TYPES } from "@/lib/storage/mime";

export { SCAN_MIME_TYPES };

export const ERROR_TYPES = [
  "calculation_mistake",
  "place_value_error",
  "fraction_concept",
  "word_problem_interpretation",
  "unit_conversion",
  "pattern_recognition",
  "time_pressure",
] as const;

export const ERROR_TYPE_LABELS: Record<(typeof ERROR_TYPES)[number], string> = {
  calculation_mistake: "계산 실수",
  place_value_error: "자릿수 오류",
  fraction_concept: "분수 개념",
  word_problem_interpretation: "단어 문제 해석",
  unit_conversion: "단위 변환",
  pattern_recognition: "패턴 인식",
  time_pressure: "시간 부족",
};

export const SCAN_STATUS_LABELS: Record<
  "uploaded" | "grading" | "pending_review" | "reviewed" | "grading_failed",
  string
> = {
  uploaded: "업로드됨",
  grading: "채점 중",
  pending_review: "검토 대기",
  reviewed: "확정 완료",
  grading_failed: "채점 실패",
};

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const uploadMetaSchema = z.object({
  student_id: z.string().uuid("학생을 선택해주세요."),
  original_filename: z.string().min(1),
  mime_type: z.enum(SCAN_MIME_TYPES),
  file_size_bytes: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_UPLOAD_BYTES, "파일 크기는 20MB를 초과할 수 없습니다."),
  session_date: z.string().min(1),
  // True when the teacher deliberately photographed only the problems a
  // student struggled with, rather than everything the student solved that
  // session — see getConceptAccuracySummary's isTargetedReviewHeavy, which
  // uses this so parent-facing accuracy stats can flag that skew instead of
  // presenting the number as a representative sample.
  is_targeted_review: z.boolean().default(false),
});

export const learningItemInputSchema = z.object({
  id: z.string().uuid().optional(),
  problem_number: z.string().max(20).optional().or(z.literal("")),
  transcribed_problem: z.string().min(1, "문제 내용을 입력해주세요."),
  transcribed_answer: z.string().max(500).optional().or(z.literal("")),
  is_correct: z.boolean(),
  concept_id: z.string().uuid().nullable(),
  error_type: z.enum(ERROR_TYPES).nullable(),
  source: z.enum(["ai", "teacher"]),
  edited_by_teacher: z.boolean(),
});

export type LearningItemInputValues = z.infer<typeof learningItemInputSchema>;

export const reviewSubmissionSchema = z.object({
  scan_id: z.string().uuid(),
  student_id: z.string().uuid(),
  session_date: z.string().min(1),
  items: z.array(learningItemInputSchema).min(1, "최소 1개 이상의 문항이 필요합니다."),
});

export const noteTextSchema = z.string().min(1, "내용을 입력해주세요.").max(2000);

export const sessionNoteSchema = z.object({
  student_id: z.string().uuid(),
  scan_id: z.string().uuid().optional().or(z.literal("")),
  session_date: z.string().optional().or(z.literal("")),
  note: noteTextSchema,
});
