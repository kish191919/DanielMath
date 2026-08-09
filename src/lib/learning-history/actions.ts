"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { requireRole } from "@/lib/dal";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { triggerGradingJob } from "@/lib/ai/trigger-grading";
import { generateParentReportDraft } from "@/lib/ai/generate-parent-report-draft";
import { listGuardiansForStudent } from "@/lib/students/queries";
import { getOrCreateThreadForParent } from "@/lib/messages/queries";
import { generateParentMagicLink } from "@/lib/auth/magic-link";
import { sendSms, normalizeUsPhone } from "@/lib/notifications/sms";
import { EXT_BY_MIME } from "@/lib/storage/mime";
import { mintSignedUploadUrl } from "@/lib/storage/signed-upload";
import type { SessionNoteLanguage } from "@/lib/supabase/types";
import {
  uploadMetaSchema,
  reviewSubmissionSchema,
  sessionNoteSchema,
  noteTextSchema,
  type LearningItemInputValues,
} from "./schema";

const BUCKET = "worksheet-scans";

export type UploadUrlResult =
  | { error: string }
  | { scanId: string; path: string; signedUrl: string; token: string };

export async function createUploadUrlAction(
  studentId: string,
  mimeType: string,
): Promise<UploadUrlResult> {
  await requireRole("principal");

  const ext = EXT_BY_MIME[mimeType];
  if (!ext) return { error: "지원하지 않는 파일 형식입니다." };
  if (!studentId) return { error: "학생을 선택해주세요." };

  const scanId = crypto.randomUUID();
  const path = `${studentId}/${scanId}.${ext}`;

  const result = await mintSignedUploadUrl(BUCKET, path);
  if ("error" in result) return result;

  return { scanId, path: result.path, signedUrl: result.signedUrl, token: result.token };
}

export type ConfirmUploadInput = {
  scanId: string;
  path: string;
  studentId: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  sessionDate: string;
  // Set only when this upload is a re-photograph of problems the teacher
  // already graded and marked wrong in red pen — see
  // correction-upload-form.tsx. Its presence is what decides whether AI
  // grading runs at all (see below); a plain full-session upload never
  // triggers AI.
  sourceScanId?: string;
};

export type ConfirmUploadResult = { error: string };

export async function confirmUploadAction(
  input: ConfirmUploadInput,
): Promise<ConfirmUploadResult | void> {
  const session = await requireRole("principal");

  const parsed = uploadMetaSchema.safeParse({
    student_id: input.studentId,
    original_filename: input.originalFilename,
    mime_type: input.mimeType,
    file_size_bytes: input.fileSizeBytes,
    session_date: input.sessionDate,
    source_scan_id: input.sourceScanId || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const isCorrectionUpload = !!parsed.data.source_scan_id;

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("worksheet_scans").insert({
    id: input.scanId,
    student_id: parsed.data.student_id,
    uploaded_by: session.userId,
    storage_path: input.path,
    original_filename: parsed.data.original_filename,
    mime_type: parsed.data.mime_type,
    file_size_bytes: parsed.data.file_size_bytes,
    session_date: parsed.data.session_date,
    // Derived server-side, not chosen by the teacher: true exactly when
    // this is a correction upload, which by definition only ever captures
    // the subset of problems marked wrong — see 0028_worksheet_scan_targeted_review.sql.
    is_targeted_review: isCorrectionUpload,
    source_scan_id: parsed.data.source_scan_id ?? null,
    // Plain full-session uploads are never AI-graded, so they stay at
    // "uploaded" permanently instead of entering the grading pipeline.
    status: isCorrectionUpload ? "grading" : "uploaded",
  });
  if (error) return { error: error.message };

  if (isCorrectionUpload) {
    // Grading runs via a dedicated Route Handler (POST /api/grading/run)
    // instead of inline here, so it gets its own maxDuration budget rather
    // than sharing this request's — see src/lib/ai/grading-config.ts. The
    // trigger fetch itself is fast (just waits for a 202 ack), so this stays
    // well within this action's own budget even though it runs after the
    // redirect below via after().
    after(async () => {
      await triggerGradingJob(input.scanId, 0);
    });
  }

  revalidatePath("/dashboard/principal/worksheets");
  if (input.sourceScanId) revalidatePath(`/dashboard/principal/worksheets/${input.sourceScanId}`);
  redirect(`/dashboard/principal/worksheets/${input.scanId}`);
}

export async function retryGradingAction(scanId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  await supabase.from("learning_items").delete().eq("scan_id", scanId).eq("confirmed", false);

  // Optimistic-concurrency claim: only proceed if updated_at is still what
  // we just read. This prevents a race with the reconcile cron (which uses
  // the same pattern) double-triggering grading for the same scan and
  // duplicating learning_items — see src/app/api/cron/reconcile-grading.
  const { data: current } = await supabase
    .from("worksheet_scans")
    .select("updated_at, grading_attempts")
    .eq("id", scanId)
    .single();

  const nextAttempt = (current?.grading_attempts ?? 0) + 1;
  const { data: claimed } = await supabase
    .from("worksheet_scans")
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
      await triggerGradingJob(scanId, nextAttempt);
    });
  }

  revalidatePath(`/dashboard/principal/worksheets/${scanId}`);
  revalidatePath("/dashboard/principal");
}

