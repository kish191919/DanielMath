import { pick, randInt, type Rng } from "../rng";
import { decimalToString, fractionLatex, gcd, latexNumber, moneyLatex, simplify } from "../math";
import type { Generator, Rational, WorksheetProblem } from "../types";

/** Two different numbers in 1..max with no common factor. */
function coprimePair(rng: Rng, max: number): [number, number] {
  for (;;) {
    const x = randInt(rng, 1, max);
    const y = randInt(rng, 1, max);
    if (x !== y && gcd(x, y) === 1) return [x, y];
  }
}

type RatioNotation = "colon" | "to" | "fraction";

function ratioText(notation: RatioNotation, a: number, b: number): string {
  if (notation === "to") return `${a} to ${b}`;
  return notation === "colon" ? `$${a} : ${b}$` : `$\\frac{${a}}{${b}}$`;
}

function simplifyRatio(rng: Rng): WorksheetProblem {
  const [x, y] = coprimePair(rng, 12);
  const g = randInt(rng, 2, 9);
  const notation = pick(rng, ["colon", "to", "fraction"] as const);
  return {
    body: { kind: "text", text: `Simplest form: ${ratioText(notation, x * g, y * g)}`, blank: "inline" },
    answer: ratioText(notation, x, y),
    meta: { type: "ratio", a: x * g, b: y * g, result: [x, y] },
  };
}

function equivalentRatio(rng: Rng): WorksheetProblem {
  const small: Rational = coprimePair(rng, 12);
  const k = randInt(rng, 2, 9);
  const big: Rational = [small[0] * k, small[1] * k];
  // Usually scale up (3 : 4 = □ : 20); sometimes down (15 : 20 = 3 : □).
  const [left, right] = rng() < 0.7 ? [small, big] : [big, small];
  const missingPart = pick(rng, ["num", "den"] as const);
  const shown = missingPart === "num" ? `\\square : ${right[1]}` : `${right[0]} : \\square`;
  return {
    body: { kind: "text", text: `$${left[0]} : ${left[1]} = ${shown}$`, blank: "none" },
    answer: String(missingPart === "num" ? right[0] : right[1]),
    meta: { type: "equivalent", left, right, missingPart },
  };
}

const RATES = [
  { what: "miles", per: "hour", pers: "hours", max: 70 },
  { what: "pages", per: "day", pers: "days", max: 40 },
  { what: "words", per: "minute", pers: "minutes", max: 90 },
  { what: "points", per: "game", pers: "games", max: 30 },
  { what: "laps", per: "week", pers: "weeks", max: 25 },
] as const;

const PRICES = [
  { per: "ticket", pers: "tickets" },
  { per: "pound", pers: "pounds" },
  { per: "notebook", pers: "notebooks" },
  { per: "bottle", pers: "bottles" },
] as const;

function unitRate(rng: Rng): WorksheetProblem {
  const count = randInt(rng, 2, 9);
  if (rng() < 0.4) {
    const { per, pers } = pick(rng, PRICES);
    const rate = randInt(rng, 10, 300) * 5;
    return {
      body: { kind: "text", text: `$${moneyLatex(rate * count)}$ for ${count} ${pers}. Find the unit rate.`, blank: "line" },
      answer: `$${moneyLatex(rate)}$ per ${per}`,
      meta: { type: "unit-rate", total: rate * count, count, rate, money: true },
    };
  }
  const { what, per, pers, max } = pick(rng, RATES);
  const rate = randInt(rng, 3, max);
  return {
    body: {
      kind: "text",
      text: `$${latexNumber(rate * count)}$ ${what} in ${count} ${pers}. Find the unit rate.`,
      blank: "line",
    },
    answer: `${rate} ${what} per ${per}`,
    meta: { type: "unit-rate", total: rate * count, count, rate, money: false },
  };
}

export const ratiosRates: Generator<{ tasks: readonly ("simplify" | "equivalent" | "unit-rate")[] }> = (
  rng,
  { tasks },
) => {
  const task = pick(rng, tasks);
  return task === "simplify" ? simplifyRatio(rng) : task === "equivalent" ? equivalentRatio(rng) : unitRate(rng);
};

type PercentTask =
  | "percent-to-decimal"
  | "decimal-to-percent"
  | "fraction-to-percent"
  | "percent-to-fraction"
  | "percent-of";

// Percents that make friendly "percent of" problems.
const PERCENT_OF = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];

export const percents: Generator<{ tasks: readonly PercentTask[] }> = (rng, { tasks }) => {
  const task = pick(rng, tasks);

  if (task === "percent-of") {
    const p = pick(rng, PERCENT_OF);
    // Multiples of 100 / gcd(p, 100) make p% of n whole.
    const step = 100 / gcd(p, 100);
    const n = step * randInt(rng, Math.ceil(10 / step), Math.floor(200 / step));
    const result = (p * n) / 100;
    return {
      body: { kind: "text", text: `$${p}\\%$ of $${n}$ =`, blank: "inline" },
      answer: `$${result}$`,
      meta: { type: "expression", expr: `${p}*${n}/100`, result },
    };
  }

  if (task === "fraction-to-percent") {
    const d = pick(rng, [2, 4, 5, 10, 20, 25, 50]);
    let n: number;
    do n = randInt(rng, 1, d - 1);
    while (gcd(n, d) !== 1);
    return {
      body: { kind: "text", text: `$\\frac{${n}}{${d}}$ as a percent:`, blank: "inline" },
      answer: `$${(n * 100) / d}\\%$`,
      meta: { type: "convert", value: [n, d], to: "percent" },
    };
  }

  if (task === "percent-to-fraction") {
    const p = 5 * randInt(rng, 1, 19);
    return {
      body: { kind: "text", text: `$${p}\\%$ as a fraction:`, blank: "inline" },
      answer: `$${fractionLatex([p, 100])}$`,
      meta: { type: "convert", value: simplify([p, 100]), to: "fraction" },
    };
  }

  // Up to 150% so values over 1 (1.25 = 125%) come up too.
  const p = randInt(rng, 1, 150);
  const decimal = decimalToString({ units: p, scale: 2 });
  const toDecimal = task === "percent-to-decimal";
  return {
    body: {
      kind: "text",
      text: toDecimal ? `$${p}\\%$ as a decimal:` : `$${decimal}$ as a percent:`,
      blank: "inline",
    },
    answer: toDecimal ? `$${decimal}$` : `$${p}\\%$`,
    meta: { type: "convert", value: simplify([p, 100]), to: toDecimal ? "decimal" : "percent" },
  };
};
