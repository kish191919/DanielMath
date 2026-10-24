import { pick, randInt, type Rng } from "../rng";
import { addR, compareR, divR, fractionLatex, gcd, mixedLatex, mulR, numberToWords, subR } from "../math";
import type { Generator, Rational } from "../types";

export const fractionModel: Generator<{
  denominators: readonly number[];
  improper: boolean;
  /** Shade exactly one part. */
  unit?: boolean;
}> = (rng, { denominators, improper, unit }) => {
  const parts = pick(rng, denominators);
  const shape = pick(rng, ["circle", "bar"] as const);
  const shaded = improper ? [parts, randInt(rng, 1, parts - 1)] : [unit ? 1 : randInt(rng, 1, parts - 1)];
  const total = shaded.reduce((s, x) => s + x, 0);
  // The model shows total/parts literally, so that's the answer (not reduced);
  // improper amounts also get the mixed-number form.
  const answer = improper
    ? `$\\frac{${total}}{${parts}}$ = $${mixedLatex(1, total - parts, parts)}$`
    : `$\\frac{${total}}{${parts}}$`;

  return {
    body: {
      kind: "figure",
      figure: { type: "fraction-model", shape, parts, shaded },
      prompt: improper ? "Improper fraction and mixed number:" : "Fraction shaded:",
    },
    answer,
    meta: { type: "fraction-value", value: [total, parts] },
  };
};

const DENOMINATOR_WORDS: Record<number, [string, string]> = {
  2: ["half", "halves"],
  3: ["third", "thirds"],
  4: ["fourth", "fourths"],
  5: ["fifth", "fifths"],
  6: ["sixth", "sixths"],
  7: ["seventh", "sevenths"],
  8: ["eighth", "eighths"],
  9: ["ninth", "ninths"],
  10: ["tenth", "tenths"],
  12: ["twelfth", "twelfths"],
};

/** 3/4 → "three-fourths", 1/2 → "one-half". */
function fractionWords(n: number, d: number): string {
  return `${numberToWords(n)}-${DENOMINATOR_WORDS[d][n === 1 ? 0 : 1]}`;
}

// Grade 3 names fractions as they are shown, so nothing here is simplified.
export const fractionInWords: Generator<{ denominators: readonly number[] }> = (rng, { denominators }) => {
  const d = pick(rng, denominators);
  const n = randInt(rng, 1, d - 1);
  const to = pick(rng, ["number", "words"] as const);
  const latex = `$\\frac{${n}}{${d}}$`;
  const words = fractionWords(n, d);
  return {
    body: {
      kind: "text",
      text: to === "number" ? `Write as a fraction: ${words}` : `Write in words: ${latex}`,
      blank: "line",
    },
    answer: to === "number" ? latex : words,
    meta: { type: "fraction-words", value: [n, d], to },
  };
};

export const unitFractionSums: Generator<{ denominators: readonly number[]; maxTerms: number }> = (
  rng,
  { denominators, maxTerms },
) => {
  const d = pick(rng, denominators);
  const n = randInt(rng, 2, Math.min(d, maxTerms));
  const sum = Array.from({ length: n }, () => `\\frac{1}{${d}}`).join(" + ");
  const fraction = `\\frac{${n}}{${d}}`;
  return rng() < 0.5
    ? {
        body: { kind: "text", text: `$${sum} =$`, blank: "inline" },
        answer: `$${fraction}$`,
        meta: { type: "unit-fraction-sum", value: [n, d], to: "fraction" },
      }
    : {
        body: { kind: "text", text: `Write $${fraction}$ as a sum of unit fractions.`, blank: "line" },
        answer: `$${sum}$`,
        meta: { type: "unit-fraction-sum", value: [n, d], to: "sum" },
      };
};

/** 6/8 = 3/4: reduce to simplest form. */
export const simplifyFraction: Generator<{ denominators: readonly number[]; maxFactor: number }> = (
  rng,
  { denominators, maxFactor },
) => {
  const d = pick(rng, denominators);
  const n = properNumerator(rng, d, true);
  const k = randInt(rng, 2, maxFactor);
  return {
    body: { kind: "text", text: `$\\frac{${n * k}}{${d * k}} =$`, blank: "inline" },
    answer: `$\\frac{${n}}{${d}}$`,
    meta: { type: "convert", value: [n, d], to: "fraction" },
  };
};

