import { pick, randInt } from "../rng";
import type { Generator, WorksheetProblem } from "../types";

type Property = "commutative" | "identity" | "zero" | "associative" | "distributive";

// The test suite checks `lhs` with the answer substituted for x, so every
// sentence has exactly one number that makes it true.
function sentence(latex: string, lhs: string, rhs: number, solution: number): WorksheetProblem {
  return {
    body: { kind: "text", text: `$${latex}$`, blank: "none" },
    answer: String(solution),
    meta: { type: "equation", variable: "x", lhs, rhs, solution },
  };
}

/** Fill-in-the-box sentences for the properties of + or ×. Zero and distributive are × only. */
export const properties: Generator<{ op: "+" | "*"; kinds: readonly Property[] }> = (rng, { op, kinds }) => {
  const kind = pick(rng, kinds);
  const sym = op === "+" ? "+" : "\\times";
  const apply = (a: number, b: number) => (op === "+" ? a + b : a * b);

  if (kind === "commutative") {
    const max = op === "+" ? 99 : 10;
    const a = randInt(rng, 2, max);
    let b: number;
    do b = randInt(rng, 2, max);
    while (b === a);
    return sentence(`${a} ${sym} ${b} = ${b} ${sym} \\square`, `${b}${op}x`, apply(a, b), a);
  }

  if (kind === "identity") {
    const a = randInt(rng, 2, op === "+" ? 999 : 99);
    const id = op === "+" ? 0 : 1;
    const latex = rng() < 0.5 ? `${id} ${sym} ${a} = \\square` : `${a} ${sym} ${id} = \\square`;
    return sentence(latex, "x", a, a);
  }

  if (kind === "zero") {
    const a = randInt(rng, 2, 99);
    return sentence(rng() < 0.5 ? `0 \\times ${a} = \\square` : `${a} \\times 0 = \\square`, "x", 0, 0);
  }

  if (kind === "associative") {
    const max = op === "+" ? 50 : 5;
    const [a, b, c] = [randInt(rng, 2, max), randInt(rng, 2, max), randInt(rng, 2, max)];
    return sentence(
      `(${a} ${sym} ${b}) ${sym} ${c} = ${a} ${sym} (\\square ${sym} ${c})`,
      `${a}${op}(x${op}${c})`,
      apply(apply(a, b), c),
      b,
    );
  }

  // Distributive: 6 × 7 = 6 × 5 + 6 × □ — split the 7 into 5 and 2.
  const a = randInt(rng, 2, 9);
  const b = randInt(rng, 3, 10);
  const part = randInt(rng, 1, b - 1);
  return sentence(
    `${a} \\times ${b} = ${a} \\times ${part} + ${a} \\times \\square`,
    `${a}*${part}+${a}*x`,
    a * b,
    b - part,
  );
};

export const repeatedAddition: Generator<{ maxAddend: number; maxTimes: number }> = (
  rng,
  { maxAddend, maxTimes },
) => {
  const addend = randInt(rng, 2, maxAddend);
  const times = randInt(rng, 2, maxTimes);
  const sum = Array.from({ length: times }, () => addend).join(" + ");
  return {
    body: { kind: "text", text: `$${sum} = \\square \\times \\square = \\square$`, blank: "none" },
    answer: `$${times} \\times ${addend} = ${times * addend}$`,
    meta: { type: "repeated-addition", addend, times },
  };
};
