import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { GeneratedProblem, GeneratedWorksheet, ReferenceProblem } from "@/lib/supabase/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PROBLEM_BANK_BUCKET = "problem-bank";

export type GeneratedProblemWithCrop = GeneratedProblem & { crop_image_url: string | null };

export async function getPracticeSheetWithProblems(
  worksheetId: string,
): Promise<{ worksheet: GeneratedWorksheet; problems: GeneratedProblemWithCrop[] } | null> {
  const supabase = await createServerSupabase();
  const { data: worksheet } = await supabase
    .from("generated_worksheets")
    .select("*")
    .eq("id", worksheetId)
    .maybeSingle<GeneratedWorksheet>();
  if (!worksheet) return null;

  const { data: problems, error } = await supabase
    .from("generated_problems")
    .select("*")
    .eq("worksheet_id", worksheetId)
    .order("sort_order", { ascending: true })
    .returns<GeneratedProblem[]>();
  if (error) throw new Error(error.message);

  const withCrops = await attachCropImageUrls(problems ?? []);
  return { worksheet, problems: withCrops };
}

// Only "reference_verbatim" rows (translated original text, unmodified) may
// ever be paired with the original figure — an "ai" row (generate-similar-
// problems.ts) has changed numbers/scenario, so its original diagram would
// no longer match and must never be attached here.
async function attachCropImageUrls(problems: GeneratedProblem[]): Promise<GeneratedProblemWithCrop[]> {
  const verbatimReferenceIds = problems
    .filter((p) => p.source === "reference_verbatim" && p.source_reference_id)
    .map((p) => p.source_reference_id as string);
  if (verbatimReferenceIds.length === 0) {
    return problems.map((p) => ({ ...p, crop_image_url: null }));
  }

  const admin = createAdminSupabase();
  const { data: referenceRows } = await admin
    .from("reference_problems")
    .select("id, crop_storage_path")
    .in("id", verbatimReferenceIds)
    .returns<Pick<ReferenceProblem, "id" | "crop_storage_path">[]>();

  const cropPathByReferenceId = new Map(
    (referenceRows ?? [])
      .filter((r) => r.crop_storage_path)
      .map((r) => [r.id, r.crop_storage_path as string]),
  );
  const paths = [...cropPathByReferenceId.values()];

  let urlByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: signed } = await admin.storage.from(PROBLEM_BANK_BUCKET).createSignedUrls(paths, 300);
    if (signed) {
      urlByPath = new Map(paths.map((path, index) => [path, signed[index]?.signedUrl ?? ""]));
    }
  }

  return problems.map((p) => {
    if (p.source !== "reference_verbatim" || !p.source_reference_id) {
      return { ...p, crop_image_url: null };
    }
    const path = cropPathByReferenceId.get(p.source_reference_id);
    const url = path ? urlByPath.get(path) : undefined;
    return { ...p, crop_image_url: url || null };
  });
}

// Public "check my answers" lookup for the QR code printed on a practice
// sheet. Runs with the service-role client (no session exists for a parent
// or student scanning the code) and deliberately returns only the title and
// answer text — never the student's name or problem text — scoped to a
// confirmed sheet matching this exact share token.
export async function getPracticeSheetAnswersByToken(
  token: string,
): Promise<{
  title: string;
  answers: Pick<GeneratedProblem, "sort_order" | "answer_text" | "correct_option">[];
} | null> {
  if (!UUID_RE.test(token)) return null;

  const supabase = createAdminSupabase();
  const { data: worksheet } = await supabase
    .from("generated_worksheets")
    .select("id, title, status")
    .eq("share_token", token)
    .maybeSingle<Pick<GeneratedWorksheet, "id" | "title" | "status">>();
  if (!worksheet || worksheet.status !== "confirmed") return null;

  const { data: problems, error } = await supabase
    .from("generated_problems")
    .select("sort_order, answer_text, correct_option")
    .eq("worksheet_id", worksheet.id)
    .order("sort_order", { ascending: true })
    .returns<Pick<GeneratedProblem, "sort_order" | "answer_text" | "correct_option">[]>();
  if (error) throw new Error(error.message);

  return { title: worksheet.title?.trim() || "연습문제", answers: problems ?? [] };
}
