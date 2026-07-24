"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { classSchema } from "./schema";

export type ClassFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "days_of_week" | "start_time" | "end_time", string>>;
};

function parseClassForm(formData: FormData) {
  return classSchema.safeParse({
    name: formData.get("name"),
    days_of_week: formData.getAll("days_of_week"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
  });
}

function collectFieldErrors(
  parsed: ReturnType<typeof parseClassForm>,
): ClassFormState["fieldErrors"] {
  if (parsed.success) return undefined;
  const fieldErrors: ClassFormState["fieldErrors"] = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (key === "name" || key === "days_of_week" || key === "start_time" || key === "end_time") {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export async function createClassAction(
  _prev: ClassFormState | null,
  formData: FormData,
): Promise<ClassFormState> {
  await requireRole("principal");

  const parsed = parseClassForm(formData);
  if (!parsed.success) {
    return { error: "입력값을 확인해주세요.", fieldErrors: collectFieldErrors(parsed) };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("classes").insert({
    name: parsed.data.name,
    days_of_week: parsed.data.days_of_week,
    start_time: parsed.data.start_time,
    end_time: parsed.data.end_time,
    is_active: formData.get("is_active") === "on",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/principal/classes");
  redirect("/dashboard/principal/classes");
}

export async function updateClassAction(
  id: string,
  _prev: ClassFormState | null,
  formData: FormData,
): Promise<ClassFormState> {
  await requireRole("principal");

  const parsed = parseClassForm(formData);
  if (!parsed.success) {
    return { error: "입력값을 확인해주세요.", fieldErrors: collectFieldErrors(parsed) };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("classes")
    .update({
      name: parsed.data.name,
      days_of_week: parsed.data.days_of_week,
      start_time: parsed.data.start_time,
      end_time: parsed.data.end_time,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/principal/classes");
  revalidatePath(`/dashboard/principal/classes/${id}`);
  redirect(`/dashboard/principal/classes/${id}`);
}

export async function deleteClassAction(id: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/principal/classes");
}

export async function enrollStudentAction(classId: string, formData: FormData) {
  await requireRole("principal");

  const studentId = formData.get("student_id");
  if (typeof studentId !== "string" || studentId.length === 0) {
    throw new Error("학생을 선택해주세요.");
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("class_enrollments")
    .insert({ class_id: classId, student_id: studentId });
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/principal/classes/${classId}`);
  revalidatePath("/dashboard/principal/students");
}

export async function unenrollStudentAction(classId: string, enrollmentId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("class_enrollments")
    .update({ unenrolled_at: new Date().toISOString().slice(0, 10) })
    .eq("id", enrollmentId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/principal/classes/${classId}`);
  revalidatePath("/dashboard/principal/students");
}
