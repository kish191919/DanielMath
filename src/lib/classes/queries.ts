import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Class, ClassEnrollment, Student } from "@/lib/supabase/types";

export async function listClasses(): Promise<Class[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .order("start_time", { ascending: true })
    .returns<Class[]>();

  if (error) throw new Error(error.message);
  return data ?? [];
}

export type ClassWithCount = {
  classRow: Class;
  activeCount: number;
};

export async function listClassesWithCounts(): Promise<ClassWithCount[]> {
  const classList = await listClasses();
  if (classList.length === 0) return [];

  const supabase = await createServerSupabase();
  const classIds = classList.map((c) => c.id);
  const { data: enrollments, error } = await supabase
    .from("class_enrollments")
    .select("class_id")
    .in("class_id", classIds)
    .is("unenrolled_at", null)
    .returns<Pick<ClassEnrollment, "class_id">[]>();
  if (error) throw new Error(error.message);

  const countByClass = new Map<string, number>();
  for (const row of enrollments ?? []) {
    countByClass.set(row.class_id, (countByClass.get(row.class_id) ?? 0) + 1);
  }

  return classList.map((classRow) => ({
    classRow,
    activeCount: countByClass.get(classRow.id) ?? 0,
  }));
}

export async function getClass(id: string): Promise<Class | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("classes")
    .select("*")
    .eq("id", id)
    .maybeSingle<Class>();

  return data ?? null;
}

export type ClassRosterEntry = {
  enrollmentId: string;
  student: Student;
};

export type ClassRoster = {
  classRow: Class;
  roster: ClassRosterEntry[];
};

export async function getClassRoster(id: string): Promise<ClassRoster | null> {
  const classRow = await getClass(id);
  if (!classRow) return null;

  const supabase = await createServerSupabase();
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("class_enrollments")
    .select("id, student_id")
    .eq("class_id", id)
    .is("unenrolled_at", null)
    .returns<Pick<ClassEnrollment, "id" | "student_id">[]>();
  if (enrollmentsError) throw new Error(enrollmentsError.message);

  const enrollmentList = enrollments ?? [];
  if (enrollmentList.length === 0) return { classRow, roster: [] };

  const studentIds = enrollmentList.map((e) => e.student_id);
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("*")
    .in("id", studentIds)
    .returns<Student[]>();
  if (studentsError) throw new Error(studentsError.message);

  const studentById = new Map((students ?? []).map((s) => [s.id, s]));
  const roster = enrollmentList
    .map((e) => {
      const student = studentById.get(e.student_id);
      return student ? { enrollmentId: e.id, student } : null;
    })
    .filter((entry): entry is ClassRosterEntry => entry !== null)
    .sort((a, b) => a.student.full_name.localeCompare(b.student.full_name));

  return { classRow, roster };
}

export async function listAvailableStudentsForClass(classId: string): Promise<Student[]> {
  const supabase = await createServerSupabase();

  const [{ data: enrolled, error: enrolledError }, { data: students, error: studentsError }] =
    await Promise.all([
      supabase
        .from("class_enrollments")
        .select("student_id")
        .eq("class_id", classId)
        .is("unenrolled_at", null)
        .returns<Pick<ClassEnrollment, "student_id">[]>(),
      supabase.from("students").select("*").order("full_name", { ascending: true }).returns<Student[]>(),
    ]);
  if (enrolledError) throw new Error(enrolledError.message);
  if (studentsError) throw new Error(studentsError.message);

  const enrolledIds = new Set((enrolled ?? []).map((e) => e.student_id));
  return (students ?? []).filter((s) => !enrolledIds.has(s.id));
}

export async function listClassBadgesForStudents(
  studentIds: string[],
): Promise<Record<string, Class[]>> {
  if (studentIds.length === 0) return {};

  const supabase = await createServerSupabase();
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("class_enrollments")
    .select("class_id, student_id")
    .in("student_id", studentIds)
    .is("unenrolled_at", null)
    .returns<Pick<ClassEnrollment, "class_id" | "student_id">[]>();
  if (enrollmentsError) throw new Error(enrollmentsError.message);

  const enrollmentList = enrollments ?? [];
  if (enrollmentList.length === 0) return {};

  const classIds = [...new Set(enrollmentList.map((e) => e.class_id))];
  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("*")
    .in("id", classIds)
    .returns<Class[]>();
  if (classesError) throw new Error(classesError.message);

  const classById = new Map((classes ?? []).map((c) => [c.id, c]));
  const badgesByStudent: Record<string, Class[]> = {};
  for (const enrollment of enrollmentList) {
    const classRow = classById.get(enrollment.class_id);
    if (!classRow) continue;
    (badgesByStudent[enrollment.student_id] ??= []).push(classRow);
  }
  return badgesByStudent;
}
