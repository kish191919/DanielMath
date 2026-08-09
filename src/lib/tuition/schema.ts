import { z } from "zod";
import { todayInEasternTime } from "@/lib/dates";

export const TUITION_STATUSES = ["paid", "overdue", "due"] as const;
export type TuitionStatus = (typeof TUITION_STATUSES)[number];

export const TUITION_STATUS_LABELS: Record<TuitionStatus, string> = {
  paid: "납부완료",
  overdue: "연체",
  due: "납부예정",
};

export function computeTuitionStatus(
  payment: { paid_at: string | null; due_date: string },
  today: string,
): TuitionStatus {
  if (payment.paid_at) return "paid";
  return payment.due_date < today ? "overdue" : "due";
}

export function currentBillingMonth(): string {
  return `${todayInEasternTime().slice(0, 7)}-01`;
}

export const TUITION_PAYMENT_METHODS = ["zelle", "venmo", "cash", "stripe"] as const;
export type TuitionPaymentMethod = (typeof TUITION_PAYMENT_METHODS)[number];

export const TUITION_PAYMENT_METHOD_LABELS: Record<TuitionPaymentMethod, string> = {
  zelle: "Zelle",
  venmo: "Venmo",
  cash: "현금",
  stripe: "Stripe",
};

export const monthlyTuitionAmountSchema = z.object({
  monthly_tuition_amount: z.coerce.number().min(0, "0 이상의 금액을 입력해주세요."),
});

export const updateTuitionPaymentSchema = z.object({
  amount_due: z.coerce.number().min(0, "0 이상의 금액을 입력해주세요."),
  due_date: z.string().min(1, "납부 기한을 선택해주세요."),
});

export const markTuitionPaidSchema = z.object({
  paid_amount: z.coerce.number().min(0, "0 이상의 금액을 입력해주세요."),
  paid_at: z.string().min(1, "납부일을 선택해주세요."),
  payment_method: z.enum(TUITION_PAYMENT_METHODS, {
    message: "입금 방법을 선택해주세요.",
  }),
  note: z.string().max(500).optional().or(z.literal("")),
});
