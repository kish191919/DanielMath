import { z } from "zod";
import type { AttendanceStatus, HomeworkStatus } from "@/lib/supabase/types";

export const ATTENDANCE_STATUSES: readonly AttendanceStatus[] = ["present", "absent"];

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  present: "출석",
  absent: "결석",
};

export const HOMEWORK_STATUSES: readonly HomeworkStatus[] = ["done", "partial", "not_done", "na"];

export const HOMEWORK_LABELS: Record<HomeworkStatus, string> = {
  done: "완료",
  partial: "부분 완료",
  not_done: "미완료",
  na: "해당없음",
};

export const classSessionSchema = z.object({
  session_date: z.string().min(1, "날짜를 입력해주세요."),
  topic: z.string().optional().or(z.literal("")),
  materials: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
});

export type ClassSessionValues = z.infer<typeof classSessionSchema>;
