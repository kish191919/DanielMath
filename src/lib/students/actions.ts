"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { studentSchema } from "./schema";

export type StudentFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"full_name" | "grade" | "parent_email" | "notes", string>>;
};

function parseStudentForm(formData: FormData) {
  return studentSchema.safeParse({
    full_name: formData.get("full_name"),
    grade: formData.get("grade"),
    parent_email: formData.get("parent_email") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

function collectFieldErrors(
  parsed: ReturnType<typeof parseStudentForm>,
): StudentFormState["fieldErrors"] {
  if (parsed.success) return undefined;
  const fieldErrors: StudentFormState["fieldErrors"] = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (
      key === "full_name" ||
      key === "grade" ||
      key === "parent_email" ||
      key === "notes"
    ) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

function normalize(values: { parent_email?: string; notes?: string }) {
  return {
    parent_email: values.parent_email && values.parent_email.length > 0 ? values.parent_email : null,
    notes: values.notes && values.notes.length > 0 ? values.notes : null,
  };
}

export async function createStudentAction(
  _prev: StudentFormState | null,
  formData: FormData,
): Promise<StudentFormState> {
  await requireRole("principal");

  const parsed = parseStudentForm(formData);
  if (!parsed.success) {
    return { error: "입력값을 확인해주세요.", fieldErrors: collectFieldErrors(parsed) };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("students").insert({
    full_name: parsed.data.full_name,
    grade: parsed.data.grade,
    ...normalize(parsed.data),
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/principal/students");
  redirect("/dashboard/principal/students");
}

export async function updateStudentAction(
  id: string,
  _prev: StudentFormState | null,
  formData: FormData,
): Promise<StudentFormState> {
  await requireRole("principal");

  const parsed = parseStudentForm(formData);
  if (!parsed.success) {
    return { error: "입력값을 확인해주세요.", fieldErrors: collectFieldErrors(parsed) };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("students")
    .update({
      full_name: parsed.data.full_name,
      grade: parsed.data.grade,
      ...normalize(parsed.data),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/principal/students");
  revalidatePath(`/dashboard/principal/students/${id}`);
  redirect("/dashboard/principal/students");
}

export async function deleteStudentAction(id: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/principal/students");
}
