import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type {
  Concept,
  WorksheetScan,
  LearningItem,
  SessionNote,
  Student,
  Grade,
  Track,
} from "@/lib/supabase/types";
import {
  getCurrentQuarter,
  compareQuarters,
  QUARTERS,
  type Quarter,
  type AdvancedStatus,
} from "@/lib/curriculum-quarter";

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

export type ConceptAccuracySummary = {
  conceptId: string | null;
  label: string;
  strand: string | null;
  total: number;
  correct: number;
  accuracyRate: number;
  isLowSample: boolean;
  isWeak: boolean;
};

export async function getConceptAccuracySummary(
  studentId: string,
  filters?: { from?: string; to?: string },
): Promise<ConceptAccuracySummary[]> {
  const [items, concepts] = await Promise.all([
    listLearningItems(studentId, filters),
    listConcepts(),
  ]);
  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  const buckets = new Map<string, { total: number; correct: number }>();
  for (const item of items) {
    const key = item.concept_id ?? "unassigned";
    const bucket = buckets.get(key) ?? { total: 0, correct: 0 };
    bucket.total += 1;
    if (item.is_correct) bucket.correct += 1;
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
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("parent_id", parentId)
    .order("full_name", { ascending: true })
    .returns<Student[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function assertParentOwnsStudent(parentId: string, studentId: string): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("students")
    .select("id")
    .eq("id", studentId)
    .eq("parent_id", parentId)
    .maybeSingle<{ id: string }>();
  return !!data;
}

export async function getSignedScanViewUrlForParent(
  parentId: string,
  scanId: string,
): Promise<{ url: string; scan: WorksheetScan } | null> {
  const supabase = await createServerSupabase();
  const { data: scan } = await supabase
    .from("worksheet_scans")
    .select("*")
    .eq("id", scanId)
    .maybeSingle<WorksheetScan>();
  if (!scan) return null;

  const owns = await assertParentOwnsStudent(parentId, scan.student_id);
  if (!owns) return null;

  const admin = createAdminSupabase();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(scan.storage_path, 300);
  if (error || !data) return null;

  return { url: data.signedUrl, scan };
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
