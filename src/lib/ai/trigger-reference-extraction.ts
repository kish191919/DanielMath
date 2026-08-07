import "server-only";
import { siteConfig } from "@/lib/site-config";

// Fires the actual extraction work (extractReferenceProblems) as a fresh
// HTTP request to /api/reference-extraction/run instead of running it inline
// in the caller's after(). That route gets its own maxDuration budget,
// independent of whatever page request triggered this — see
// src/lib/ai/grading-config.ts for why that matters. This function only
// waits for the 202 ack, not for extraction itself to finish, so it stays
// fast enough to run inside the caller's own after(). Mirrors
// triggerGradingJob in trigger-grading.ts.
export async function triggerReferenceExtractionJob(scanId: string, attempt: number): Promise<void> {
  // In production, self-fetching the raw *.vercel.app deployment URL
  // (VERCEL_URL) hits Vercel Deployment Protection and gets a 401 from the
  // platform itself, before the request ever reaches this app's route —
  // this silently killed every extraction (and grading) job, since the
  // CRON_SECRET header never mattered. The custom production domain isn't
  // behind that wall, so use it whenever we're actually running in
  // production; only fall back to VERCEL_URL (preview) or localhost (dev).
  const baseUrl =
    process.env.VERCEL_ENV === "production"
      ? siteConfig.url
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT ?? 3000}`;

  try {
    const res = await fetch(`${baseUrl}/api/reference-extraction/run`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({ scanId, attempt }),
    });
    if (!res.ok) {
      console.error(`[triggerReferenceExtractionJob] scan ${scanId} attempt ${attempt}: HTTP ${res.status}`);
    }
  } catch (err) {
    // A network-level failure here doesn't mark the scan grading_failed —
    // status stays "grading" and the reconcile cron will pick it up on its
    // next sweep (see src/app/api/cron/reconcile-reference-extraction/route.ts).
    console.error(
      `[triggerReferenceExtractionJob] scan ${scanId} attempt ${attempt} failed to dispatch`,
      err,
    );
  }
}
