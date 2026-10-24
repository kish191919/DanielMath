import { pick, randInt, type Rng } from "../rng";
import { latexNumber } from "../math";
import type { Generator, PatternRule, WorksheetProblem } from "../types";

function apply({ op, k }: PatternRule, x: number): number {
  return op === "+" ? x + k : op === "-" ? x - k : op === "*" ? x * k : x / k;
}

const RULE_WORDS: Record<PatternRule["op"], string> = {
  "+": "add",
  "-": "subtract",
  "*": "multiply by",
  "/": "divide by",
};

const list = (items: string[]) => items.join(",\\ ");

/** Two distinct indices in [from, to], ascending. */
function twoIndices(rng: Rng, from: number, to: number): number[] {
  const a = randInt(rng, from, to);
  let b: number;
  do b = randInt(rng, from, to);
  while (b === a);
  return [a, b].sort((x, y) => x - y);
}

function sequence(
  rng: Rng,
  ops: readonly ("+" | "-" | "*")[],
  length: number,
  gaps: "end" | "inside",
  skip: readonly number[] | undefined,
): WorksheetProblem {
  for (;;) {
    let op: PatternRule["op"];
    let rule: PatternRule;
    let start: number;
    if (skip) {
      // Skip-counting: add k, starting from a multiple of k.
      op = "+";
      rule = { op, k: pick(rng, skip) };
      start = rule.k * randInt(rng, 1, Math.max(1, Math.min(20, Math.floor(999 / rule.k) - length)));
    } else {
      op = pick(rng, ops);
      rule = { op, k: op === "*" ? randInt(rng, 2, 3) : randInt(rng, 2, 12) };
      start =
        op === "*"
          ? randInt(rng, 1, 6)
          : op === "-"
            ? randInt(rng, rule.k * (length - 1) + 1, rule.k * (length - 1) + 60)
            : randInt(rng, 1, 50);
    }
    const terms = [start];
    for (let i = 1; i < length; i++) terms.push(apply(rule, terms[i - 1]));
    // Sub-1,000 terms keep thousands commas out of a comma-separated list.
    if (terms[length - 1] >= 1000) continue;
    // The first two terms always show, so the rule can be found.
    const missing = gaps === "end" ? [length - 2, length - 1] : twoIndices(rng, 2, length - 1);
    const shown = terms.map((t, i) => (missing.includes(i) ? "\\square" : latexNumber(t)));

    return {
      body: { kind: "text", text: `$${list(shown)}$`, blank: "none" },
      answer: `$${list(missing.map((i) => latexNumber(terms[i])))}$ (${RULE_WORDS[op]} ${rule.k})`,
      meta: { type: "pattern", terms, rule, missing },
    };
  }
}

function table(rng: Rng, ops: readonly PatternRule["op"][], maxK: number, cells: number): WorksheetProblem {
  let rule: PatternRule;
  let inputs: number[];
  let outputs: number[];
  do {
    rule = { op: pick(rng, ops), k: randInt(rng, 2, maxK) };
    // Inputs climb by a steady step, so the table also reads as a pattern.
    const step = randInt(rng, 1, 3);
    const first = randInt(rng, rule.op === "-" ? rule.k + 1 : 1, rule.op === "-" ? rule.k + 10 : 10);
    const base = Array.from({ length: cells }, (_, i) => first + i * step);
    // Division tables are built from the quotients so every output is whole.
    inputs = rule.op === "/" ? base.map((q) => q * rule.k) : base;
    outputs = inputs.map((x) => apply(rule, x));
    // Two-digit entries keep the table inside a two-column cell.
  } while (Math.max(...inputs, ...outputs) >= 100);
  // The first pair always shows, plus at least two more to pin the rule down.
  const missing = twoIndices(rng, 1, cells - 1);
  const row = (label: string, values: string[]) => `\\text{${label}} & ${values.join(" & ")}`;
  const latex =
    `\\begin{array}{|c|${"c|".repeat(cells)}}\\hline ` +
    `${row("In", inputs.map(latexNumber))} \\\\ \\hline ` +
    `${row("Out", outputs.map((y, i) => (missing.includes(i) ? "\\square" : latexNumber(y))))} \\\\ \\hline ` +
    `\\end{array}`;

  return {
    body: { kind: "text", text: `$${latex}$`, blank: "line" },
    answer: `$${list(missing.map((i) => latexNumber(outputs[i])))}$ (rule: ${RULE_WORDS[rule.op]} ${rule.k})`,
    meta: { type: "function-table", inputs, outputs, rule, missing },
  };
}

export const numberPatterns: Generator<
  | {
      kind: "sequence";
      ops: readonly ("+" | "-" | "*")[];
      length: number;
      gaps: "end" | "inside";
      /** Skip-count by one of these instead of following `ops`. */
      skip?: readonly number[];
    }
  | { kind: "table"; ops: readonly PatternRule["op"][]; maxK: number; cells: number }
> = (rng, params) =>
  params.kind === "sequence"
    ? sequence(rng, params.ops, params.length, params.gaps, params.skip)
    : table(rng, params.ops, params.maxK, params.cells);
