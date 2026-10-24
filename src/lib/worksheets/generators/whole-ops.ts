import { pick, randDigits, randInt, shuffle, type Rng } from "../rng";
import { formatNumber, latexNumber } from "../math";
import type { Generator, WorksheetProblem } from "../types";

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

/**
 * How many columns regroup: a column carries when its digits (plus any carry
 * coming in) sum past 9, and borrows when its top digit (less any borrow
 * already taken) is smaller.
 */
function regroupCount(a: number, b: number, op: "+" | "-"): number {
  let count = 0;
  let carry = 0;
  for (let p = 1; p <= Math.max(a, b); p *= 10) {
    const x = Math.floor(a / p) % 10;
    const y = Math.floor(b / p) % 10;
    carry = (op === "+" ? x + y + carry >= 10 : x - carry < y) ? 1 : 0;
    count += carry;
  }
  return count;
}

// Every digit between the lead and the ones is 0 (503, 7,006), and the ones
// digit below is bigger, so the borrow has to cross the zeros.
function acrossZerosPair(rng: Rng, topLen: number, bottomLen: number): [number, number] {
  for (;;) {
    const ones = randInt(rng, 0, 8);
    const a = randInt(rng, 1, 9) * 10 ** (topLen - 1) + ones;
    const b = randDigits(rng, bottomLen);
    if (b % 10 > ones && b < a) return [a, b];
  }
}

