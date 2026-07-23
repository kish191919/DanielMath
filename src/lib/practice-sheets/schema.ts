import { z } from "zod";

export const generateSelectionSchema = z
  .array(
    z.object({
      itemId: z.string().uuid(),
      count: z.number().int().min(1).max(5),
    }),
  )
  .min(1, "오답 문항을 1개 이상 선택해주세요");

export type GenerateSelection = z.infer<typeof generateSelectionSchema>;

export const practiceProblemInputSchema = z.object({
  id: z.string().uuid().optional(),
  problem_text: z.string().min(1, "문제 내용을 입력해주세요"),
  answer_text: z.string().min(1, "정답을 입력해주세요"),
  source_item_id: z.string().uuid().nullable().optional(),
  concept_id: z.string().uuid().nullable().optional(),
  source: z.enum(["ai", "teacher"]),
  edited_by_teacher: z.boolean(),
});

export type PracticeProblemInputValues = z.infer<typeof practiceProblemInputSchema>;

export const confirmPracticeSheetSchema = z.object({
  worksheet_id: z.string().uuid(),
  title: z.string().trim().max(80, "제목은 80자 이내로 입력해주세요").optional(),
  problems: z.array(practiceProblemInputSchema).min(1, "최소 1개 이상의 문항이 있어야 합니다"),
});
