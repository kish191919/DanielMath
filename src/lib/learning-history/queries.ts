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
  Grade,
  Track,
  AttendanceStatus,
} from "@/lib/supabase/types";
import {
  getCurrentQuarter,
  compareQuarters,
  QUARTERS,
  type Quarter,
  type AdvancedStatus,
} from "@/lib/curriculum-quarter";
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

export const MIN_SAMPLE_SIZE = 3;
export const WEAK_ACCURACY_THRESHOLD = 70;
// If at least half of a concept's items came from a scan the teacher marked
// "targeted review" (worksheet_scans.is_targeted_review), the accuracy
// number is likely skewed low by what got selected for upload rather than
// by the student's actual grasp of the concept — see confirmUploadAction.
const TARGETED_REVIEW_HEAVY_RATIO = 0.5;

export type ConceptAccuracySummary = {
  conceptId: string | null;
  label: string;
  strand: string | null;
  total: number;
  correct: number;
  accuracyRate: number;
  isLowSample: boolean;
  isWeak: boolean;
  isTargetedReviewHeavy: boolean;
};

// Items don't carry is_targeted_review themselves (it lives on the scan they
// came from), so this does one extra lookup rather than widening
// listLearningItems's shared shape for every caller.
async function getTargetedReviewScanIds(scanIds: string[]): Promise<Set<string>> {
  if (scanIds.length === 0) return new Set();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("worksheet_scans")
    .select("id")
    .in("id", scanIds)
    .eq("is_targeted_review", true)
    .returns<{ id: string }[]>();
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => row.id));
}

export async function getConceptAccuracySummary(
  studentId: string,
  filters?: { from?: string; to?: string },
): Promise<ConceptAccuracySummary[]> {
  const [items, concepts] = await Promise.all([
    listLearningItems(studentId, filters),
    listConcepts(),
  ]);
  const conceptById = new Map(concepts.map((c) => [c.id, c]));
  const targetedReviewScanIds = await getTargetedReviewScanIds([
    ...new Set(items.map((item) => item.scan_id)),
  ]);

  const buckets = new Map<string, { total: number; correct: number; targetedReviewCount: number }>();
  for (const item of items) {
    const key = item.concept_id ?? "unassigned";
    const bucket = buckets.get(key) ?? { total: 0, correct: 0, targetedReviewCount: 0 };
    bucket.total += 1;
    if (item.is_correct) bucket.correct += 1;
    if (targetedReviewScanIds.has(item.scan_id)) bucket.targetedReviewCount += 1;
    buckets.set(key, bucket);
  }

  const summaries: ConceptAccuracySummary[] = [];
  for (const [key, bucket] of buckets) {
    const concept = key === "unassigned" ? null : (conceptById.get(key) ?? null);
    const accuracyRate = bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0;
    const isLowSample = bucket.total < MIN_SAMPLE_SIZE;
    summaries.push({
      conceptId: concept?.id ?? null,
      label: concept?.label_ko ?? "미분류",
      strand: concept?.strand ?? null,
      total: bucket.total,
      correct: bucket.correct,
      accuracyRate,
      isLowSample,
      isWeak: !isLowSample && accuracyRate < WEAK_ACCURACY_THRESHOLD,
      isTargetedReviewHeavy:
        bucket.total > 0 && bucket.targetedReviewCount / bucket.total >= TARGETED_REVIEW_HEAVY_RATIO,
    });
  }

  return summaries.sort((a, b) => {
    if (a.isWeak !== b.isWeak) return a.isWeak ? -1 : 1;
    if (a.isWeak) return a.accuracyRate - b.accuracyRate;
    return b.total - a.total;
  });
}

export type PaceStatus = "ahead" | "on_pace" | "due" | "not_due" | "unscheduled" | "mastered_prior_grade";

export type ConceptHeatmapCell = {
  conceptId: string;
  label: string;
  total: number;
  accuracyRate: number | null;
  isLowSample: boolean;
  isWeak: boolean;
  quarter: Quarter | null;
  advancedStatus: AdvancedStatus | null;
  paceStatus: PaceStatus;
};

