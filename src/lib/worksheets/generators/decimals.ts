import { pick, randInt, type Rng } from "../rng";
import { compareDecimals, decimalToString, rescale, type Decimal } from "../math";
import type { Generator } from "../types";

function randomDecimal(rng: Rng, scale: number, wholeMin: number, wholeMax: number): Decimal {
  const whole = randInt(rng, wholeMin, wholeMax);
  // Last digit nonzero so the printed operand has exactly `scale` places.
  const frac = scale === 0 ? 0 : randInt(rng, 0, 10 ** (scale - 1) - 1) * 10 + randInt(rng, 1, 9);
  return { units: whole * 10 ** scale + frac, scale };
}

export const compareDecimalNumbers: Generator<{
  scales: readonly number[];
  wholeMax: number;
  /** Mix place counts (0.5 vs 0.457) and include trailing-zero equalities (0.5 = 0.50). */
  tricky: boolean;
}> = (rng, { scales, wholeMax, tricky }) => {
  let a = randomDecimal(rng, pick(rng, scales), 0, wholeMax);
  let b: Decimal;
  let bText: string;
  // Grade 4 stops at thousandths, so the padded twin of a 3-place number is skipped.
  if (tricky && a.scale < 3 && rng() < 0.15) {
    b = { units: a.units * 10, scale: a.scale + 1 };
    bText = decimalToString(b, false);
  } else {
    // Same whole part, so the comparison is decided by the decimal places.
    const whole = Math.floor(a.units / 10 ** a.scale);
    do b = randomDecimal(rng, tricky ? pick(rng, scales) : a.scale, whole, whole);
    while (compareDecimals(a, b) === 0);
    bText = decimalToString(b);
  }
  let aText = decimalToString(a);
  if (rng() < 0.5) {
    [a, b] = [b, a];
    [aText, bText] = [bText, aText];
  }
  const c = compareDecimals(a, b);
  const symbol = c < 0 ? "<" : c > 0 ? ">" : "=";

  return {
    body: { kind: "compare", left: `$${aText}$`, right: `$${bText}$` },
    answer: symbol,
    meta: { type: "compare", left: [a.units, 10 ** a.scale], right: [b.units, 10 ** b.scale], symbol },
  };
};

export const addSubtractDecimals: Generator<{
  scales: readonly number[];
  wholeMax: number;
  op: "+" | "-" | "mixed";
  sameScale: boolean;
}> = (rng, { scales, wholeMax, op: opParam, sameScale }) => {
  const op = opParam === "mixed" ? pick(rng, ["+", "-"] as const) : opParam;
  const s1 = pick(rng, scales);
  const s2 = sameScale ? s1 : pick(rng, scales);
  let a = randomDecimal(rng, s1, 0, wholeMax);
  let b = randomDecimal(rng, s2, 0, wholeMax);
  if (op === "-" && compareDecimals(a, b) < 0) [a, b] = [b, a];
  const s = Math.max(a.scale, b.scale);
  const result: Decimal = {
    units: op === "+" ? rescale(a, s) + rescale(b, s) : rescale(a, s) - rescale(b, s),
    scale: s,
  };

  return {
    body: {
      kind: "vertical",
      operator: op === "+" ? "+" : "−",
      top: decimalToString(a),
      bottom: decimalToString(b),
      align: "decimal",
    },
    answer: decimalToString(result),
    meta: { type: "decimal-op", op, a: decimalToString(a), b: decimalToString(b), result: decimalToString(result) },
  };
};

export const multiplyDecimals: Generator<{
  aScale: number;
  aWholeMax: number;
  bScale: number;
  bWholeMax: number;
}> = (rng, { aScale, aWholeMax, bScale, bWholeMax }) => {
  // A whole-number factor starts at 2 (× 0 and × 1 aren't practice).
  const a = randomDecimal(rng, aScale, aScale === 0 ? 2 : 0, aWholeMax);
  const b = randomDecimal(rng, bScale, bScale === 0 ? 2 : 0, bWholeMax);
  const result: Decimal = { units: a.units * b.units, scale: a.scale + b.scale };

  return {
    body: { kind: "vertical", operator: "×", top: decimalToString(a), bottom: decimalToString(b), align: "right" },
    answer: decimalToString(result),
    meta: { type: "decimal-op", op: "*", a: decimalToString(a), b: decimalToString(b), result: decimalToString(result) },
  };
};

export const divideDecimals: Generator<{
  quotientScale: number;
  quotientWholeMax: number;
  divisorScale: 0 | 1;
  divisorMax: number;
}> = (rng, { quotientScale, quotientWholeMax, divisorScale, divisorMax }) => {
  // Built backwards from the quotient so every problem divides exactly.
  const quotient = randomDecimal(rng, quotientScale, quotientScale === 0 ? 1 : 0, quotientWholeMax);
  const divisor: Decimal =
    divisorScale === 0 ? { units: randInt(rng, 2, divisorMax), scale: 0 } : randomDecimal(rng, 1, 0, divisorMax);
  const dividend: Decimal = { units: quotient.units * divisor.units, scale: quotient.scale + divisor.scale };

  return {
    body: { kind: "longdiv", divisor: decimalToString(divisor), dividend: decimalToString(dividend) },
    answer: decimalToString(quotient),
    meta: {
      type: "decimal-op",
      op: "/",
      a: decimalToString(dividend),
      b: decimalToString(divisor),
      result: decimalToString(quotient),
    },
  };
};
