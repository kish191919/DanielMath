"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { getClassRoster } from "@/lib/classes/queries";
import { classSessionSchema } from "./schema";
import type { AttendanceStatus } from "@/lib/supabase/types";

export type ClassSessionFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"session_date", string>>;
  success?: boolean;
};

function parseClassSessionForm(formData: FormData) {
  return classSessionSchema.safeParse({
    session_date: formData.get("session_date"),
    topic: formData.get("topic") ?? "",
    materials: formData.get("materials") ?? "",
    note: formData.get("note") ?? "",
  });
}

function collectFieldErrors(
  parsed: ReturnType<typeof parseClassSessionForm>,
): ClassSessionFormState["fieldErrors"] {
  if (parsed.success) return undefined;
  const fieldErrors: ClassSessionFormState["fieldErrors"] = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (key === "session_date") {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

function normalize(values: { topic?: string; materials?: string; note?: string }) {
  return {
    topic: values.topic && values.topic.length > 0 ? values.topic : null,
    materials: values.materials && values.materials.length > 0 ? values.materials : null,
    note: values.note && values.note.length > 0 ? values.note : null,
  };
}

export async function createClassSessionAction(
  classId: string,
  _prev: ClassSessionFormState | null,
  formData: FormData,
): Promise<ClassSessionFormState> {
  const session = await requireRole("principal");

  const parsed = parseClassSessionForm(formData);
  if (!parsed.success) {
    return { error: "입력값을 확인해주세요.", fieldErrors: collectFieldErrors(parsed) };
  }

  const rosterData = await getClassRoster(classId);
  if (!rosterData) return { error: "반을 찾을 수 없습니다." };

  const supabase = await createServerSupabase();
  const { data: inserted, error } = await supabase
    .from("class_sessions")
    .insert({
      class_id: classId,
      session_date: parsed.data.session_date,
      created_by: session.userId,
      ...normalize(parsed.data),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  if (rosterData.roster.length > 0) {
    const attendanceRows = rosterData.roster.map(({ student }) => {
      const submitted = formData.get(`status_${student.id}`);
      const status: AttendanceStatus =
        submitted === "absent" || submitted === "late" ? submitted : "present";
      return { session_id: inserted.id, student_id: student.id, status };
    });

    const { error: attendanceError } = await supabase
      .from("class_session_attendance")
      .insert(attendanceRows);
    if (attendanceError) return { error: attendanceError.message };
  }

  revalidatePath(`/dashboard/principal/classes/${classId}`);
  return { success: true };
}

export async function deleteClassSessionAction(sessionId: string, classId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("class_sessions").delete().eq("id", sessionId);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/principal/classes/${classId}`);
}
