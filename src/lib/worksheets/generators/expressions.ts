import { pick, randInt, type Rng } from "../rng";
import { latexNumber } from "../math";
import type { Generator, WorksheetProblem } from "../types";

type Op = "+" | "-" | "*" | "/";

type Operand = { value: number; abs?: boolean };

// A flat expression `n0 op0 n1 op1 n2 ...`, optionally with one parenthesized
// run of operands [start, end]. Rendered to LaTeX for the sheet and to a JS
// string for the test suite, which evaluates it independently.
type Expression = { operands: Operand[]; ops: Op[]; paren: readonly [number, number] | null };

const LATEX_OP: Record<Op, string> = { "+": "+", "-": "-", "*": "\\times", "/": "\\div" };

function operandLatex(o: Operand, first: boolean): string {
  const n = latexNumber(o.value);
  if (o.abs) return `\\lvert ${n} \\rvert`;
  return o.value < 0 && !first ? `(${n})` : n;
}

function operandJs(o: Operand): string {
  return o.abs ? `Math.abs(${o.value})` : `(${o.value})`;
}

function render(e: Expression, part: (o: Operand, i: number) => string, op: (o: Op) => string): string {
  let s = "";
  e.operands.forEach((o, i) => {
    if (i > 0) s += ` ${op(e.ops[i - 1])} `;
    if (e.paren && e.paren[0] === i) s += "(";
    s += part(o, i);
    if (e.paren && e.paren[1] === i) s += ")";
  });
  return s;
}

const toLatex = (e: Expression) =>
  render(e, (o, i) => operandLatex(o, i === 0 || e.paren?.[0] === i), (op) => LATEX_OP[op]);
const toJs = (e: Expression) => render(e, operandJs, (op) => op);

// Exact evaluation with the usual precedence. Returns null when a division
// isn't exact, or — when `allowNegative` is off — any step goes below zero,
// so the generator can reject the draw.
function evaluate(e: Expression, allowNegative: boolean): number | null {
  const values = e.operands.map((o) => (o.abs ? Math.abs(o.value) : o.value));
  const apply = (a: number, op: Op, b: number): number | null => {
    if (op === "+") return a + b;
    if (op === "-") return !allowNegative && a - b < 0 ? null : a - b;
    if (op === "*") return a * b;
    return b !== 0 && a % b === 0 ? a / b : null;
  };
  const evalRange = (from: number, to: number): number | null => {
    // Collapse × and ÷ first, then + and −, both left to right.
    const terms: number[] = [values[from]];
    const addOps: Op[] = [];
    for (let i = from; i < to; i++) {
      const op = e.ops[i];
      if (op === "*" || op === "/") {
        const v = apply(terms[terms.length - 1], op, values[i + 1]);
        if (v === null) return null;
        terms[terms.length - 1] = v;
      } else {
        terms.push(values[i + 1]);
        addOps.push(op);
      }
    }
    let acc: number | null = terms[0];
    addOps.forEach((op, k) => {
      if (acc !== null) acc = apply(acc, op, terms[k + 1]);
    });
    return acc;
  };

  if (!e.paren) return evalRange(0, values.length - 1);
  const [ps, pe] = e.paren;
  const inner = evalRange(ps, pe);
  if (inner === null) return null;
  return evaluate(
    {
      operands: [
        ...e.operands.slice(0, ps),
        { value: inner },
        ...e.operands.slice(pe + 1),
      ],
      ops: [...e.ops.slice(0, ps), ...e.ops.slice(pe)],
      paren: null,
    },
    allowNegative,
  );
}

function expressionProblem(e: Expression, result: number): WorksheetProblem {
  return {
    body: { kind: "text", text: `$${toLatex(e)} =$`, blank: "inline" },
    answer: `$${latexNumber(result)}$`,
    meta: { type: "expression", expr: toJs(e), result },
  };
}

export const orderOfOperations: Generator<{
  operands: readonly [number, number];
  maxOperand: number;
  parens: boolean;
  maxResult: number;
}> = (rng, { operands, maxOperand, parens, maxResult }) => {
  for (;;) {
    const count = randInt(rng, operands[0], operands[1]);
    const ops = Array.from({ length: count - 1 }, () => pick(rng, ["+", "-", "*", "/"] as const));
    // Precedence only matters when both kinds of operation appear.
    const hasMulDiv = ops.some((o) => o === "*" || o === "/");
    const hasAddSub = ops.some((o) => o === "+" || o === "-");
    if (!hasMulDiv || !hasAddSub) continue;

    const e: Expression = {
      // Operands start at 2: "× 1" and "÷ 1" steps teach nothing.
      operands: Array.from({ length: count }, () => ({ value: randInt(rng, 2, maxOperand) })),
      ops,
      paren: null,
    };
    if (parens) {
      const start = randInt(rng, 0, count - 2);
      const end = randInt(rng, start + 1, Math.min(count - 1, start + 2));
      if (start === 0 && end === count - 1) continue;
      e.paren = [start, end];
    }
    const result = evaluate(e, false);
    if (result === null || result > maxResult) continue;
    // Parentheses that don't change the answer teach nothing.
    if (e.paren && evaluate({ ...e, paren: null }, false) === result) continue;
    return expressionProblem(e, result);
  }
};

