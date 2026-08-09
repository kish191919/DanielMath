"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { todayInEasternTime } from "@/lib/dates";
import {
  currentBillingMonth,
  markTuitionPaidSchema,
  monthlyTuitionAmountSchema,
  updateTuitionPaymentSchema,
} from "./schema";
import { listActiveStudentsMissingBilling } from "./queries";
import type { Student } from "@/lib/supabase/types";

export type TuitionActionState = {
  error?: string;
};

function revalidateTuitionPaths(studentId: string) {
  revalidatePath("/dashboard/principal");
  revalidatePath("/dashboard/principal/students");
  revalidatePath("/dashboard/principal/tuition");
  revalidatePath(`/dashboard/principal/students/${studentId}/tuition`);
  revalidatePath("/dashboard/parent/tuition");
}

export async function generateBillingForStudentAction(studentId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("monthly_tuition_amount")
    .eq("id", studentId)
    .maybeSingle<Pick<Student, "monthly_tuition_amount">>();
  if (studentError) throw new Error(studentError.message);
  if (!student) throw new Error("학생을 찾을 수 없습니다.");

  const billingMonth = currentBillingMonth();
  const { error } = await supabase.from("tuition_payments").insert({
    student_id: studentId,
    billing_month: billingMonth,
    amount_due: student.monthly_tuition_amount,
    due_date: billingMonth,
  });

  if (error) {
    if (error.code === "23505") throw new Error("이미 이번 달 청구가 생성되어 있습니다.");
    throw new Error(error.message);
  }

  revalidateTuitionPaths(studentId);
}

export async function bulkGenerateBillingAction() {
  await requireRole("principal");

  const billingMonth = currentBillingMonth();
  const missing = await listActiveStudentsMissingBilling(billingMonth);
  if (missing.length === 0) return;

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("tuition_payments").insert(
    missing.map((student) => ({
      student_id: student.id,
      billing_month: billingMonth,
      amount_due: student.monthly_tuition_amount,
      due_date: billingMonth,
    })),
  );
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/principal");
  revalidatePath("/dashboard/principal/students");
  revalidatePath("/dashboard/principal/tuition");
  revalidatePath("/dashboard/parent/tuition");
}

export async function updateTuitionPaymentAction(
  paymentId: string,
  studentId: string,
  _prev: TuitionActionState | null,
  formData: FormData,
): Promise<TuitionActionState> {
  await requireRole("principal");

  const parsed = updateTuitionPaymentSchema.safeParse({
    amount_due: formData.get("amount_due"),
    due_date: formData.get("due_date"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("tuition_payments")
    .update({
      amount_due: parsed.data.amount_due,
      due_date: parsed.data.due_date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);
  if (error) return { error: error.message };

  revalidateTuitionPaths(studentId);
  return {};
}

export async function markTuitionPaidAction(
  paymentId: string,
  studentId: string,
  _prev: TuitionActionState | null,
  formData: FormData,
): Promise<TuitionActionState> {
  await requireRole("principal");

  const parsed = markTuitionPaidSchema.safeParse({
    paid_amount: formData.get("paid_amount"),
    paid_at: formData.get("paid_at") || todayInEasternTime(),
    payment_method: formData.get("payment_method"),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("tuition_payments")
    .update({
      paid_amount: parsed.data.paid_amount,
      paid_at: parsed.data.paid_at,
      payment_method: parsed.data.payment_method,
      note: parsed.data.note && parsed.data.note.length > 0 ? parsed.data.note : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);
  if (error) return { error: error.message };

  revalidateTuitionPaths(studentId);
  return {};
}

export async function markTuitionUnpaidAction(paymentId: string, studentId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("tuition_payments")
    .update({
      paid_amount: null,
      paid_at: null,
      payment_method: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);
  if (error) throw new Error(error.message);

  revalidateTuitionPaths(studentId);
}

export async function deleteTuitionPaymentAction(paymentId: string, studentId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("tuition_payments").delete().eq("id", paymentId);
  if (error) throw new Error(error.message);

  revalidateTuitionPaths(studentId);
}

export async function updateDefaultTuitionAmountAction(
  studentId: string,
  _prev: TuitionActionState | null,
  formData: FormData,
): Promise<TuitionActionState> {
  await requireRole("principal");

  const parsed = monthlyTuitionAmountSchema.safeParse({
    monthly_tuition_amount: formData.get("monthly_tuition_amount"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("students")
    .update({ monthly_tuition_amount: parsed.data.monthly_tuition_amount })
    .eq("id", studentId);
  if (error) return { error: error.message };

  revalidateTuitionPaths(studentId);
  return {};
}
