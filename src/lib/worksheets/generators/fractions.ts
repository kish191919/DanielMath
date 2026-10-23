import { pick, randInt, type Rng } from "../rng";
import { addR, compareR, divR, fractionLatex, gcd, mixedLatex, mulR, subR } from "../math";
import type { Generator, Rational } from "../types";

export const fractionModel: Generator<{ denominators: readonly number[]; improper: boolean }> = (
  rng,
  { denominators, improper },
) => {
  const parts = pick(rng, denominators);
  const shape = pick(rng, ["circle", "bar"] as const);
  const shaded = improper ? [parts, randInt(rng, 1, parts - 1)] : [randInt(rng, 1, parts - 1)];
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

export const compareFractions: Generator<{
  mode: "like-den" | "like-num" | "mixed";
  denominators: readonly number[];
}> = (rng, { mode, denominators }) => {
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
