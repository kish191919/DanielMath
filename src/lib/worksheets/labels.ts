import type { TopicCategory } from "@/lib/curriculum-data";
import type { Level } from "./types";

// Kept apart from catalog.ts so client components can use the labels without
// bundling every generator.

export const LEVEL_LABELS: Record<Level, { en: string; ko: string }> = {
  1: { en: "Easy", ko: "쉬움" },
  2: { en: "Medium", ko: "보통" },
  3: { en: "Hard", ko: "어려움" },
};

// Display order and English names for the curriculum categories reused from
// curriculum-data.ts.
export const CATEGORY_LABELS: { key: TopicCategory; en: string }[] = [
  { key: "수·연산", en: "Numbers & Operations" },
  { key: "분수", en: "Fractions" },
  { key: "소수", en: "Decimals" },
  { key: "측정", en: "Measurement" },
  { key: "도형", en: "Geometry" },
  { key: "확률·자료", en: "Data & Probability" },
  { key: "대수·패턴", en: "Algebra & Patterns" },
];
