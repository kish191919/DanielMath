// Shared FCPS quarter calendar/logic. Plain module (no "use client") so it
// can be imported from both server components (dashboard history page) and
// client components (marketing curriculum quarter tabs) without crossing
// the RSC client-boundary.

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export const QUARTERS: readonly Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

export function getCurrentQuarter(date: Date = new Date()): Quarter {
  const m = date.getMonth() + 1;
  if (m >= 9 && m <= 11) return "Q1";
  if (m === 12 || m === 1 || m === 2) return "Q2";
  if (m === 3) return "Q3";
  if (m >= 4 && m <= 6) return "Q4";
  return "Q1";
}

// negative: a is before b, 0: same quarter, positive: a is after b
export function compareQuarters(a: Quarter, b: Quarter): number {
  return QUARTERS.indexOf(a) - QUARTERS.indexOf(b);
}

export const QUARTER_LABELS_KO: Record<Quarter, string> = {
  Q1: "1분기 (9~11월)",
  Q2: "2분기 (12~2월)",
  Q3: "3분기 (2~4월)",
  Q4: "4분기 (4~6월)",
};

export const QUARTER_LABELS_EN: Record<Quarter, string> = {
  Q1: "Q1 · Sep–Nov",
  Q2: "Q2 · Dec–Feb",
  Q3: "Q3 · Feb–Apr",
  Q4: "Q4 · Apr–Jun",
};
