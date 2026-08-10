import type { WorksheetScan } from "@/lib/supabase/types";

// A physical worksheet as the teacher experiences it: one raw upload plus
// zero or more "오답 재촬영본" corrections taken of it (see
// confirmUploadAction's sourceScanId in learning-history/actions.ts). List
// views render one card per group instead of one per worksheet_scans row so
// a single sheet of paper doesn't show up twice just because grading
// (correction row) and parent delivery (root row) advance independently.
export type ScanGroup = { root: WorksheetScan; corrections: WorksheetScan[] };

// Groups an already-fetched, already-sorted scan list by source_scan_id,
// preserving the input's ordering for the resulting groups (Map insertion
// order follows first-seen order in `scans`). Each group's `corrections` is
// sorted oldest-first so `.at(-1)` is always the latest re-photograph.
//
// The "orphan" fallback below (a correction whose root isn't in this same
// result set) is unreachable for listScansForStudent, which has no limit()
// and always fetches every scan for a student — a root can't be missing
// from a set that contains all of that student's scans. It's only reachable
// for limit()-windowed callers like listRecentScans, where a burst of other
// uploads could push an older root out of the window while a correction
// just taken of it stays in.
export function groupScansByRoot(scans: WorksheetScan[]): ScanGroup[] {
  const groups = new Map<string, ScanGroup>();
  const orphanCorrections: WorksheetScan[] = [];

  for (const scan of scans) {
    if (!scan.source_scan_id) groups.set(scan.id, { root: scan, corrections: [] });
  }
  for (const scan of scans) {
    if (!scan.source_scan_id) continue;
    const group = groups.get(scan.source_scan_id);
    if (group) group.corrections.push(scan);
    else orphanCorrections.push(scan);
  }

  for (const group of groups.values()) {
    group.corrections.sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  return [
    ...groups.values(),
    ...orphanCorrections.map((scan) => ({ root: scan, corrections: [] })),
  ];
}

// Identity transform for views that must stay one-row-per-scan (operational
// queues like "확정 대기"/"미발송", where every individual scan is its own
// actionable item) but still want to share the same ScanGroup[] rendering
// code as the grouped views.
export function toSingleScanGroups(scans: WorksheetScan[]): ScanGroup[] {
  return scans.map((scan) => ({ root: scan, corrections: [] }));
}
