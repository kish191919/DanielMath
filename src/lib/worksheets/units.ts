import type { TopicCategory } from "@/lib/curriculum-data";
import { CATEGORY_LABELS } from "./labels";
import type { GradeNum } from "./types";

// Units group a grade's skills the way IXL lists them (A. Place value →
// A.1, A.2, …). Plain data so client components can use it without bundling
// the generators. Letters follow display order: units are shown by category
// (CATEGORY_LABELS order), then in the order listed here.

export type UnitIcon =
  | "hash"
  | "arrow-up-down"
  | "target"
  | "plus"
  | "minus"
  | "layout-grid"
  | "x"
  | "divide"
  | "shuffle"
  | "pie-chart"
  | "scale"
  | "clock"
  | "coins"
  | "trending-up"
  | "ruler"
  | "dices"
  | "percent"
  | "triangle"
  | "bar-chart"
  | "circle"
  | "variable";

export type UnitColor =
  | "sky"
  | "violet"
  | "amber"
  | "emerald"
  | "rose"
  | "indigo"
  | "orange"
  | "cyan"
  | "fuchsia"
  | "pink"
  | "purple"
  | "blue"
  | "lime"
  | "teal";

export type WorksheetUnit = {
  grade: GradeNum;
  /** Stable within the grade; skills point at it with WorksheetDef.unit. */
  key: string;
  title: { en: string; ko: string };
  category: TopicCategory;
  icon: UnitIcon;
  color: UnitColor;
};

const unit = (
  grade: GradeNum,
  key: string,
  en: string,
  ko: string,
  category: TopicCategory,
  icon: UnitIcon,
  color: UnitColor,
): WorksheetUnit => ({ grade, key, title: { en, ko }, category, icon, color });

export const WORKSHEET_UNITS: WorksheetUnit[] = [
  unit(3, "place-value", "Place value", "자릿값", "수·연산", "hash", "sky"),
  unit(3, "compare-order", "Comparing & ordering", "수의 크기 비교와 순서", "수·연산", "arrow-up-down", "violet"),
  unit(3, "rounding-estimation", "Rounding & estimating", "반올림과 어림셈", "수·연산", "target", "amber"),
  unit(3, "addition", "Addition", "덧셈", "수·연산", "plus", "emerald"),
  unit(3, "subtraction", "Subtraction", "뺄셈", "수·연산", "minus", "rose"),
  unit(3, "multiplication-concepts", "Understanding multiplication", "곱셈의 원리", "수·연산", "layout-grid", "indigo"),
  unit(3, "times-tables", "Multiplication facts", "곱셈구구", "수·연산", "x", "orange"),
  unit(3, "division", "Division facts", "나눗셈", "수·연산", "divide", "cyan"),
  unit(3, "mixed-operations", "Mixed operations & unknowns", "사칙연산과 □ 구하기", "수·연산", "shuffle", "fuchsia"),
  unit(3, "fraction-basics", "Understanding fractions", "분수의 이해", "분수", "pie-chart", "pink"),
  unit(3, "fraction-compare", "Equivalent & comparing fractions", "분수의 크기", "분수", "scale", "purple"),
  unit(3, "time", "Time", "시각과 시간", "측정", "clock", "blue"),
  unit(3, "money", "Money", "돈", "측정", "coins", "lime"),
  unit(3, "patterns", "Skip-counting & patterns", "뛰어 세기와 규칙", "대수·패턴", "trending-up", "teal"),

  unit(4, "whole-numbers", "Large numbers & estimating", "큰 수와 어림하기", "수·연산", "hash", "sky"),
  unit(4, "multiplication-division", "Multiplication & division", "곱셈과 나눗셈", "수·연산", "x", "orange"),
  unit(4, "factors", "Factors", "약수", "수·연산", "layout-grid", "emerald"),
  unit(4, "fractions", "Fractions", "분수", "분수", "pie-chart", "pink"),
  unit(4, "decimals", "Decimals", "소수", "소수", "scale", "violet"),
  unit(4, "measurement", "Measurement", "단위 환산", "측정", "ruler", "blue"),
  unit(4, "probability", "Probability", "확률", "확률·자료", "dices", "amber"),
  unit(4, "patterns", "Patterns", "규칙 찾기", "대수·패턴", "trending-up", "teal"),

  unit(5, "number-theory", "Prime & composite numbers", "소수와 합성수", "수·연산", "hash", "sky"),
  unit(5, "fractions", "Fractions", "분수", "분수", "pie-chart", "pink"),
  unit(5, "decimals", "Decimals", "소수", "소수", "scale", "violet"),
  unit(5, "measurement", "Measurement", "단위 환산", "측정", "ruler", "blue"),
  unit(5, "geometry", "Geometry", "도형", "도형", "triangle", "emerald"),
  unit(5, "data", "Data", "자료의 정리", "확률·자료", "bar-chart", "amber"),
  unit(5, "expressions", "Expressions", "혼합 계산", "대수·패턴", "variable", "teal"),

  unit(6, "number-system", "Number system", "수 체계", "수·연산", "hash", "sky"),
  unit(6, "ratios-percents", "Ratios & percents", "비와 백분율", "수·연산", "percent", "orange"),
  unit(6, "fractions", "Fractions", "분수", "분수", "pie-chart", "pink"),
  unit(6, "circles", "Circles", "원", "측정", "circle", "blue"),
  unit(6, "expressions-equations", "Expressions & equations", "식과 방정식", "대수·패턴", "variable", "teal"),
];

const categoryRank = (c: TopicCategory) => CATEGORY_LABELS.findIndex((l) => l.key === c);

/** A grade's units in display order. */
export function unitsForGrade(grade: GradeNum): WorksheetUnit[] {
  // Array.prototype.sort is stable, so the listed order holds within a category.
  return WORKSHEET_UNITS.filter((u) => u.grade === grade).sort(
    (a, b) => categoryRank(a.category) - categoryRank(b.category),
  );
}

/** A, B, …, Z, then AA, BB, … as IXL does. */
export function unitLetter(index: number): string {
  return String.fromCharCode(65 + (index % 26)).repeat(Math.floor(index / 26) + 1);
}
