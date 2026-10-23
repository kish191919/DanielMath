import type { Rational } from "./types";

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

// ── Formatting ───────────────────────────────────────────────────────────────

/** Plain-text integer with thousands separators: 12345 → "12,345". */
export function formatNumber(n: number): string {
  const s = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return n < 0 ? `-${s}` : s;
}

/** Same as formatNumber, for use inside `$...$` — KaTeX needs `{,}` or it spaces the comma as punctuation. */
export function latexNumber(n: number): string {
  return formatNumber(n).replace(/,/g, "{,}");
}

/**
 * A dollar amount for use inside `$...$`. A bare `$` can't appear in sheet
 * text — MathText would pair it up as a math delimiter.
 */
export function moneyLatex(cents: number): string {
  return `\\text{\\textdollar}${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
}

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function wordsBelowThousand(n: number): string {
  const words: string[] = [];
  if (n >= 100) words.push(`${ONES[Math.floor(n / 100)]} hundred`);
  const rest = n % 100;
  if (rest >= 20) words.push(TENS[Math.floor(rest / 10)] + (rest % 10 ? `-${ONES[rest % 10]}` : ""));
  else if (rest > 0) words.push(ONES[rest]);
  return words.join(" ");
}

/** US word form, no "and": 42605 → "forty-two thousand, six hundred five". Up to 999,999. */
export function numberToWords(n: number): string {
  if (n === 0) return "zero";
  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  const parts: string[] = [];
  if (thousands) parts.push(`${wordsBelowThousand(thousands)} thousand`);
  if (rest) parts.push(wordsBelowThousand(rest));
  return parts.join(", ");
}

// ── Fractions ────────────────────────────────────────────────────────────────

export function simplify([n, d]: Rational): Rational {
  const g = gcd(n, d) || 1;
  const sign = d < 0 ? -1 : 1;
  return [(sign * n) / g, (sign * d) / g];
}

export function addR(a: Rational, b: Rational): Rational {
  return simplify([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);
}

export function subR(a: Rational, b: Rational): Rational {
  return simplify([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
}

export function mulR(a: Rational, b: Rational): Rational {
  return simplify([a[0] * b[0], a[1] * b[1]]);
}

export function divR(a: Rational, b: Rational): Rational {
  return simplify([a[0] * b[1], a[1] * b[0]]);
}

/** Negative if a < b, 0 if equal, positive if a > b. */
export function compareR(a: Rational, b: Rational): number {
  return a[0] * b[1] - b[0] * a[1];
}

/** LaTeX for a value in simplest form; improper values become mixed numbers. */
export function fractionLatex(r: Rational): string {
  const [n, d] = simplify(r);
  if (d === 1) return latexNumber(n);
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs > d) return `${sign}${Math.floor(abs / d)}\\frac{${abs % d}}{${d}}`;
  return `${sign}\\frac{${abs}}{${d}}`;
}

/** LaTeX for a problem operand written as a mixed number (whole may be 0). */
export function mixedLatex(whole: number, num: number, den: number): string {
  return whole === 0 ? `\\frac{${num}}{${den}}` : `${whole}\\frac{${num}}{${den}}`;
}

// ── Decimals ─────────────────────────────────────────────────────────────────
// Decimals are kept as an integer count of 10^-scale units (3.45 → 345 @ 2)
// so arithmetic is exact — no 0.1 + 0.2 float artifacts on an answer key.

export type Decimal = { units: number; scale: number };

export function rescale(d: Decimal, scale: number): number {
  return d.units * 10 ** (scale - d.scale);
}

export function compareDecimals(a: Decimal, b: Decimal): number {
  const s = Math.max(a.scale, b.scale);
  return rescale(a, s) - rescale(b, s);
}

/** `trim` drops trailing zeros (2.50 → 2.5); keep them when the zero is the point of the problem. */
export function decimalToString({ units, scale }: Decimal, trim = true): string {
  let s = Math.abs(units).toString().padStart(scale + 1, "0");
  if (scale > 0) s = `${s.slice(0, -scale)}.${s.slice(-scale)}`;
  if (trim && s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return (units < 0 ? "-" : "") + s;
}

// ── Worked examples ──────────────────────────────────────────────────────────
// The example box solves the numbers it shows, so the printed working can't
// drift from the arithmetic.

export type VerticalWork = {
  /** Carry written above each digit column of the top number, ones column first; null = none. */
  carries: (number | null)[];
  /** Shifted partial products, ones row first — only when the multiplier has 2+ nonzero digits. */
  partials: string[];
  /** Unformatted (no commas), keeping the operands' decimal places so columns line up. */
  result: string;
};

/** Digits of `s` with the decimal point removed and zeros appended up to `scale` places, ones column first. */
function columnDigits(s: string, scale: number): number[] {
  const frac = s.split(".")[1]?.length ?? 0;
  return [...(s.replace(".", "") + "0".repeat(scale - frac))].reverse().map(Number);
}

export function verticalWork(op: "+" | "−" | "×", top: string, bottom: string): VerticalWork {
  if (op === "×") {
    if (top.includes(".") || bottom.includes(".")) throw new Error("verticalWork: × takes whole numbers");
    const a = Number(top);
    const result = String(a * Number(bottom));
    const multiplier = columnDigits(bottom, 0);
    if (multiplier.length > 1) {
      const rows = multiplier.flatMap((d, j) => (d === 0 ? [] : [String(a * d * 10 ** j)]));
      return { carries: [], partials: rows.length > 1 ? rows : [], result };
    }
    const digits = columnDigits(top, 0);
    const carries: (number | null)[] = digits.map(() => null);
    let carry = 0;
    digits.forEach((d, k) => {
      carry = Math.floor((d * multiplier[0] + carry) / 10);
      if (carry && k + 1 < digits.length) carries[k + 1] = carry;
    });
    return { carries, partials: [], result };
  }

  const scale = Math.max(...[top, bottom].map((s) => s.split(".")[1]?.length ?? 0));
  const toUnits = (s: string) => Number(s.replace(".", "")) * 10 ** (scale - (s.split(".")[1]?.length ?? 0));
  const units = op === "+" ? toUnits(top) + toUnits(bottom) : toUnits(top) - toUnits(bottom);
  const result = decimalToString({ units, scale }, false);
  if (op === "−") return { carries: [], partials: [], result };

  const a = columnDigits(top, scale);
  const b = columnDigits(bottom, scale);
  const carries: (number | null)[] = a.map(() => null);
  let carry = 0;
  for (let k = 0; k < Math.max(a.length, b.length); k++) {
    carry = Math.floor(((a[k] ?? 0) + (b[k] ?? 0) + carry) / 10);
    if (carry && k + 1 < a.length) carries[k + 1] = carry;
  }
  return { carries, partials: [], result };
}

export type LongDivisionStep = {
  /** Dividend digit column (0 = leftmost) the product ends under. */
  col: number;
  product: number;
  /** Left after subtracting; the next dividend digit is brought down beside it. */
  difference: number;
};

export type LongDivisionWork = {
  quotient: number;
  remainder: number;
  /** Column of the quotient's first digit (no leading zeros). */
  firstCol: number;
  steps: LongDivisionStep[];
};

export function longDivisionSteps(dividend: number, divisor: number): LongDivisionWork {
  const digits = [...String(dividend)].map(Number);
  const steps: LongDivisionStep[] = [];
  let current = 0;
  let quotient = 0;
  let firstCol = -1;
  digits.forEach((d, col) => {
    current = current * 10 + d;
    // Wait until the divisor fits before writing the first quotient digit.
    if (firstCol < 0 && current < divisor && col < digits.length - 1) return;
    if (firstCol < 0) firstCol = col;
    const q = Math.floor(current / divisor);
    quotient = quotient * 10 + q;
    current -= q * divisor;
    steps.push({ col, product: q * divisor, difference: current });
  });
  return { quotient, remainder: current, firstCol, steps };
}

/** Mean, median, mode and range; the mode is the first most-frequent value in sorted order. */
export function describeData(data: readonly number[]) {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  const counts = new Map<number, number>();
  for (const v of sorted) counts.set(v, (counts.get(v) ?? 0) + 1);
  const [mode] = [...counts].reduce((best, cur) => (cur[1] > best[1] ? cur : best));
  return {
    sorted,
    mean: sorted.reduce((s, v) => s + v, 0) / n,
    median: n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
    mode,
    range: sorted[n - 1] - sorted[0],
  };
}