export const addSubtract: Generator<{
  digits: readonly [number, number];
  op: "+" | "-" | "mixed";
  regroup: boolean;
  /** With `regroup`: every problem regroups in at least this many columns. */
  minRegroups?: number;
  /** Subtraction from numbers like 400 or 503. */
  acrossZeros?: boolean;
}> = (rng, { digits, op: opParam, regroup, minRegroups = 0, acrossZeros }) => {
  const op = opParam === "mixed" ? pick(rng, ["+", "-"] as const) : opParam;
  let a: number;
  let b: number;
  // A difference of 0 (44 − 44) isn't practice.
  do {
    if (acrossZeros) {
      [a, b] = acrossZerosPair(rng, digits[0], digits[1]);
    } else if (regroup) {
      a = randDigits(rng, digits[0]);
      b = randDigits(rng, digits[1]);
      if (op === "-" && a < b) [a, b] = [b, a];
    } else {
      [a, b] = noRegroupPair(rng, digits[0], digits[1], op);
    }
  } while ((op === "-" && a === b) || (minRegroups > 0 && regroupCount(a, b, op) < minRegroups));
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

const SYMBOL = { "+": "+", "-": "-", "*": "\\times", "/": "\\div" } as const;

export const tableFacts: Generator<{
  op: "*" | "/";
  /** One factor (×) or the divisor (÷) comes from these tables; the other number runs to 10. */
  tables: readonly number[];
  /** Ask for the missing factor or divisor. Tables must not include 0 (0 × □ = 0 has no single answer). */
  missing?: boolean;
  /** Largest other factor or quotient. */
  max?: number;
}> = (rng, { op, tables, missing, max = 10 }) => {
  const k = pick(rng, tables);
  if (op === "/") {
    const q = randInt(rng, 1, max);
    const dividend = k * q;
    return missing
      ? {
          body: { kind: "text", text: `$${dividend} \\div \\square = ${q}$`, blank: "none" },
          answer: String(k),
          meta: { type: "int-op", op, a: dividend, b: k, result: q, unknown: "b" },
        }
      : {
          body: { kind: "text", text: `$${dividend} \\div ${k} =$`, blank: "inline" },
          answer: String(q),
          meta: { type: "int-op", op, a: dividend, b: k, result: q, unknown: "result" },
        };
  }

  const n = randInt(rng, missing ? 1 : 0, max);
  // Both orders, so 7 × 3 and 3 × 7 are practiced as the same fact.
  const tableFirst = rng() < 0.5;
  const [a, b] = tableFirst ? [k, n] : [n, k];
  const product = a * b;
  if (!missing) {
    return {
      body: { kind: "text", text: `$${a} \\times ${b} =$`, blank: "inline" },
      answer: String(product),
      meta: { type: "int-op", op, a, b, result: product, unknown: "result" },
    };
  }
  return {
    body: {
      kind: "text",
      text: tableFirst ? `$${k} \\times \\square = ${product}$` : `$\\square \\times ${k} = ${product}$`,
      blank: "none",
    },
    answer: String(n),
    meta: { type: "int-op", op, a, b, result: product, unknown: tableFirst ? "b" : "a" },
  };
};

export const multiplyTens: Generator<{ max: number }> = (rng, { max }) => {
  const x = randInt(rng, 2, max);
  const tens = randInt(rng, 1, 9) * 10;
  const [a, b] = rng() < 0.5 ? [x, tens] : [tens, x];
  return {
    body: { kind: "text", text: `$${a} \\times ${b} =$`, blank: "inline" },
    answer: formatNumber(a * b),
    meta: { type: "int-op", op: "*", a, b, result: a * b, unknown: "result" },
  };
};

/** 34 × 100 or 5,600 ÷ 100: whole numbers times or divided by 10, 100, or 1,000. */
export const powersOfTen: Generator<{ op: "*" | "/"; powers: readonly number[]; digits: readonly [number, number] }> = (
  rng,
  { op, powers, digits },
) => {
  const power = 10 ** pick(rng, powers);
  const n = randDigits(rng, randInt(rng, digits[0], digits[1]));
  const [a, b, result] = op === "*" ? [n, power, n * power] : [n * power, power, n];
  return {
    body: { kind: "text", text: `$${latexNumber(a)} ${SYMBOL[op]} ${latexNumber(b)} =$`, blank: "inline" },
    answer: formatNumber(result),
    meta: { type: "int-op", op, a, b, result, unknown: "result" },
  };
};

/** 6 × 400, 30 × 40, or 2,400 ÷ 6: a basic fact carried over to tens, hundreds, or thousands. */
export const factPowers: Generator<{
  op: "*" | "/";
  powers: readonly number[];
  /** Both factors end in zeros (30 × 40). */
  bothTens?: boolean;
  /** Largest digit in the basic fact. */
  factMax?: number;
}> = (rng, { op, powers, bothTens, factMax = 9 }) => {
  const x = randInt(rng, 2, factMax);
  const y = randInt(rng, 2, factMax);
  const big = y * 10 ** pick(rng, powers);
  if (op === "/") {
    const dividend = x * big;
    return {
      body: { kind: "text", text: `$${latexNumber(dividend)} \\div ${x} =$`, blank: "inline" },
      answer: formatNumber(big),
      meta: { type: "int-op", op, a: dividend, b: x, result: big, unknown: "result" },
    };
  }
  const small = bothTens ? x * 10 : x;
  const [a, b] = rng() < 0.5 ? [small, big] : [big, small];
  return {
    body: { kind: "text", text: `$${latexNumber(a)} \\times ${latexNumber(b)} =$`, blank: "inline" },
    answer: formatNumber(a * b),
    meta: { type: "int-op", op, a, b, result: a * b, unknown: "result" },
  };
};

type Op = keyof typeof SYMBOL;

// Two numbers for `op`: + and − within `max` (each part at least a tenth of
// it), × and ÷ within the `factMax` × `factMax` facts.
function opPair(rng: Rng, op: Op, max: number, factMax: number, zero: boolean): { a: number; b: number; result: number } {
  if (op === "+") {
    const result = randInt(rng, Math.ceil(max / 5), max);
    const a = randInt(rng, Math.ceil(result / 10), result - Math.ceil(result / 10));
    return { a, b: result - a, result };
  }
  if (op === "-") {
    const a = randInt(rng, Math.ceil(max / 5), max);
    const b = randInt(rng, Math.ceil(a / 10), a - Math.ceil(a / 10));
    return { a, b, result: a - b };
  }
  if (op === "*") {
    const a = randInt(rng, zero ? 0 : 1, factMax);
    const b = randInt(rng, zero ? 0 : 1, factMax);
    return { a, b, result: a * b };
  }
  const b = randInt(rng, 1, factMax);
  const result = randInt(rng, zero ? 0 : 1, factMax);
  return { a: b * result, b, result };
}

export const missingNumber: Generator<{
  ops: readonly Op[];
  /** Largest sum or starting number for + and −. */
  max: number;
  /** Largest factor, divisor or quotient for × and ÷. */
  factMax?: number;
}> = (rng, { ops, max, factMax = 10 }) => {
  const op = pick(rng, ops);
  const { a, b, result } = opPair(rng, op, max, factMax, false);
  const unknown = pick(rng, ["a", "b"] as const);
  const show = (n: number, hide: boolean) => (hide ? "\\square" : latexNumber(n));

  return {
    body: {
      kind: "text",
      text: `$${show(a, unknown === "a")} ${SYMBOL[op]} ${show(b, unknown === "b")} = ${latexNumber(result)}$`,
      blank: "none",
    },
    answer: formatNumber(unknown === "a" ? a : b),
    meta: { type: "int-op", op, a, b, result, unknown },
  };
};

export const fourOperations: Generator<{ addMax: number }> = (rng, { addMax }) => {
  const op = pick(rng, ["+", "-", "*", "/"] as const);
  const { a, b, result } = opPair(rng, op, addMax, 10, true);
  return {
    body: { kind: "text", text: `$${latexNumber(a)} ${SYMBOL[op]} ${latexNumber(b)} =$`, blank: "inline" },
    answer: formatNumber(result),
    meta: { type: "int-op", op, a, b, result, unknown: "result" },
  };
};

export const factFamily: Generator<{ max: number }> = (rng, { max }) => {
  const a = randInt(rng, 2, max);
  const b = randInt(rng, 2, max);
  const product = a * b;
  return rng() < 0.5
    ? {
        body: {
          kind: "text",
          text: `If $${a} \\times ${b} = ${product}$, then $${product} \\div ${b} = \\square$`,
          blank: "none",
        },
        answer: String(a),
        meta: { type: "int-op", op: "/", a: product, b, result: a, unknown: "result" },
      }
    : {
        body: {
          kind: "text",
          text: `If $${product} \\div ${a} = ${b}$, then $${a} \\times \\square = ${product}$`,
          blank: "none",
        },
        answer: String(b),
        meta: { type: "int-op", op: "*", a, b, result: product, unknown: "b" },
      };
};

function sumOrProduct(op: "+" | "*", values: number[]): WorksheetProblem {
  const result = values.reduce((s, v) => (op === "+" ? s + v : s * v));
  return {
    body: {
      kind: "text",
      text: `$${values.map(latexNumber).join(op === "+" ? " + " : " \\times ")} =$`,
      blank: "inline",
    },
    answer: formatNumber(result),
    meta: { type: "expression", expr: values.join(op), result },
  };
}

export const addThree: Generator<{ digits: readonly [number, number] }> = (rng, { digits }) =>
  sumOrProduct(
    "+",
    [0, 1, 2].map(() => randDigits(rng, randInt(rng, digits[0], digits[1]))),
  );

// Two small factors and one up to 10, in any order: 2 × 7 × 3.
export const multiplyThree: Generator<{ smallMax: number }> = (rng, { smallMax }) =>
  sumOrProduct(
    "*",
    shuffle(rng, [randInt(rng, 2, smallMax), randInt(rng, 2, smallMax), randInt(rng, 1, 10)]),
  );

export const multiply: Generator<{
  topDigits: number;
  bottomDigits: number;
  /** Put a 0 in the middle of the top number (e.g. 406 × 7) — a classic error spot. */
  zeroInTop?: boolean;
  /** Bottom number is a multiple of ten (e.g. 34 × 20). */
  bottomTens?: boolean;
  /** Range of a one-digit bottom number. */
  bottom?: readonly [number, number];
}> = (rng, { topDigits, bottomDigits, zeroInTop, bottomTens, bottom = [2, 9] }) => {
  let a = randDigits(rng, topDigits);
  if (zeroInTop && topDigits >= 3) {
    const s = [...String(a)];
    s[randInt(rng, 1, topDigits - 2)] = "0";
    a = Number(s.join(""));
  }
  const b = bottomTens
    ? randInt(rng, 1, 9) * 10
    : bottomDigits === 1
      ? randInt(rng, bottom[0], bottom[1])
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
  /** Range of the one-digit divisor. */
  divisors?: readonly [number, number];
}> = (rng, { dividendDigits, remainder, divisors = [2, 9] }) => {
  const divisor = randInt(rng, divisors[0], divisors[1]);
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
