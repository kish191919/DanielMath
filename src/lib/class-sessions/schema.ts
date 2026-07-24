import { z } from "zod";
import type { AttendanceStatus } from "@/lib/supabase/types";

export const ATTENDANCE_STATUSES: readonly AttendanceStatus[] = ["present", "absent", "late"];

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  present: "출석",
  absent: "결석",
  late: "지각",
};

export const classSessionSchema = z.object({
  session_date: z.string().min(1, "날짜를 입력해주세요."),
  topic: z.string().optional().or(z.literal("")),
  materials: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
});

export type ClassSessionValues = z.infer<typeof classSessionSchema>;
