import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type {
  Concept,
  WorksheetScan,
  LearningItem,
  SessionNote,
  Student,
} from "@/lib/supabase/types";

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

export async function listRecentScans(limit = 50): Promise<WorksheetScan[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("worksheet_scans")
    .select("*")
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

export type ConceptAccuracySummary = {
  conceptId: string | null;
  label: string;
  strand: string | null;
  total: number;
  correct: number;
  accuracyRate: number;
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
    summaries.push({
      conceptId: concept?.id ?? null,
      label: concept?.label_ko ?? "미분류",
      strand: concept?.strand ?? null,
      total: bucket.total,
      correct: bucket.correct,
      accuracyRate: bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0,
    });
  }

  return summaries.sort((a, b) => b.total - a.total);
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

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceStr = since.toISOString().slice(0, 10);

  const overview: StudentProgressOverview[] = [];
  for (const student of students ?? []) {
    const [items, scans] = await Promise.all([
      listLearningItems(student.id, { from: sinceStr }),
      listScansForStudent(student.id),
    ]);
    const correct = items.filter((i) => i.is_correct).length;
    overview.push({
      student,
      lastSessionDate: scans[0]?.session_date ?? null,
      recentAccuracyRate: items.length > 0 ? Math.round((correct / items.length) * 100) : null,
      recentTotal: items.length,
    });
  }
  return overview;
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
