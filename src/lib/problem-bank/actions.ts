"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { triggerReferenceExtractionJob } from "@/lib/ai/trigger-reference-extraction";
import { translateReferenceProblems } from "@/lib/ai/translate-reference-problems";
import { solveReferenceProblems } from "@/lib/ai/solve-reference-problems";
import { EXT_BY_MIME } from "@/lib/storage/mime";
import { mintSignedUploadUrl } from "@/lib/storage/signed-upload";
import { referenceUploadMetaSchema } from "./schema";
import { getReferenceProblemCropSource } from "./queries";
import type { ReferenceProblem } from "@/lib/supabase/types";

const BUCKET = "problem-bank";
const PRACTICE_SHEETS_NEW_PATH = "/dashboard/principal/practice-sheets/new";

export type UploadUrlResult =
  | { error: string }
  | { scanId: string; path: string; signedUrl: string; token: string };

export async function createReferenceUploadUrlAction(mimeType: string): Promise<UploadUrlResult> {
  await requireRole("principal");

  const ext = EXT_BY_MIME[mimeType];
  if (!ext) return { error: "지원하지 않는 파일 형식입니다." };

  const scanId = crypto.randomUUID();
  const path = `${scanId}.${ext}`;

  const result = await mintSignedUploadUrl(BUCKET, path);
  if ("error" in result) return result;

  return { scanId, path: result.path, signedUrl: result.signedUrl, token: result.token };
}

export type ConfirmReferenceUploadInput = {
  scanId: string;
  path: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
};

export type ConfirmUploadResult = { error: string };

