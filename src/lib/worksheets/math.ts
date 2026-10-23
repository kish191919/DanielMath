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
