import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { markExtractionFailed } from "@/lib/ai/extract-reference-problems";
import { triggerReferenceExtractionJob } from "@/lib/ai/trigger-reference-extraction";
import { REFERENCE_EXTRACTION_STUCK_THRESHOLD_MS, MAX_GRADING_ATTEMPTS } from "@/lib/ai/grading-config";

// Safety net for scans left stuck in "grading" status — e.g. the
// triggerReferenceExtractionJob() fetch from confirmReferenceUploadAction/
// retryReferenceExtractionAction failed at the network level, or the
// /api/reference-extraction/run invocation itself died mid-run. Runs on
// Vercel Cron (see vercel.json). Mirrors
// src/app/api/cron/reconcile-grading/route.ts.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminSupabase();
  const staleBefore = new Date(Date.now() - REFERENCE_EXTRACTION_STUCK_THRESHOLD_MS).toISOString();

  const { data: stuckScans } = await admin
    .from("reference_problem_scans")
    .select("id, updated_at, grading_attempts")
    .eq("status", "grading")
    .lt("updated_at", staleBefore);

  for (const scan of stuckScans ?? []) {
    if (scan.grading_attempts >= MAX_GRADING_ATTEMPTS) {
      await markExtractionFailed(
        scan.id,
        new Error("문제 추출이 반복적으로 시간 초과되었습니다. 페이지 수를 줄여 다시 업로드해주세요."),
      );
      continue;
    }

    // Optimistic-concurrency claim: only proceed if updated_at is still what
    // we just read. If a principal's manual "다시 추출하기" click (or a
    // previous sweep) already touched this row, this affects 0 rows and we
    // skip it rather than double-triggering extraction.
    const nextAttempt = scan.grading_attempts + 1;
    const { data: claimed } = await admin
      .from("reference_problem_scans")
      .update({ updated_at: new Date().toISOString(), grading_attempts: nextAttempt })
      .eq("id", scan.id)
      .eq("updated_at", scan.updated_at)
      .select("id")
      .maybeSingle();

    if (claimed) await triggerReferenceExtractionJob(scan.id, nextAttempt);
  }

  return NextResponse.json({ checked: stuckScans?.length ?? 0 });
}