export async function confirmReferenceUploadAction(
  input: ConfirmReferenceUploadInput,
): Promise<ConfirmUploadResult | void> {
  const session = await requireRole("principal");

  const parsed = referenceUploadMetaSchema.safeParse({
    original_filename: input.originalFilename,
    mime_type: input.mimeType,
    file_size_bytes: input.fileSizeBytes,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("reference_problem_scans").insert({
    id: input.scanId,
    uploaded_by: session.userId,
    storage_path: input.path,
    original_filename: parsed.data.original_filename,
    mime_type: parsed.data.mime_type,
    file_size_bytes: parsed.data.file_size_bytes,
    status: "grading",
  });
  if (error) return { error: error.message };

  // Extraction runs via a dedicated Route Handler (POST
  // /api/reference-extraction/run) instead of inline here, so it gets its
  // own maxDuration budget rather than sharing this request's — see
  // src/lib/ai/grading-config.ts. The trigger fetch itself is fast (just
  // waits for a 202 ack), so this stays well within this action's own
  // budget even though it runs via after().
  after(async () => {
    await triggerReferenceExtractionJob(input.scanId, 0);
  });

  // No redirect — this is called from an embedded widget on
  // practice-sheets/new, which polls (GradingStatusPoller) and refreshes
  // itself once extraction completes.
  revalidatePath(PRACTICE_SHEETS_NEW_PATH);
}

export async function retryReferenceExtractionAction(scanId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  await supabase.from("reference_problems").delete().eq("scan_id", scanId);

  // Optimistic-concurrency claim: only proceed if updated_at is still what
  // we just read. This prevents a race with the reconcile cron (which uses
  // the same pattern) double-triggering extraction for the same scan and
  // duplicating reference_problems — see
  // src/app/api/cron/reconcile-reference-extraction.
  const { data: current } = await supabase
    .from("reference_problem_scans")
    .select("updated_at, grading_attempts")
    .eq("id", scanId)
    .single();

  const nextAttempt = (current?.grading_attempts ?? 0) + 1;
  const { data: claimed } = await supabase
    .from("reference_problem_scans")
    .update({
      status: "grading",
      grading_error: null,
      updated_at: new Date().toISOString(),
      grading_attempts: nextAttempt,
    })
    .eq("id", scanId)
    .eq("updated_at", current?.updated_at ?? "")
    .select("id")
    .maybeSingle();

  if (claimed) {
    after(async () => {
      await triggerReferenceExtractionJob(scanId, nextAttempt);
    });
  }

  revalidatePath(PRACTICE_SHEETS_NEW_PATH);
}

export async function deleteReferenceScanAction(scanId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("reference_problem_scans")
    .delete()
    .eq("id", scanId)
    .select("storage_path")
    .single();
  if (error) throw new Error(error.message);

  if (data?.storage_path) {
    const admin = createAdminSupabase();
    await admin.storage.from(BUCKET).remove([data.storage_path]);
  }

  revalidatePath(PRACTICE_SHEETS_NEW_PATH);
}

export async function deleteReferenceProblemAction(id: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("reference_problems").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(PRACTICE_SHEETS_NEW_PATH);
}

// Manual retry for the automatic translation step in extractReferenceProblems
// (see extract-reference-problems.ts) — surfaced in the workspace whenever a
// row has translation_error set, or for problems extracted before this
// column existed (translated_problem null, translation_error also null).
export async function retranslateReferenceProblemAction(id: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { data: problem, error: fetchError } = await supabase
    .from("reference_problems")
    .select("id, transcribed_problem, transcribed_answer, transcribed_options, transcribed_correct_option")
    .eq("id", id)
    .maybeSingle<
      Pick<
        ReferenceProblem,
        "id" | "transcribed_problem" | "transcribed_answer" | "transcribed_options" | "transcribed_correct_option"
      >
    >();
  if (fetchError) throw new Error(fetchError.message);
  if (!problem) return;

  try {
    const translated = await translateReferenceProblems([problem]);
    const t = translated.get(problem.id);
    await supabase
      .from("reference_problems")
      .update(
        t
          ? {
              translated_problem: t.translated_problem,
              translated_answer: t.translated_answer,
              translated_options: t.translated_options,
              translated_correct_option: t.translated_correct_option,
              translation_error: null,
            }
          : { translation_error: "번역 응답에서 이 문제를 찾지 못했습니다." },
      )
      .eq("id", id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "번역 중 오류가 발생했습니다.";
    await supabase.from("reference_problems").update({ translation_error: message }).eq("id", id);
  }

  revalidatePath(PRACTICE_SHEETS_NEW_PATH);
}

// Manual retry for the automatic answer-solving step in
// extractReferenceProblems (see extract-reference-problems.ts /
// solve-reference-problems.ts) — surfaced in the workspace whenever a
// verbatim-eligible row has no translated_answer and either solve_error is
// set or solving simply hasn't run yet (e.g. rows extracted before this
// feature existed).
export async function resolveReferenceAnswerAction(id: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { data: problem, error: fetchError } = await supabase
    .from("reference_problems")
    .select("id, translated_problem, has_diagram, translated_answer, translated_options")
    .eq("id", id)
    .maybeSingle<
      Pick<
        ReferenceProblem,
        "id" | "translated_problem" | "has_diagram" | "translated_answer" | "translated_options"
      >
    >();
  if (fetchError) throw new Error(fetchError.message);
  if (!problem || !problem.translated_problem || problem.translated_answer) return;

  try {
    const solved = await solveReferenceProblems([
      {
        id: problem.id,
        translated_problem: problem.translated_problem,
        has_diagram: problem.has_diagram,
        translated_options: problem.translated_options,
      },
    ]);
    const s = solved.get(problem.id);
    await supabase
      .from("reference_problems")
      .update(
        s
          ? { solved_answer: s.solved_answer, solved_correct_option: s.solved_correct_option, solve_error: null }
          : { solve_error: "풀이 응답에서 이 문제를 찾지 못했습니다." },
      )
      .eq("id", id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "정답 풀이 중 오류가 발생했습니다.";
    await supabase.from("reference_problems").update({ solve_error: message }).eq("id", id);
  }

  revalidatePath(PRACTICE_SHEETS_NEW_PATH);
}

// --- Diagram crop (reference-problem-crop-dialog.tsx) ---

export type CropSourceResult = { error: string } | { signedUrl: string; mimeType: string };

export async function getReferenceScanCropSourceAction(
  referenceProblemId: string,
): Promise<CropSourceResult> {
  await requireRole("principal");
  const source = await getReferenceProblemCropSource(referenceProblemId);
  if (!source) return { error: "원본 스캔을 찾을 수 없습니다." };
  return source;
}

export type CropUploadUrlResult = { error: string } | { path: string; signedUrl: string; token: string };

export async function createReferenceCropUploadUrlAction(
  referenceProblemId: string,
): Promise<CropUploadUrlResult> {
  await requireRole("principal");

  // Fixed, deterministic path (unlike scan uploads, which mint a fresh
  // scanId) so re-cropping the same problem overwrites its old crop instead
  // of accumulating orphaned files — hence upsert: true here.
  const path = `crops/${referenceProblemId}.jpg`;
  return mintSignedUploadUrl(BUCKET, path, { upsert: true });
}

export async function confirmReferenceCropAction(referenceProblemId: string, storagePath: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("reference_problems")
    .update({ crop_storage_path: storagePath })
    .eq("id", referenceProblemId);
  if (error) throw new Error(error.message);

  revalidatePath(PRACTICE_SHEETS_NEW_PATH);
}

export async function deleteReferenceCropAction(referenceProblemId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("reference_problems")
    .select("crop_storage_path")
    .eq("id", referenceProblemId)
    .maybeSingle<Pick<ReferenceProblem, "crop_storage_path">>();
  if (error) throw new Error(error.message);

  if (data?.crop_storage_path) {
    const admin = createAdminSupabase();
    await admin.storage.from(BUCKET).remove([data.crop_storage_path]);
  }

  const { error: updateError } = await supabase
    .from("reference_problems")
    .update({ crop_storage_path: null })
    .eq("id", referenceProblemId);
  if (updateError) throw new Error(updateError.message);

  revalidatePath(PRACTICE_SHEETS_NEW_PATH);
}