export type ReviewResult = { error: string } | { ok: true };

export async function confirmReviewAction(
  scanId: string,
  studentId: string,
  sessionDate: string,
  items: LearningItemInputValues[],
): Promise<ReviewResult> {
  const session = await requireRole("principal");

  const parsed = reviewSubmissionSchema.safeParse({
    scan_id: scanId,
    student_id: studentId,
    session_date: sessionDate,
    items,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createServerSupabase();

  const { error: deleteError } = await supabase
    .from("learning_items")
    .delete()
    .eq("scan_id", parsed.data.scan_id);
  if (deleteError) return { error: deleteError.message };

  const rows = parsed.data.items.map((item) => ({
    scan_id: parsed.data.scan_id,
    student_id: parsed.data.student_id,
    problem_number: item.problem_number || null,
    transcribed_problem: item.transcribed_problem,
    transcribed_answer: item.transcribed_answer || null,
    is_correct: item.is_correct,
    concept_id: item.concept_id,
    error_type: item.is_correct ? null : item.error_type,
    source: item.source,
    edited_by_teacher: item.edited_by_teacher,
    confirmed: true,
    session_date: parsed.data.session_date,
  }));

  const { error: insertError } = await supabase.from("learning_items").insert(rows);
  if (insertError) return { error: insertError.message };

  const { error: updateError } = await supabase
    .from("worksheet_scans")
    .update({
      status: "reviewed",
      reviewed_at: new Date().toISOString(),
      reviewed_by: session.userId,
    })
    .eq("id", parsed.data.scan_id);
  if (updateError) return { error: updateError.message };

  revalidatePath("/dashboard/principal/worksheets");
  revalidatePath(`/dashboard/principal/students/${parsed.data.student_id}/history`);
  revalidatePath("/dashboard/principal/students");
  revalidatePath("/dashboard/parent/progress");
  redirect(`/dashboard/principal/worksheets/${parsed.data.scan_id}`);
}

export type SessionNoteFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"note", string>>;
  success?: boolean;
};

export type GenerateParentDraftResult = { draft: string } | { error: string };

// Generates an English draft of a teacher's Korean note for review — does not
// touch the database. Callers must still go through saveSessionNoteAction /
// sendSessionNoteAction to persist or notify; this is draft generation only.
export async function generateParentReportDraftAction(
  note: string,
): Promise<GenerateParentDraftResult> {
  await requireRole("principal");

  const parsed = noteTextSchema.safeParse(note);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "내용을 입력해주세요." };
  }

  try {
    const draft = await generateParentReportDraft(parsed.data);
    if (draft.length > 2000) {
      return { error: "생성된 초안이 너무 깁니다. 원본 내용을 줄여서 다시 시도해주세요." };
    }
    return { draft };
  } catch (err) {
    console.error("[generateParentReportDraftAction] failed", err);
    return { error: "AI 초안 생성에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }
}

// Shared insert-or-update for both saveSessionNoteAction and
// sendSessionNoteAction below. confirmOnInsert always applies (a brand new
// note has no prior confirmed state to preserve); confirmOnUpdate is only
// applied when given — omitting it on an update leaves the row's existing
// confirmed value untouched, which is what lets "저장" fix a typo on an
// already-sent report without silently re-hiding or re-sending it.
async function upsertSessionNote(params: {
  noteId: string | null;
  studentId: string;
  scanId: string;
  sessionDate: string;
  note: string;
  language: SessionNoteLanguage;
  createdBy: string;
  confirmOnInsert: boolean;
  confirmOnUpdate?: boolean;
}): Promise<{ id: string } | { error: string }> {
  const supabase = await createServerSupabase();

  if (params.noteId) {
    const updatePayload: {
      note: string;
      language: SessionNoteLanguage;
      edited_by_teacher: boolean;
      confirmed?: boolean;
    } = {
      note: params.note,
      language: params.language,
      edited_by_teacher: true,
    };
    if (params.confirmOnUpdate !== undefined) updatePayload.confirmed = params.confirmOnUpdate;

    const { error } = await supabase
      .from("session_notes")
      .update(updatePayload)
      .eq("id", params.noteId);
    if (error) return { error: error.message };
    return { id: params.noteId };
  }

  const { data, error } = await supabase
    .from("session_notes")
    .insert({
      student_id: params.studentId,
      scan_id: params.scanId || null,
      session_date: params.sessionDate || new Date().toISOString().slice(0, 10),
      note: params.note,
      source: "teacher",
      confirmed: params.confirmOnInsert,
      language: params.language,
      created_by: params.createdBy,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  return { id: data.id };
}

function parseSessionNoteForm(
  studentId: string,
  scanId: string,
  sessionDate: string,
  formData: FormData,
) {
  return sessionNoteSchema.safeParse({
    student_id: studentId,
    scan_id: scanId || "",
    session_date: sessionDate || "",
    note: formData.get("note"),
    language: formData.get("language") || "ko",
  });
}

// Saves the report text without notifying anyone — lets a teacher write a
// report across multiple sittings (including from a different computer)
// before it ever reaches the parent. noteId is null on the very first save
// (inserts a confirmed:false draft) and the existing note's id on every
// save after that (updates in place, leaving confirmed as-is).
export async function saveSessionNoteAction(
  noteId: string | null,
  studentId: string,
  scanId: string,
  sessionDate: string,
  _prev: SessionNoteFormState | null,
  formData: FormData,
): Promise<SessionNoteFormState> {
  const session = await requireRole("principal");

  const parsed = parseSessionNoteForm(studentId, scanId, sessionDate, formData);
  if (!parsed.success) {
    const fieldErrors: SessionNoteFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "note") fieldErrors.note = issue.message;
    }
    return { error: "입력값을 확인해주세요.", fieldErrors };
  }

  const result = await upsertSessionNote({
    noteId,
    studentId: parsed.data.student_id,
    scanId: parsed.data.scan_id ?? "",
    sessionDate: parsed.data.session_date ?? "",
    note: parsed.data.note,
    language: parsed.data.language,
    createdBy: session.userId,
    confirmOnInsert: false,
  });
  if ("error" in result) return { error: result.error };

  if (parsed.data.scan_id) {
    revalidatePath(`/dashboard/principal/worksheets/${parsed.data.scan_id}`);
  }
  revalidatePath(`/dashboard/principal/students/${studentId}/history`);
  revalidatePath("/dashboard/parent/progress");
  return { success: true };
}

// Saves (same as above) and marks the report confirmed, notifying every
// guardian immediately (chat thread message + SMS magic link for those who
// consented) — works even if the teacher never clicked "저장" first, since
// it persists whatever's currently in the textarea before sending.
export async function sendSessionNoteAction(
  noteId: string | null,
  studentId: string,
  scanId: string,
  sessionDate: string,
  _prev: SessionNoteFormState | null,
  formData: FormData,
): Promise<SessionNoteFormState> {
  const session = await requireRole("principal");

  const parsed = parseSessionNoteForm(studentId, scanId, sessionDate, formData);
  if (!parsed.success) {
    const fieldErrors: SessionNoteFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "note") fieldErrors.note = issue.message;
    }
    return { error: "입력값을 확인해주세요.", fieldErrors };
  }

  const result = await upsertSessionNote({
    noteId,
    studentId: parsed.data.student_id,
    scanId: parsed.data.scan_id ?? "",
    sessionDate: parsed.data.session_date ?? "",
    note: parsed.data.note,
    language: parsed.data.language,
    createdBy: session.userId,
    confirmOnInsert: true,
    confirmOnUpdate: true,
  });
  if ("error" in result) return { error: result.error };

  try {
    await notifyGuardiansOfReport(
      studentId,
      parsed.data.scan_id ?? "",
      session.userId,
      result.id,
    );
  } catch (err) {
    console.error(`[sendSessionNoteAction] guardian notify failed for ${result.id}`, err);
  }

  if (parsed.data.scan_id) {
    revalidatePath(`/dashboard/principal/worksheets/${parsed.data.scan_id}`);
  }
  revalidatePath(`/dashboard/principal/students/${studentId}/history`);
  revalidatePath("/dashboard/parent/progress");
  return { success: true };
}

