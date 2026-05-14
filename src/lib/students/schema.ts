import { z } from "zod";

export const GRADES = ["3", "4", "5", "6"] as const;

export const studentSchema = z.object({
  full_name: z.string().min(1, "학생 이름을 입력해주세요."),
  grade: z.enum(GRADES),
  parent_email: z
    .string()
    .email("올바른 이메일을 입력해주세요.")
    .optional()
    .or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type StudentValues = z.infer<typeof studentSchema>;

export const GRADE_LABELS: Record<(typeof GRADES)[number], string> = {
  "3": "3rd Grade",
  "4": "4th Grade",
  "5": "5th Grade",
  "6": "6th Grade",
};
