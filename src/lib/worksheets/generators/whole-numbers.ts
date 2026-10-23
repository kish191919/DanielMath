import { pick, randDigits, randInt } from "../rng";
import { formatNumber, latexNumber } from "../math";
import type { Generator } from "../types";

export const placeValue: Generator<{ digits: readonly [number, number] }> = (rng, { digits }) => {
  const len = randInt(rng, digits[0], digits[1]);
  const n = randDigits(rng, len);
  const str = String(n);
  // Only underline nonzero digits — "the value of the 0" isn't a useful question.
  const candidates = [...str].map((_, i) => i).filter((i) => str[i] !== "0");
  const i = pick(rng, candidates);
  const power = len - 1 - i;
  const value = Number(str[i]) * 10 ** power;

  // Built digit by digit so the underline and the thousands separators coexist.
  let latex = "";
  for (let k = 0; k < len; k++) {
    latex += k === i ? `\\underline{${str[k]}}` : str[k];
    const remaining = len - 1 - k;
    if (remaining > 0 && remaining % 3 === 0) latex += "{,}";
  }

  return {
    body: { kind: "text", text: `$${latex}$`, blank: "inline" },
    answer: formatNumber(value),
    meta: { type: "place-value", n, power, value },
  };
};

const PLACE_NAMES: Record<number, string> = {
  10: "ten",
  100: "hundred",
  1000: "thousand",
  10000: "ten thousand",
  100000: "hundred thousand",
};

export const rounding: Generator<{ digits: readonly [number, number]; places: readonly number[] }> = (
  rng,
  { digits, places },
) => {
  const place = pick(rng, places);
  // The number needs at least one more digit than the place it's rounded to.
  const len = randInt(rng, Math.max(digits[0], String(place).length + 1), digits[1]);
  let n: number;
  do n = randDigits(rng, len);
  while (n % place === 0);
  const r = n % place;
  const result = r * 2 >= place ? n - r + place : n - r;

  return {
    body: { kind: "text", text: `Round $${latexNumber(n)}$ to the nearest ${PLACE_NAMES[place]}.`, blank: "line" },
    answer: formatNumber(result),
    meta: { type: "rounding", n, place, result },
  };
};

export const compareWhole: Generator<{ digits: number; close: boolean }> = (rng, { digits, close }) => {
  const a = randDigits(rng, digits);
  let b: number;
  if (rng() < 0.1) {
    b = a;
  } else if (close) {
    // Change a single digit so the comparison hinges on place value.
    const s = [...String(a)];
    const i = randInt(rng, 0, digits - 1);
    let d: string;
    do d = String(randInt(rng, i === 0 ? 1 : 0, 9));
    while (d === s[i]);
    s[i] = d;
    b = Number(s.join(""));
  } else {
    do b = randDigits(rng, digits);
    while (b === a);
  }
  const symbol = a < b ? "<" : a > b ? ">" : "=";

  return {
    body: { kind: "compare", left: `$${latexNumber(a)}$`, right: `$${latexNumber(b)}$` },
    answer: symbol,
    meta: { type: "compare", left: [a, 1], right: [b, 1], symbol },
  };
};
