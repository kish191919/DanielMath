import "server-only";

// Fires the actual grading work (gradeWorksheetScan) as a fresh HTTP request
// to /api/grading/run instead of running it inline in the caller's after().
// That route gets its own maxDuration budget, independent of whatever page
// request triggered this — see src/lib/ai/grading-config.ts for why that
// matters. This function only waits for the 202 ack, not for grading itself
// to finish, so it stays fast enough to run inside the caller's own after().
export async function triggerGradingJob(scanId: string, attempt: number): Promise<void> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

  try {
    const res = await fetch(`${baseUrl}/api/grading/run`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({ scanId, attempt }),
    });
    if (!res.ok) {
      console.error(`[triggerGradingJob] scan ${scanId} attempt ${attempt}: HTTP ${res.status}`);
    }
  } catch (err) {
    // A network-level failure here doesn't mark the scan grading_failed —
    // status stays "grading" and the reconcile cron will pick it up on its
    // next sweep (see src/app/api/cron/reconcile-grading/route.ts).
    console.error(`[triggerGradingJob] scan ${scanId} attempt ${attempt} failed to dispatch`, err);
  }
}