/** Random integer with min ≤ |n| ≤ max and a random sign. */
function signed(rng: Rng, min: number, max: number): number {
  const n = randInt(rng, min, max);
  return rng() < 0.5 ? -n : n;
}

export const integerOperations: Generator<{
  ops: readonly Op[];
  range: number;
  terms: 2 | 3;
  absoluteValue: boolean;
}> = (rng, { ops: opChoices, range, terms, absoluteValue }) => {
  for (;;) {
    const ops = Array.from({ length: terms - 1 }, () => pick(rng, opChoices));
    const operands: Operand[] = Array.from({ length: terms }, () => ({ value: signed(rng, 2, range) }));
    // Make division exact by building the dividend from the quotient.
    ops.forEach((op, i) => {
      if (op === "/" && (i === 0 || ops[i - 1] !== "/")) operands[i].value = operands[i + 1].value * signed(rng, 1, range);
    });
    if (absoluteValue && rng() < 0.4) operands[randInt(rng, 0, terms - 1)].abs = true;
    // At least one negative operand, otherwise it's whole-number arithmetic.
    if (!operands.some((o) => o.value < 0)) continue;

    const e: Expression = { operands, ops, paren: null };
    const result = evaluate(e, true);
    if (result === null || Math.abs(result) > range * range * 2) continue;
    return expressionProblem(e, result);
  }
};

export const exponents: Generator<{
  mode: "power" | "powers-of-ten" | "squares";
  maxBase: number;
  maxExponent: number;
}> = (rng, { mode, maxBase, maxExponent }) => {
  if (mode === "power") {
    for (;;) {
      const base = randInt(rng, 2, maxBase);
      const exp = randInt(rng, 0, maxExponent);
      const result = base ** exp;
      if (result > 10000) continue;
      return {
        body: { kind: "text", text: `$${base}^{${exp}} =$`, blank: "inline" },
        answer: `$${latexNumber(result)}$`,
        meta: { type: "expression", expr: `${base}**${exp}`, result },
      };
    }
  }

  if (mode === "powers-of-ten") {
    const exp = randInt(rng, 1, maxExponent);
    const style = pick(rng, ["evaluate", "times", "missing"] as const);
    if (style === "missing") {
      const value = 10 ** exp;
      return {
        // Scriptsize keeps the answer box exponent-sized instead of a full-size box up in the air.
        body: { kind: "text", text: `$${latexNumber(value)} = 10^{\\scriptsize\\square}$`, blank: "none" },
        answer: String(exp),
        meta: { type: "equation", variable: "x", lhs: "10**x", rhs: value, solution: exp },
      };
    }
    const k = style === "times" ? randInt(rng, 2, 9) : 1;
    const result = k * 10 ** exp;
    return {
      body: {
        kind: "text",
        text: k === 1 ? `$10^{${exp}} =$` : `$${k} \\times 10^{${exp}} =$`,
        blank: "inline",
      },
      answer: `$${latexNumber(result)}$`,
      meta: { type: "expression", expr: `${k}*10**${exp}`, result },
    };
  }

  const base = randInt(rng, 2, maxBase);
  const square = base * base;
  return rng() < 0.5
    ? {
        body: { kind: "text", text: `$${base}^{2} =$`, blank: "inline" },
        answer: `$${latexNumber(square)}$`,
        meta: { type: "expression", expr: `${base}**2`, result: square },
      }
    : {
        body: { kind: "text", text: `$\\square^{2} = ${latexNumber(square)}$`, blank: "none" },
        answer: String(base),
        meta: { type: "equation", variable: "x", lhs: "x**2", rhs: square, solution: base },
      };
};

