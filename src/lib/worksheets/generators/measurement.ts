import { pick, randInt, type Rng } from "../rng";
import { decimalToString, formatNumber, latexNumber } from "../math";
import type { Generator, WorksheetProblem } from "../types";

type UnitPair = { big: string; small: string; factor: number };

const CUSTOMARY: UnitPair[] = [
  { big: "ft", small: "in", factor: 12 },
  { big: "yd", small: "ft", factor: 3 },
  { big: "yd", small: "in", factor: 36 },
  { big: "gal", small: "qt", factor: 4 },
  { big: "qt", small: "pt", factor: 2 },
  { big: "pt", small: "c", factor: 2 },
  { big: "gal", small: "pt", factor: 8 },
  { big: "qt", small: "c", factor: 4 },
  { big: "lb", small: "oz", factor: 16 },
];

const METRIC: UnitPair[] = [
  { big: "km", small: "m", factor: 1000 },
  { big: "m", small: "cm", factor: 100 },
  { big: "cm", small: "mm", factor: 10 },
  { big: "m", small: "mm", factor: 1000 },
  { big: "kg", small: "g", factor: 1000 },
  { big: "L", small: "mL", factor: 1000 },
];

type ConvertTask =
  /** 3 ft = □ in */
  | "big-to-small"
  /** 2 ft 5 in = □ in */
  | "mixed-to-small"
  /** 50 in = □ ft □ in */
  | "small-to-mixed"
  /** 48 in = □ ft, or 2,750 m = □ km (a decimal when the system is metric) */
  | "small-to-big"
  /** 2.75 km = □ m */
  | "decimal-to-small";

/** An amount as printed: plain text for the answer key, LaTeX for the sheet. */
type Amount = { value: string; unit: string };

// Whole parts get thousands separators; decimals here never reach 1,000.
const plain = (v: string) => (v.includes(".") ? v : formatNumber(Number(v)));
const latex = (v: string) => (v.includes(".") ? v : latexNumber(Number(v)));
const amountLatex = (a: Amount) => `${latex(a.value)}\\text{ ${a.unit}}`;
const blankLatex = (unit: string) => `\\square\\text{ ${unit}}`;

function problem(from: Amount[], to: Amount[]): WorksheetProblem {
  return {
    body: {
      kind: "text",
      text: `$${from.map(amountLatex).join("\\ ")} = ${to.map((a) => blankLatex(a.unit)).join("\\ ")}$`,
      blank: "none",
    },
    answer: to.map((a) => `${plain(a.value)} ${a.unit}`).join(" "),
    meta: {
      type: "unit-convert",
      from: from.map((a) => [a.value, a.unit]),
      result: to.map((a) => [a.value, a.unit]),
    },
  };
}

/** A decimal with 1 or 2 places (last digit nonzero) that times `factor` is whole. */
function metricDecimal(rng: Rng, factor: number): { units: number; scale: number } {
  const scale = Math.min(randInt(rng, 1, 2), Math.log10(factor));
  const units = randInt(rng, 0, 9) * 10 ** scale + randInt(rng, 0, 10 ** (scale - 1) - 1) * 10 + randInt(rng, 1, 9);
  return { units, scale };
}

export const convertUnits: Generator<{ system: "customary" | "metric"; tasks: readonly ConvertTask[] }> = (
  rng,
  { system, tasks },
) => {
  const task = pick(rng, tasks);
  const { big, small, factor } = pick(rng, system === "customary" ? CUSTOMARY : METRIC);
  const whole = (n: number, unit: string): Amount => ({ value: String(n), unit });

  if (task === "big-to-small") {
    const n = randInt(rng, 2, 12);
    return problem([whole(n, big)], [whole(n * factor, small)]);
  }
  if (task === "mixed-to-small" || task === "small-to-mixed") {
    const n = randInt(rng, 1, 9);
    const rest = randInt(rng, 1, factor - 1);
    const mixed = [whole(n, big), whole(rest, small)];
    const total = [whole(n * factor + rest, small)];
    return task === "mixed-to-small" ? problem(mixed, total) : problem(total, mixed);
  }

  if (system === "customary") {
    const n = randInt(rng, 2, 12);
    return problem([whole(n * factor, small)], [whole(n, big)]);
  }
  // Metric decimals: units × factor stays whole because scale ≤ log10(factor).
  const d = metricDecimal(rng, factor);
  const decimal: Amount = { value: decimalToString(d), unit: big };
  const smallAmount = whole((d.units * factor) / 10 ** d.scale, small);
  return task === "decimal-to-small" ? problem([decimal], [smallAmount]) : problem([smallAmount], [decimal]);
};

const CIRCLE_PARTS = { r: "radius", d: "diameter", C: "circumference", A: "area" } as const;

export const circles: Generator<{ finds: readonly ("r" | "d" | "C" | "A")[]; maxRadius: number }> = (
  rng,
  { finds, maxRadius },
) => {
  const find = pick(rng, finds);
  const unit = pick(rng, ["cm", "m", "mm", "in", "ft"] as const);
  // Radius and diameter questions give the other one; C and A may give either.
  const given = find === "r" ? "d" : find === "d" ? "r" : pick(rng, ["r", "d"] as const);
  const r = randInt(rng, 1, maxRadius);
  const value = given === "r" ? r : 2 * r;
  // π ≈ 3.14, kept as 314 hundredths so the answer is exact.
  const result =
    find === "r"
      ? String(r)
      : find === "d"
        ? String(2 * r)
        : decimalToString({ units: find === "C" ? 314 * 2 * r : 314 * r * r, scale: 2 });

  return {
    body: {
      kind: "text",
      text: `$${given} = ${value}\\text{ ${unit}}$. Find the ${CIRCLE_PARTS[find]}.`,
      blank: "line",
    },
    answer: `${result} ${unit}${find === "A" ? "²" : ""}`,
    meta: { type: "circle", given, value, find, result },
  };
};
