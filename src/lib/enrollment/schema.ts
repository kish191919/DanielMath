import { z } from "zod";

export const ENROLLMENT_STATUSES = ["active", "paused"] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  active: "재원중",
  paused: "중지",
};

export const openEnrollmentPeriodSchema = z.object({
  started_at: z.string().min(1, "등록일을 선택해주세요."),
  note: z.string().max(500).optional().or(z.literal("")),
});

export const closeEnrollmentPeriodSchema = z.object({
  ended_at: z.string().min(1, "중지일을 선택해주세요."),
  note: z.string().max(500).optional().or(z.literal("")),
});