export const oneStepEquations: Generator<{
  ops: readonly Op[];
  negative: boolean;
  max: number;
}> = (rng, { ops, negative, max }) => {
  const v = pick(rng, ["x", "y", "n", "m", "k", "p"] as const);
  const op = pick(rng, ops);
  const a = negative ? signed(rng, 2, 12) : randInt(rng, 2, 12);
  let solution = negative ? signed(rng, 1, max) : randInt(rng, 1, max);
  let latex: string;
  let lhs: string;
  let rhs: number;

  if (op === "+") {
    latex = a < 0 ? `${v} - ${-a}` : `${v} + ${a}`;
    lhs = `${v}+(${a})`;
    rhs = solution + a;
  } else if (op === "-") {
    // Whole-number level keeps the right side positive.
    if (!negative) solution += a;
    latex = a < 0 ? `${v} - (${a})` : `${v} - ${a}`;
    lhs = `${v}-(${a})`;
    rhs = solution - a;
  } else if (op === "*") {
    latex = `${a}${v}`;
    lhs = `${a}*${v}`;
    rhs = a * solution;
  } else {
    // x ÷ a = q, written as a fraction; the solution is a·q.
    const q = solution;
    solution = a * q;
    latex = `\\frac{${v}}{${a}}`;
    lhs = `${v}/(${a})`;
    rhs = q;
  }

  return {
    body: { kind: "text", text: `$${latex} = ${rhs}$`, blank: "line" },
    answer: `$${v} = ${solution}$`,
    meta: { type: "equation", variable: v, lhs, rhs, solution },
  };
};

type EvalForm = "linear" | "parens" | "square" | "two-var";

// One expression shape: its LaTeX, the same thing as JS (for the test suite),
// and its value — or null when this draw doesn't fit (negative, inexact).
type Shape = { latex: string; js: string; value: number | null };

const VARIABLES = ["x", "y", "n", "m", "a", "b", "k", "p"] as const;

export const evaluateExpressions: Generator<{ forms: readonly EvalForm[] }> = (rng, { forms }) => {
  const form = pick(rng, forms);
  for (;;) {
    const v = pick(rng, VARIABLES);
    let w: string;
    do w = pick(rng, VARIABLES);
    while (w === v);
    const x = randInt(rng, 1, 12);
    const y = randInt(rng, 1, 10);
    const a = randInt(rng, 2, 9);
    const b = randInt(rng, 1, 20);

    const shapes: Record<EvalForm, Shape[]> = {
      linear: [
        { latex: `${a}${v} + ${b}`, js: `${a}*${v}+${b}`, value: a * x + b },
        { latex: `${a}${v} - ${b}`, js: `${a}*${v}-${b}`, value: a * x - b },
        { latex: `${b} + ${a}${v}`, js: `${b}+${a}*${v}`, value: b + a * x },
        { latex: `\\frac{${v}}{${a}} + ${b}`, js: `${v}/${a}+${b}`, value: x % a ? null : x / a + b },
      ],
      parens: [
        { latex: `${a}(${v} + ${b})`, js: `${a}*(${v}+${b})`, value: a * (x + b) },
        { latex: `${a}(${v} - ${b})`, js: `${a}*(${v}-${b})`, value: a * (x - b) },
        { latex: `(${v} + ${b}) \\div ${a}`, js: `(${v}+${b})/${a}`, value: (x + b) % a ? null : (x + b) / a },
      ],
      square: [
        { latex: `${v}^{2} + ${b}`, js: `${v}**2+${b}`, value: x * x + b },
        { latex: `${v}^{2} - ${b}`, js: `${v}**2-${b}`, value: x * x - b },
        { latex: `${a}${v}^{2}`, js: `${a}*${v}**2`, value: a * x * x },
      ],
      "two-var": [
        { latex: `${a}${v} + ${b}${w}`, js: `${a}*${v}+${b}*${w}`, value: a * x + b * y },
        { latex: `${a}${v} - ${w}`, js: `${a}*${v}-${w}`, value: a * x - y },
        { latex: `${v}${w} + ${b}`, js: `${v}*${w}+${b}`, value: x * y + b },
        { latex: `${a}(${v} + ${w})`, js: `${a}*(${v}+${w})`, value: a * (x + y) },
        { latex: `${v}^{2} - ${w}`, js: `${v}**2-${w}`, value: x * x - y },
      ],
    };
    const shape = pick(rng, shapes[form]);
    // Whole, positive answers only; a zero answer teaches nothing either.
    if (shape.value === null || shape.value <= 0) continue;
    const twoVars = form === "two-var";
    const vars: Record<string, number> = twoVars ? { [v]: x, [w]: y } : { [v]: x };

    return {
      body: {
        kind: "text",
        text: `$${shape.latex}$ when ${Object.entries(vars).map(([name, val]) => `$${name} = ${val}$`).join(", ")}`,
        blank: "line",
      },
      answer: `$${latexNumber(shape.value)}$`,
      meta: { type: "evaluate", expr: shape.js, vars, result: shape.value },
    };
  }
};
