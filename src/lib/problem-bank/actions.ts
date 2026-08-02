"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { extractReferenceProblems } from "@/lib/ai/extract-reference-problems";
import { EXT_BY_MIME } from "@/lib/storage/mime";
import { mintSignedUploadUrl } from "@/lib/storage/signed-upload";
import { referenceUploadMetaSchema } from "./schema";

const BUCKET = "problem-bank";
const PRACTICE_SHEETS_NEW_PATH = "/dashboard/principal/practice-sheets/new";

async function markExtractionFailed(scanId: string, err: unknown) {
  // Runs inside after(), after the response/redirect has already been sent —
  // uses the admin client so it doesn't depend on request cookies still
  // being valid in that deferred context (same pattern as markGradingFailed
  // in learning-history/actions.ts).
  const admin = createAdminSupabase();
  await admin
    .from("reference_problem_scans")
    .update({
      status: "grading_failed",
      grading_error: err instanceof Error ? err.message : "문제 추출 중 오류가 발생했습니다.",
    })
    .eq("id", scanId);
}

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

  // Extraction (Claude Vision, tens of seconds) runs after this response is
  // sent instead of blocking it — mirrors confirmUploadAction in
  // learning-history/actions.ts.
  after(async () => {
    try {
      await extractReferenceProblems(input.scanId);
    } catch (err) {
      await markExtractionFailed(input.scanId, err);
    }
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
  await supabase
    .from("reference_problem_scans")
    .update({ status: "grading", grading_error: null, updated_at: new Date().toISOString() })
    .eq("id", scanId);

  after(async () => {
    try {
      await extractReferenceProblems(scanId);
    } catch (err) {
      await markExtractionFailed(scanId, err);
    }
  });

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