export async function deleteWorksheetScanAction(scanId: string, studentId: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("worksheet_scans")
    .delete()
    .eq("id", scanId)
    .select("storage_path")
    .single();
  if (error) throw new Error(error.message);

  if (data?.storage_path) {
    const admin = createAdminSupabase();
    await admin.storage.from(BUCKET).remove([data.storage_path]);
  }

  revalidatePath("/dashboard/principal/worksheets");
  revalidatePath(`/dashboard/principal/students/${studentId}/history`);
  revalidatePath("/dashboard/parent/progress");
}

// Posts the published report into each guardian's own chat thread (one
// thread per parent, never per-student — see 0019_messages.sql) and, for
// guardians with a phone on file, texts a short summary with a
// passwordless magic link straight into that thread. Both steps are
// best-effort per-guardian: one guardian's failure shouldn't stop the
// others, and this whole function's caller already treats it as
// best-effort overall.
async function notifyGuardiansOfReport(
  studentId: string,
  scanId: string,
  principalId: string,
  noteId: string,
): Promise<void> {
  const guardians = await listGuardiansForStudent(studentId);
  if (guardians.length === 0) return;

  const supabase = await createServerSupabase();

  const { data: student } = await supabase
    .from("students")
    .select("full_name")
    .eq("id", studentId)
    .maybeSingle<{ full_name: string }>();
  const studentName = student?.full_name ?? "학생";

  // Chat gets a short arrival notice rather than the full report text — the
  // full report already lives on the "진행 상황" page (session_notes), and
  // duplicating it into the thread just meant parents saw it twice.
  const notificationText = `${studentName} 학생의 학습 리포트가 도착했습니다. '진행 상황' 메뉴에서 전체 내용을 확인해보세요.`;

  for (const { guardian } of guardians) {
    try {
      const thread = await getOrCreateThreadForParent(guardian.id);
      const { error: msgError } = await supabase.from("messages").insert({
        thread_id: thread.id,
        sender_id: principalId,
        body: notificationText,
      });
      if (!msgError) {
        await supabase
          .from("message_threads")
          .update({
            last_message_at: new Date().toISOString(),
            last_message_body: notificationText.slice(0, 200),
            last_sender_id: principalId,
          })
          .eq("id", thread.id);
      }
    } catch (err) {
      console.error(`[notifyGuardiansOfReport] chat message failed for guardian ${guardian.id}`, err);
    }

    if (!guardian.phone || !guardian.sms_consent) continue;
    const phone = normalizeUsPhone(guardian.phone);
    if (!phone) {
      console.error(`[notifyGuardiansOfReport] invalid phone for guardian ${guardian.id}`);
      continue;
    }

    const link = await generateParentMagicLink(guardian.email, `/dashboard/parent/reports/${noteId}`);
    if (!link) continue;

    try {
      await sendSms({
        to: phone,
        body: `Daniel Math Academy: ${studentName}'s learning report has arrived. View the full report and reply: ${link}`,
      });
    } catch (err) {
      console.error(`[notifyGuardiansOfReport] SMS failed for guardian ${guardian.id}`, err);
    }
  }
}

// Lets a teacher drop a single wrong-answer item from the practice-sheet
// generation workspace (e.g. it's stale or was miscategorized) without
// deleting the whole scan it came from — unlike deleteWorksheetScanAction.
export async function deleteLearningItemAction(id: string) {
  await requireRole("principal");

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("learning_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/principal/practice-sheets/new");
}
