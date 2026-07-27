"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { addGuardianSchema, guardianPhoneSchema, studentSchema } from "./schema";
import type { Profile } from "@/lib/supabase/types";

export type StudentFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"full_name" | "grade" | "track" | "notes", string>>;
};

function parseStudentForm(formData: FormData) {
  return studentSchema.safeParse({
    full_name: formData.get("full_name"),
    grade: formData.get("grade"),
    track: formData.get("track") ?? "advanced",
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
    if (key === "full_name" || key === "grade" || key === "track" || key === "notes") {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

function normalize(values: { notes?: string }) {
  return {
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
    track: parsed.data.track,
    ...normalize(parsed.data),
  });

  if (error) return { error: error.message };

  // If this registration started from an inquiry card ("학생으로 등록"
  // link), close the loop by marking that inquiry enrolled. Best-effort:
  // the student is already saved, so a failure here shouldn't block the
  // redirect — it would just leave the inquiry's status stale.
  const fromInquiryId = formData.get("from_inquiry_id");
  if (typeof fromInquiryId === "string" && fromInquiryId.length > 0) {
    await supabase.from("inquiries").update({ status: "enrolled" }).eq("id", fromInquiryId);
    revalidatePath("/dashboard/principal/inquiries");
  }

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
      track: parsed.data.track,
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

export type AddGuardianFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"email", string>>;
  success?: boolean;
};

export async function addGuardianAction(
  studentId: string,
  _prev: AddGuardianFormState | null,
  formData: FormData,
): Promise<AddGuardianFormState> {
  await requireRole("principal");

  const parsed = addGuardianSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      error: "입력값을 확인해주세요.",
      fieldErrors: { email: parsed.error.issues[0]?.message },
    };
  }

  const admin = createAdminSupabase();
  const { data: guardian } = await admin
    .from("profiles")
    .select("id, role")
    .ilike("email", parsed.data.email)
    .maybeSingle<Pick<Profile, "id" | "role">>();

  if (!guardian || guardian.role !== "parent") {
    return {
      error: "해당 이메일의 학부모 계정을 찾을 수 없습니다 — 계정을 먼저 생성해주세요.",
      fieldErrors: { email: undefined },
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("student_guardians")
    .insert({ student_id: studentId, guardian_id: guardian.id });

  if (error) {
    if (error.code === "23505") {
      return { error: "이미 등록된 보호자입니다." };
    }
    return { error: error.message };
  }

  revalidatePath(`/dashboard/principal/students/${studentId}`);
  return { success: true };
}

export type UpdateGuardianPhoneState = {
  error?: string;
  success?: boolean;
};

export async function updateGuardianPhoneAction(
  guardianId: string,
  studentId: string,
  _prev: UpdateGuardianPhoneState | null,
  formData: FormData,
): Promise<UpdateGuardianPhoneState> {
  await requireRole("principal");

  const parsed = guardianPhoneSchema.safeParse(formData.get("phone"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "연락처를 확인해주세요." };
  }

  // admin client, not the principal's session client — there's no existing
  // precedent of the principal writing another user's profiles row (only
  // addGuardianAction's admin-client read precedent), and profiles' RLS is
  // hand-managed outside this repo, so this avoids gambling on it.
  const admin = createAdminSupabase();
  const { error } = await admin
    .from("profiles")
    .update({ phone: parsed.data })
    .eq("id", guardianId);
  if (error) return { error: error.message };

  revalidatePath(`/dashboard/principal/students/${studentId}`);
  return { success: true };
}

export async function removeGuardianAction(studentId: string, linkId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("student_guardians").delete().eq("id", linkId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/principal/students/${studentId}`);
}
