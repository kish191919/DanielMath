import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Sonnet-tier by default to fit the academy's ~$15-30/month AI budget;
// override via env if higher-accuracy grading is worth the extra cost later.
export const GRADING_MODEL = process.env.ANTHROPIC_GRADING_MODEL || "claude-sonnet-5";

// Exposed as an env knob (not hardcoded) so "high" can be swapped for
// "medium"/"low" without a redeploy while we're still tuning grading
// reliability on cluttered multi-page scans.
export const GRADING_EFFORT = (process.env.ANTHROPIC_GRADING_EFFORT ||
  "high") as "low" | "medium" | "high" | "xhigh" | "max";

// Reference-problem extraction is verbatim transcription (not scoring a
// student's answer), and now always runs one Claude call per page (see
// extractReferenceProblems), so it doesn't need GRADING_EFFORT's "high"
// thinking budget the way whole-document worksheet grading does — "medium"
// finishes far faster per page with no meaningful accuracy loss for
// transcription. Kept as its own knob (not reusing GRADING_EFFORT) so tuning
// worksheet-grading accuracy never accidentally slows reference extraction
// back down, and vice versa.
export const REFERENCE_EXTRACTION_EFFORT = (process.env.ANTHROPIC_REFERENCE_EXTRACTION_EFFORT ||
  "medium") as "low" | "medium" | "high" | "xhigh" | "max";

// Solving a reference problem's missing answer (see
// solve-reference-problems.ts) is real problem-solving, not transcription —
// source scans skew toward AMC8/매스카운츠-style competition problems, so
// this needs GRADING_EFFORT-tier reasoning rather than REFERENCE_EXTRACTION_
// EFFORT's "medium" (that knob is for simple transcription and deliberately
// runs with thinking disabled). Own knob for the same reason
// REFERENCE_EXTRACTION_EFFORT is separate from GRADING_EFFORT — tuning one
// must never silently change the other.
export const REFERENCE_SOLVE_MODEL = process.env.ANTHROPIC_REFERENCE_SOLVE_MODEL || "claude-sonnet-5";

export const REFERENCE_SOLVE_EFFORT = (process.env.ANTHROPIC_REFERENCE_SOLVE_EFFORT ||
  "high") as "low" | "medium" | "high" | "xhigh" | "max";

// Similar-problem generation is text-only synthesis (no vision, no image
// tokens), so effort defaults lower than GRADING_EFFORT.
export const PRACTICE_GEN_MODEL = process.env.ANTHROPIC_PRACTICE_GEN_MODEL || "claude-sonnet-5";

export const PRACTICE_GEN_EFFORT = (process.env.ANTHROPIC_PRACTICE_GEN_EFFORT ||
  "medium") as "low" | "medium" | "high" | "xhigh" | "max";

// Translation is a direct text-only rendering (no invention, no vision), so
// it defaults lower effort than even PRACTICE_GEN_EFFORT.
export const TRANSLATION_MODEL = process.env.ANTHROPIC_TRANSLATION_MODEL || "claude-sonnet-5";

export const TRANSLATION_EFFORT = (process.env.ANTHROPIC_TRANSLATION_EFFORT ||
  "low") as "low" | "medium" | "high" | "xhigh" | "max";

// Rewriting a teacher's Korean shorthand into a warm, natural, parent-facing
// English report is closer to localization than literal translation, so
// effort defaults a notch above TRANSLATION_EFFORT.
export const PARENT_REPORT_MODEL = process.env.ANTHROPIC_PARENT_REPORT_MODEL || "claude-sonnet-5";

export const PARENT_REPORT_EFFORT = (process.env.ANTHROPIC_PARENT_REPORT_EFFORT ||
  "medium") as "low" | "medium" | "high" | "xhigh" | "max";

// Turning concept/error-type labels into a parent-friendly explanation is the
// same kind of localization work as PARENT_REPORT_EFFORT (not literal
// translation), so it shares that effort tier by default.
export const PARENT_ERROR_SUMMARY_MODEL =
  process.env.ANTHROPIC_PARENT_ERROR_SUMMARY_MODEL || "claude-sonnet-5";

export const PARENT_ERROR_SUMMARY_EFFORT = (process.env.ANTHROPIC_PARENT_ERROR_SUMMARY_EFFORT ||
  "medium") as "low" | "medium" | "high" | "xhigh" | "max";

export function getClaudeClient() {
  return new Anthropic();
}
