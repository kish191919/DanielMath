import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { extractReferenceProblems, markExtractionFailed } from "@/lib/ai/extract-reference-problems";
import { GRADING_ROUTE_MAX_DURATION_S } from "@/lib/ai/grading-config";

// Its own duration budget, independent of the page request that triggered
// it via triggerReferenceExtractionJob() — see src/lib/ai/grading-config.ts.
// Mirrors src/app/api/grading/run/route.ts.
export const maxDuration = GRADING_ROUTE_MAX_DURATION_S;

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

  // Respond immediately; extraction runs after the response is sent so it
  // gets this route's full maxDuration budget rather than blocking the
  // caller.
  after(async () => {
    try {
      await extractReferenceProblems(scanId, attempt ?? 0);
    } catch (err) {
      await markExtractionFailed(scanId, err);
    }
  });

  return NextResponse.json({ ok: true }, { status: 202 });
}
