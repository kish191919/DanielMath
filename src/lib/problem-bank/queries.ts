import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { ReferenceProblemScan, ReferenceProblem } from "@/lib/supabase/types";

const BUCKET = "problem-bank";

export async function listReferenceScans(): Promise<ReferenceProblemScan[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("reference_problem_scans")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<ReferenceProblemScan[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listPendingReferenceScans(): Promise<ReferenceProblemScan[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("reference_problem_scans")
    .select("*")
    .neq("status", "reviewed")
    .order("created_at", { ascending: false })
    .returns<ReferenceProblemScan[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getReferenceScanWithItems(
  scanId: string,
): Promise<{ scan: ReferenceProblemScan; items: ReferenceProblem[] } | null> {
  const supabase = await createServerSupabase();
  const { data: scan } = await supabase
    .from("reference_problem_scans")
    .select("*")
    .eq("id", scanId)
    .maybeSingle<ReferenceProblemScan>();
  if (!scan) return null;

  const { data: items, error } = await supabase
    .from("reference_problems")
    .select("*")
    .eq("scan_id", scanId)
    .order("created_at", { ascending: true })
    .returns<ReferenceProblem[]>();
  if (error) throw new Error(error.message);

  return { scan, items: items ?? [] };
}

export async function getSignedReferenceScanViewUrl(scanId: string): Promise<string | null> {
  const supabase = await createServerSupabase();
  const { data: scan } = await supabase
    .from("reference_problem_scans")
    .select("storage_path")
    .eq("id", scanId)
    .maybeSingle<Pick<ReferenceProblemScan, "storage_path">>();
  if (!scan) return null;

  const admin = createAdminSupabase();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(scan.storage_path, 300);
  if (error || !data) return null;
  return data.signedUrl;
}

export type ReferenceProblemFilters = {
  conceptId?: string;
};

// Catalog browse query — only ever returns confirmed rows, mirroring how
// listLearningItems requires confirmed=true (an unreviewed AI draft isn't
// usable as a generation source yet).
export async function listReferenceProblems(
  filters?: ReferenceProblemFilters,
): Promise<ReferenceProblem[]> {
  const supabase = await createServerSupabase();
  let query = supabase.from("reference_problems").select("*").eq("confirmed", true);
  if (filters?.conceptId) query = query.eq("concept_id", filters.conceptId);
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .returns<ReferenceProblem[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}
