import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { gradeWorksheetScan, markGradingFailed } from "@/lib/ai/grade-worksheet";

// Its own duration budget, independent of the page request that triggered
// it via triggerGradingJob() — see src/lib/ai/grading-config.ts. Must be a
// literal here (not an imported constant) — Next.js reads route segment
// config via static analysis, not module evaluation, so an imported
// identifier fails the build with "Invalid segment configuration export".
// Keep this in sync with GRADING_ROUTE_MAX_DURATION_S in grading-config.ts.
export const maxDuration = 300;

// proxy.ts doesn't guard /api/* routes (it's a dashboard-page-only auth
// gate), so this route authenticates itself via a shared secret instead of
// requireRole() — requireRole() redirects on failure, which doesn't make
// sense for a route that must return JSON to a server-to-server caller.
export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { scanId, attempt } = (await request.json()) as { scanId?: string; attempt?: number };
  if (!scanId) {
    return NextResponse.json({ error: "scanId required" }, { status: 400 });
  }

  // Respond immediately; grading runs after the response is sent so it gets
  // this route's full maxDuration budget rather than blocking the caller.
  after(async () => {
    try {
      await gradeWorksheetScan(scanId, attempt ?? 0);
    } catch (err) {
      await markGradingFailed(scanId, err);
    }
  });

  return NextResponse.json({ ok: true }, { status: 202 });
}
