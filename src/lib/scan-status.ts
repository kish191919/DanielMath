// Shared by worksheet_scans (learning-history) and reference_problem_scans
// (problem-bank) — both drive their AI step through next/server's after(),
// which is killed once the invoking route's maxDuration (180s everywhere
// this is used) elapses. If a row is still "grading" well past that, the
// background job is guaranteed dead rather than merely slow, so it's safe
// to offer a retry even though no explicit grading_failed was ever recorded.
export const GRADING_STUCK_THRESHOLD_MS = 210_000; // 3.5 min

export function isGradingStuck(status: string, updatedAt: string): boolean {
  return status === "grading" && Date.now() - new Date(updatedAt).getTime() > GRADING_STUCK_THRESHOLD_MS;
}
