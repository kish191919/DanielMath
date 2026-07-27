"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { extractReferenceProblems } from "@/lib/ai/extract-reference-problems";
import { EXT_BY_MIME } from "@/lib/storage/mime";
import { mintSignedUploadUrl } from "@/lib/storage/signed-upload";
import {
  referenceUploadMetaSchema,
  referenceReviewSubmissionSchema,
  updateReferenceProblemSchema,
  type ReferenceProblemInputValues,
} from "./schema";

const BUCKET = "problem-bank";

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

  revalidatePath("/dashboard/principal/problem-bank");
  redirect(`/dashboard/principal/problem-bank/${input.scanId}`);
}

export async function retryReferenceExtractionAction(scanId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  await supabase.from("reference_problems").delete().eq("scan_id", scanId).eq("confirmed", false);
  await supabase
    .from("reference_problem_scans")
    .update({ status: "grading", grading_error: null })
    .eq("id", scanId);

  after(async () => {
    try {
      await extractReferenceProblems(scanId);
    } catch (err) {
      await markExtractionFailed(scanId, err);
    }
  });

  revalidatePath(`/dashboard/principal/problem-bank/${scanId}`);
  revalidatePath("/dashboard/principal/problem-bank");
}

export type ReviewResult = { error: string } | { ok: true };

export async function confirmReferenceReviewAction(
  scanId: string,
  items: ReferenceProblemInputValues[],
): Promise<ReviewResult> {
  const session = await requireRole("principal");

  const parsed = referenceReviewSubmissionSchema.safeParse({ scan_id: scanId, items });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();

  const { error: deleteError } = await supabase
    .from("reference_problems")
    .delete()
    .eq("scan_id", parsed.data.scan_id);
  if (deleteError) return { error: deleteError.message };

  const rows = parsed.data.items.map((item) => ({
    scan_id: parsed.data.scan_id,
    problem_number: item.problem_number || null,
    transcribed_problem: item.transcribed_problem,
    transcribed_answer: item.transcribed_answer || null,
    concept_id: item.concept_id,
    source: item.source,
    edited_by_teacher: item.edited_by_teacher,
    confirmed: true,
  }));

  const { error: insertError } = await supabase.from("reference_problems").insert(rows);
  if (insertError) return { error: insertError.message };

  const { error: updateError } = await supabase
    .from("reference_problem_scans")
    .update({
      status: "reviewed",
      reviewed_at: new Date().toISOString(),
      reviewed_by: session.userId,
    })
    .eq("id", parsed.data.scan_id);
  if (updateError) return { error: updateError.message };

  revalidatePath("/dashboard/principal/problem-bank");
  redirect(`/dashboard/principal/problem-bank/${parsed.data.scan_id}`);
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

  revalidatePath("/dashboard/principal/problem-bank");
}

export type UpdateReferenceProblemResult = { error: string } | { ok: true };

// Lets a teacher edit or re-tag an already-confirmed catalog entry from the
// problem-bank browse page — unlike a worksheet review (one-shot, per
// scan), the bank is long-lived and reused across many generations, so it
// needs ongoing light maintenance outside the initial review flow.
export async function updateReferenceProblemAction(
  id: string,
  patch: { transcribed_problem: string; transcribed_answer: string; concept_id: string },
): Promise<UpdateReferenceProblemResult> {
  await requireRole("principal");

  const parsed = updateReferenceProblemSchema.safeParse({ id, ...patch });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("reference_problems")
    .update({
      transcribed_problem: parsed.data.transcribed_problem,
      transcribed_answer: parsed.data.transcribed_answer || null,
      concept_id: parsed.data.concept_id,
      edited_by_teacher: true,
    })
    .eq("id", parsed.data.id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/principal/problem-bank");
  return { ok: true };
}

export async function deleteReferenceProblemAction(id: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("reference_problems").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/principal/problem-bank");
}
