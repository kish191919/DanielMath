import { pick, randInt, type Rng } from "../rng";
import { gcd, isPrime, lcm } from "../math";
import type { Generator, WorksheetProblem } from "../types";

function listWithAnd(items: number[]): string {
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export const factorPairs: Generator<{ min: number; max: number }> = (rng, { min, max }) => {
  let n: number;
  // Composite numbers with at least two pairs — "1 × 13" alone isn't practice.
  do n = randInt(rng, min, max);
  while (isPrime(n) || n < 4);
  const pairs: [number, number][] = [];
  for (let i = 1; i * i <= n; i++) if (n % i === 0) pairs.push([i, n / i]);

  return {
    body: { kind: "text", text: `List all the factor pairs of ${n}.`, blank: "line" },
    answer: pairs.map(([a, b]) => `$${a} \\times ${b}$`).join(", "),
    meta: { type: "factor-pairs", n, pairs },
  };
};

function gcfProblem(rng: Rng, count: 2 | 3, max: number): WorksheetProblem {
  // Built from a shared factor so the GCF is rarely 1 — "GCF = 1" every time
  // isn't practice.
  const shared = randInt(rng, 2, Math.max(2, Math.floor(max / 6)));
  const numbers: number[] = [];
  while (numbers.length < count) {
    const n = shared * randInt(rng, 1, Math.floor(max / shared));
    if (!numbers.includes(n)) numbers.push(n);
  }
  const result = numbers.reduce(gcd);
  return {
    body: { kind: "text", text: `Find the greatest common factor (GCF) of ${listWithAnd(numbers)}.`, blank: "line" },
    answer: String(result),
    meta: { type: "gcf", numbers, result },
  };
}

function lcmProblem(rng: Rng, max: number): WorksheetProblem {
  const a = randInt(rng, 2, max);
  let b: number;
  do b = randInt(rng, 2, max);
  while (b === a);
  const result = lcm(a, b);
  return {
    body: { kind: "text", text: `Find the least common multiple (LCM) of ${a} and ${b}.`, blank: "line" },
    answer: String(result),
    meta: { type: "lcm", numbers: [a, b], result },
  };
}

export const factorsGcf: Generator<
  { mode: "pairs"; min: number; max: number } | { mode: "gcf"; counts: readonly (2 | 3)[]; max: number }
> = (rng, params) =>
  params.mode === "pairs" ? factorPairs(rng, params) : gcfProblem(rng, pick(rng, params.counts), params.max);

export const gcfLcm: Generator<{ mode: "gcf" | "lcm" | "mixed"; gcfMax: number; lcmMax: number }> = (
  rng,
  { mode, gcfMax, lcmMax },
) => {
  const m = mode === "mixed" ? pick(rng, ["gcf", "lcm"] as const) : mode;
  return m === "gcf" ? gcfProblem(rng, 2, gcfMax) : lcmProblem(rng, lcmMax);
};

export const primeFactorization: Generator<{ mode: "classify" | "factorize"; min: number; max: number }> = (
  rng,
  { mode, min, max },
) => {
  if (mode === "classify") {
    const n = randInt(rng, Math.max(2, min), max);
    const prime = isPrime(n);
    return {
      body: { kind: "text", text: `Is ${n} prime or composite?`, blank: "line" },
      answer: prime ? "prime" : "composite",
      meta: { type: "prime-check", n, isPrime: prime },
    };
  }

  let n: number;
  do n = randInt(rng, Math.max(4, min), max);
  while (isPrime(n));
  const factors: number[] = [];
  let rest = n;
  for (let p = 2; rest > 1; p++) {
    while (rest % p === 0) {
      factors.push(p);
      rest /= p;
    }
  }
  return {
    body: { kind: "text", text: `Write the prime factorization of ${n}.`, blank: "line" },
    answer: `$${factors.join(" \\times ")}$`,
    meta: { type: "prime-factorization", n, factors },
  };
};