/** 12/4 = □, 3 = □/4, 2 = 6/□. */
export const fractionsAsWholes: Generator<{ denominators: readonly number[]; wholeMax: number }> = (
  rng,
  { denominators, wholeMax },
) => {
  const d = pick(rng, denominators);
  const w = randInt(rng, 1, wholeMax);
  const form = pick(rng, ["to-whole", "missing-num", "missing-den"] as const);
  if (form === "to-whole") {
    return {
      body: { kind: "text", text: `$\\frac{${w * d}}{${d}} = \\square$`, blank: "none" },
      answer: String(w),
      meta: { type: "equivalent", left: [w * d, d], right: [w, 1], missingPart: "num" },
    };
  }
  const missingPart = form === "missing-num" ? "num" : "den";
  const num = missingPart === "num" ? "\\square" : String(w * d);
  const den = missingPart === "den" ? "\\square" : String(d);
  return {
    body: { kind: "text", text: `$${w} = \\frac{${num}}{${den}}$`, blank: "none" },
    answer: String(missingPart === "num" ? w * d : d),
    meta: { type: "equivalent", left: [w, 1], right: [w * d, d], missingPart },
  };
};

export const compareFractions: Generator<{
  /** "mixed" alternates like denominators and like numerators. */
  mode: "like-den" | "like-num" | "unlike" | "mixed";
  denominators: readonly number[];
  /** Unlike denominators where one divides the other (1/3 vs 5/12). */
  relatedOnly?: boolean;
}> = (rng, { mode, denominators, relatedOnly }) => {
  const m = mode === "mixed" ? pick(rng, ["like-den", "like-num"] as const) : mode;
  let left: Rational;
  let right: Rational;
  if (m === "like-den") {
    let d: number;
    do d = pick(rng, denominators);
    while (d < 3);
    const a = randInt(rng, 1, d - 1);
    let b: number;
    do b = randInt(rng, 1, d - 1);
    while (b === a);
    left = [a, d];
    right = [b, d];
  } else if (m === "unlike") {
    // Different numerators and denominators: rename, or compare each to 1/2.
    let d1: number;
    let d2: number;
    let a: number;
    let b: number;
    do {
      d1 = pick(rng, denominators);
      d2 = pick(rng, denominators);
      a = randInt(rng, 1, d1 - 1);
      b = randInt(rng, 1, d2 - 1);
    } while (d1 === d2 || a === b || (relatedOnly && d1 % d2 !== 0 && d2 % d1 !== 0));
    left = [a, d1];
    right = [b, d2];
  } else {
    const d1 = pick(rng, denominators);
    let d2: number;
    do d2 = pick(rng, denominators);
    while (d2 === d1);
    const n = randInt(rng, 1, Math.min(d1, d2) - 1);
    left = [n, d1];
    right = [n, d2];
  }
  const c = compareR(left, right);
  const symbol = c < 0 ? "<" : c > 0 ? ">" : "=";

  return {
    body: {
      kind: "compare",
      left: `$\\frac{${left[0]}}{${left[1]}}$`,
      right: `$\\frac{${right[0]}}{${right[1]}}$`,
    },
    answer: symbol,
    meta: { type: "compare", left, right, symbol },
  };
};

export const equivalentFractions: Generator<{
  denominators: readonly number[];
  multipliers: readonly [number, number];
  direction: "up" | "down" | "mixed";
}> = (rng, { denominators, multipliers, direction }) => {
  const d = pick(rng, denominators);
  const n = properNumerator(rng, d, true);
  const k = randInt(rng, multipliers[0], multipliers[1]);
  const small: Rational = [n, d];
  const big: Rational = [n * k, d * k];
  const dir = direction === "mixed" ? pick(rng, ["up", "down"] as const) : direction;
  const [left, right] = dir === "up" ? [small, big] : [big, small];
  const missingPart = pick(rng, ["num", "den"] as const);
  const rightNum = missingPart === "num" ? "\\square" : String(right[0]);
  const rightDen = missingPart === "den" ? "\\square" : String(right[1]);

  return {
    body: {
      kind: "text",
      text: `$\\frac{${left[0]}}{${left[1]}} = \\frac{${rightNum}}{${rightDen}}$`,
      blank: "none",
    },
    answer: String(missingPart === "num" ? right[0] : right[1]),
    meta: { type: "equivalent", left, right, missingPart },
  };
};

type Operand = { latex: string; value: Rational };

/** Numerator in 1..den-1, optionally coprime with den so the fraction is already in simplest form. */
function properNumerator(rng: Rng, den: number, simplest: boolean): number {
  let num: number;
  do num = randInt(rng, 1, den - 1);
  while (simplest && gcd(num, den) !== 1);
  return num;
}

