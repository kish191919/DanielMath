import { pick, randDigits, randInt, type Rng } from "../rng";
import { formatNumber } from "../math";
import type { Generator } from "../types";

// Digits (least significant first) for an a ± b pair that never carries or
// borrows — the "no regrouping" warm-up level.
function noRegroupPair(rng: Rng, topLen: number, bottomLen: number, op: "+" | "-"): [number, number] {
  let a = 0;
  let b = 0;
  for (let col = 0; col < topLen; col++) {
    const topLead = col === topLen - 1;
    const bottomLead = col === bottomLen - 1;
    let x: number;
    let y: number;
    if (col >= bottomLen) {
      x = randInt(rng, topLead ? 1 : 0, 9);
      y = 0;
    } else if (op === "+") {
      x = randInt(rng, topLead ? 1 : 0, bottomLead ? 8 : 9);
      y = randInt(rng, bottomLead ? 1 : 0, 9 - x);
    } else {
      x = randInt(rng, topLead || bottomLead ? 1 : 0, 9);
      y = randInt(rng, bottomLead ? 1 : 0, x);
    }
    a += x * 10 ** col;
    b += y * 10 ** col;
  }
  return [a, b];
}

export const addSubtract: Generator<{
  digits: readonly [number, number];
  op: "+" | "-" | "mixed";
  regroup: boolean;
}> = (rng, { digits, op: opParam, regroup }) => {
  const op = opParam === "mixed" ? pick(rng, ["+", "-"] as const) : opParam;
  let a: number;
  let b: number;
  // A difference of 0 (44 − 44) isn't practice.
  do {
    if (regroup) {
      a = randDigits(rng, digits[0]);
      b = randDigits(rng, digits[1]);
      if (op === "-" && a < b) [a, b] = [b, a];
    } else {
      [a, b] = noRegroupPair(rng, digits[0], digits[1], op);
    }
  } while (op === "-" && a === b);
  const result = op === "+" ? a + b : a - b;

  return {
    body: { kind: "vertical", operator: op === "+" ? "+" : "−", top: String(a), bottom: String(b), align: "right" },
    answer: formatNumber(result),
    meta: { type: "int-op", op, a, b, result, unknown: "result" },
  };
};

export const facts: Generator<{
  op: "*" | "/" | "mixed";
  min: number;
  max: number;
  missing: boolean;
}> = (rng, { op: opParam, min, max, missing }) => {
  const op = opParam === "mixed" ? pick(rng, ["*", "/"] as const) : opParam;
  const askMissing = missing && rng() < 0.5;
  // A missing factor next to 0 has no unique answer (0 × ? = 0), and a
  // divisor can never be 0, so those slots start at 1.
  const x = randInt(rng, askMissing ? Math.max(min, 1) : min, max);
  const y = randInt(rng, askMissing || op === "/" ? Math.max(min, 1) : min, max);

  if (op === "*") {
    const product = x * y;
    return askMissing
      ? {
          body: { kind: "text", text: `$${x} \\times \\square = ${product}$`, blank: "none" },
          answer: String(y),
          meta: { type: "int-op", op, a: x, b: y, result: product, unknown: "b" },
        }
      : {
          body: { kind: "text", text: `$${x} \\times ${y} =$`, blank: "inline" },
          answer: String(product),
          meta: { type: "int-op", op, a: x, b: y, result: product, unknown: "result" },
        };
  }

  const dividend = x * y;
  return askMissing
    ? {
        body: { kind: "text", text: `$${dividend} \\div \\square = ${x}$`, blank: "none" },
        answer: String(y),
        meta: { type: "int-op", op, a: dividend, b: y, result: x, unknown: "b" },
      }
    : {
        body: { kind: "text", text: `$${dividend} \\div ${y} =$`, blank: "inline" },
        answer: String(x),
        meta: { type: "int-op", op, a: dividend, b: y, result: x, unknown: "result" },
      };
};

export const multiply: Generator<{
  topDigits: number;
  bottomDigits: number;
  /** Put a 0 in the middle of the top number (e.g. 406 × 7) — a classic error spot. */
  zeroInTop?: boolean;
  /** Bottom number is a multiple of ten (e.g. 34 × 20). */
  bottomTens?: boolean;
}> = (rng, { topDigits, bottomDigits, zeroInTop, bottomTens }) => {
  let a = randDigits(rng, topDigits);
  if (zeroInTop && topDigits >= 3) {
    const s = [...String(a)];
    s[randInt(rng, 1, topDigits - 2)] = "0";
    a = Number(s.join(""));
  }
  const b = bottomTens
    ? randInt(rng, 1, 9) * 10
    : bottomDigits === 1
      ? randInt(rng, 2, 9)
      : randDigits(rng, bottomDigits);
  const result = a * b;

  return {
    body: { kind: "vertical", operator: "×", top: String(a), bottom: String(b), align: "right" },
    answer: formatNumber(result),
    meta: { type: "int-op", op: "*", a, b, result, unknown: "result" },
  };
};

export const longDivision: Generator<{
  dividendDigits: readonly [number, number];
  remainder: "none" | "some" | "mixed";
}> = (rng, { dividendDigits, remainder }) => {
  const divisor = randInt(rng, 2, 9);
  const len = randInt(rng, dividendDigits[0], dividendDigits[1]);
  const withRemainder = remainder === "some" || (remainder === "mixed" && rng() < 0.6);
  let dividend: number;
  for (;;) {
    dividend = randDigits(rng, len);
    const r = dividend % divisor;
    if (withRemainder ? r === 0 : r !== 0) {
      if (withRemainder) continue;
      dividend -= r;
    }
    if (String(dividend).length === len && dividend >= divisor * 2) break;
  }
  const quotient = Math.floor(dividend / divisor);
  const rem = dividend % divisor;

  return {
    body: { kind: "longdiv", divisor: String(divisor), dividend: String(dividend) },
    answer: rem ? `${formatNumber(quotient)} R${rem}` : formatNumber(quotient),
    meta: { type: "long-division", dividend, divisor, quotient, remainder: rem },
  };
};
