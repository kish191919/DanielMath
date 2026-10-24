import { pick, randInt, type Rng } from "../rng";
import {
  compareDecimals,
  compareR,
  decimalToString,
  fractionLatex,
  gcd,
  latexNumber,
  numberToWords,
  rescale,
  simplify,
  type Decimal,
} from "../math";
import type { Generator, Rational } from "../types";

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

export const fractionsDecimals: Generator<{
  to: readonly ("decimal" | "fraction")[];
  /** Each divides 1,000, so every value has an exact decimal of at most three places. */
  denominators: readonly number[];
  /** 0 = proper fractions only. */
  wholeMax: number;
}> = (rng, { to: directions, denominators, wholeMax }) => {
  const to = pick(rng, directions);
  for (;;) {
    const d = pick(rng, denominators);
    const n = randInt(rng, 1, d - 1);
    // Tenths and hundredths are shown as written (43/100); other fractions
    // start in simplest form, and 40/100 is really just tenths.
    if (to === "decimal" && (d === 100 ? n % 10 === 0 : d !== 10 && gcd(n, d) !== 1)) continue;
    const whole = randInt(rng, 0, wholeMax);
    const value: Rational = [whole * d + n, d];
    const decimal = decimalToString({ units: (value[0] * 1000) / d, scale: 3 });
    const fraction = whole ? `${whole}\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}}`;
    const [from, answer] = to === "decimal" ? [fraction, decimal] : [decimal, fractionLatex(value)];

    return {
      body: { kind: "text", text: `$${from} =$`, blank: "inline" },
      answer: `$${answer}$`,
      meta: { type: "convert", value: simplify(value), to },
    };
  }
};

const DECIMAL_PLACES = ["whole number", "tenth", "hundredth"] as const;

export const roundDecimals: Generator<{
  places: readonly (0 | 1 | 2)[];
  maxScale: number;
  wholeMax: number;
  /** Sometimes force a 9 before a round-up digit (4.97 → 5.0). */
  carry: boolean;
}> = (rng, { places, maxScale, wholeMax, carry }) => {
  const place = pick(rng, places);
  const scale = randInt(rng, place + 1, Math.max(place + 1, maxScale));
  let n = decimalToString(randomDecimal(rng, scale, 0, wholeMax), false);
  if (carry && rng() < 0.3) {
    const s = [...n];
    const kept = n.indexOf(".") + place - (place === 0 ? 1 : 0);
    const next = kept + (place === 0 ? 2 : 1);
    s[kept] = "9";
    s[next] = String(randInt(rng, 5, 9));
    n = s.join("");
  }
  const units = Number(n.replace(".", ""));
  const factor = 10 ** (scale - place);
  const r = units % factor;
  const rounded = (units - r + (r * 2 >= factor ? factor : 0)) / factor;
  const result = decimalToString({ units: rounded, scale: place }, false);

  return {
    body: { kind: "text", text: `Round $${n}$ to the nearest ${DECIMAL_PLACES[place]}.`, blank: "line" },
    answer: result,
    meta: { type: "decimal-rounding", n, places: place, result },
  };
};

export const compareRationals: Generator<{
  denominators: readonly number[];
  /** 0 = proper fractions only; otherwise mixed numbers or improper fractions. */
  wholeMax: number;
  negatives: boolean;
}> = (rng, { denominators, wholeMax, negatives }) => {
  for (;;) {
    const d = pick(rng, denominators);
    let n: number;
    do n = randInt(rng, 1, d - 1);
    while (gcd(n, d) !== 1);
    const whole = randInt(rng, 0, wholeMax);
    const fraction: Rational = [whole * d + n, d];
    // A decimal within a few hundredths of the fraction, so it takes a real
    // conversion to decide (sometimes exactly equal: 1/4 = 0.25).
    const scale = randInt(rng, 1, 2);
    const units = Math.round((fraction[0] * 10 ** scale) / d) + randInt(rng, -2, 2);
    if (units <= 0 || units % 10 === 0) continue;

    const items = [
      {
        value: fraction,
        latex: whole && rng() < 0.5 ? `\\frac{${fraction[0]}}{${d}}` : fractionLatex(fraction),
      },
      { value: [units, 10 ** scale] as Rational, latex: decimalToString({ units, scale }) },
    ];
    if (negatives) {
      // Mostly both negative — one negative side is a giveaway.
      const r = rng();
      const flip = r < 0.7 ? [0, 1] : r < 0.85 ? [randInt(rng, 0, 1)] : [];
      for (const i of flip) items[i] = { value: [-items[i].value[0], items[i].value[1]], latex: `-${items[i].latex}` };
    }
    const [left, right] = rng() < 0.5 ? items : [items[1], items[0]];
    const c = compareR(left.value, right.value);
    const symbol = c < 0 ? "<" : c > 0 ? ">" : "=";

    return {
      body: { kind: "compare", left: `$${left.latex}$`, right: `$${right.latex}$` },
      answer: symbol,
      meta: { type: "compare", left: left.value, right: right.value, symbol },
    };
  }
};