export type ConceptHeatmapStrand = {
  strand: string;
  cells: ConceptHeatmapCell[];
};

export type ConceptHeatmapQuarterGroup = {
  // "quarter": quarter is a real Q1-Q4 value. "mastered_prior_grade": no
  // quarter this year because the advanced-track student already covered it
  // in an earlier grade. "unscheduled": genuinely no quarter data (assumed
  // prerequisite skill / untagged gap). quarter is only meaningful when
  // groupKind === "quarter".
  groupKind: "quarter" | "mastered_prior_grade" | "unscheduled";
  quarter: Quarter | null;
  strands: ConceptHeatmapStrand[];
};

function derivePaceStatus(
  quarter: Quarter | null,
  advancedStatus: AdvancedStatus | null,
  currentQuarter: Quarter,
  total: number,
): PaceStatus {
  if (quarter === null) {
    return advancedStatus === "mastered_prior_grade" ? "mastered_prior_grade" : "unscheduled";
  }
  const isDueOrPast = compareQuarters(quarter, currentQuarter) <= 0;
  if (total > 0) return isDueOrPast ? "on_pace" : "ahead";
  return isDueOrPast ? "due" : "not_due";
}

// Unlike getConceptAccuracySummary (which only lists concepts the student has
// items for), this covers every concept tagged for the student's grade so
// untouched concepts show up as "no data" rather than being omitted.
//
// Uses all-time accuracy (no date filter) rather than a rolling window —
// "is my child ahead of the school's pace" is a whole-year question, not a
// last-30-days one. Recent performance still has its own KPI card/table
// elsewhere on the history page.
export async function getConceptHeatmap(
  studentId: string,
  grade: Grade,
  track: Track,
): Promise<ConceptHeatmapQuarterGroup[]> {
  const [concepts, summary] = await Promise.all([
    listConcepts(),
    getConceptAccuracySummary(studentId),
  ]);
  const summaryByConceptId = new Map(summary.map((s) => [s.conceptId, s]));
  const currentQuarter = getCurrentQuarter();

  type GroupKey = Quarter | "mastered_prior_grade" | "unscheduled";
  const quarterGroups = new Map<GroupKey, Map<string, ConceptHeatmapCell[]>>();
  for (const concept of concepts) {
    if (!concept.grades.includes(grade)) continue;
    const s = summaryByConceptId.get(concept.id);
    const total = s?.total ?? 0;
    const quarter = track === "advanced" ? concept.quarter_advanced : concept.quarter_standard;
    const advancedStatus = track === "advanced" ? concept.advanced_status : null;
    const groupKey: GroupKey =
      quarter ?? (advancedStatus === "mastered_prior_grade" ? "mastered_prior_grade" : "unscheduled");
    const strands = quarterGroups.get(groupKey) ?? new Map<string, ConceptHeatmapCell[]>();
    const cells = strands.get(concept.strand) ?? [];
    cells.push({
      conceptId: concept.id,
      label: concept.label_ko,
      total,
      accuracyRate: s?.accuracyRate ?? null,
      isLowSample: s?.isLowSample ?? true,
      isWeak: s?.isWeak ?? false,
      quarter,
      advancedStatus,
      paceStatus: derivePaceStatus(quarter, advancedStatus, currentQuarter, total),
    });
    strands.set(concept.strand, cells);
    quarterGroups.set(groupKey, strands);
  }

  const orderedKeys: GroupKey[] = [...QUARTERS, "mastered_prior_grade", "unscheduled"];
  return orderedKeys
    .filter((key) => quarterGroups.has(key))
    .map((key) => ({
      groupKind: key === "mastered_prior_grade" || key === "unscheduled" ? key : "quarter",
      quarter: key === "mastered_prior_grade" || key === "unscheduled" ? null : key,
      strands: [...quarterGroups.get(key)!.entries()].map(([strand, cells]) => ({ strand, cells })),
    }));
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
  recentAccuracyRate: number | null;
  recentTotal: number;
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
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceStr = since.toISOString().slice(0, 10);

  const [itemsResult, scansResult] = await Promise.all([
    supabase
      .from("learning_items")
      .select("student_id, is_correct")
      .in("student_id", studentIds)
      .eq("confirmed", true)
      .gte("session_date", sinceStr)
      .returns<Pick<LearningItem, "student_id" | "is_correct">[]>(),
    supabase
      .from("worksheet_scans")
      .select("student_id, session_date")
      .in("student_id", studentIds)
      .order("session_date", { ascending: false })
      .returns<Pick<WorksheetScan, "student_id" | "session_date">[]>(),
  ]);
  if (itemsResult.error) throw new Error(itemsResult.error.message);
  if (scansResult.error) throw new Error(scansResult.error.message);

  const accuracyByStudent = new Map<string, { total: number; correct: number }>();
  for (const item of itemsResult.data ?? []) {
    const bucket = accuracyByStudent.get(item.student_id) ?? { total: 0, correct: 0 };
    bucket.total += 1;
    if (item.is_correct) bucket.correct += 1;
    accuracyByStudent.set(item.student_id, bucket);
  }

  // scansResult.data is ordered desc by session_date, so the first row seen
  // per student_id is that student's most recent session.
  const lastSessionByStudent = new Map<string, string>();
  for (const scan of scansResult.data ?? []) {
    if (!lastSessionByStudent.has(scan.student_id)) {
      lastSessionByStudent.set(scan.student_id, scan.session_date);
    }
  }

  return studentList.map((student) => {
    const bucket = accuracyByStudent.get(student.id);
    return {
      student,
      lastSessionDate: lastSessionByStudent.get(student.id) ?? null,
      recentAccuracyRate:
        bucket && bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : null,
      recentTotal: bucket?.total ?? 0,
    };
  });
}

