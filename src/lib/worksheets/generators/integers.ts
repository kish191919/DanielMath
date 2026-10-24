import { randInt } from "../rng";
import type { Generator } from "../types";

export const compareIntegers: Generator<{ range: number }> = (rng, { range }) => {
  for (;;) {
    const a = randInt(rng, -range, range);
    // Now and then the same number twice, for an "=".
    const b = rng() < 0.1 ? a : randInt(rng, -range, range);
    // At least one negative, or it's whole-number comparing.
    if (a >= 0 && b >= 0) continue;
    const symbol = a < b ? "<" : a > b ? ">" : "=";
    return {
      body: { kind: "compare", left: `$${a}$`, right: `$${b}$` },
      answer: symbol,
      meta: { type: "compare", left: [a, 1], right: [b, 1], symbol },
    };
  }
};