const PLACE_NAMES: [string, string][] = [
  ["tenth", "tenths"],
  ["hundredth", "hundredths"],
  ["thousandth", "thousandths"],
];

/** The value (0.07) or the place name (hundredths) of an underlined digit after the decimal point. */
export const decimalDigit: Generator<{ scales: readonly number[]; wholeMax: number; ask: "value" | "name" }> = (
  rng,
  { scales, wholeMax, ask },
) => {
  const n = decimalToString(randomDecimal(rng, pick(rng, scales), 0, wholeMax));
  const [whole, frac] = n.split(".");
  // A 0 has no value worth asking for, but it still has a place.
  const candidates = [...frac].map((_, i) => i).filter((i) => ask === "name" || frac[i] !== "0");
  const i = pick(rng, candidates);
  const shown = [...frac].map((d, k) => (k === i ? `\\underline{${d}}` : d)).join("");
  return {
    body: { kind: "text", text: `$${latexNumber(Number(whole))}.${shown}$`, blank: "inline" },
    answer: ask === "value" ? decimalToString({ units: Number(frac[i]), scale: i + 1 }) : PLACE_NAMES[i][1],
    meta: { type: "decimal-digit", n, place: i + 1, ask },
  };
};

/** 4.37 ↔ "four and thirty-seven hundredths". */
export const decimalInWords: Generator<{ scales: readonly number[]; wholeMax: number }> = (rng, { scales, wholeMax }) => {
  const d = randomDecimal(rng, pick(rng, scales), 0, wholeMax);
  const n = decimalToString(d);
  const whole = Math.floor(d.units / 10 ** d.scale);
  const frac = d.units % 10 ** d.scale;
  const words = `${whole ? `${numberToWords(whole)} and ` : ""}${numberToWords(frac)} ${PLACE_NAMES[d.scale - 1][frac === 1 ? 0 : 1]}`;
  const to = pick(rng, ["number", "words"] as const);
  return {
    body: {
      kind: "text",
      text: to === "number" ? `Write as a decimal: ${words}` : `Write in words: $${n}$`,
      blank: "line",
    },
    answer: to === "number" ? n : words,
    meta: { type: "decimal-words", n, to },
  };
};

/** 3.45 × 100 or 3.45 ÷ 100: the decimal point moves one place per zero. */
export const decimalPowersOfTen: Generator<{ op: "*" | "/"; powers: readonly number[] }> = (rng, { op, powers }) => {
  const p = pick(rng, powers);
  // Products stay under 1,000, so the plain answer never needs a comma.
  const d = randomDecimal(rng, randInt(rng, 1, 2), 0, op === "*" && p === 3 ? 0 : 9);
  const scale = op === "*" ? d.scale - p : d.scale + p;
  const result: Decimal = scale >= 0 ? { units: d.units, scale } : { units: d.units * 10 ** -scale, scale: 0 };
  return {
    body: {
      kind: "text",
      text: `$${decimalToString(d)} ${op === "*" ? "\\times" : "\\div"} ${latexNumber(10 ** p)} =$`,
      blank: "inline",
    },
    answer: decimalToString(result),
    meta: { type: "decimal-op", op, a: decimalToString(d), b: String(10 ** p), result: decimalToString(result) },
  };
};
