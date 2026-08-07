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

export function getClaudeClient() {
  return new Anthropic();
}
