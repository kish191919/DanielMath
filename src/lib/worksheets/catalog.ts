import {
  compareDecimalNumbers,
  addSubtractDecimals,
  compareRationals,
  divideDecimals,
  fractionsDecimals,
  multiplyDecimals,
  roundDecimals,
} from "./generators/decimals";
import {
  evaluateExpressions,
  exponents,
  integerOperations,
  oneStepEquations,
  orderOfOperations,
} from "./generators/expressions";
import { factorsGcf, gcfLcm, primeFactorization } from "./generators/factors";
import {
  addSubtractFractions,
  compareFractions,
  convertMixed,
  equivalentFractions,
  fractionModel,
  multiplyDivideFractions,
  multiplyFractionWhole,
} from "./generators/fractions";
import { triangleAngles } from "./generators/geometry";
import { circles, convertUnits } from "./generators/measurement";
import { countMoney } from "./generators/money";
import { orderValues } from "./generators/ordering";
import { numberPatterns } from "./generators/patterns";
import { probability } from "./generators/probability";
import { percents, ratiosRates } from "./generators/ratios";
import { meanMedianModeRange } from "./generators/statistics";
import { elapsedTime, tellingTime } from "./generators/time";
import { compareWhole, estimate, numberForms, placeValue, rounding } from "./generators/whole-numbers";
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
    examples: {
      1: {
        show: { kind: "math", lines: ["$4{,}\\underline{6}52 \\rightarrow 600$"] },
        think: "The 6 is in the hundreds place, so it is worth $6 \\times 100 = 600$.",
      },
      2: {
        show: { kind: "math", lines: ["$3\\underline{5}{,}218 \\rightarrow 50{,}000$"] },
        think: "The 5 is in the ten thousands place, so it is worth $5 \\times 10{,}000 = 50{,}000$.",
      },
    },
  }),
  defineWorksheet({
    grade: 3,
    slug: "number-forms",
    title: { en: "Standard, Expanded & Word Form", ko: "수의 세 가지 표현 (표준형·전개형·단어형)" },
    description: {
      en: "Write numbers up to six digits in standard, expanded, and word form.",
      ko: "여섯 자리까지의 수를 표준형·전개형(자릿값의 합)·영어 단어로 나타내기",
    },
    instructions: "Write each number in the form asked for.",
    category: "수·연산",
    conceptCode: "ns-place-value",
    quarter: "Q1",
    counts: [4, 6, 8],
    columns: 2,
    generator: numberForms,
    levels: {
      1: { tasks: ["to-expanded"], digits: [3, 4] },
      2: { tasks: ["to-expanded", "to-standard"], digits: [5, 6] },
      3: { tasks: ["word-to-standard", "to-word"], digits: [4, 6] },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$4{,}305 = 4{,}000 + 300 + 5$"] },
        think: "Write the value of each digit. The 0 in the tens place is worth 0, so leave it out.",
      },
      2: {
        show: { kind: "math", lines: ["$60{,}000 + 2{,}000 + 40 + 7 = 62{,}047$"] },
        think: "There are no hundreds, so write a 0 in the hundreds place.",
      },
      3: {
        show: { kind: "math", lines: ["$35{,}612$ = thirty-five thousand, six hundred twelve"] },
        think: "Read the digits before the comma and say thousand, then read the last three digits.",
      },
    },
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
    counts: [12, 18, 21],
    columns: 3,
    generator: compareWhole,
    levels: {
      1: { digits: 3, close: false },
      2: { digits: 4, close: false },
      3: { digits: 4, close: true },
    },
    examples: {
      1: {
        show: { kind: "compare", left: "$582$", right: "$528$", symbol: ">" },
        think: "The hundreds are the same (5). Compare the tens: $8 > 2$, so $582 > 528$.",
      },
      2: {
        show: { kind: "compare", left: "$4{,}315$", right: "$4{,}351$", symbol: "<" },
        think: "The thousands and hundreds match. Compare the tens: $1 < 5$, so $4{,}315 < 4{,}351$.",
      },
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
    counts: [8, 12, 16],
    columns: 4,
    generator: addSubtract,
    levels: {
      1: { digits: [2, 2], op: "mixed", regroup: false },
      2: { digits: [3, 3], op: "mixed", regroup: true },
      3: { digits: [4, 3], op: "mixed", regroup: true },
    },
    examples: {
      1: {
        show: { kind: "vertical", operator: "+", top: "43", bottom: "25", align: "right" },
        think: "Add the ones first ($3 + 5 = 8$), then the tens ($4 + 2 = 6$).",
      },
      2: {
        show: { kind: "vertical", operator: "+", top: "368", bottom: "275", align: "right" },
        think: "$8 + 5 = 13$: write 3, carry 1 ten. $1 + 6 + 7 = 14$: write 4, carry 1 hundred. $1 + 3 + 2 = 6$.",
      },
      3: {
        show: { kind: "vertical", operator: "−", top: "4312", bottom: "1205", align: "right" },
        think: "$2 < 5$, so regroup 1 ten as 10 ones: $12 - 5 = 7$. Then $0 - 0 = 0$, $3 - 2 = 1$, $4 - 1 = 3$.",
      },
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
    counts: [12, 18, 24],
    columns: 3,
    generator: facts,
    levels: {
      1: { op: "*", min: 0, max: 5, missing: false },
      2: { op: "*", min: 0, max: 10, missing: false },
      3: { op: "*", min: 1, max: 10, missing: true },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$4 \\times 5 = 20$"] },
        think: "4 groups of 5: skip count 5, 10, 15, 20.",
      },
      2: {
        show: { kind: "math", lines: ["$7 \\times 8 = 56$"] },
        think: "Use a fact you know: $7 \\times 4 = 28$, and $28 + 28 = 56$.",
      },
      3: {
        show: { kind: "math", lines: ["$6 \\times \\boxed{7} = 42$"] },
        think: "Ask: 6 times what is 42? $6 \\times 7 = 42$, so the missing number is 7.",
      },
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
    counts: [12, 18, 24],
    columns: 3,
    generator: facts,
    levels: {
      1: { op: "/", min: 1, max: 5, missing: false },
      2: { op: "/", min: 1, max: 10, missing: false },
      3: { op: "/", min: 1, max: 10, missing: true },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$20 \\div 4 = 5$"] },
        think: "Think multiplication: $4 \\times 5 = 20$, so $20 \\div 4 = 5$.",
      },
      2: {
        show: { kind: "math", lines: ["$63 \\div 9 = 7$"] },
        think: "Think multiplication: $9 \\times 7 = 63$, so $63 \\div 9 = 7$.",
      },
      3: {
        show: { kind: "math", lines: ["$48 \\div \\boxed{6} = 8$"] },
        think: "Ask: 48 divided by what is 8? $8 \\times 6 = 48$, so the missing number is 6.",
      },
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
    counts: [6, 9],
    columns: 3,
    generator: fractionModel,
    levels: {
      1: { denominators: [2, 3, 4], improper: false },
      2: { denominators: [2, 3, 4, 5, 6, 8, 10], improper: false },
      3: { denominators: [2, 3, 4, 5, 6, 8], improper: true },
    },
    examples: {
      1: {
        show: {
          kind: "figure",
          figure: { type: "fraction-model", shape: "circle", parts: 4, shaded: [3] },
          prompt: "Fraction shaded:",
          answer: "$\\frac{3}{4}$",
        },
        think: "The circle has 4 equal parts and 3 are shaded, so $\\frac{3}{4}$ is shaded.",
      },
      3: {
        show: {
          kind: "figure",
          figure: { type: "fraction-model", shape: "bar", parts: 3, shaded: [3, 2] },
          prompt: "Improper fraction and mixed number:",
          answer: "$\\frac{5}{3}$ = $1\\frac{2}{3}$",
        },
        think: "One whole bar is $\\frac{3}{3}$. Add 2 more thirds: $\\frac{5}{3} = 1\\frac{2}{3}$.",
      },
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
    counts: [12, 18, 21],
    columns: 3,
    generator: compareFractions,
    levels: {
      1: { mode: "like-den", denominators: [3, 4, 5, 6, 8, 10] },
      2: { mode: "like-num", denominators: [2, 3, 4, 5, 6, 8, 10] },
      3: { mode: "mixed", denominators: [2, 3, 4, 5, 6, 8, 10] },
    },
    examples: {
      1: {
        show: { kind: "compare", left: "$\\frac{2}{5}$", right: "$\\frac{4}{5}$", symbol: "<" },
        think: "Same denominator: compare the numerators. $2 < 4$, so $\\frac{2}{5} < \\frac{4}{5}$.",
      },
      2: {
        show: { kind: "compare", left: "$\\frac{3}{4}$", right: "$\\frac{3}{8}$", symbol: ">" },
        think: "Same numerator: fourths are bigger pieces than eighths, so $\\frac{3}{4} > \\frac{3}{8}$.",
      },
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
    counts: [6, 9],
    columns: 3,
    generator: tellingTime,
    levels: { 1: { minuteStep: 30 }, 2: { minuteStep: 5 }, 3: { minuteStep: 1 } },
    examples: {
      1: {
        show: { kind: "figure", figure: { type: "clock", hour: 4, minute: 30 }, prompt: "Time:", answer: "4:30" },
        think: "The long hand points to 6, which means 30 minutes. The short hand is between 4 and 5.",
      },
      2: {
        show: { kind: "figure", figure: { type: "clock", hour: 7, minute: 25 }, prompt: "Time:", answer: "7:25" },
        think: "The long hand points to 5. Count by fives: $5 \\times 5 = 25$ minutes past 7.",
      },
      3: {
        show: { kind: "figure", figure: { type: "clock", hour: 2, minute: 38 }, prompt: "Time:", answer: "2:38" },
        think: "The long hand is 3 marks past the 7: $35 + 3 = 38$ minutes past 2.",
      },
    },
  }),
  defineWorksheet({
    grade: 3,
    slug: "elapsed-time",
    title: { en: "Elapsed Time", ko: "걸린 시간 구하기" },
    description: {
      en: "Find the elapsed time, start time, or end time within a.m. or within p.m.",
      ko: "오전 또는 오후 안에서 걸린 시간, 시작 시각, 끝난 시각 구하기",
    },
    instructions: "Find the elapsed time, or the missing start or end time.",
    category: "측정",
    conceptCode: "meas-time-elapsed",
    quarter: "Q4",
    counts: [4, 6, 8],
    columns: 2,
    generator: elapsedTime,
    levels: {
      1: { unknowns: ["elapsed"], wholeHours: true, step: 15 },
      2: { unknowns: ["elapsed"], wholeHours: false, step: 5 },
      3: { unknowns: ["start", "end"], wholeHours: false, step: 5 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["From 2:15 p.m. to 5:15 p.m. → 3 hours"] },
        think: "Count the hours: 3:15, 4:15, 5:15. That is 3 hours.",
      },
      2: {
        show: { kind: "math", lines: ["From 9:20 a.m. to 11:45 a.m. → 2 hours 25 minutes"] },
        think: "Count whole hours up to 11:20 (2 hours), then the minutes from 11:20 to 11:45 (25 minutes).",
      },
      3: {
        show: { kind: "math", lines: ["Starts at 1:35 p.m. and lasts 2 hours 40 minutes → ends at 4:15 p.m."] },
        think: "Add the hours first: 3:35 p.m. Then add the minutes: 25 minutes gets to 4:00, and 15 more makes 4:15.",
      },
    },
  }),
  defineWorksheet({
    grade: 3,
    slug: "counting-money",
    title: { en: "Counting Money & Making Change", ko: "돈 세기와 거스름돈" },
    description: {
      en: "Count coins and bills up to five dollars, and make change from one, five, or ten dollars.",
      ko: "5달러까지 동전·지폐 세기, 1·5·10달러를 냈을 때 거스름돈 구하기",
    },
    instructions: "Find the total value, or the change.",
    category: "측정",
    conceptCode: "meas-money",
    quarter: "Q4",
    counts: [4, 6, 8],
    columns: 2,
    generator: countMoney,
    levels: { 1: { mode: "coins" }, 2: { mode: "bills" }, 3: { mode: "change" } },
    examples: {
      1: {
        show: { kind: "math", lines: ["2 quarters, 1 dime, 3 pennies → 63¢"] },
        think: "Start with the coins worth the most and count on: 25, 50, then 60, then 61, 62, 63.",
      },
      2: {
        show: { kind: "math", lines: ["2 one-dollar bills, 3 quarters, 1 nickel → $\\text{\\textdollar}2.80$"] },
        think: "The bills make 2 dollars. The coins make 80¢ (25, 50, 75, 80). Together: $\\text{\\textdollar}2.80$.",
      },
      3: {
        show: {
          kind: "math",
          lines: ["Pay $\\text{\\textdollar}5.00$ for something that costs $\\text{\\textdollar}3.47$. Change: $\\text{\\textdollar}1.53$"],
        },
        think:
          "Count up from the price: 3¢ makes $\\text{\\textdollar}3.50$, 50¢ makes $\\text{\\textdollar}4.00$, and 1 dollar makes $\\text{\\textdollar}5.00$.",
      },
    },
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
    counts: [4, 6, 8],
    columns: 2,
    generator: rounding,
    levels: {
      1: { digits: [3, 4], places: [10, 100] },
      2: { digits: [4, 5], places: [100, 1000] },
      3: { digits: [5, 7], places: [1000, 10000, 100000] },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["Round $347$ to the nearest ten: $347 \\rightarrow 350$"] },
        think: "Look at the digit to the right of the tens place: $7 \\ge 5$, so round up.",
      },
      2: {
        show: { kind: "math", lines: ["Round $6{,}482$ to the nearest hundred: $6{,}482 \\rightarrow 6{,}500$"] },
        think: "Look at the tens digit: $8 \\ge 5$, so the hundreds digit goes up from 4 to 5.",
      },
      3: {
        show: { kind: "math", lines: ["Round $274{,}516$ to the nearest ten thousand: $274{,}516 \\rightarrow 270{,}000$"] },
        think: "Look at the thousands digit: $4 < 5$, so the ten thousands digit stays 7.",
      },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "order-numbers",
    title: { en: "Ordering Whole Numbers", ko: "큰 수의 순서 정하기" },
    description: {
      en: "Put four whole numbers up to seven digits in order, least to greatest or greatest to least.",
      ko: "일곱 자리까지의 수 네 개를 작은 수부터 또는 큰 수부터 차례로 쓰기",
    },
    instructions: "Write the numbers in the order shown.",
    category: "수·연산",
    conceptCode: "ns-compare-order-whole",
    quarter: "Q1",
    counts: [4, 6, 8],
    columns: 2,
    generator: orderValues,
    levels: {
      1: { values: { kind: "whole", digits: [4, 4], close: false }, direction: "asc" },
      2: { values: { kind: "whole", digits: [5, 6], close: true }, direction: "asc" },
      3: { values: { kind: "whole", digits: [6, 7], close: true, mixedLengths: true }, direction: "either" },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$3{,}452 < 3{,}524 < 4{,}235 < 4{,}352$"] },
        think: "Compare the thousands first: $3 < 4$. When the thousands match, compare the hundreds.",
      },
      2: {
        show: { kind: "math", lines: ["$45{,}213 < 45{,}312 < 45{,}321 < 46{,}123$"] },
        think: "All four start with 4 ten thousands. Compare the thousands, then the hundreds, then the tens.",
      },
      3: {
        show: { kind: "math", lines: ["$1{,}204{,}516 > 1{,}042{,}516 > 998{,}760 > 989{,}760$"] },
        think: "A 7-digit number is greater than any 6-digit number. Then compare place by place from the left.",
      },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "estimation",
    title: { en: "Estimating Sums, Differences & Products", ko: "어림셈 (반올림하여 계산하기)" },
    description: {
      en: "Round each number to the place shown, then add, subtract, or multiply to estimate.",
      ko: "주어진 자리에서 반올림한 뒤 더하고 빼고 곱해 어림하기",
    },
    instructions: "Round each number to the place shown, then estimate.",
    category: "수·연산",
    conceptCode: "ops-add-sub-multi-digit",
    quarter: "Q1",
    counts: [6, 8, 10],
    columns: 2,
    generator: estimate,
    levels: {
      1: {
        cases: [
          { digits: 2, place: 10, op: "+" },
          { digits: 2, place: 10, op: "-" },
        ],
      },
      2: {
        cases: [
          { digits: 3, place: 100, op: "+" },
          { digits: 3, place: 100, op: "-" },
        ],
      },
      3: {
        cases: [
          { digits: 4, place: 1000, op: "+" },
          { digits: 4, place: 1000, op: "-" },
          { digits: 2, place: 10, op: "*" },
          { digits: 3, place: 100, op: "*" },
        ],
      },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$47 + 32$ → $50 + 30 = 80$"] },
        think: "47 rounds up to 50 because $7 \\ge 5$. 32 rounds down to 30 because $2 < 5$.",
      },
      2: {
        show: { kind: "math", lines: ["$487 - 213$ → $500 - 200 = 300$"] },
        think: "Look at the tens digits: 487 rounds up to 500 ($8 \\ge 5$), and 213 rounds down to 200 ($1 < 5$).",
      },
      3: {
        show: {
          kind: "math",
          lines: ["$4{,}618 + 2{,}375$ → $5{,}000 + 2{,}000 = 7{,}000$", "$48 \\times 7$ → $50 \\times 7 = 350$"],
        },
        think: "Round, then use a basic fact: $5 + 2 = 7$ thousands, and $5 \\times 7 = 35$ tens.",
      },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "number-patterns",
    title: { en: "Number Patterns & Input/Output Tables", ko: "수의 규칙과 입출력표" },
    description: {
      en: "Find the rule to extend number patterns and complete input/output tables.",
      ko: "규칙을 찾아 수의 배열과 입출력표의 빈칸 채우기",
    },
    instructions: "Find the rule and fill in the missing numbers.",
    category: "대수·패턴",
    conceptCode: "alg-patterns",
    quarter: "Q1",
    counts: [4, 6, 8],
    columns: 2,
    generator: numberPatterns,
    levels: {
      1: { kind: "sequence", ops: ["+", "-"], length: 6, gaps: "end" },
      2: { kind: "sequence", ops: ["+", "-", "*"], length: 6, gaps: "inside" },
      3: { kind: "table", ops: ["+", "-", "*", "/"], maxK: 9, cells: 5 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$5,\\ 9,\\ 13,\\ 17,\\ \\boxed{21},\\ \\boxed{25}$"] },
        think: "Each number is 4 more than the one before, so the rule is add 4: $17 + 4 = 21$ and $21 + 4 = 25$.",
      },
      2: {
        show: { kind: "math", lines: ["$3,\\ 6,\\ 12,\\ \\boxed{24},\\ 48,\\ \\boxed{96}$"] },
        think: "Each number is double the one before, so the rule is multiply by 2: $12 \\times 2 = 24$ and $48 \\times 2 = 96$.",
      },
      3: {
        show: {
          kind: "math",
          lines: [
            "$\\begin{array}{|c|c|c|c|c|}\\hline \\text{In} & 2 & 4 & 6 & 8 \\\\ \\hline \\text{Out} & 6 & 12 & \\mathbf{18} & \\mathbf{24} \\\\ \\hline \\end{array}$",
          ],
        },
        think: "$2 \\times 3 = 6$ and $4 \\times 3 = 12$, so the rule is multiply by 3: $6 \\times 3 = 18$ and $8 \\times 3 = 24$.",
      },
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
    counts: [12, 18, 24],
    columns: 3,
    generator: facts,
    levels: {
      1: { op: "*", min: 0, max: 12, missing: false },
      2: { op: "/", min: 1, max: 12, missing: false },
      3: { op: "mixed", min: 1, max: 12, missing: true },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$9 \\times 12 = 108$"] },
        think: "Break 12 into 10 and 2: $9 \\times 10 = 90$, $9 \\times 2 = 18$, and $90 + 18 = 108$.",
      },
      2: {
        show: { kind: "math", lines: ["$84 \\div 7 = 12$"] },
        think: "Think multiplication: $7 \\times 12 = 84$, so $84 \\div 7 = 12$.",
      },
      3: {
        show: { kind: "math", lines: ["$6 \\times \\boxed{11} = 66$"] },
        think: "Ask: 6 times what is 66? $6 \\times 11 = 66$, so the missing number is 11.",
      },
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
    counts: [8, 12, 16],
    columns: 4,
    generator: multiply,
    levels: {
      1: { topDigits: 2, bottomDigits: 1 },
      2: { topDigits: 3, bottomDigits: 1 },
      3: { topDigits: 3, bottomDigits: 1, zeroInTop: true },
    },
    examples: {
      1: {
        show: { kind: "vertical", operator: "×", top: "46", bottom: "3", align: "right" },
        think: "$6 \\times 3 = 18$: write 8, carry 1. $4 \\times 3 = 12$, plus the 1 carried is 13.",
      },
      2: {
        show: { kind: "vertical", operator: "×", top: "324", bottom: "6", align: "right" },
        think: "$4 \\times 6 = 24$: write 4, carry 2. $2 \\times 6 + 2 = 14$: write 4, carry 1. $3 \\times 6 + 1 = 19$.",
      },
      3: {
        show: { kind: "vertical", operator: "×", top: "406", bottom: "7", align: "right" },
        think: "$6 \\times 7 = 42$: write 2, carry 4. $0 \\times 7 = 0$, plus the 4 carried is 4. $4 \\times 7 = 28$.",
      },
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
    counts: [6, 9],
    columns: 3,
    generator: longDivision,
    levels: {
      1: { dividendDigits: [2, 2], remainder: "none" },
      2: { dividendDigits: [2, 3], remainder: "mixed" },
      3: { dividendDigits: [3, 4], remainder: "mixed" },
    },
    examples: {
      1: {
        show: { kind: "longdiv", divisor: 3, dividend: 72 },
        think: "Divide, multiply, subtract, bring down — then repeat. Check: $24 \\times 3 = 72$.",
      },
      2: {
        show: { kind: "longdiv", divisor: 4, dividend: 87 },
        think: "$4 \\times 21 = 84$, and $87 - 84 = 3$ is left over, so the answer is 21 R3.",
      },
      3: {
        show: { kind: "longdiv", divisor: 4, dividend: 197 },
        think: "4 doesn't go into 1, so start with 19. Divide, multiply, subtract, bring down. Check: $49 \\times 4 + 1 = 197$.",
      },
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
    counts: [4, 6, 8],
    columns: 2,
    generator: factorsGcf,
    levels: {
      1: { mode: "pairs", min: 12, max: 48 },
      2: { mode: "pairs", min: 24, max: 100 },
      3: { mode: "gcf", counts: [2, 3], max: 100 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["Factor pairs of $18$: $1 \\times 18$, $2 \\times 9$, $3 \\times 6$"] },
        think: "Try 1, 2, 3, … in order. Stop when the pairs start to repeat (the next one would be $6 \\times 3$).",
      },
      3: {
        show: { kind: "math", lines: ["$\\text{GCF}(12, 18) = 6$"] },
        think: "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. The greatest one they share is 6.",
      },
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
    examples: {
      1: {
        show: { kind: "math", lines: ["$\\frac{3}{4} = \\frac{\\boxed{6}}{8}$"] },
        think: "$4 \\times 2 = 8$, so multiply the numerator by 2 too: $3 \\times 2 = 6$.",
      },
      2: {
        show: { kind: "math", lines: ["$\\frac{2}{3} = \\frac{\\boxed{8}}{12}$"] },
        think: "$3 \\times 4 = 12$, so multiply the numerator by 4 too: $2 \\times 4 = 8$.",
      },
      3: {
        show: { kind: "math", lines: ["$\\frac{10}{15} = \\frac{2}{\\boxed{3}}$"] },
        think: "$10 \\div 5 = 2$, so divide the denominator by 5 too: $15 \\div 5 = 3$.",
      },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "mixed-numbers",
    title: { en: "Improper Fractions & Mixed Numbers", ko: "가분수와 대분수" },
    description: {
      en: "Rename improper fractions as mixed numbers, and mixed numbers as improper fractions.",
      ko: "가분수를 대분수로, 대분수를 가분수로 바꾸기",
    },
    instructions: "Write each as a mixed number or an improper fraction.",
    category: "분수",
    conceptCode: "frac-mixed-numbers",
    quarter: "Q2",
    counts: [12, 18, 24],
    columns: 3,
    generator: convertMixed,
    levels: {
      1: { to: ["mixed"], denominators: [2, 3, 4, 5, 6], wholeMax: 4 },
      2: { to: ["improper"], denominators: [2, 3, 4, 5, 6, 8, 10], wholeMax: 6 },
      3: { to: ["mixed", "improper"], denominators: [2, 3, 4, 5, 6, 8, 10, 12], wholeMax: 9 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$\\frac{11}{4} = 2\\frac{3}{4}$"] },
        think: "How many 4s are in 11? $4 \\times 2 = 8$ and $11 - 8 = 3$, so that is 2 wholes and 3 fourths.",
      },
      2: {
        show: { kind: "math", lines: ["$3\\frac{2}{5} = \\frac{17}{5}$"] },
        think: "Multiply the whole number by the denominator, then add the numerator: $3 \\times 5 + 2 = 17$.",
      },
      3: {
        show: { kind: "math", lines: ["$\\frac{29}{8} = 3\\frac{5}{8}$", "$4\\frac{1}{6} = \\frac{25}{6}$"] },
        think: "To a mixed number, divide: $8 \\times 3 = 24$, with 5 left over. To an improper fraction: $4 \\times 6 + 1 = 25$.",
      },
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
    counts: [4, 8],
    columns: 4,
    generator: multiply,
    levels: {
      1: { topDigits: 2, bottomDigits: 2, bottomTens: true },
      2: { topDigits: 2, bottomDigits: 2 },
      3: { topDigits: 3, bottomDigits: 2 },
    },
    examples: {
      1: {
        show: { kind: "vertical", operator: "×", top: "34", bottom: "20", align: "right" },
        think: "$34 \\times 2 = 68$. Multiplying by 2 tens gives 68 tens: $34 \\times 20 = 680$.",
      },
      2: {
        show: { kind: "vertical", operator: "×", top: "47", bottom: "23", align: "right" },
        think: "$47 \\times 3 = 141$ and $47 \\times 20 = 940$. Add the partial products: $141 + 940 = 1{,}081$.",
      },
      3: {
        show: { kind: "vertical", operator: "×", top: "216", bottom: "34", align: "right" },
        think: "$216 \\times 4 = 864$ and $216 \\times 30 = 6{,}480$. Add: $864 + 6{,}480 = 7{,}344$.",
      },
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
    counts: [12, 18, 21],
    columns: 3,
    generator: compareDecimalNumbers,
    levels: {
      1: { scales: [1], wholeMax: 9, tricky: false },
      2: { scales: [2, 3], wholeMax: 20, tricky: false },
      3: { scales: [1, 2, 3], wholeMax: 9, tricky: true },
    },
    examples: {
      1: {
        show: { kind: "compare", left: "$3.6$", right: "$3.9$", symbol: "<" },
        think: "The ones are the same. Compare the tenths: $6 < 9$.",
      },
      2: {
        show: { kind: "compare", left: "$12.48$", right: "$12.435$", symbol: ">" },
        think: "Compare place by place: the tenths match (4), and in the hundredths $8 > 3$.",
      },
      3: {
        show: { kind: "compare", left: "$4.5$", right: "$4.45$", symbol: ">" },
        think: "Give both numbers hundredths: $4.5 = 4.50$, and 50 hundredths is more than 45 hundredths.",
      },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "fractions-decimals",
    title: { en: "Fractions & Decimals", ko: "분수와 소수의 관계" },
    description: {
      en: "Write fractions as decimals, and decimals as fractions in simplest form.",
      ko: "분수를 소수로, 소수를 기약분수로 나타내기",
    },
    instructions: "Write each fraction as a decimal, or each decimal as a fraction in simplest form.",
    category: "소수",
    conceptCode: "dec-frac-convert",
    quarter: "Q3",
    counts: [12, 18, 24],
    columns: 3,
    generator: fractionsDecimals,
    levels: {
      1: { to: ["decimal"], denominators: [10, 100], wholeMax: 0 },
      2: { to: ["fraction"], denominators: [2, 4, 5, 10, 20, 25, 50, 100], wholeMax: 0 },
      3: { to: ["decimal", "fraction"], denominators: [2, 4, 5, 8, 10, 20, 25, 100], wholeMax: 3 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$\\frac{7}{10} = 0.7$", "$\\frac{43}{100} = 0.43$"] },
        think: "Tenths fill one decimal place, and hundredths fill two.",
      },
      2: {
        show: { kind: "math", lines: ["$0.25 = \\frac{25}{100} = \\frac{1}{4}$"] },
        think: "Two decimal places means hundredths: write 25 over 100, then divide the top and bottom by 25.",
      },
      3: {
        show: { kind: "math", lines: ["$1\\frac{3}{8} = 1.375$", "$2.6 = 2\\frac{3}{5}$"] },
        think: "$\\frac{3}{8} = 3 \\div 8 = 0.375$, and $0.6 = \\frac{6}{10} = \\frac{3}{5}$.",
      },
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
    counts: [8, 12, 16],
    columns: 4,
    generator: addSubtractDecimals,
    levels: {
      1: { scales: [1], wholeMax: 20, op: "mixed", sameScale: true },
      2: { scales: [2], wholeMax: 50, op: "mixed", sameScale: true },
      3: { scales: [1, 2, 3], wholeMax: 99, op: "mixed", sameScale: false },
    },
    examples: {
      1: {
        show: { kind: "vertical", operator: "+", top: "12.4", bottom: "5.8", align: "decimal" },
        think: "Line up the decimal points. $4 + 8 = 12$ tenths: write 2, carry 1 to the ones.",
      },
      2: {
        show: { kind: "vertical", operator: "−", top: "23.45", bottom: "8.17", align: "decimal" },
        think: "Line up the decimal points and subtract like whole numbers, regrouping when needed: $15 - 7 = 8$.",
      },
      3: {
        show: { kind: "vertical", operator: "+", top: "7.5", bottom: "2.36", align: "decimal" },
        think: "Give both numbers hundredths ($7.5 = 7.50$), line up the decimal points, then add.",
      },
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
    counts: [8, 12, 14],
    columns: 2,
    generator: addSubtractFractions,
    levels: {
      1: { denominators: [3, 4, 5, 6, 8, 10, 12], like: true, mixed: false, op: "mixed", properResult: true },
      2: { denominators: [3, 4, 5, 6, 8, 10, 12], like: true, mixed: false, op: "mixed" },
      3: { denominators: [2, 3, 4, 5, 6, 8, 10, 12], like: true, mixed: true, op: "mixed" },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$\\frac{3}{8} + \\frac{2}{8} = \\frac{5}{8}$"] },
        think: "The denominators are the same, so add the numerators ($3 + 2 = 5$) and keep the denominator.",
      },
      2: {
        show: { kind: "math", lines: ["$\\frac{7}{10} - \\frac{3}{10} = \\frac{4}{10} = \\frac{2}{5}$"] },
        think: "Subtract the numerators, then simplify: divide the numerator and denominator by 2.",
      },
      3: {
        show: { kind: "math", lines: ["$2\\frac{3}{4} + 1\\frac{3}{4} = 3\\frac{6}{4} = 4\\frac{1}{2}$"] },
        think: "Add the wholes and the fractions, then regroup: $\\frac{6}{4} = 1\\frac{2}{4} = 1\\frac{1}{2}$.",
      },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "customary-units",
    title: { en: "Customary Unit Conversions", ko: "미국 단위 환산 (길이·들이·무게)" },
    description: {
      en: "Convert among inches, feet, yards, cups, pints, quarts, gallons, ounces, and pounds.",
      ko: "인치·피트·야드, 컵·파인트·쿼트·갤런, 온스·파운드 사이의 단위 바꾸기",
    },
    instructions: "Fill in each box. 1 ft = 12 in · 1 yd = 3 ft · 1 gal = 4 qt · 1 qt = 2 pt · 1 pt = 2 c · 1 lb = 16 oz",
    category: "측정",
    conceptCode: "meas-unit-conversion",
    quarter: "Q4",
    counts: [12, 18, 24],
    columns: 3,
    generator: convertUnits,
    levels: {
      1: { system: "customary", tasks: ["big-to-small"] },
      2: { system: "customary", tasks: ["mixed-to-small"] },
      3: { system: "customary", tasks: ["small-to-mixed", "small-to-big"] },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$3\\text{ ft} = 36\\text{ in}$"] },
        think: "1 foot is 12 inches, so 3 feet is $3 \\times 12 = 36$ inches.",
      },
      2: {
        show: { kind: "math", lines: ["$2\\text{ ft}\\ 5\\text{ in} = 29\\text{ in}$"] },
        think: "$2 \\times 12 = 24$ inches, plus 5 more: $24 + 5 = 29$.",
      },
      3: {
        show: { kind: "math", lines: ["$50\\text{ in} = 4\\text{ ft}\\ 2\\text{ in}$"] },
        think: "How many 12s are in 50? $4 \\times 12 = 48$, and $50 - 48 = 2$ inches are left over.",
      },
    },
  }),
  defineWorksheet({
    grade: 4,
    slug: "probability",
    title: { en: "Probability", ko: "확률" },
    description: {
      en: "Write the probability of simple events with number cubes, marbles, and number cards.",
      ko: "주사위·구슬·숫자 카드에서 사건이 일어날 확률을 0~1 사이의 분수로 나타내기",
    },
    instructions: "Write each probability as a fraction in simplest form, or as 0 or 1.",
    category: "확률·자료",
    conceptCode: "ps-probability-basic",
    quarter: "Q4",
    counts: [4, 6],
    columns: 2,
    generator: probability,
    levels: { 1: { mode: "cube" }, 2: { mode: "bag" }, 3: { mode: "cards" } },
    examples: {
      1: {
        show: { kind: "math", lines: ["$P(\\text{even}) = \\frac{3}{6} = \\frac{1}{2}$"] },
        think: "A number cube has 6 equally likely outcomes, and 3 of them (2, 4, 6) are even.",
      },
      2: {
        show: { kind: "math", lines: ["3 red, 5 blue, 2 green: $P(\\text{blue}) = \\frac{5}{10} = \\frac{1}{2}$"] },
        think: "There are $3 + 5 + 2 = 10$ marbles in all, and 5 of them are blue.",
      },
      3: {
        show: { kind: "math", lines: ["Cards 1 to 20: $P(\\text{prime}) = \\frac{8}{20} = \\frac{2}{5}$"] },
        think: "The primes up to 20 are 2, 3, 5, 7, 11, 13, 17, and 19, so 8 of the 20 cards are prime.",
      },
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
    counts: [8, 12, 14],
    columns: 2,
    generator: orderOfOperations,
    levels: {
      1: { operands: [3, 3], maxOperand: 12, parens: false, maxResult: 100 },
      2: { operands: [3, 4], maxOperand: 12, parens: true, maxResult: 150 },
      3: { operands: [4, 5], maxOperand: 20, parens: true, maxResult: 300 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$6 + 4 \\times 3 = 6 + 12 = 18$"] },
        think: "Multiply and divide before you add and subtract.",
      },
      2: {
        show: { kind: "math", lines: ["$(8 - 3) \\times 4 + 2 = 5 \\times 4 + 2 = 20 + 2 = 22$"] },
        think: "Parentheses first, then multiply and divide, then add and subtract from left to right.",
      },
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
    counts: [6, 8, 10],
    columns: 2,
    generator: primeFactorization,
    levels: {
      1: { mode: "classify", min: 2, max: 50 },
      2: { mode: "factorize", min: 4, max: 60 },
      3: { mode: "factorize", min: 20, max: 100 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$13$ → prime", "$15$ → composite $(3 \\times 5)$"] },
        think: "A prime number has exactly two factors: 1 and itself. 15 also has 3 and 5, so it is composite.",
      },
      2: {
        show: { kind: "math", lines: ["$36 = 4 \\times 9 = 2 \\times 2 \\times 3 \\times 3$"] },
        think: "Keep splitting into factors until every factor is prime.",
      },
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
    counts: [4, 6],
    columns: 2,
    generator: meanMedianModeRange,
    levels: {
      1: { size: [5, 5], maxValue: 12, oddOnly: true },
      2: { size: [6, 7], maxValue: 20, oddOnly: false },
      3: { size: [7, 9], maxValue: 50, oddOnly: false },
    },
    examples: {
      1: {
        show: { kind: "stats", data: [4, 7, 2, 7, 10] },
        think: "Order the data first: 2, 4, 7, 7, 10. The mean is $30 \\div 5 = 6$ and the median is the middle value.",
      },
      2: {
        show: { kind: "stats", data: [3, 8, 5, 8, 6, 12] },
        think: "Order the data: 3, 5, 6, 8, 8, 12. With an even count, the median is $(6 + 8) \\div 2 = 7$.",
      },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "rounding-decimals",
    title: { en: "Rounding Decimals", ko: "소수의 반올림" },
    description: {
      en: "Round decimals to the nearest whole number, tenth, or hundredth.",
      ko: "소수를 일의 자리, 소수 첫째 자리, 소수 둘째 자리까지 반올림하기",
    },
    instructions: "Round each number.",
    category: "소수",
    conceptCode: "dec-place-value",
    quarter: "Q2",
    counts: [4, 6, 8],
    columns: 2,
    generator: roundDecimals,
    levels: {
      1: { places: [0], maxScale: 2, wholeMax: 99, carry: false },
      2: { places: [1], maxScale: 3, wholeMax: 50, carry: false },
      3: { places: [0, 1, 2], maxScale: 3, wholeMax: 99, carry: true },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["Round $7.63$ to the nearest whole number: $7.63 \\rightarrow 8$"] },
        think: "Look at the tenths digit: $6 \\ge 5$, so round up to 8.",
      },
      2: {
        show: { kind: "math", lines: ["Round $3.248$ to the nearest tenth: $3.248 \\rightarrow 3.2$"] },
        think: "Look at the hundredths digit: $4 < 5$, so the tenths digit stays 2.",
      },
      3: {
        show: { kind: "math", lines: ["Round $4.97$ to the nearest tenth: $4.97 \\rightarrow 5.0$"] },
        think: "The hundredths digit is 7, so round up: 9 tenths and 1 more tenth make 10 tenths. Keep the 0 to show tenths.",
      },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "order-fractions-decimals",
    title: { en: "Ordering Fractions & Decimals", ko: "분수와 소수의 크기 순서" },
    description: {
      en: "Order decimals, fractions with unlike denominators, and lists that mix both.",
      ko: "소수, 분모가 다른 분수, 분수·소수가 섞인 수를 크기 순서대로 쓰기",
    },
    instructions: "Write the numbers in the order shown.",
    category: "분수",
    conceptCode: "frac-compare-order",
    quarter: "Q2",
    counts: [4, 6, 8],
    columns: 2,
    generator: orderValues,
    levels: {
      1: { values: { kind: "decimal", wholeMax: 3 }, direction: "asc" },
      2: { values: { kind: "fraction", denominators: [2, 3, 4, 5, 6, 8, 10, 12] }, direction: "asc" },
      3: { values: { kind: "mixed-forms" }, direction: "either" },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$0.405 < 0.45 < 0.5 < 0.54$"] },
        think: "Give every number three decimal places (0.405, 0.450, 0.500, 0.540), then compare them like whole numbers.",
      },
      2: {
        show: { kind: "math", lines: ["$\\frac{1}{3} < \\frac{5}{12} < \\frac{1}{2} < \\frac{3}{4}$"] },
        think: "Rename with the common denominator 12: $\\frac{4}{12}$, $\\frac{5}{12}$, $\\frac{6}{12}$, $\\frac{9}{12}$.",
      },
      3: {
        show: { kind: "math", lines: ["$1.2 < 1\\frac{1}{4} < 1.3 < 1\\frac{2}{5}$"] },
        think: "Write every number as a decimal: $1\\frac{1}{4} = 1.25$ and $1\\frac{2}{5} = 1.4$.",
      },
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
    counts: [8, 12],
    columns: 4,
    generator: multiplyDecimals,
    levels: {
      1: { aScale: 1, aWholeMax: 9, bScale: 0, bWholeMax: 9 },
      2: { aScale: 1, aWholeMax: 9, bScale: 1, bWholeMax: 9 },
      3: { aScale: 2, aWholeMax: 20, bScale: 1, bWholeMax: 9 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$2.4 \\times 3 = 7.2$"] },
        think: "Multiply as whole numbers: $24 \\times 3 = 72$. The factors have 1 decimal place, so the product does too.",
      },
      2: {
        show: { kind: "math", lines: ["$1.2 \\times 0.3 = 0.36$"] },
        think: "$12 \\times 3 = 36$. The factors have $1 + 1 = 2$ decimal places, so the product is $0.36$.",
      },
      3: {
        show: { kind: "math", lines: ["$3.15 \\times 0.4 = 1.26$"] },
        think: "$315 \\times 4 = 1{,}260$. Count $2 + 1 = 3$ decimal places: $1.260 = 1.26$.",
      },
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
    counts: [6, 9],
    columns: 3,
    generator: divideDecimals,
    levels: {
      1: { quotientScale: 1, quotientWholeMax: 20, divisorScale: 0, divisorMax: 9 },
      2: { quotientScale: 2, quotientWholeMax: 20, divisorScale: 0, divisorMax: 12 },
      3: { quotientScale: 1, quotientWholeMax: 20, divisorScale: 1, divisorMax: 9 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$8.4 \\div 4 = 2.1$"] },
        think: "Divide as whole numbers ($84 \\div 4 = 21$), then bring the decimal point straight up.",
      },
      2: {
        show: { kind: "math", lines: ["$7.56 \\div 6 = 1.26$"] },
        think: "$756 \\div 6 = 126$. Bring the decimal point straight up: $1.26$.",
      },
      3: {
        show: { kind: "math", lines: ["$2.4 \\div 0.6 = 24 \\div 6 = 4$"] },
        think: "Multiply both numbers by 10 so the divisor is a whole number, then divide.",
      },
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
    counts: [8, 12, 14],
    columns: 2,
    generator: addSubtractFractions,
    levels: {
      1: { denominators: [2, 3, 4, 6, 8, 12], like: false, relatedOnly: true, mixed: false, op: "mixed" },
      2: { denominators: FRACTION_DENS, like: false, mixed: false, op: "mixed" },
      3: { denominators: FRACTION_DENS, like: false, mixed: true, op: "mixed" },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$\\frac{1}{3} + \\frac{1}{6} = \\frac{2}{6} + \\frac{1}{6} = \\frac{3}{6} = \\frac{1}{2}$"] },
        think: "6 is a multiple of 3, so rename $\\frac{1}{3} = \\frac{2}{6}$ and add sixths.",
      },
      2: {
        show: { kind: "math", lines: ["$\\frac{3}{4} - \\frac{2}{5} = \\frac{15}{20} - \\frac{8}{20} = \\frac{7}{20}$"] },
        think: "Use a common denominator: $\\text{LCM}(4, 5) = 20$.",
      },
      3: {
        show: {
          kind: "math",
          lines: ["$2\\frac{1}{2} + 1\\frac{2}{3} = 2\\frac{3}{6} + 1\\frac{4}{6} = 3\\frac{7}{6} = 4\\frac{1}{6}$"],
        },
        think: "Rename both fractions as sixths and add. Then regroup: $\\frac{7}{6} = 1\\frac{1}{6}$.",
      },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "multiply-fraction-whole",
    title: { en: "Multiplying Fractions by Whole Numbers", ko: "(분수) × (자연수)" },
    description: {
      en: "Multiply whole numbers by unit fractions, fractions, and mixed numbers; simplify.",
      ko: "자연수와 단위분수·진분수·대분수의 곱셈 (기약분수로)",
    },
    instructions: "Multiply. Write each answer in simplest form.",
    category: "분수",
    conceptCode: "frac-mult",
    quarter: "Q3",
    counts: [12, 18, 21],
    columns: 3,
    generator: multiplyFractionWhole,
    levels: {
      1: { fraction: "unit", denominators: [2, 3, 4, 5, 6, 8, 10, 12], wholeMax: 12 },
      2: { fraction: "proper", denominators: [3, 4, 5, 6, 8, 10, 12], wholeMax: 10 },
      3: { fraction: "mixed", denominators: [2, 3, 4, 5, 6, 8], wholeMax: 6 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$6 \\times \\frac{1}{3} = \\frac{6}{3} = 2$"] },
        think: "6 groups of one third is 6 thirds, and 6 thirds make 2 wholes.",
      },
      2: {
        show: { kind: "math", lines: ["$4 \\times \\frac{2}{3} = \\frac{8}{3} = 2\\frac{2}{3}$"] },
        think: "Multiply the whole number by the numerator ($4 \\times 2 = 8$ thirds), then write it as a mixed number.",
      },
      3: {
        show: { kind: "math", lines: ["$2\\frac{1}{2} \\times 3 = \\frac{5}{2} \\times 3 = \\frac{15}{2} = 7\\frac{1}{2}$"] },
        think: "Change the mixed number to an improper fraction first, then multiply the numerator by the whole number.",
      },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "metric-units",
    title: { en: "Metric Unit Conversions", ko: "미터법 단위 환산" },
    description: {
      en: "Convert among kilometers, meters, centimeters, millimeters, kilograms, grams, liters, and milliliters.",
      ko: "km·m·cm·mm, kg·g, L·mL 사이의 단위 바꾸기 (소수 포함)",
    },
    instructions: "Fill in each box. 1 km = 1,000 m · 1 m = 100 cm · 1 cm = 10 mm · 1 kg = 1,000 g · 1 L = 1,000 mL",
    category: "측정",
    conceptCode: "meas-unit-conversion",
    quarter: "Q3",
    counts: [12, 18, 24],
    columns: 3,
    generator: convertUnits,
    levels: {
      1: { system: "metric", tasks: ["big-to-small"] },
      2: { system: "metric", tasks: ["decimal-to-small"] },
      3: { system: "metric", tasks: ["decimal-to-small", "small-to-big"] },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$4\\text{ km} = 4{,}000\\text{ m}$"] },
        think: "1 kilometer is 1,000 meters, so multiply: $4 \\times 1{,}000 = 4{,}000$.",
      },
      2: {
        show: { kind: "math", lines: ["$2.75\\text{ km} = 2{,}750\\text{ m}$"] },
        think: "To change to a smaller unit, multiply: $2.75 \\times 1{,}000 = 2{,}750$.",
      },
      3: {
        show: { kind: "math", lines: ["$850\\text{ cm} = 8.5\\text{ m}$"] },
        think: "To change to a bigger unit, divide: $850 \\div 100 = 8.5$.",
      },
    },
  }),
  defineWorksheet({
    grade: 5,
    slug: "triangle-angles",
    title: { en: "Triangle Angles & Classification", ko: "삼각형의 각과 분류" },
    description: {
      en: "Use the 180° angle sum to find missing angles, and classify triangles by angles and sides.",
      ko: "세 각의 합 180°로 모르는 각 구하기, 각과 변의 길이로 삼각형 분류하기",
    },
    instructions: "A triangle's angles add up to 180°. A square marks a 90° angle; ticks mark equal sides.",
    category: "도형",
    conceptCode: "geo-angle-triangle-classify",
    quarter: "Q4",
    counts: [4, 6],
    columns: 2,
    generator: triangleAngles,
    levels: {
      1: { tasks: ["missing"] },
      2: { tasks: ["missing-classify"] },
      3: { tasks: ["sides", "right-missing", "isosceles-base"] },
    },
    examples: {
      1: {
        show: {
          kind: "figure",
          figure: { type: "triangle", angles: [75, 57, 48], angleLabels: ["75°", "?", "48°"] },
          prompt: "? =",
          answer: "$57^\\circ$",
        },
        think: "The three angles of any triangle add up to $180^\\circ$, so subtract the two you know: $180^\\circ - 48^\\circ - 75^\\circ = 57^\\circ$.",
      },
      2: {
        show: {
          kind: "figure",
          figure: { type: "triangle", angles: [35, 90, 55], angleLabels: ["35°", "?", "55°"] },
          prompt: "? =",
          answer: "$90^\\circ$, right",
        },
        think: "$180^\\circ - 35^\\circ - 55^\\circ = 90^\\circ$. A $90^\\circ$ angle makes it right, an angle over $90^\\circ$ makes it obtuse, and three angles under $90^\\circ$ make it acute.",
      },
      3: {
        show: {
          kind: "figure",
          figure: { type: "triangle", angles: [40, 70, 70], angleLabels: ["40°", "?", "?"], ticks: [0, 1, 1] },
          prompt: "? =",
          answer: "$70^\\circ$",
        },
        think: "Isosceles: 2 equal sides, so the base angles are equal: $(180^\\circ - 40^\\circ) \\div 2 = 70^\\circ$. Equilateral: 3 equal sides. Scalene: no equal sides.",
      },
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
    counts: [4, 6, 8],
    columns: 2,
    generator: gcfLcm,
    levels: {
      1: { mode: "gcf", gcfMax: 50, lcmMax: 12 },
      2: { mode: "lcm", gcfMax: 50, lcmMax: 12 },
      3: { mode: "mixed", gcfMax: 100, lcmMax: 20 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$\\text{GCF}(24, 36) = 12$"] },
        think: "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. The greatest shared one is 12.",
      },
      2: {
        show: { kind: "math", lines: ["$\\text{LCM}(6, 8) = 24$"] },
        think: "Multiples of 6: 6, 12, 18, 24. Multiples of 8: 8, 16, 24. The first shared one is 24.",
      },
      3: {
        show: { kind: "math", lines: ["$\\text{GCF}(24, 36) = 12$", "$\\text{LCM}(6, 8) = 24$"] },
        think: "GCF: the greatest factor both numbers share. LCM: the smallest multiple both numbers share.",
      },
    },
  }),
  defineWorksheet({
    grade: 6,
    slug: "ratios-rates",
    title: { en: "Ratios & Unit Rates", ko: "비와 단위비율" },
    description: {
      en: "Simplify ratios, find equivalent ratios, and work out unit rates.",
      ko: "비를 간단히 하기, 같은 비의 빈칸 채우기, 단위비율 구하기",
    },
    instructions: "Answer each question. Write ratios in simplest form.",
    category: "수·연산",
    conceptCode: "word-ratio-rate",
    quarter: "Q2",
    counts: [4, 6, 8],
    columns: 2,
    generator: ratiosRates,
    levels: { 1: { tasks: ["simplify"] }, 2: { tasks: ["equivalent"] }, 3: { tasks: ["unit-rate"] } },
    examples: {
      1: {
        show: { kind: "math", lines: ["$12 : 18 = 2 : 3$"] },
        think: "The GCF of 12 and 18 is 6. Divide both terms by 6: $12 \\div 6 = 2$ and $18 \\div 6 = 3$.",
      },
      2: {
        show: { kind: "math", lines: ["$3 : 4 = 15 : 20$"] },
        think: "$4 \\times 5 = 20$, so multiply the first term by 5 too: $3 \\times 5 = 15$.",
      },
      3: {
        show: { kind: "math", lines: ["150 miles in 3 hours: $150 \\div 3 = 50$ miles per hour"] },
        think: "A unit rate is the amount for 1 unit. Divide the total by the number of units.",
      },
    },
  }),
  defineWorksheet({
    grade: 6,
    slug: "percents",
    title: { en: "Fractions, Decimals & Percents", ko: "분수·소수·백분율" },
    description: {
      en: "Convert among percents, decimals, and fractions, and find a percent of a number.",
      ko: "백분율·소수·분수 사이의 변환, 어떤 수의 몇 % 구하기",
    },
    instructions: "Write each number in the form asked for. Write fractions in simplest form.",
    category: "수·연산",
    conceptCode: "percent-basic",
    quarter: "Q2",
    counts: [9, 12, 15],
    columns: 3,
    generator: percents,
    levels: {
      1: { tasks: ["percent-to-decimal", "decimal-to-percent"] },
      2: { tasks: ["fraction-to-percent", "percent-to-fraction"] },
      3: { tasks: ["percent-of"] },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$45\\% = 0.45$", "$0.7 = 70\\%$"] },
        think: "Percent means out of 100, so $45\\% = \\frac{45}{100}$. Move the decimal point two places.",
      },
      2: {
        show: { kind: "math", lines: ["$\\frac{3}{5} = \\frac{60}{100} = 60\\%$", "$35\\% = \\frac{35}{100} = \\frac{7}{20}$"] },
        think: "Rename the fraction with a denominator of 100, or write the percent over 100 and simplify.",
      },
      3: {
        show: { kind: "math", lines: ["$25\\%$ of $80$: $\\frac{1}{4} \\times 80 = 20$"] },
        think: "$25\\% = \\frac{1}{4}$, so find one fourth of 80: $80 \\div 4 = 20$.",
      },
    },
  }),
  defineWorksheet({
    grade: 6,
    slug: "compare-rational-numbers",
    title: { en: "Comparing Rational Numbers", ko: "유리수의 크기 비교" },
    description: {
      en: "Compare fractions, mixed numbers, and decimals, including negative numbers.",
      ko: "분수·대분수·소수의 크기 비교 (음수 포함)",
    },
    instructions: "Write >, <, or = in each circle.",
    category: "수·연산",
    conceptCode: "ns-compare-rationals-signed",
    quarter: "Q2",
    counts: [12, 18, 21],
    columns: 3,
    generator: compareRationals,
    levels: {
      1: { denominators: [2, 3, 4, 5, 6, 8, 10, 12], wholeMax: 0, negatives: false },
      2: { denominators: [2, 3, 4, 5, 6, 8], wholeMax: 3, negatives: false },
      3: { denominators: [2, 3, 4, 5, 6, 8, 10], wholeMax: 2, negatives: true },
    },
    examples: {
      1: {
        show: { kind: "compare", left: "$\\frac{3}{5}$", right: "$0.62$", symbol: "<" },
        think: "Write the fraction as a decimal: $\\frac{3}{5} = 0.6$, and $0.60 < 0.62$.",
      },
      2: {
        show: { kind: "compare", left: "$2\\frac{3}{8}$", right: "$2.4$", symbol: "<" },
        think: "$\\frac{3}{8} = 0.375$, so $2\\frac{3}{8} = 2.375$, and $2.375 < 2.4$.",
      },
      3: {
        show: { kind: "compare", left: "$-\\frac{1}{2}$", right: "$-0.45$", symbol: "<" },
        think: "$-\\frac{1}{2} = -0.5$, which is farther left on the number line than $-0.45$, so it is less.",
      },
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
    counts: [8, 12, 16],
    columns: 2,
    generator: integerOperations,
    levels: {
      1: { ops: ["+", "-"], range: 20, terms: 2, absoluteValue: false },
      2: { ops: ["*", "/"], range: 12, terms: 2, absoluteValue: false },
      3: { ops: ["+", "-", "*", "/"], range: 12, terms: 3, absoluteValue: true },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$-7 + 4 = -3$", "$5 - (-3) = 5 + 3 = 8$"] },
        think: "Adding moves right on the number line. Subtracting a negative is the same as adding a positive.",
      },
      2: {
        show: { kind: "math", lines: ["$-6 \\times 4 = -24$", "$-18 \\div (-3) = 6$"] },
        think: "Same signs give a positive answer; different signs give a negative answer.",
      },
      3: {
        show: { kind: "math", lines: ["$\\lvert -8 \\rvert + (-3) \\times 2 = 8 + (-6) = 2$"] },
        think: "Absolute value first ($\\lvert -8 \\rvert = 8$), then multiply, then add.",
      },
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
    counts: [12, 18, 24],
    columns: 3,
    generator: exponents,
    levels: {
      1: { mode: "power", maxBase: 10, maxExponent: 4 },
      2: { mode: "powers-of-ten", maxBase: 10, maxExponent: 6 },
      3: { mode: "squares", maxBase: 20, maxExponent: 2 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$3^{4} = 3 \\times 3 \\times 3 \\times 3 = 81$"] },
        think: "The exponent tells how many times the base is used as a factor.",
      },
      2: {
        show: { kind: "math", lines: ["$10^{4} = 10{,}000$", "$5 \\times 10^{3} = 5{,}000$"] },
        think: "For a power of ten, the exponent is the number of zeros.",
      },
      3: {
        show: { kind: "math", lines: ["$14^{2} = 14 \\times 14 = 196$", "$\\boxed{12}^{2} = 144$"] },
        think: "A perfect square is a whole number times itself: $12 \\times 12 = 144$.",
      },
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
    counts: [8, 12, 16],
    columns: 2,
    generator: multiplyDivideFractions,
    levels: {
      1: { ops: ["*"], denominators: FRACTION_DENS, mixed: false },
      2: { ops: ["/"], denominators: FRACTION_DENS, mixed: false },
      3: { ops: ["*", "/"], denominators: [2, 3, 4, 5, 6, 8], mixed: true },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}$"] },
        think: "Multiply the numerators and the denominators, then simplify.",
      },
      2: {
        show: {
          kind: "math",
          lines: ["$\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times \\frac{2}{1} = \\frac{6}{4} = 1\\frac{1}{2}$"],
        },
        think: "Keep, change, flip: keep the first fraction, change ÷ to ×, and flip the second fraction.",
      },
      3: {
        show: {
          kind: "math",
          lines: ["$1\\frac{1}{2} \\times 2\\frac{2}{3} = \\frac{3}{2} \\times \\frac{8}{3} = \\frac{24}{6} = 4$"],
        },
        think: "Change mixed numbers to improper fractions first, then multiply and simplify.",
      },
    },
  }),
  defineWorksheet({
    grade: 6,
    slug: "evaluate-expressions",
    title: { en: "Evaluating Expressions", ko: "식의 값 구하기" },
    description: {
      en: "Substitute values for one or two variables and simplify.",
      ko: "문자에 수를 넣어 식의 값 구하기 (문자 1~2개)",
    },
    instructions: "Evaluate each expression for the given value.",
    category: "대수·패턴",
    conceptCode: "alg-expressions",
    quarter: "Q3",
    counts: [6, 8, 10],
    columns: 2,
    generator: evaluateExpressions,
    levels: { 1: { forms: ["linear"] }, 2: { forms: ["parens", "square"] }, 3: { forms: ["two-var"] } },
    examples: {
      1: {
        show: { kind: "math", lines: ["$3x + 5$ when $x = 4$: $3 \\times 4 + 5 = 17$"] },
        think: "Replace the variable with its value. $3x$ means 3 times $x$.",
      },
      2: {
        show: { kind: "math", lines: ["$3(n + 4)$ when $n = 5$: $3 \\times (5 + 4) = 27$"] },
        think: "Substitute, then follow the order of operations: parentheses first.",
      },
      3: {
        show: { kind: "math", lines: ["$4a - b^{2}$ when $a = 6$, $b = 3$: $4 \\times 6 - 3^{2} = 24 - 9 = 15$"] },
        think: "Substitute both values. Exponents come before multiplication and subtraction.",
      },
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
    counts: [9, 12, 15],
    columns: 3,
    generator: oneStepEquations,
    levels: {
      1: { ops: ["+", "-"], negative: false, max: 20 },
      2: { ops: ["*", "/"], negative: false, max: 12 },
      3: { ops: ["+", "-", "*", "/"], negative: true, max: 12 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$x + 7 = 15$", "$x = 15 - 7 = 8$"] },
        think: "Undo adding 7 by subtracting 7 from both sides. Check: $8 + 7 = 15$.",
      },
      2: {
        show: { kind: "math", lines: ["$4n = 36$", "$n = 36 \\div 4 = 9$"] },
        think: "Undo multiplying by 4: divide both sides by 4. Check: $4 \\times 9 = 36$.",
      },
      3: {
        show: { kind: "math", lines: ["$\\frac{m}{-3} = 4$", "$m = 4 \\times (-3) = -12$"] },
        think: "Undo dividing by −3: multiply both sides by −3. Check: $-12 \\div (-3) = 4$.",
      },
    },
  }),
  defineWorksheet({
    grade: 6,
    slug: "circles",
    title: { en: "Circumference & Area of Circles", ko: "원의 둘레와 넓이" },
    description: {
      en: "Find the radius, diameter, circumference, and area of circles using π ≈ 3.14.",
      ko: "π ≈ 3.14를 이용해 원의 반지름·지름·둘레·넓이 구하기",
    },
    instructions: "Use π ≈ 3.14. Include units in your answers.",
    category: "측정",
    conceptCode: "geo-circles",
    quarter: "Q4",
    counts: [4, 6, 8],
    columns: 2,
    generator: circles,
    levels: {
      1: { finds: ["r", "d"], maxRadius: 25 },
      2: { finds: ["C"], maxRadius: 20 },
      3: { finds: ["A"], maxRadius: 12 },
    },
    examples: {
      1: {
        show: { kind: "math", lines: ["$r = 7$ cm", "$d = 2 \\times 7 = 14$ cm"] },
        think: "The diameter goes all the way across the circle, so it is twice the radius.",
      },
      2: {
        show: { kind: "math", lines: ["$d = 10$ cm", "$C = \\pi \\times d$", "$3.14 \\times 10 = 31.4$ cm"] },
        think: "The circumference is π times the diameter. If you are given the radius, double it first.",
      },
      3: {
        show: { kind: "math", lines: ["$r = 5$ m", "$A = \\pi \\times r^{2}$", "$3.14 \\times 5^{2} = 3.14 \\times 25 = 78.5$ m²"] },
        think: "Square the radius first, then multiply by 3.14. Area is measured in square units.",
      },
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