export type StudentKpiSummary = {
  recentAccuracyRate: number | null;
  recentTotal: number;
  allTimeAccuracyRate: number | null;
  allTimeTotal: number;
  lastSessionDate: string | null;
  curriculumCoverage: { covered: number; total: number; rate: number | null };
};

export async function getStudentKpiSummary(
  studentId: string,
  grade: Grade,
): Promise<StudentKpiSummary> {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceStr = since.toISOString().slice(0, 10);

  const [allItems, scans, concepts] = await Promise.all([
    listLearningItems(studentId),
    listScansForStudent(studentId),
    listConcepts(),
  ]);

  const recentItems = allItems.filter((i) => i.session_date >= sinceStr);
  const recentCorrect = recentItems.filter((i) => i.is_correct).length;
  const allCorrect = allItems.filter((i) => i.is_correct).length;

  const gradeConceptIds = new Set(
    concepts.filter((c) => c.grades.includes(grade)).map((c) => c.id),
  );
  const coveredConceptIds = new Set(
    allItems
      .filter((i) => i.concept_id && gradeConceptIds.has(i.concept_id))
      .map((i) => i.concept_id as string),
  );

  return {
    recentAccuracyRate:
      recentItems.length > 0 ? Math.round((recentCorrect / recentItems.length) * 100) : null,
    recentTotal: recentItems.length,
    allTimeAccuracyRate:
      allItems.length > 0 ? Math.round((allCorrect / allItems.length) * 100) : null,
    allTimeTotal: allItems.length,
    lastSessionDate: scans[0]?.session_date ?? null,
    curriculumCoverage: {
      covered: coveredConceptIds.size,
      total: gradeConceptIds.size,
      rate:
        gradeConceptIds.size > 0
          ? Math.round((coveredConceptIds.size / gradeConceptIds.size) * 100)
          : null,
    },
  };
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

export async function getConceptAccuracySummaryForParent(
  parentId: string,
  studentId: string,
  filters?: { from?: string; to?: string },
): Promise<ConceptAccuracySummary[]> {
  const owns = await assertParentOwnsStudent(parentId, studentId);
  if (!owns) return [];
  return getConceptAccuracySummary(studentId, filters);
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
