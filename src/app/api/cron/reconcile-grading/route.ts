import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { markGradingFailed } from "@/lib/ai/grade-worksheet";
import { triggerGradingJob } from "@/lib/ai/trigger-grading";
import { WORKSHEET_GRADING_STUCK_THRESHOLD_MS, MAX_GRADING_ATTEMPTS } from "@/lib/ai/grading-config";

// Safety net for scans left stuck in "grading" status — e.g. the
// triggerGradingJob() fetch from confirmUploadAction/retryGradingAction
// failed at the network level, or the /api/grading/run invocation itself
// died mid-run. Runs on Vercel Cron (see vercel.json); Vercel automatically
// attaches `Authorization: Bearer $CRON_SECRET` to cron-triggered requests
// when an env var literally named CRON_SECRET exists.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminSupabase();
  const staleBefore = new Date(Date.now() - WORKSHEET_GRADING_STUCK_THRESHOLD_MS).toISOString();

  const { data: stuckScans } = await admin
    .from("worksheet_scans")
    .select("id, updated_at, grading_attempts")
    .eq("status", "grading")
    .lt("updated_at", staleBefore);

  for (const scan of stuckScans ?? []) {
    if (scan.grading_attempts >= MAX_GRADING_ATTEMPTS) {
      await markGradingFailed(
        scan.id,
        new Error("채점이 반복적으로 시간 초과되었습니다. 페이지 수를 줄여 다시 업로드해주세요."),
      );
      continue;
    }

    // Optimistic-concurrency claim: only proceed if updated_at is still what
    // we just read. If a principal's manual "다시 채점하기" click (or a
    // previous sweep) already touched this row, this affects 0 rows and we
    // skip it rather than double-triggering grading.
    const nextAttempt = scan.grading_attempts + 1;
    const { data: claimed } = await admin
      .from("worksheet_scans")
      .update({ updated_at: new Date().toISOString(), grading_attempts: nextAttempt })
      .eq("id", scan.id)
      .eq("updated_at", scan.updated_at)
      .select("id")
      .maybeSingle();

    if (claimed) await triggerGradingJob(scan.id, nextAttempt);
  }

  return NextResponse.json({ checked: stuckScans?.length ?? 0 });
}
