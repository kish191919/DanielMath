"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { getClassRoster } from "@/lib/classes/queries";
import { classSessionSchema, HOMEWORK_STATUSES } from "./schema";
import type { AttendanceStatus, HomeworkStatus } from "@/lib/supabase/types";

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
      const submittedStatus = formData.get(`status_${student.id}`);
      const status: AttendanceStatus = submittedStatus === "absent" ? "absent" : "present";

      const submittedHomework = formData.get(`homework_${student.id}`);
      const homework_status: HomeworkStatus = HOMEWORK_STATUSES.includes(
        submittedHomework as HomeworkStatus,
      )
        ? (submittedHomework as HomeworkStatus)
        : "na";

      return { session_id: inserted.id, student_id: student.id, status, homework_status };
    });

    const { error: attendanceError } = await supabase
      .from("class_session_attendance")
      .insert(attendanceRows);
    if (attendanceError) return { error: attendanceError.message };

    const noteRows = rosterData.roster
      .map(({ student }) => {
        const rawNote = formData.get(`note_${student.id}`);
        const note = typeof rawNote === "string" ? rawNote.trim().slice(0, 2000) : "";
        return note ? { student_id: student.id, note } : null;
      })
      .filter((row): row is { student_id: string; note: string } => row !== null);

    if (noteRows.length > 0) {
      const { error: noteError } = await supabase.from("session_notes").insert(
        noteRows.map((row) => ({
          student_id: row.student_id,
          scan_id: null,
          session_date: parsed.data.session_date,
          note: row.note,
          source: "teacher" as const,
          confirmed: true,
          created_by: session.userId,
        })),
      );
      if (noteError) return { error: noteError.message };

      for (const row of noteRows) {
        revalidatePath(`/dashboard/principal/students/${row.student_id}/history`);
      }
      revalidatePath("/dashboard/parent/progress");
    }
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
