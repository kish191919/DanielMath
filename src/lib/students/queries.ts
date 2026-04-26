import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Student } from "@/lib/supabase/types";

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
