import { z } from "zod";

export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export const WEEKDAY_LABELS: Record<(typeof WEEKDAYS)[number], string> = {
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
  7: "일",
};

export const WEEKDAY_LABELS_EN: Record<(typeof WEEKDAYS)[number], string> = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

export const classSchema = z
  .object({
    name: z.string().min(1, "반 이름을 입력해주세요."),
    days_of_week: z
      .array(z.coerce.number().int().min(1).max(7))
      .min(1, "요일을 하나 이상 선택해주세요."),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "시작 시간을 입력해주세요."),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "종료 시간을 입력해주세요."),
  })
  .refine((v) => v.start_time < v.end_time, {
    message: "종료 시간은 시작 시간보다 늦어야 합니다.",
    path: ["end_time"],
  });

export type ClassValues = z.infer<typeof classSchema>;
