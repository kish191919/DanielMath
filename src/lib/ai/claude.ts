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

// Parent summary generation is plain-text synthesis over already-graded
// items (no vision, no thinking) — a fraction of the grading call's cost,
// so effort defaults low rather than reusing GRADING_EFFORT.
export const PARENT_SUMMARY_MODEL =
  process.env.ANTHROPIC_PARENT_SUMMARY_MODEL || "claude-sonnet-5";

export const PARENT_SUMMARY_EFFORT = (process.env.ANTHROPIC_PARENT_SUMMARY_EFFORT ||
  "low") as "low" | "medium" | "high" | "xhigh" | "max";

export function getClaudeClient() {
  return new Anthropic();
}
