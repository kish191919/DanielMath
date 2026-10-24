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
  | "variable"
  | "decimal"
  | "superscript"
  | "box"
  | "diff"
  | "square"
  | "equal"
  | "calculator";

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

  unit(4, "place-value", "Place value", "큰 수의 자릿값", "수·연산", "hash", "sky"),
  unit(4, "compare-round", "Comparing & rounding", "큰 수의 비교와 반올림", "수·연산", "arrow-up-down", "violet"),
  unit(4, "estimation", "Estimation", "어림셈", "수·연산", "target", "amber"),
  unit(4, "addition-subtraction", "Addition & subtraction", "덧셈과 뺄셈", "수·연산", "plus", "emerald"),
  unit(4, "multiplication", "Multiplication", "곱셈", "수·연산", "x", "orange"),
  unit(4, "division", "Division", "나눗셈", "수·연산", "divide", "cyan"),
  unit(4, "factors-multiples", "Factors, multiples & primes", "약수·배수와 소수", "수·연산", "layout-grid", "lime"),
  unit(4, "fraction-compare", "Equivalent & comparing fractions", "분수의 크기", "분수", "scale", "purple"),
  unit(4, "fraction-operations", "Mixed numbers & fraction operations", "대분수와 분수의 계산", "분수", "pie-chart", "pink"),
  unit(4, "decimals", "Decimal place value", "소수의 자릿값", "소수", "decimal", "indigo"),
  unit(4, "decimal-operations", "Adding & subtracting decimals", "소수의 덧셈과 뺄셈", "소수", "calculator", "fuchsia"),
  unit(4, "measurement", "Measurement & time", "단위 환산과 시간", "측정", "ruler", "blue"),
  unit(4, "area-perimeter", "Area & perimeter", "넓이와 둘레", "측정", "square", "rose"),
  unit(4, "probability", "Probability", "확률", "확률·자료", "dices", "amber"),
  unit(4, "patterns", "Patterns", "규칙 찾기", "대수·패턴", "trending-up", "teal"),

  unit(5, "number-theory", "Primes, factors & multiples", "약수·배수와 소인수분해", "수·연산", "hash", "sky"),
  unit(5, "fraction-concepts", "Simplifying & comparing fractions", "약분과 분수의 크기", "분수", "scale", "purple"),
  unit(5, "fraction-add-sub", "Adding & subtracting fractions", "분수의 덧셈과 뺄셈", "분수", "pie-chart", "pink"),
  unit(5, "fraction-multiply", "Multiplying fractions", "분수의 곱셈", "분수", "layout-grid", "violet"),
  unit(5, "decimal-place-value", "Decimal place value & rounding", "소수의 자릿값과 반올림", "소수", "decimal", "indigo"),
  unit(5, "decimal-add-sub", "Adding & subtracting decimals", "소수의 덧셈과 뺄셈", "소수", "calculator", "fuchsia"),
  unit(5, "decimal-multiply", "Multiplying decimals", "소수의 곱셈", "소수", "x", "orange"),
  unit(5, "decimal-divide", "Dividing decimals", "소수의 나눗셈", "소수", "divide", "cyan"),
  unit(5, "measurement", "Unit conversions", "단위 환산", "측정", "ruler", "blue"),
  unit(5, "area-volume", "Area, perimeter & volume", "넓이·둘레·부피", "측정", "box", "rose"),
  unit(5, "triangles", "Triangles", "삼각형", "도형", "triangle", "emerald"),
  unit(5, "data", "Mean, median, mode & range", "평균·중앙값·최빈값·범위", "확률·자료", "bar-chart", "amber"),
  unit(5, "expressions", "Order of operations & expressions", "혼합 계산과 식의 값", "대수·패턴", "variable", "teal"),

  unit(6, "number-theory", "GCF & LCM", "최대공약수와 최소공배수", "수·연산", "hash", "sky"),
  unit(6, "ratios", "Ratios & rates", "비와 비율", "수·연산", "scale", "orange"),
  unit(6, "percents", "Percents", "백분율", "수·연산", "percent", "amber"),
  unit(6, "integers", "Integers", "정수", "수·연산", "diff", "violet"),
  unit(6, "rational-numbers", "Comparing rational numbers", "유리수의 크기 비교", "수·연산", "arrow-up-down", "purple"),
  unit(6, "exponents", "Exponents & perfect squares", "거듭제곱과 제곱수", "수·연산", "superscript", "indigo"),
  unit(6, "fractions", "Multiplying & dividing fractions", "분수의 곱셈과 나눗셈", "분수", "pie-chart", "pink"),
  unit(6, "decimals", "Decimal operations", "소수의 사칙연산", "소수", "decimal", "fuchsia"),
  unit(6, "circles", "Circles", "원", "측정", "circle", "blue"),
  unit(6, "area", "Area of polygons", "도형의 넓이", "측정", "square", "rose"),
  unit(6, "expressions", "Expressions", "식의 값", "대수·패턴", "variable", "teal"),
  unit(6, "equations", "One-step equations", "일차방정식", "대수·패턴", "equal", "emerald"),
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