// Like-denominator problems keep any numerator (8/12 − 4/12 is normal
// practice); everywhere else operands start in simplest form, as printed
// worksheets do.
function fractionOperand(rng: Rng, den: number, mixed: boolean, simplest: boolean): Operand {
  const num = properNumerator(rng, den, simplest);
  const whole = mixed ? randInt(rng, 1, 5) : 0;
  return { latex: mixedLatex(whole, num, den), value: [whole * den + num, den] };
}

export const addSubtractFractions: Generator<{
  denominators: readonly number[];
  like: boolean;
  /** Unlike denominators where one divides the other (1/3 + 1/6) — the easier first step. */
  relatedOnly?: boolean;
  mixed: boolean;
  op: "+" | "-" | "mixed";
  /** Keep sums below 1 (like denominators only) for the first level. */
  properResult?: boolean;
}> = (rng, { denominators, like, relatedOnly, mixed, op: opParam, properResult }) => {
  const op = opParam === "mixed" ? pick(rng, ["+", "-"] as const) : opParam;
  for (;;) {
    const d1 = pick(rng, denominators);
    let d2 = d1;
    if (!like) {
      const partners = denominators.filter(
        (d) => d !== d1 && (!relatedOnly || d1 % d === 0 || d % d1 === 0),
      );
      if (partners.length === 0) continue;
      d2 = pick(rng, partners);
    }
    let x = fractionOperand(rng, d1, mixed, !like);
    let y = fractionOperand(rng, d2, mixed, !like);
    const c = compareR(x.value, y.value);
    if (c === 0) continue;
    if (op === "-" && c < 0) [x, y] = [y, x];
    const result = op === "+" ? addR(x.value, y.value) : subR(x.value, y.value);
    if (properResult && result[0] >= result[1]) continue;

    return {
      body: { kind: "text", text: `$${x.latex} ${op} ${y.latex} =$`, blank: "inline" },
      answer: `$${fractionLatex(result)}$`,
      meta: { type: "fraction-op", op, a: x.value, b: y.value, result },
    };
  }
};

export const multiplyDivideFractions: Generator<{
  ops: readonly ("*" | "/")[];
  denominators: readonly number[];
  mixed: boolean;
}> = (rng, { ops, denominators, mixed }) => {
  const op = pick(rng, ops);
  const x = fractionOperand(rng, pick(rng, denominators), mixed, true);
  const y = fractionOperand(rng, pick(rng, denominators), mixed, true);
  const result = op === "*" ? mulR(x.value, y.value) : divR(x.value, y.value);

  return {
    body: { kind: "text", text: `$${x.latex} ${op === "*" ? "\\times" : "\\div"} ${y.latex} =$`, blank: "inline" },
    answer: `$${fractionLatex(result)}$`,
    meta: { type: "fraction-op", op, a: x.value, b: y.value, result },
  };
};

export const convertMixed: Generator<{
  to: readonly ("mixed" | "improper")[];
  denominators: readonly number[];
  wholeMax: number;
}> = (rng, { to: directions, denominators, wholeMax }) => {
  const to = pick(rng, directions);
  const d = pick(rng, denominators);
  const whole = randInt(rng, 1, wholeMax);
  // Now and then an improper fraction that is a whole number (12/4 = 3).
  const n = to === "mixed" && rng() < 0.1 ? 0 : properNumerator(rng, d, true);
  const value: Rational = [whole * d + n, d];
  const improper = `\\frac{${value[0]}}{${d}}`;
  const mixed = n === 0 ? String(whole) : mixedLatex(whole, n, d);
  const [from, answer] = to === "mixed" ? [improper, mixed] : [mixed, improper];

  return {
    body: { kind: "text", text: `$${from} =$`, blank: "inline" },
    answer: `$${answer}$`,
    meta: { type: "convert", value, to },
  };
};

export const multiplyFractionWhole: Generator<{
  fraction: "unit" | "proper" | "mixed";
  denominators: readonly number[];
  wholeMax: number;
}> = (rng, { fraction, denominators, wholeMax }) => {
  const d = pick(rng, denominators);
  const x: Operand =
    fraction === "unit" ? { latex: `\\frac{1}{${d}}`, value: [1, d] } : fractionOperand(rng, d, fraction === "mixed", true);
  const w = randInt(rng, 2, wholeMax);
  const whole: Operand = { latex: String(w), value: [w, 1] };
  // Both orders are common on worksheets: 6 × 1/3 and 1/3 × 6.
  const [a, b] = rng() < 0.5 ? [whole, x] : [x, whole];
  const result = mulR(a.value, b.value);

  return {
    body: { kind: "text", text: `$${a.latex} \\times ${b.latex} =$`, blank: "inline" },
    answer: `$${fractionLatex(result)}$`,
    meta: { type: "fraction-op", op: "*", a: a.value, b: b.value, result },
  };
};
