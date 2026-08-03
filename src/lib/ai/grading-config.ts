// Shared by both AI document-processing pipelines: worksheet grading
// (gradeWorksheetScan) and reference-problem extraction
// (extractReferenceProblems). Both run in their own Route Handler
// (src/app/api/grading/run, src/app/api/reference-extraction/run) instead of
// inline in the upload/retry Server Actions, so they get their own
// maxDuration budget independent of the page request that kicked them off.
// The stuck-detection thresholds must stay comfortably above this value or
// the UI will flag a scan as "stuck" while it's still legitimately running.
export const GRADING_ROUTE_MAX_DURATION_S = 300;
export const WORKSHEET_GRADING_STUCK_THRESHOLD_MS = 330_000;
export const REFERENCE_EXTRACTION_STUCK_THRESHOLD_MS = WORKSHEET_GRADING_STUCK_THRESHOLD_MS;

// Above this many attempts, the reconcile cron gives up and marks the scan
// grading_failed instead of retrying again.
export const MAX_GRADING_ATTEMPTS = 2;

// Applied from the first retry (attempt >= 1) onward, whether triggered by
// the principal clicking "다시 채점하기" or by the reconcile cron — smaller/
// cheaper calls are more likely to finish within the route's time budget.
export const DEGRADED_GRADING_EFFORT = "medium" as const;
export const DEGRADED_PAGES_PER_CHUNK = 2;
