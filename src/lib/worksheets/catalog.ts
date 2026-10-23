import { compareDecimalNumbers, addSubtractDecimals, multiplyDecimals, divideDecimals } from "./generators/decimals";
import { exponents, integerOperations, oneStepEquations, orderOfOperations } from "./generators/expressions";
import { factorsGcf, gcfLcm, primeFactorization } from "./generators/factors";
import {
  addSubtractFractions,
  compareFractions,
  equivalentFractions,
  fractionModel,
  multiplyDivideFractions,
} from "./generators/fractions";
import { meanMedianModeRange } from "./generators/statistics";
import { tellingTime } from "./generators/time";
import { compareWhole, placeValue, rounding } from "./generators/whole-numbers";
import { addSubtract, facts, longDivision, multiply } from "./generators/whole-ops";
import type { Generator, GradeNum, Level, WorksheetDef } from "./types";

// Closes over the generator's param type so the catalog can hold worksheets
// with different param shapes in one array.
function defineWorksheet<P>(
  def: Omit<WorksheetDef, "generate"> & { generator: Generator<P>; levels: Record<Level, P> },
): WorksheetDef {
  const { generator, levels, ...rest } = def;
  return { ...rest, generate: (rng, level) => generator(rng, levels[level]) };
}

const FRACTION_DENS = [2, 3, 4, 5, 6, 8, 10, 12];

