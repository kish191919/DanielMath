"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { todayInEasternTime } from "@/lib/dates";
import { closeEnrollmentPeriodSchema, openEnrollmentPeriodSchema } from "./schema";

export type EnrollmentActionState = {
  error?: string;
};

function revalidateStudentPaths(studentId: string) {
  revalidatePath("/dashboard/principal");
  revalidatePath("/dashboard/principal/students");
  revalidatePath(`/dashboard/principal/students/${studentId}/tuition`);
  revalidatePath("/dashboard/parent/tuition");
}

export async function openEnrollmentPeriodAction(
  studentId: string,
  _prev: EnrollmentActionState | null,
  formData: FormData,
): Promise<EnrollmentActionState> {
  await requireRole("principal");

  const parsed = openEnrollmentPeriodSchema.safeParse({
    started_at: formData.get("started_at") || todayInEasternTime(),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("student_enrollment_periods").insert({
    student_id: studentId,
    started_at: parsed.data.started_at,
    note: parsed.data.note && parsed.data.note.length > 0 ? parsed.data.note : null,
  });

  if (error) {
    if (error.code === "23505") return { error: "이미 재원 중인 학생입니다." };
    return { error: error.message };
  }

  revalidateStudentPaths(studentId);
  return {};
}

export async function closeEnrollmentPeriodAction(
  studentId: string,
  periodId: string,
  _prev: EnrollmentActionState | null,
  formData: FormData,
): Promise<EnrollmentActionState> {
  await requireRole("principal");

  const parsed = closeEnrollmentPeriodSchema.safeParse({
    ended_at: formData.get("ended_at") || todayInEasternTime(),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("student_enrollment_periods")
    .update({
      ended_at: parsed.data.ended_at,
      note: parsed.data.note && parsed.data.note.length > 0 ? parsed.data.note : null,
    })
    .eq("id", periodId);

  if (error) return { error: error.message };

  revalidateStudentPaths(studentId);
  return {};
}
