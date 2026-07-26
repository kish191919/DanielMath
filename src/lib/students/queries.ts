import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Profile, Student, StudentGuardian } from "@/lib/supabase/types";

export async function listStudents(): Promise<Student[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("full_name", { ascending: true })
    .returns<Student[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getStudent(id: string): Promise<Student | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .maybeSingle<Student>();

  return data ?? null;
}

export type GuardianLink = {
  linkId: string;
  guardian: Pick<Profile, "id" | "email" | "full_name">;
};

export async function listGuardiansForStudent(studentId: string): Promise<GuardianLink[]> {
  const supabase = await createServerSupabase();
  const { data: links, error: linksError } = await supabase
    .from("student_guardians")
    .select("id, guardian_id")
    .eq("student_id", studentId)
    .returns<Pick<StudentGuardian, "id" | "guardian_id">[]>();
  if (linksError) throw new Error(linksError.message);

  const linkList = links ?? [];
  if (linkList.length === 0) return [];

  const guardianIds = linkList.map((l) => l.guardian_id);
  const { data: guardians, error: guardiansError } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", guardianIds)
    .returns<Pick<Profile, "id" | "email" | "full_name">[]>();
  if (guardiansError) throw new Error(guardiansError.message);

  const guardianById = new Map((guardians ?? []).map((g) => [g.id, g]));
  return linkList
    .map((link) => {
      const guardian = guardianById.get(link.guardian_id);
      return guardian ? { linkId: link.id, guardian } : null;
    })
    .filter((entry): entry is GuardianLink => entry !== null)
    .sort((a, b) => a.guardian.email.localeCompare(b.guardian.email));
}
