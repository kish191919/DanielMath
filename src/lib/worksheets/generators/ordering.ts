import { pick, randDigits, randInt, shuffle, type Rng } from "../rng";
import { compareR, decimalToString, fractionLatex, gcd, latexNumber } from "../math";
import type { Generator, Rational } from "../types";

type Item = { value: Rational; latex: string };

type ValueKind =
  | {
      kind: "whole";
      digits: readonly [number, number];
      /** Variations of one number (digits swapped or changed), so the order hinges on a middle place. */
      close: boolean;
      /** Close variations may also drop a digit (1,204,516 vs 120,456). */
      mixedLengths?: boolean;
    }
  | { kind: "decimal"; wholeMax: number }
  | { kind: "fraction"; denominators: readonly number[] }
  | { kind: "mixed-forms" };

function closeVariant(rng: Rng, base: number, mixedLengths: boolean): number {
  // Positions from 1 on, so the leading digit stays nonzero.
  const s = [...String(base)];
  const change = pick(rng, mixedLengths ? (["swap", "digit", "drop"] as const) : (["swap", "digit"] as const));
  const i = randInt(rng, 1, s.length - 1);
  if (change === "drop") s.splice(i, 1);
  else if (change === "swap" && i < s.length - 1) [s[i], s[i + 1]] = [s[i + 1], s[i]];
  else s[i] = String(randInt(rng, 0, 9));
  return Number(s.join(""));
}

function wholeItems(rng: Rng, v: Extract<ValueKind, { kind: "whole" }>): Item[] {
  for (;;) {
    let nums: number[];
    if (v.close) {
      const base = randDigits(rng, randInt(rng, v.digits[0], v.digits[1]));
      nums = [base, ...Array.from({ length: 3 }, () => closeVariant(rng, base, v.mixedLengths ?? false))];
    } else {
      nums = Array.from({ length: 4 }, () => randDigits(rng, randInt(rng, v.digits[0], v.digits[1])));
    }
    if (new Set(nums).size < 4) continue;
    return nums.map((n) => ({ value: [n, 1], latex: latexNumber(n) }));
  }
}

// Decimals built from the same two digits in different places (0.5, 0.45,
// 0.405, 0.54) — the classic "longer isn't bigger" trap.
function decimalItems(rng: Rng, wholeMax: number): Item[] {
  const whole = randInt(rng, 0, wholeMax);
  const a = randInt(rng, 1, 9);
  let b: number;
  do b = randInt(rng, 1, 9);
  while (b === a);
  const fracs = shuffle(rng, [`${a}`, `${a}${b}`, `${b}${a}`, `0${a}`, `${a}0${b}`, `${b}`, `0${b}${a}`, `${a}${b}${a}`]);
  return fracs.slice(0, 4).map((f) => ({
    value: [whole * 10 ** f.length + Number(f), 10 ** f.length],
    latex: `${whole}.${f}`,
  }));
}

function distinctFractions(rng: Rng, denominators: readonly number[], whole: number): Rational[] {
  const values: Rational[] = [];
  while (values.length < 4) {
    const d = pick(rng, denominators);
    let n: number;
    do n = randInt(rng, 1, d - 1);
    while (gcd(n, d) !== 1);
    const value: Rational = [whole * d + n, d];
    if (!values.some((v) => compareR(v, value) === 0)) values.push(value);
  }
  return values;
}

function fractionItems(rng: Rng, denominators: readonly number[]): Item[] {
  for (;;) {
    const values = distinctFractions(rng, denominators, 0);
    // Mostly unlike denominators, or it's just comparing numerators.
    if (new Set(values.map((v) => v[1])).size < 3) continue;
    return values.map((v) => ({ value: v, latex: fractionLatex(v) }));
  }
}

// Two decimals and two fractions (or mixed numbers) sharing a whole part.
// Denominators divide 1,000, so every value has an exact decimal.
function mixedFormItems(rng: Rng): Item[] {
  const whole = randInt(rng, 0, 2);
  const values = distinctFractions(rng, [2, 4, 5, 8, 10], whole);
  const forms = shuffle(rng, ["decimal", "decimal", "fraction", "fraction"] as const);
  return values.map((v, i) => ({
    value: v,
    latex:
      forms[i] === "decimal" ? decimalToString({ units: (v[0] * 1000) / v[1], scale: 3 }) : fractionLatex(v),
  }));
}

function makeItems(rng: Rng, values: ValueKind): Item[] {
  if (values.kind === "whole") return wholeItems(rng, values);
  if (values.kind === "decimal") return decimalItems(rng, values.wholeMax);
  if (values.kind === "fraction") return fractionItems(rng, values.denominators);
  return mixedFormItems(rng);
}

const isSorted = (items: Item[], sign: number) =>
  items.every((it, i) => i === 0 || sign * compareR(items[i - 1].value, it.value) < 0);

export const orderValues: Generator<{ values: ValueKind; direction: "asc" | "desc" | "either" }> = (
  rng,
  { values, direction: dirParam },
) => {
  const direction = dirParam === "either" ? pick(rng, ["asc", "desc"] as const) : dirParam;
  const sign = direction === "asc" ? 1 : -1;
  let items = makeItems(rng, values);
  // A list that is already in order (either way) gives the answer away.
  while (isSorted(items, 1) || isSorted(items, -1)) items = shuffle(rng, items);
  const sorted = [...items].sort((x, y) => sign * compareR(x.value, y.value));
  const span = (it: Item) => `$${it.latex}$`;

  return {
    body: {
      kind: "text",
      text: `${direction === "asc" ? "Least to greatest" : "Greatest to least"}: ${items.map(span).join("; ")}`,
      blank: "line",
    },
    answer: sorted.map(span).join(direction === "asc" ? " < " : " > "),
    meta: { type: "order", values: items.map((it) => it.value), direction },
  };
};
