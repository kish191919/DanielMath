import { pick, randDigits, randInt } from "../rng";
import { formatNumber, latexNumber, numberToWords } from "../math";
import type { Generator, NumberForm } from "../types";

export const placeValue: Generator<{ digits: readonly [number, number] }> = (rng, { digits }) => {
  const len = randInt(rng, digits[0], digits[1]);
  const n = randDigits(rng, len);
  const str = String(n);
  // Only underline nonzero digits — "the value of the 0" isn't a useful question.
  const candidates = [...str].map((_, i) => i).filter((i) => str[i] !== "0");
  const i = pick(rng, candidates);
  const power = len - 1 - i;
  const value = Number(str[i]) * 10 ** power;

  // Built digit by digit so the underline and the thousands separators coexist.
  let latex = "";
  for (let k = 0; k < len; k++) {
    latex += k === i ? `\\underline{${str[k]}}` : str[k];
    const remaining = len - 1 - k;
    if (remaining > 0 && remaining % 3 === 0) latex += "{,}";
  }

  return {
    body: { kind: "text", text: `$${latex}$`, blank: "inline" },
    answer: formatNumber(value),
    meta: { type: "place-value", n, power, value },
  };
};

const PLACE_NAMES: Record<number, string> = {
  10: "ten",
  100: "hundred",
  1000: "thousand",
  10000: "ten thousand",
  100000: "hundred thousand",
};

export const rounding: Generator<{ digits: readonly [number, number]; places: readonly number[] }> = (
  rng,
  { digits, places },
) => {
  const place = pick(rng, places);
  // The number needs at least one more digit than the place it's rounded to.
  const len = randInt(rng, Math.max(digits[0], String(place).length + 1), digits[1]);
  let n: number;
  do n = randDigits(rng, len);
  while (n % place === 0);
  const r = n % place;
  const result = r * 2 >= place ? n - r + place : n - r;

  return {
    body: { kind: "text", text: `Round $${latexNumber(n)}$ to the nearest ${PLACE_NAMES[place]}.`, blank: "line" },
    answer: formatNumber(result),
    meta: { type: "rounding", n, place, result },
  };
};

export const compareWhole: Generator<{ digits: number; close: boolean }> = (rng, { digits, close }) => {
  const a = randDigits(rng, digits);
  let b: number;
  if (rng() < 0.1) {
    b = a;
  } else if (close) {
    // Change a single digit so the comparison hinges on place value.
    const s = [...String(a)];
    const i = randInt(rng, 0, digits - 1);
    let d: string;
    do d = String(randInt(rng, i === 0 ? 1 : 0, 9));
    while (d === s[i]);
    s[i] = d;
    b = Number(s.join(""));
  } else {
    do b = randDigits(rng, digits);
    while (b === a);
  }
  const symbol = a < b ? "<" : a > b ? ">" : "=";

  return {
    body: { kind: "compare", left: `$${latexNumber(a)}$`, right: `$${latexNumber(b)}$` },
    answer: symbol,
    meta: { type: "compare", left: [a, 1], right: [b, 1], symbol },
  };
};

/** Nonzero place values of n, largest first: 4305 → [4000, 300, 5]. */
function expandedParts(n: number): number[] {
  const digits = [...String(n)];
  return digits.map((d, i) => Number(d) * 10 ** (digits.length - 1 - i)).filter((v) => v > 0);
}

// Each term is its own `$...$` span, so a long expansion wraps between terms
// instead of running out of the cell.
function expandedLatex(n: number): string {
  const parts = expandedParts(n);
  return parts.map((p, i) => `$${latexNumber(p)}${i < parts.length - 1 ? " +" : ""}$`).join(" ");
}

type NumberFormTask = "to-expanded" | "to-standard" | "word-to-standard" | "to-word";

const FORM_TASKS: Record<NumberFormTask, { from: NumberForm; to: NumberForm }> = {
  "to-expanded": { from: "standard", to: "expanded" },
  "to-standard": { from: "expanded", to: "standard" },
  "word-to-standard": { from: "word", to: "standard" },
  "to-word": { from: "standard", to: "word" },
};

export const numberForms: Generator<{ tasks: readonly NumberFormTask[]; digits: readonly [number, number] }> = (
  rng,
  { tasks, digits },
) => {
  const task = pick(rng, tasks);
  let n: number;
  do {
    const s = [...String(randDigits(rng, randInt(rng, digits[0], digits[1])))];
    // Half the numbers get a zero digit — the place that drops out of the
    // expanded form is the point of the exercise.
    if (rng() < 0.5) s[randInt(rng, 1, s.length - 1)] = "0";
    n = Number(s.join(""));
  } while (expandedParts(n).length < 2);

  const standard = `$${latexNumber(n)}$`;
  const shown = { standard, expanded: expandedLatex(n), word: numberToWords(n) };
  const { from, to } = FORM_TASKS[task];

  return {
    body: { kind: "text", text: `Write in ${to} form: ${shown[from]}`, blank: "line" },
    answer: shown[to],
    meta: { type: "number-form", n, from, to },
  };
};

export const estimate: Generator<{
  cases: readonly { digits: number; place: number; op: "+" | "-" | "*" }[];
}> = (rng, { cases }) => {
  const { digits, place, op } = pick(rng, cases);
  const roundTo = (n: number) => Math.round(n / place) * place;
  for (;;) {
    let a = randDigits(rng, digits);
    // Products round only the big factor: 48 × 7 → 50 × 7.
    let b = op === "*" ? randInt(rng, 3, 9) : randDigits(rng, digits);
    // A number that is already round skips the step being practiced.
    if (a % place === 0 || (op !== "*" && b % place === 0)) continue;
    if (op === "-" && a < b) [a, b] = [b, a];
    const ra = roundTo(a);
    const rb = op === "*" ? b : roundTo(b);
    if (op === "-" && ra <= rb) continue;
    const result = op === "+" ? ra + rb : op === "-" ? ra - rb : ra * rb;
    const sym = op === "*" ? "\\times" : op;

    return {
      body: {
        kind: "text",
        text: `Nearest ${PLACE_NAMES[place]}: $${latexNumber(a)} ${sym} ${latexNumber(b)}$`,
        blank: "line",
      },
      answer: `$${latexNumber(ra)} ${sym} ${latexNumber(rb)} = ${latexNumber(result)}$`,
      meta: { type: "estimate", op, a, b, place, result },
    };
  }
};