export const WORKSHEETS: WorksheetDef[] = [
  // ── Grade 3 ────────────────────────────────────────────────────────────────
  defineWorksheet({
    grade: 3,
    slug: "place-value",
    title: { en: "Place Value", ko: "자릿값" },
    description: {
      en: "Find the value of the underlined digit in numbers up to six digits.",
      ko: "밑줄 친 숫자가 나타내는 값 구하기 (최대 6자리 수)",
    },
    instructions: "Write the value of the underlined digit.",
    category: "수·연산",
    conceptCode: "ns-place-value",
    quarter: "Q1",
    counts: [12, 18, 24],
    columns: 3,
    generator: placeValue,
    levels: { 1: { digits: [3, 4] }, 2: { digits: [4, 5] }, 3: { digits: [5, 6] } },
  }),
  defineWorksheet({
    grade: 3,
    slug: "compare-numbers",
    title: { en: "Comparing Numbers", ko: "수의 크기 비교" },
    description: {
      en: "Compare whole numbers up to 9,999 using >, <, or =.",
      ko: "9,999 이하의 수를 >, <, = 로 비교하기",
    },
    instructions: "Write >, <, or = in each circle.",
    category: "수·연산",
    conceptCode: "ns-compare-order-whole",
    quarter: "Q1",
    counts: [12, 18, 24],
    columns: 3,
    generator: compareWhole,
    levels: {
      1: { digits: 3, close: false },
      2: { digits: 4, close: false },
      3: { digits: 4, close: true },
    },
  }),
  defineWorksheet({
    grade: 3,
    slug: "add-subtract",
    title: { en: "Addition & Subtraction", ko: "덧셈과 뺄셈" },
    description: {
      en: "Multi-digit addition and subtraction, with and without regrouping.",
      ko: "받아올림·받아내림이 있는/없는 여러 자리 수의 덧셈과 뺄셈",
    },
    instructions: "Add or subtract.",
    category: "수·연산",
    conceptCode: "ops-add-sub-multi-digit",
    quarter: "Q1",
    counts: [12, 16, 20],
    columns: 4,
    generator: addSubtract,
    levels: {
      1: { digits: [2, 2], op: "mixed", regroup: false },
      2: { digits: [3, 3], op: "mixed", regroup: true },
      3: { digits: [4, 3], op: "mixed", regroup: true },
    },
  }),
  defineWorksheet({
    grade: 3,
    slug: "multiplication-facts",
    title: { en: "Multiplication Facts (0–10)", ko: "곱셈구구 (0–10)" },
    description: {
      en: "Quick recall of multiplication facts through 10 × 10.",
      ko: "10 × 10까지의 곱셈구구 빠르게 익히기",
    },
    instructions: "Multiply. Fill in any missing numbers.",
    category: "수·연산",
    conceptCode: "ops-mult-facts",
    quarter: "Q2",
    counts: [20, 30, 40],
    columns: 4,
    generator: facts,
    levels: {
      1: { op: "*", min: 0, max: 5, missing: false },
      2: { op: "*", min: 0, max: 10, missing: false },
      3: { op: "*", min: 1, max: 10, missing: true },
    },
  }),
  defineWorksheet({
    grade: 3,
    slug: "division-facts",
    title: { en: "Division Facts (0–10)", ko: "나눗셈 기본 (0–10)" },
    description: {
      en: "Division facts related to multiplication through 10 × 10.",
      ko: "10 × 10 곱셈구구와 연결된 기본 나눗셈",
    },
    instructions: "Divide. Fill in any missing numbers.",
    category: "수·연산",
    conceptCode: "ops-division-basic",
    quarter: "Q2",
    counts: [20, 30, 40],
    columns: 4,
    generator: facts,
    levels: {
      1: { op: "/", min: 1, max: 5, missing: false },
      2: { op: "/", min: 1, max: 10, missing: false },
      3: { op: "/", min: 1, max: 10, missing: true },
    },
  }),
  defineWorksheet({
    grade: 3,
    slug: "fraction-models",
    title: { en: "Fraction Models", ko: "분수 모형 읽기" },
    description: {
      en: "Name the fraction shown by shaded circles and bars.",
      ko: "색칠된 원·막대 모형을 보고 분수로 나타내기",
    },
    instructions: "Write the fraction of each model that is shaded.",
    category: "분수",
    conceptCode: "frac-basic-concept",
    quarter: "Q3",
    counts: [9, 12, 15],
    columns: 3,
    generator: fractionModel,
    levels: {
      1: { denominators: [2, 3, 4], improper: false },
      2: { denominators: [2, 3, 4, 5, 6, 8, 10], improper: false },
      3: { denominators: [2, 3, 4, 5, 6, 8], improper: true },
    },
  }),
  defineWorksheet({
    grade: 3,
    slug: "compare-fractions",
    title: { en: "Comparing Fractions", ko: "분수의 크기 비교" },
    description: {
      en: "Compare fractions with like numerators or like denominators.",
      ko: "분자 또는 분모가 같은 분수의 크기 비교하기",
    },
    instructions: "Write >, <, or = in each circle.",
    category: "분수",
    conceptCode: "frac-compare-order",
    quarter: "Q4",
    counts: [12, 18, 24],
    columns: 3,
    generator: compareFractions,
    levels: {
      1: { mode: "like-den", denominators: [3, 4, 5, 6, 8, 10] },
      2: { mode: "like-num", denominators: [2, 3, 4, 5, 6, 8, 10] },
      3: { mode: "mixed", denominators: [2, 3, 4, 5, 6, 8, 10] },
    },
  }),
  defineWorksheet({
    grade: 3,
    slug: "telling-time",
    title: { en: "Telling Time", ko: "시계 보기" },
    description: {
      en: "Read analog clocks to the half hour, five minutes, and nearest minute.",
      ko: "아날로그 시계 읽기 (30분 → 5분 → 1분 단위)",
    },
    instructions: "Write the time shown on each clock.",
    category: "측정",
    conceptCode: "meas-time-elapsed",
    quarter: "Q4",
    counts: [9, 12, 15],
    columns: 3,
    generator: tellingTime,
    levels: { 1: { minuteStep: 30 }, 2: { minuteStep: 5 }, 3: { minuteStep: 1 } },
  }),

  // ── Grade 4 ────────────────────────────────────────────────────────────────
  defineWorksheet({
    grade: 4,
    slug: "rounding",
    title: { en: "Rounding Whole Numbers", ko: "반올림하기" },
    description: {
      en: "Round whole numbers to the nearest ten, hundred, thousand, and beyond.",
      ko: "십·백·천의 자리 등에서 반올림하기",
    },
    instructions: "Round each number.",
    category: "수·연산",
    conceptCode: "ns-place-value",
    quarter: "Q1",
    counts: [10, 16, 20],
    columns: 2,
    generator: rounding,
    levels: {
      1: { digits: [3, 4], places: [10, 100] },
      2: { digits: [4, 5], places: [100, 1000] },
      3: { digits: [5, 7], places: [1000, 10000, 100000] },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "multiplication-division-facts",
    title: { en: "Multiplication & Division Facts (0–12)", ko: "곱셈·나눗셈 기본 (0–12)" },
    description: {
      en: "Facts through 12 × 12 and the related division facts.",
      ko: "12 × 12까지의 곱셈과 관련 나눗셈",
    },
    instructions: "Solve. Fill in any missing numbers.",
    category: "수·연산",
    conceptCode: "ops-mult-facts",
    quarter: "Q2",
    counts: [20, 30, 40],
    columns: 4,
    generator: facts,
    levels: {
      1: { op: "*", min: 0, max: 12, missing: false },
      2: { op: "/", min: 1, max: 12, missing: false },
      3: { op: "mixed", min: 1, max: 12, missing: true },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "multiply-by-1-digit",
    title: { en: "Multiplying by 1-Digit Numbers", ko: "(두·세 자리 수) × (한 자리 수)" },
    description: {
      en: "2- and 3-digit numbers times a 1-digit number.",
      ko: "두 자리·세 자리 수와 한 자리 수의 곱셈",
    },
    instructions: "Multiply.",
    category: "수·연산",
    conceptCode: "ops-mult-multi-digit",
    quarter: "Q2",
    counts: [12, 16, 20],
    columns: 4,
    generator: multiply,
    levels: {
      1: { topDigits: 2, bottomDigits: 1 },
      2: { topDigits: 3, bottomDigits: 1 },
      3: { topDigits: 3, bottomDigits: 1, zeroInTop: true },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "long-division",
    title: { en: "Long Division", ko: "나눗셈 (한 자리 수로 나누기)" },
    description: {
      en: "Divide 2- and 3-digit numbers by a 1-digit divisor, with and without remainders.",
      ko: "두·세 자리 수를 한 자리 수로 나누기 (나머지 포함)",
    },
    instructions: "Divide. Write any remainder with R.",
    category: "수·연산",
    conceptCode: "ops-division-long",
    quarter: "Q2",
    counts: [9, 12, 15],
    columns: 3,
    generator: longDivision,
    levels: {
      1: { dividendDigits: [2, 2], remainder: "none" },
      2: { dividendDigits: [2, 3], remainder: "mixed" },
      3: { dividendDigits: [3, 4], remainder: "mixed" },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "factors-gcf",
    title: { en: "Factor Pairs & GCF", ko: "약수와 최대공약수" },
    description: {
      en: "List factor pairs for numbers up to 100 and find the greatest common factor.",
      ko: "100 이하 수의 약수 쌍 구하기와 최대공약수",
    },
    instructions: "Answer each question.",
    category: "수·연산",
    conceptCode: "ns-factors-gcf",
    quarter: "Q2",
    counts: [8, 10, 12],
    columns: 2,
    generator: factorsGcf,
    levels: {
      1: { mode: "pairs", min: 12, max: 48 },
      2: { mode: "pairs", min: 24, max: 100 },
      3: { mode: "gcf", counts: [2, 3], max: 100 },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "equivalent-fractions",
    title: { en: "Equivalent Fractions", ko: "크기가 같은 분수" },
    description: {
      en: "Fill in the missing numerator or denominator.",
      ko: "빈칸에 알맞은 분자·분모 구하기",
    },
    instructions: "Fill in the missing number.",
    category: "분수",
    conceptCode: "frac-equivalence",
    quarter: "Q2",
    counts: [12, 18, 24],
    columns: 3,
    generator: equivalentFractions,
    levels: {
      1: { denominators: [2, 3, 4, 5, 6], multipliers: [2, 2], direction: "up" },
      2: { denominators: [2, 3, 4, 5, 6], multipliers: [2, 4], direction: "up" },
      3: { denominators: [2, 3, 4, 5, 6, 8], multipliers: [2, 5], direction: "mixed" },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "multiply-2-digit",
    title: { en: "Multiplying 2-Digit Numbers", ko: "(두 자리 수) × (두 자리 수)" },
    description: {
      en: "2-digit by 2-digit multiplication with the standard algorithm.",
      ko: "두 자리 수끼리의 곱셈 (세로셈)",
    },
    instructions: "Multiply.",
    category: "수·연산",
    conceptCode: "ops-mult-multi-digit",
    quarter: "Q3",
    counts: [8, 12, 16],
    columns: 4,
    generator: multiply,
    levels: {
      1: { topDigits: 2, bottomDigits: 2, bottomTens: true },
      2: { topDigits: 2, bottomDigits: 2 },
      3: { topDigits: 3, bottomDigits: 2 },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "compare-decimals",
    title: { en: "Comparing Decimals", ko: "소수의 크기 비교" },
    description: {
      en: "Compare decimals through thousandths.",
      ko: "소수 셋째 자리까지 소수의 크기 비교하기",
    },
    instructions: "Write >, <, or = in each circle.",
    category: "소수",
    conceptCode: "dec-compare-order",
    quarter: "Q3",
    counts: [12, 18, 24],
    columns: 3,
    generator: compareDecimalNumbers,
    levels: {
      1: { scales: [1], wholeMax: 9, tricky: false },
      2: { scales: [2, 3], wholeMax: 20, tricky: false },
      3: { scales: [1, 2, 3], wholeMax: 9, tricky: true },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "add-subtract-decimals",
    title: { en: "Adding & Subtracting Decimals", ko: "소수의 덧셈과 뺄셈" },
    description: {
      en: "Line up the decimal points to add and subtract decimals through thousandths.",
      ko: "소수점을 맞춰 소수 셋째 자리까지 더하고 빼기",
    },
    instructions: "Add or subtract.",
    category: "소수",
    conceptCode: "dec-add-sub",
    quarter: "Q3",
    counts: [12, 16, 20],
    columns: 4,
    generator: addSubtractDecimals,
    levels: {
      1: { scales: [1], wholeMax: 20, op: "mixed", sameScale: true },
      2: { scales: [2], wholeMax: 50, op: "mixed", sameScale: true },
      3: { scales: [1, 2, 3], wholeMax: 99, op: "mixed", sameScale: false },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "add-subtract-fractions",
    title: { en: "Adding & Subtracting Fractions (Like Denominators)", ko: "분모가 같은 분수의 덧셈과 뺄셈" },
    description: {
      en: "Add and subtract fractions and mixed numbers with like denominators.",
      ko: "분모가 같은 분수·대분수의 덧셈과 뺄셈 (기약분수로)",
    },
    instructions: "Add or subtract. Write each answer in simplest form.",
    category: "분수",
    conceptCode: "frac-add-sub-like",
    quarter: "Q4",
    counts: [12, 18, 24],
    columns: 3,
    generator: addSubtractFractions,
    levels: {
      1: { denominators: [3, 4, 5, 6, 8, 10, 12], like: true, mixed: false, op: "mixed", properResult: true },
      2: { denominators: [3, 4, 5, 6, 8, 10, 12], like: true, mixed: false, op: "mixed" },
      3: { denominators: [2, 3, 4, 5, 6, 8, 10, 12], like: true, mixed: true, op: "mixed" },
    },
  }),

  // ── Grade 5 ────────────────────────────────────────────────────────────────
  defineWorksheet({
    grade: 5,
    slug: "order-of-operations",
    title: { en: "Order of Operations", ko: "혼합 계산 (계산 순서)" },
    description: {
      en: "Simplify expressions with +, −, ×, ÷, and parentheses.",
      ko: "+, −, ×, ÷와 괄호가 섞인 식 계산하기",
    },
    instructions: "Simplify each expression.",
    category: "대수·패턴",
    conceptCode: "ops-order-of-operations",
    quarter: "Q1",
    counts: [10, 14, 20],
    columns: 2,
    generator: orderOfOperations,
    levels: {
      1: { operands: [3, 3], maxOperand: 12, parens: false, maxResult: 100 },
      2: { operands: [3, 4], maxOperand: 12, parens: true, maxResult: 150 },
      3: { operands: [4, 5], maxOperand: 20, parens: true, maxResult: 300 },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "prime-factorization",
    title: { en: "Prime & Composite Numbers", ko: "소수·합성수와 소인수분해" },
    description: {
      en: "Classify numbers as prime or composite and write prime factorizations up to 100.",
      ko: "소수와 합성수 구별하기, 100 이하 수의 소인수분해",
    },
    instructions: "Answer each question.",
    category: "수·연산",
    conceptCode: "ns-prime-composite",
    quarter: "Q1",
    counts: [10, 14, 20],
    columns: 2,
    generator: primeFactorization,
    levels: {
      1: { mode: "classify", min: 2, max: 50 },
      2: { mode: "factorize", min: 4, max: 60 },
      3: { mode: "factorize", min: 20, max: 100 },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "mean-median-mode-range",
    title: { en: "Mean, Median, Mode & Range", ko: "평균·중앙값·최빈값·범위" },
    description: {
      en: "Find the mean, median, mode, and range of small data sets.",
      ko: "자료의 평균, 중앙값, 최빈값, 범위 구하기",
    },
    instructions: "Find the mean, median, mode, and range of each data set.",
    category: "확률·자료",
    conceptCode: "meas-mean-median",
    quarter: "Q1",
    counts: [4, 6, 8],
    columns: 2,
    generator: meanMedianModeRange,
    levels: {
      1: { size: [5, 5], maxValue: 12, oddOnly: true },
      2: { size: [6, 7], maxValue: 20, oddOnly: false },
      3: { size: [7, 9], maxValue: 50, oddOnly: false },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "multiply-decimals",
    title: { en: "Multiplying Decimals", ko: "소수의 곱셈" },
    description: {
      en: "Multiply decimals by whole numbers and by other decimals.",
      ko: "(소수) × (자연수), (소수) × (소수)",
    },
    instructions: "Multiply.",
    category: "소수",
    conceptCode: "dec-mult",
    quarter: "Q2",
    counts: [12, 16, 20],
    columns: 4,
    generator: multiplyDecimals,
    levels: {
      1: { aScale: 1, aWholeMax: 9, bScale: 0, bWholeMax: 9 },
      2: { aScale: 1, aWholeMax: 9, bScale: 1, bWholeMax: 9 },
      3: { aScale: 2, aWholeMax: 20, bScale: 1, bWholeMax: 9 },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "divide-decimals",
    title: { en: "Dividing Decimals", ko: "소수의 나눗셈" },
    description: {
      en: "Divide decimals by whole numbers and by tenths.",
      ko: "(소수) ÷ (자연수), (소수) ÷ (소수 한 자리 수)",
    },
    instructions: "Divide.",
    category: "소수",
    conceptCode: "dec-div",
    quarter: "Q2",
    counts: [9, 12, 15],
    columns: 3,
    generator: divideDecimals,
    levels: {
      1: { quotientScale: 1, quotientWholeMax: 20, divisorScale: 0, divisorMax: 9 },
      2: { quotientScale: 2, quotientWholeMax: 20, divisorScale: 0, divisorMax: 12 },
      3: { quotientScale: 1, quotientWholeMax: 20, divisorScale: 1, divisorMax: 9 },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "add-subtract-unlike-fractions",
    title: { en: "Adding & Subtracting Fractions (Unlike Denominators)", ko: "분모가 다른 분수의 덧셈과 뺄셈" },
    description: {
      en: "Find common denominators to add and subtract fractions and mixed numbers.",
      ko: "통분하여 분수·대분수 더하고 빼기",
    },
    instructions: "Add or subtract. Write each answer in simplest form.",
    category: "분수",
    conceptCode: "frac-add-sub-unlike",
    quarter: "Q3",
    counts: [12, 18, 24],
    columns: 3,
    generator: addSubtractFractions,
    levels: {
      1: { denominators: [2, 3, 4, 6, 8, 12], like: false, relatedOnly: true, mixed: false, op: "mixed" },
      2: { denominators: FRACTION_DENS, like: false, mixed: false, op: "mixed" },
      3: { denominators: FRACTION_DENS, like: false, mixed: true, op: "mixed" },
    },
  }),

  // ── Grade 6 ────────────────────────────────────────────────────────────────
  defineWorksheet({
    grade: 6,
    slug: "gcf-lcm",
    title: { en: "GCF & LCM", ko: "최대공약수와 최소공배수" },
    description: {
      en: "Greatest common factor and least common multiple of two numbers.",
      ko: "두 수의 최대공약수와 최소공배수",
    },
    instructions: "Answer each question.",
    category: "수·연산",
    conceptCode: "ns-lcm-lcd",
    quarter: "Q1",
    counts: [10, 14, 20],
    columns: 2,
    generator: gcfLcm,
    levels: {
      1: { mode: "gcf", gcfMax: 50, lcmMax: 12 },
      2: { mode: "lcm", gcfMax: 50, lcmMax: 12 },
      3: { mode: "mixed", gcfMax: 100, lcmMax: 20 },
    },
  }),
  defineWorksheet({
    grade: 6,
    slug: "integer-operations",
    title: { en: "Integer Operations", ko: "정수의 사칙연산" },
    description: {
      en: "Add, subtract, multiply, and divide positive and negative integers, including absolute value.",
      ko: "양수·음수 정수의 사칙연산과 절댓값",
    },
    instructions: "Solve.",
    category: "수·연산",
    conceptCode: "ops-negative-numbers",
    quarter: "Q3",
    counts: [15, 21, 30],
    columns: 3,
    generator: integerOperations,
    levels: {
      1: { ops: ["+", "-"], range: 20, terms: 2, absoluteValue: false },
      2: { ops: ["*", "/"], range: 12, terms: 2, absoluteValue: false },
      3: { ops: ["+", "-", "*", "/"], range: 12, terms: 3, absoluteValue: true },
    },
  }),
  defineWorksheet({
    grade: 6,
    slug: "exponents-perfect-squares",
    title: { en: "Exponents & Perfect Squares", ko: "거듭제곱과 완전제곱수" },
    description: {
      en: "Evaluate powers, powers of ten, and perfect squares up to 20².",
      ko: "거듭제곱, 10의 거듭제곱, 20²까지의 완전제곱수",
    },
    instructions: "Evaluate, or fill in the missing number.",
    category: "수·연산",
    conceptCode: "ops-exponents",
    quarter: "Q3",
    counts: [15, 21, 30],
    columns: 3,
    generator: exponents,
    levels: {
      1: { mode: "power", maxBase: 10, maxExponent: 4 },
      2: { mode: "powers-of-ten", maxBase: 10, maxExponent: 6 },
      3: { mode: "squares", maxBase: 20, maxExponent: 2 },
    },
  }),
  defineWorksheet({
    grade: 6,
    slug: "multiply-divide-fractions",
    title: { en: "Multiplying & Dividing Fractions", ko: "분수의 곱셈과 나눗셈" },
    description: {
      en: "Multiply and divide fractions and mixed numbers; simplify.",
      ko: "분수·대분수의 곱셈과 나눗셈 (기약분수로)",
    },
    instructions: "Multiply or divide. Write each answer in simplest form.",
    category: "분수",
    conceptCode: "frac-mult",
    quarter: "Q3",
    counts: [12, 18, 24],
    columns: 3,
    generator: multiplyDivideFractions,
    levels: {
      1: { ops: ["*"], denominators: FRACTION_DENS, mixed: false },
      2: { ops: ["/"], denominators: FRACTION_DENS, mixed: false },
      3: { ops: ["*", "/"], denominators: [2, 3, 4, 5, 6, 8], mixed: true },
    },
  }),
  defineWorksheet({
    grade: 6,
    slug: "one-step-equations",
    title: { en: "One-Step Equations", ko: "한 단계 일차방정식" },
    description: {
      en: "Solve one-step equations using inverse operations.",
      ko: "역연산을 이용해 한 단계 방정식 풀기",
    },
    instructions: "Solve for the variable.",
    category: "대수·패턴",
    conceptCode: "alg-equations-basic",
    quarter: "Q3",
    counts: [12, 18, 24],
    columns: 3,
    generator: oneStepEquations,
    levels: {
      1: { ops: ["+", "-"], negative: false, max: 20 },
      2: { ops: ["*", "/"], negative: false, max: 12 },
      3: { ops: ["+", "-", "*", "/"], negative: true, max: 12 },
    },
  }),
];

export const WORKSHEET_GRADES: readonly GradeNum[] = [3, 4, 5, 6];

export function gradeSlug(grade: GradeNum): string {
  return `grade-${grade}`;
}

export function parseGradeSlug(slug: string): GradeNum | null {
  const n = Number(slug.replace(/^grade-/, ""));
  return (WORKSHEET_GRADES as readonly number[]).includes(n) && slug === `grade-${n}` ? (n as GradeNum) : null;
}

export function worksheetsForGrade(grade: GradeNum): WorksheetDef[] {
  return WORKSHEETS.filter((w) => w.grade === grade);
}

export function getWorksheet(gradeSlugParam: string, slug: string): WorksheetDef | undefined {
  const grade = parseGradeSlug(gradeSlugParam);
  return grade === null ? undefined : WORKSHEETS.find((w) => w.grade === grade && w.slug === slug);
}

export function worksheetPath(def: WorksheetDef): string {
  return `/worksheets/${gradeSlug(def.grade)}/${def.slug}`;
}
