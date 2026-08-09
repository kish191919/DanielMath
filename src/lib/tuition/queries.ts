import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { todayInEasternTime } from "@/lib/dates";
import type { Student, TuitionPayment } from "@/lib/supabase/types";
import { computeTuitionStatus, type TuitionStatus } from "./schema";

export async function listTuitionPayments(filters?: {
  studentId?: string;
  status?: TuitionStatus;
}): Promise<TuitionPayment[]> {
  const supabase = await createServerSupabase();
  let query = supabase.from("tuition_payments").select("*").order("due_date", { ascending: false });
  if (filters?.studentId) query = query.eq("student_id", filters.studentId);

  const { data, error } = await query.returns<TuitionPayment[]>();
  if (error) throw new Error(error.message);

  const payments = data ?? [];
  if (!filters?.status) return payments;

  const today = todayInEasternTime();
  return payments.filter((payment) => computeTuitionStatus(payment, today) === filters.status);
}

export async function listOverdueTuitionPayments(): Promise<TuitionPayment[]> {
  const today = todayInEasternTime();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("tuition_payments")
    .select("*")
    .is("paid_at", null)
    .lt("due_date", today)
    .order("due_date", { ascending: true })
    .returns<TuitionPayment[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listUnpaidTuitionPayments(): Promise<TuitionPayment[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("tuition_payments")
    .select("*")
    .is("paid_at", null)
    .order("due_date", { ascending: true })
    .returns<TuitionPayment[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listTuitionPaymentsForStudent(studentId: string): Promise<TuitionPayment[]> {
  return listTuitionPayments({ studentId });
}

export async function getTuitionPayment(id: string): Promise<TuitionPayment | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("tuition_payments")
    .select("*")
    .eq("id", id)
    .maybeSingle<TuitionPayment>();
  return data ?? null;
}

export async function listActiveStudentsMissingBilling(billingMonth: string): Promise<Student[]> {
  const supabase = await createServerSupabase();
  const [{ data: activePeriods, error: periodsError }, { data: billed, error: billedError }] =
    await Promise.all([
      supabase
        .from("student_enrollment_periods")
        .select("student_id")
        .is("ended_at", null)
        .returns<{ student_id: string }[]>(),
      supabase
        .from("tuition_payments")
        .select("student_id")
        .eq("billing_month", billingMonth)
        .returns<{ student_id: string }[]>(),
    ]);
  if (periodsError) throw new Error(periodsError.message);
  if (billedError) throw new Error(billedError.message);

  const billedIds = new Set((billed ?? []).map((row) => row.student_id));
  const activeIds = [...new Set((activePeriods ?? []).map((row) => row.student_id))].filter(
    (id) => !billedIds.has(id),
  );
  if (activeIds.length === 0) return [];

  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("*")
    .in("id", activeIds)
    .order("full_name", { ascending: true })
    .returns<Student[]>();
  if (studentsError) throw new Error(studentsError.message);
  return students ?? [];
}

// --- Parent-scoped variants -------------------------------------------------
// RLS on `students` is not confirmed to exist, so ownership is checked
// explicitly here rather than assumed — see AGENTS.md's DAL-as-enforcement
// convention.

async function assertParentOwnsStudent(parentId: string, studentId: string): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("student_guardians")
    .select("id")
    .eq("student_id", studentId)
    .eq("guardian_id", parentId)
    .maybeSingle<{ id: string }>();
  return !!data;
}

export async function listTuitionPaymentsForParent(
  parentId: string,
  studentId: string,
): Promise<TuitionPayment[]> {
  const owns = await assertParentOwnsStudent(parentId, studentId);
  if (!owns) return [];

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("tuition_payments")
    .select("*")
    .eq("student_id", studentId)
    .order("due_date", { ascending: false })
    .returns<TuitionPayment[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}
