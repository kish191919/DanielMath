import { z } from "zod";
import { ProblemOptionsArraySchema } from "@/lib/ai/problem-option-schema";

export const generateSelectionSchema = z
  .array(
    z.object({
      sourceType: z.enum(["wrong_answer", "reference", "reference_verbatim"]),
      itemId: z.string().uuid(),
      count: z.number().int().min(1).max(5),
    }),
  )
  .min(1, "문항을 1개 이상 선택해주세요");

export type GenerateSelection = z.infer<typeof generateSelectionSchema>;

export const practiceProblemInputSchema = z
  .object({
    id: z.string().uuid().optional(),
    problem_text: z.string().min(1, "문제 내용을 입력해주세요"),
    answer_text: z.string().min(1, "정답을 입력해주세요"),
    options: ProblemOptionsArraySchema,
    correct_option: z.string().nullable(),
    source_item_id: z.string().uuid().nullable().optional(),
    source_reference_id: z.string().uuid().nullable().optional(),
    concept_id: z.string().uuid().nullable().optional(),
    source: z.enum(["ai", "teacher", "reference_verbatim"]),
    edited_by_teacher: z.boolean(),
    answer_needs_review: z.boolean(),
  })
  .superRefine((val, ctx) => {
    if (val.options) {
      const labels = val.options.map((o) => o.label);
      if (!val.correct_option || !labels.includes(val.correct_option)) {
        ctx.addIssue({ code: "custom", path: ["correct_option"], message: "정답 보기를 선택해주세요" });
      }
    } else if (val.correct_option) {
      ctx.addIssue({
        code: "custom",
        path: ["correct_option"],
        message: "보기가 없으면 정답 보기를 지정할 수 없습니다",
      });
    }
  });

export type PracticeProblemInputValues = z.infer<typeof practiceProblemInputSchema>;

export const confirmPracticeSheetSchema = z.object({
  worksheet_id: z.string().uuid(),
  title: z.string().trim().max(80, "제목은 80자 이내로 입력해주세요").optional(),
  problems: z.array(practiceProblemInputSchema).min(1, "최소 1개 이상의 문항이 있어야 합니다"),
});
