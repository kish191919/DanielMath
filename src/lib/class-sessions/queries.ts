import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ClassSession, ClassSessionAttendance, Student } from "@/lib/supabase/types";

export async function listClassSessions(classId: string): Promise<ClassSession[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("class_id", classId)
    .order("session_date", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<ClassSession[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}

export type AttendanceSummary = {
  total: number;
  present: number;
  absent: number;
  late: number;
  absentNames: string[];
  lateNames: string[];
  homeworkDone: number;
  homeworkPartial: number;
  homeworkNotDone: number;
  homeworkNa: number;
  homeworkNotDoneNames: string[];
};

export async function listAttendanceSummaries(
  sessionIds: string[],
): Promise<Record<string, AttendanceSummary>> {
  if (sessionIds.length === 0) return {};

  const supabase = await createServerSupabase();
  const { data: attendance, error: attendanceError } = await supabase
    .from("class_session_attendance")
    .select("session_id, student_id, status, homework_status")
    .in("session_id", sessionIds)
    .returns<
      Pick<ClassSessionAttendance, "session_id" | "student_id" | "status" | "homework_status">[]
    >();
  if (attendanceError) throw new Error(attendanceError.message);

  const attendanceList = attendance ?? [];
  if (attendanceList.length === 0) return {};

  const studentIds = [...new Set(attendanceList.map((a) => a.student_id))];
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("*")
    .in("id", studentIds)
    .returns<Student[]>();
  if (studentsError) throw new Error(studentsError.message);

  const studentById = new Map((students ?? []).map((s) => [s.id, s]));
  const summaries: Record<string, AttendanceSummary> = {};

  for (const row of attendanceList) {
    const summary = (summaries[row.session_id] ??= {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      absentNames: [],
      lateNames: [],
      homeworkDone: 0,
      homeworkPartial: 0,
      homeworkNotDone: 0,
      homeworkNa: 0,
      homeworkNotDoneNames: [],
    });
    summary.total += 1;
    const studentName = studentById.get(row.student_id)?.full_name ?? "알 수 없음";
    if (row.status === "present") summary.present += 1;
    if (row.status === "absent") {
      summary.absent += 1;
      summary.absentNames.push(studentName);
    }
    if (row.status === "late") {
      summary.late += 1;
      summary.lateNames.push(studentName);
    }
    if (row.homework_status === "done") summary.homeworkDone += 1;
    if (row.homework_status === "partial") summary.homeworkPartial += 1;
    if (row.homework_status === "na") summary.homeworkNa += 1;
    if (row.homework_status === "not_done") {
      summary.homeworkNotDone += 1;
      summary.homeworkNotDoneNames.push(studentName);
    }
  }

  return summaries;
}
