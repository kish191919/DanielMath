import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { StudentEnrollmentPeriod } from "@/lib/supabase/types";
import type { EnrollmentStatus } from "./schema";

export async function listEnrollmentPeriodsForStudent(
  studentId: string,
): Promise<StudentEnrollmentPeriod[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("student_enrollment_periods")
    .select("*")
    .eq("student_id", studentId)
    .order("started_at", { ascending: false })
    .returns<StudentEnrollmentPeriod[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getActiveEnrollmentPeriod(
  studentId: string,
): Promise<StudentEnrollmentPeriod | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("student_enrollment_periods")
    .select("*")
    .eq("student_id", studentId)
    .is("ended_at", null)
    .maybeSingle<StudentEnrollmentPeriod>();

  return data ?? null;
}

export async function listEnrollmentStatusForStudents(
  studentIds: string[],
): Promise<Record<string, EnrollmentStatus>> {
  if (studentIds.length === 0) return {};

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("student_enrollment_periods")
    .select("student_id")
    .in("student_id", studentIds)
    .is("ended_at", null)
    .returns<Pick<StudentEnrollmentPeriod, "student_id">[]>();
  if (error) throw new Error(error.message);

  const activeIds = new Set((data ?? []).map((row) => row.student_id));
  const statusByStudent: Record<string, EnrollmentStatus> = {};
  for (const studentId of studentIds) {
    statusByStudent[studentId] = activeIds.has(studentId) ? "active" : "paused";
  }
  return statusByStudent;
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

export async function getEnrollmentStatusForParent(
  parentId: string,
  studentId: string,
): Promise<EnrollmentStatus | null> {
  const owns = await assertParentOwnsStudent(parentId, studentId);
  if (!owns) return null;

  const active = await getActiveEnrollmentPeriod(studentId);
  return active ? "active" : "paused";
}
