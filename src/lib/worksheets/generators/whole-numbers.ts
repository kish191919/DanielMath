import { pick, randDigits, randInt, shuffle } from "../rng";
import { formatNumber, latexNumber, numberToWords } from "../math";
import type { Generator, NumberForm } from "../types";

// Built digit by digit so the underline and the thousands separators coexist.
function underlinedLatex(str: string, i: number): string {
  let latex = "";
  for (let k = 0; k < str.length; k++) {
    latex += k === i ? `\\underline{${str[k]}}` : str[k];
    const remaining = str.length - 1 - k;
    if (remaining > 0 && remaining % 3 === 0) latex += "{,}";
  }
  return latex;
}

export const placeValue: Generator<{ digits: readonly [number, number] }> = (rng, { digits }) => {
  const len = randInt(rng, digits[0], digits[1]);
  const n = randDigits(rng, len);
  const str = String(n);
  // Only underline nonzero digits — "the value of the 0" isn't a useful question.
  const candidates = [...str].map((_, i) => i).filter((i) => str[i] !== "0");
  const i = pick(rng, candidates);
  const power = len - 1 - i;
  const value = Number(str[i]) * 10 ** power;

  return {
    body: { kind: "text", text: `$${underlinedLatex(str, i)}$`, blank: "inline" },
    answer: formatNumber(value),
    meta: { type: "place-value", n, power, value },
  };
};

const PLACE_WORDS = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands", "millions"];

export const placeName: Generator<{ digits: readonly [number, number] }> = (rng, { digits }) => {
  const len = randInt(rng, digits[0], digits[1]);
  const n = randDigits(rng, len);
  // Zeros included: "the 0 is in the tens place" is still a fair question.
  const i = randInt(rng, 0, len - 1);
  const power = len - 1 - i;

  return {
    body: { kind: "text", text: `$${underlinedLatex(String(n), i)}$`, blank: "inline" },
    answer: PLACE_WORDS[power],
    meta: { type: "place-name", n, power },
  };
};

export const evenOdd: Generator<{ digits: readonly [number, number] }> = (rng, { digits }) => {
  const n = randDigits(rng, randInt(rng, digits[0], digits[1]));
  return {
    body: { kind: "text", text: `$${latexNumber(n)}$`, blank: "inline" },
    answer: n % 2 === 0 ? "even" : "odd",
    meta: { type: "parity", n },
  };
};

export const makeNumber: Generator<{ digits: readonly [number, number] }> = (rng, { digits }) => {
  const len = randInt(rng, digits[0], digits[1]);
  // Distinct digits; when a 0 is drawn it can't lead the least number.
  const ds = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len);
  const goal = pick(rng, ["greatest", "least"] as const);
  const sorted = [...ds].sort((a, b) => (goal === "greatest" ? b - a : a - b));
  if (sorted[0] === 0) [sorted[0], sorted[1]] = [sorted[1], sorted[0]];
  const result = Number(sorted.join(""));

  return {
    body: { kind: "text", text: `Use $${ds.join(",\\ ")}$ to make the ${goal} number.`, blank: "line" },
    answer: `$${latexNumber(result)}$`,
    meta: { type: "make-number", digits: ds, goal, result },
  };
};

const UNIT_WORDS: [string, string][] = [
  ["one", "ones"],
  ["ten", "tens"],
  ["hundred", "hundreds"],
  ["thousand", "thousands"],
  ["ten thousand", "ten thousands"],
  ["hundred thousand", "hundred thousands"],
];

const unitWord = (count: number, power: number) => UNIT_WORDS[power][count === 1 ? 0 : 1];

type PlaceTask = "to-smaller" | "to-larger" | "regroup";

export const convertPlaces: Generator<{ tasks: readonly PlaceTask[] }> = (rng, { tasks }) => {
  const task = pick(rng, tasks);
  // Hundreds or thousands, traded with a smaller place.
  const big = randInt(rng, 2, 3);
  let from: [number, number][];
  let to: number;
  let result: number;
  if (task === "to-smaller") {
    // 4 hundreds = □ tens
    const count = randInt(rng, 2, 9);
    to = randInt(rng, 0, big - 1);
    from = [[count, big]];
    result = count * 10 ** (big - to);
  } else if (task === "to-larger") {
    // 40 tens = □ hundreds
    const small = randInt(rng, 0, big - 1);
    result = randInt(rng, 2, 9);
    from = [[result * 10 ** (big - small), small]];
    to = big;
  } else {
    // 3 hundreds 4 tens = □ tens
    const a = randInt(rng, 1, 9);
    const b = randInt(rng, 1, 9);
    from = [
      [a, big],
      [b, big - 1],
    ];
    to = big - 1;
    result = a * 10 + b;
  }
  // Words outside the math, so a long sentence can wrap in its cell.
  const amount = ([count, power]: [number, number]) => `$${latexNumber(count)}$ ${unitWord(count, power)}`;

  return {
    body: {
      kind: "text",
      text: `${from.map(amount).join(" ")} = $\\square$ ${UNIT_WORDS[to][1]}`,
      blank: "none",
    },
    answer: formatNumber(result),
    meta: { type: "place-units", from, to, result },
  };
};

const PLACE_NAMES: Record<number, string> = {
  10: "ten",
  100: "hundred",
  1000: "thousand",
  10000: "ten thousand",
  100000: "hundred thousand",
};

export const rounding: Generator<{
  digits: readonly [number, number];
  places: readonly number[];
  /** Allow numbers as long as the place itself (47 or 682 to the nearest ten or hundred). */
  short?: boolean;
}> = (rng, { digits, places, short }) => {
  const place = pick(rng, places);
  // Otherwise the number has at least one more digit than the place it's rounded to.
  const len = randInt(rng, Math.max(digits[0], String(place).length + (short ? 0 : 1)), digits[1]);
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

/** 4305 → "4 thousands, 3 hundreds, 5 ones" (zero places left out, like the expanded form). */
function unitForm(n: number): string {
  const digits = [...String(n)].map(Number);
  return digits
    .map((d, i) => [d, digits.length - 1 - i] as [number, number])
    .filter(([d]) => d > 0)
    .map(([d, power]) => `${d} ${unitWord(d, power)}`)
    .join(", ");
}

type NumberFormTask = "to-expanded" | "to-standard" | "word-to-standard" | "to-word" | "to-unit" | "unit-to-standard";

const FORM_TASKS: Record<NumberFormTask, { from: NumberForm; to: NumberForm }> = {
  "to-expanded": { from: "standard", to: "expanded" },
  "to-standard": { from: "expanded", to: "standard" },
  "word-to-standard": { from: "word", to: "standard" },
  "to-word": { from: "standard", to: "word" },
  "to-unit": { from: "standard", to: "unit" },
  "unit-to-standard": { from: "unit", to: "standard" },
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
  const shown = { standard, expanded: expandedLatex(n), word: numberToWords(n), unit: unitForm(n) };
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
