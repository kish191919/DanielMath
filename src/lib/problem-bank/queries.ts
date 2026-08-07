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

// Feeds the crop dialog (reference-problem-crop-dialog.tsx) — the dialog
// crops out of the *original* scan page, not a re-derived preview, so a
// teacher can select a diagram at full resolution regardless of how many
// problems share that page.
export async function getReferenceProblemCropSource(
  referenceProblemId: string,
): Promise<{ signedUrl: string; mimeType: ReferenceProblemScan["mime_type"] } | null> {
  const supabase = await createServerSupabase();
  const { data: problem } = await supabase
    .from("reference_problems")
    .select("scan_id")
    .eq("id", referenceProblemId)
    .maybeSingle<Pick<ReferenceProblem, "scan_id">>();
  if (!problem) return null;

  const { data: scan } = await supabase
    .from("reference_problem_scans")
    .select("storage_path, mime_type")
    .eq("id", problem.scan_id)
    .maybeSingle<Pick<ReferenceProblemScan, "storage_path" | "mime_type">>();
  if (!scan) return null;

  const admin = createAdminSupabase();
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(scan.storage_path, 300);
  if (error || !data) return null;
  return { signedUrl: data.signedUrl, mimeType: scan.mime_type };
}

// Batched thumbnail lookup for already-cropped reference problems, called
// once from practice-sheets/new/page.tsx for every crop_storage_path in the
// current list (rather than one signed-URL call per card).
export async function getSignedReferenceProblemCropUrls(paths: string[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (paths.length === 0) return result;

  const admin = createAdminSupabase();
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrls(paths, 300);
  if (error || !data) return result;

  paths.forEach((path, index) => {
    const signedUrl = data[index]?.signedUrl;
    if (signedUrl) result.set(path, signedUrl);
  });
  return result;
}

export type ReferenceProblemFilters = {
  conceptId?: string;
};

// Scanned problems are usable as soon as they're extracted — no separate
// human tag/confirm gate (see extractReferenceProblems, which now inserts
// with confirmed: true).
export async function listReferenceProblems(
  filters?: ReferenceProblemFilters,
): Promise<ReferenceProblem[]> {
  const supabase = await createServerSupabase();
  let query = supabase.from("reference_problems").select("*");
  if (filters?.conceptId) query = query.eq("concept_id", filters.conceptId);
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .returns<ReferenceProblem[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}
