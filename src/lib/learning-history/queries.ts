import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type {
  Concept,
  WorksheetScan,
  LearningItem,
  SessionNote,
  SessionNoteLanguage,
  Student,
  AttendanceStatus,
} from "@/lib/supabase/types";
import { shiftMonth } from "@/lib/dates";

const BUCKET = "worksheet-scans";

export async function listConcepts(): Promise<Concept[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("concepts")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .returns<Concept[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listScansForStudent(studentId: string): Promise<WorksheetScan[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("worksheet_scans")
    .select("*")
    .eq("student_id", studentId)
    .order("session_date", { ascending: false })
    .returns<WorksheetScan[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listRecentScans(
  limit = 50,
  studentId?: string,
): Promise<WorksheetScan[]> {
  const supabase = await createServerSupabase();
  let query = supabase.from("worksheet_scans").select("*");
  if (studentId) query = query.eq("student_id", studentId);
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<WorksheetScan[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listPendingScans(): Promise<WorksheetScan[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("worksheet_scans")
    .select("*")
    .neq("status", "reviewed")
    .order("created_at", { ascending: false })
    .returns<WorksheetScan[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Scans still sitting at "uploaded" — a report about them has not yet been
// sent to the parent (see sendSessionNoteAction, which flips a scan to
// "delivered_to_parent" once notifyGuardiansOfReport succeeds).
export async function listUndeliveredScans(): Promise<WorksheetScan[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("worksheet_scans")
    .select("*")
    .eq("status", "uploaded")
    .order("created_at", { ascending: false })
    .returns<WorksheetScan[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getScanWithItems(
  scanId: string,
): Promise<{ scan: WorksheetScan; items: LearningItem[] } | null> {
  const supabase = await createServerSupabase();
  const { data: scan } = await supabase
    .from("worksheet_scans")
    .select("*")
    .eq("id", scanId)
    .maybeSingle<WorksheetScan>();
  if (!scan) return null;

  const { data: items, error } = await supabase
    .from("learning_items")
    .select("*")
    .eq("scan_id", scanId)
    .order("created_at", { ascending: true })
    .returns<LearningItem[]>();
  if (error) throw new Error(error.message);

  return { scan, items: items ?? [] };
}

// Correction uploads (re-photographs of problems the teacher marked wrong
// in red pen) linked back to the raw scan they correct — see
// confirmUploadAction's sourceScanId. A raw scan's review page uses this to
// list them and to aggregate their confirmed learning_items for the
// concept/error-type analysis panel.
export async function listCorrectionScansForScan(sourceScanId: string): Promise<WorksheetScan[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("worksheet_scans")
    .select("*")
    .eq("source_scan_id", sourceScanId)
    .order("created_at", { ascending: true })
    .returns<WorksheetScan[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Confirmed items across one or more correction scans, for the
// concept/error-type analysis panel on a raw scan's review page (which may
// have several correction uploads over the course of a session).
export async function getConfirmedItemsForScans(scanIds: string[]): Promise<LearningItem[]> {
  if (scanIds.length === 0) return [];
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("learning_items")
    .select("*")
    .in("scan_id", scanIds)
    .eq("confirmed", true)
    .returns<LearningItem[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSignedScanViewUrl(scanId: string): Promise<string | null> {
  const supabase = await createServerSupabase();
  const { data: scan } = await supabase
    .from("worksheet_scans")
    .select("storage_path")
    .eq("id", scanId)
    .maybeSingle<Pick<WorksheetScan, "storage_path">>();
  if (!scan) return null;

  const admin = createAdminSupabase();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(scan.storage_path, 300);
  if (error || !data) return null;
  return data.signedUrl;
}

// Separate from getSignedScanViewUrl because the viewer needs an
// inline-displayable URL, while this forces Content-Disposition:
// attachment so the browser downloads the file instead of navigating to
// it (required for the cross-origin Supabase Storage URL to download at
// all — the HTML `download` attribute alone doesn't work cross-origin).
export async function getSignedScanDownloadUrl(
  storagePath: string,
  filename: string,
): Promise<string | null> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 300, { download: filename });
  if (error || !data) return null;
  return data.signedUrl;
}

type LearningItemFilters = {
  from?: string;
  to?: string;
  conceptId?: string;
  onlyIncorrect?: boolean;
};

export async function listLearningItems(
  studentId: string,
  filters?: LearningItemFilters,
): Promise<LearningItem[]> {
  const supabase = await createServerSupabase();
  let query = supabase
    .from("learning_items")
    .select("*")
    .eq("student_id", studentId)
    .eq("confirmed", true);

  if (filters?.from) query = query.gte("session_date", filters.from);
  if (filters?.to) query = query.lte("session_date", filters.to);
  if (filters?.conceptId) query = query.eq("concept_id", filters.conceptId);
  if (filters?.onlyIncorrect) query = query.eq("is_correct", false);

  const { data, error } = await query
    .order("session_date", { ascending: false })
    .returns<LearningItem[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listSessionNotes(studentId: string, limit = 20): Promise<SessionNote[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("session_notes")
    .select("*")
    .eq("student_id", studentId)
    .eq("confirmed", true)
    .order("session_date", { ascending: false })
    .limit(limit)
    .returns<SessionNote[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Unfiltered counterpart to listSessionNotes — the worksheet review page
// needs to see an unconfirmed AI draft tied to this scan, not just
// already-published notes.
export async function getSessionNoteForScan(scanId: string): Promise<SessionNote | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("session_notes")
    .select("*")
    .eq("scan_id", scanId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<SessionNote>();
  if (error) throw new Error(error.message);
  return data ?? null;
}

// Defaults the review page's language toggle to whichever language was used
// the last time a report was actually published to this student's parent
// (confirmed = true), so the teacher isn't asked to pick every time.
export async function getLastSentNoteLanguage(studentId: string): Promise<SessionNoteLanguage> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("session_notes")
    .select("language")
    .eq("student_id", studentId)
    .eq("confirmed", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ language: SessionNoteLanguage }>();
  return data?.language ?? "ko";
}

export type StudentProgressOverview = {
  student: Student;
  lastSessionDate: string | null;
};

export async function listStudentsProgressOverview(): Promise<StudentProgressOverview[]> {
  const supabase = await createServerSupabase();
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .order("full_name", { ascending: true })
    .returns<Student[]>();
  if (error) throw new Error(error.message);

  const studentList = students ?? [];
  if (studentList.length === 0) return [];

  const studentIds = studentList.map((s) => s.id);
  const { data: scans, error: scansError } = await supabase
    .from("worksheet_scans")
    .select("student_id, session_date")
    .in("student_id", studentIds)
    .order("session_date", { ascending: false })
    .returns<Pick<WorksheetScan, "student_id" | "session_date">[]>();
  if (scansError) throw new Error(scansError.message);

  // scans is ordered desc by session_date, so the first row seen per
  // student_id is that student's most recent session.
  const lastSessionByStudent = new Map<string, string>();
  for (const scan of scans ?? []) {
    if (!lastSessionByStudent.has(scan.student_id)) {
      lastSessionByStudent.set(scan.student_id, scan.session_date);
    }
  }

  return studentList.map((student) => ({
    student,
    lastSessionDate: lastSessionByStudent.get(student.id) ?? null,
  }));
}

// --- Parent-scoped variants -------------------------------------------------
// RLS on `students` is not confirmed to exist, so ownership is checked
// explicitly here rather than assumed — see AGENTS.md's DAL-as-enforcement
// convention.

export async function listChildrenForParent(parentId: string): Promise<Student[]> {
  const supabase = await createServerSupabase();
  const { data: links, error: linksError } = await supabase
    .from("student_guardians")
    .select("student_id")
    .eq("guardian_id", parentId)
    .returns<{ student_id: string }[]>();
  if (linksError) throw new Error(linksError.message);

  const studentIds = (links ?? []).map((l) => l.student_id);
  if (studentIds.length === 0) return [];

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .in("id", studentIds)
    .order("full_name", { ascending: true })
    .returns<Student[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

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

export type AttendanceCalendarEntry = {
  date: string; // "YYYY-MM-DD"
  status: AttendanceStatus;
};

export async function listAttendanceForParent(
  parentId: string,
  studentId: string,
  month: string, // "YYYY-MM"
): Promise<AttendanceCalendarEntry[]> {
  const owns = await assertParentOwnsStudent(parentId, studentId);
  if (!owns) return [];

  const monthStart = `${month}-01`;
  const nextMonthStart = `${shiftMonth(month, 1)}-01`;

  const supabase = await createServerSupabase();
  const [attendanceResult, scanResult] = await Promise.all([
    supabase
      .from("class_session_attendance")
      .select("status, class_sessions!inner(session_date)")
      .eq("student_id", studentId)
      .gte("class_sessions.session_date", monthStart)
      .lt("class_sessions.session_date", nextMonthStart)
      .returns<{ status: AttendanceStatus; class_sessions: { session_date: string } }[]>(),
    supabase
      .from("worksheet_scans")
      .select("session_date")
      .eq("student_id", studentId)
      .neq("status", "grading_failed")
      .gte("session_date", monthStart)
      .lt("session_date", nextMonthStart)
      .returns<{ session_date: string }[]>(),
  ]);
  if (attendanceResult.error) throw new Error(attendanceResult.error.message);
  if (scanResult.error) throw new Error(scanResult.error.message);

  const statusByDate = new Map<string, AttendanceStatus>(
    (attendanceResult.data ?? []).map((row) => [row.class_sessions.session_date, row.status]),
  );
  // A worksheet upload is direct evidence the student attended, so it wins
  // over any attendance record already logged for the same date.
  for (const row of scanResult.data ?? []) {
    statusByDate.set(row.session_date, "present");
  }

  return [...statusByDate.entries()].map(([date, status]) => ({ date, status }));
}

// Batched counterpart of the old per-note getSignedScanViewUrlForParent —
// that version did 3 sequential round trips (scan lookup, ownership check,
// signed URL) per note, which meant N+1 fan-out across a child's session
// notes. This does one ownership check, one bulk scan lookup, and one
// batched Storage call for however many scans are requested.
export async function getSignedScanViewUrlsForParent(
  parentId: string,
  studentId: string,
  scanIds: string[],
): Promise<Map<string, { url: string; mimeType: string | null }>> {
  const result = new Map<string, { url: string; mimeType: string | null }>();
  if (scanIds.length === 0) return result;

  const owns = await assertParentOwnsStudent(parentId, studentId);
  if (!owns) return result;

  const supabase = await createServerSupabase();
  const { data: scans } = await supabase
    .from("worksheet_scans")
    .select("id, storage_path, student_id, mime_type")
    .in("id", scanIds)
    .returns<Pick<WorksheetScan, "id" | "storage_path" | "student_id" | "mime_type">[]>();
  const ownedScans = (scans ?? []).filter((scan) => scan.student_id === studentId);
  if (ownedScans.length === 0) return result;

  const admin = createAdminSupabase();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrls(
      ownedScans.map((scan) => scan.storage_path),
      300,
    );
  if (error || !data) return result;

  ownedScans.forEach((scan, index) => {
    const signedUrl = data[index]?.signedUrl;
    if (signedUrl) result.set(scan.id, { url: signedUrl, mimeType: scan.mime_type });
  });

  return result;
}

export async function listSessionNotesForParent(
  parentId: string,
  studentId: string,
  limit = 20,
): Promise<SessionNote[]> {
  const owns = await assertParentOwnsStudent(parentId, studentId);
  if (!owns) return [];
  return listSessionNotes(studentId, limit);
}

export async function listSessionNotesForParentByDate(
  parentId: string,
  studentId: string,
  date: string, // "YYYY-MM-DD"
): Promise<SessionNote[]> {
  const owns = await assertParentOwnsStudent(parentId, studentId);
  if (!owns) return [];
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("session_notes")
    .select("*")
    .eq("student_id", studentId)
    .eq("confirmed", true)
    .eq("session_date", date)
    .order("created_at", { ascending: true })
    .returns<SessionNote[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Calendar dot indicator — which dates in this month have a confirmed
// report, without fetching the full note bodies.
export async function listSessionNoteDatesForParent(
  parentId: string,
  studentId: string,
  month: string, // "YYYY-MM"
): Promise<Set<string>> {
  const owns = await assertParentOwnsStudent(parentId, studentId);
  if (!owns) return new Set();
  const monthStart = `${month}-01`;
  const nextMonthStart = `${shiftMonth(month, 1)}-01`;
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("session_notes")
    .select("session_date")
    .eq("student_id", studentId)
    .eq("confirmed", true)
    .gte("session_date", monthStart)
    .lt("session_date", nextMonthStart)
    .returns<{ session_date: string }[]>();
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => row.session_date));
}

// Single-report counterpart for the /dashboard/parent/reports/[noteId] deep
// link the SMS notification points at — resolves the note plus its student
// in one call, checking guardian ownership against the note's own
// student_id rather than a caller-supplied studentId (there isn't one at
// this call site).
export async function getSessionNoteForParent(
  parentId: string,
  noteId: string,
): Promise<{ note: SessionNote; student: Student } | null> {
  const supabase = await createServerSupabase();
  const { data: note } = await supabase
    .from("session_notes")
    .select("*")
    .eq("id", noteId)
    .eq("confirmed", true)
    .maybeSingle<SessionNote>();
  if (!note) return null;

  const owns = await assertParentOwnsStudent(parentId, note.student_id);
  if (!owns) return null;

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", note.student_id)
    .maybeSingle<Student>();
  if (!student) return null;

  return { note, student };
}
