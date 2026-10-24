import { pick, randInt, type Rng } from "../rng";
import { decimalToString, formatNumber, latexNumber } from "../math";
import type { FigureSpec, Generator, ShapeTask, WorksheetProblem } from "../types";

type UnitKind = "length" | "volume" | "weight";

type UnitPair = { big: string; small: string; factor: number; kind: UnitKind };

const CUSTOMARY: UnitPair[] = [
  { big: "ft", small: "in", factor: 12, kind: "length" },
  { big: "yd", small: "ft", factor: 3, kind: "length" },
  { big: "yd", small: "in", factor: 36, kind: "length" },
  { big: "gal", small: "qt", factor: 4, kind: "volume" },
  { big: "qt", small: "pt", factor: 2, kind: "volume" },
  { big: "pt", small: "c", factor: 2, kind: "volume" },
  { big: "gal", small: "pt", factor: 8, kind: "volume" },
  { big: "qt", small: "c", factor: 4, kind: "volume" },
  { big: "lb", small: "oz", factor: 16, kind: "weight" },
];

// Mass counts as "weight" here, so one filter covers both systems.
const METRIC: UnitPair[] = [
  { big: "km", small: "m", factor: 1000, kind: "length" },
  { big: "m", small: "cm", factor: 100, kind: "length" },
  { big: "cm", small: "mm", factor: 10, kind: "length" },
  { big: "m", small: "mm", factor: 1000, kind: "length" },
  { big: "kg", small: "g", factor: 1000, kind: "weight" },
  { big: "L", small: "mL", factor: 1000, kind: "volume" },
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

export const convertUnits: Generator<{
  system: "customary" | "metric";
  tasks: readonly ConvertTask[];
  /** Only these kinds of units (all of them if unset). */
  kinds?: readonly UnitKind[];
}> = (rng, { system, tasks, kinds }) => {
  const task = pick(rng, tasks);
  const pairs = system === "customary" ? CUSTOMARY : METRIC;
  const { big, small, factor } = pick(rng, kinds ? pairs.filter((p) => kinds.includes(p.kind)) : pairs);
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

// Every figure here is built from the numbers alone — no extra rng draws — so
// the problems (and the answers behind a printed QR code) are the same as when
// these sheets were written out in words.
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
      kind: "figure",
      figure: { type: "circle", segment: given, label: `${given} = ${value} ${unit}` },
      prompt: `Find the ${CIRCLE_PARTS[find]}.`,
    },
    answer: `${result} ${unit}${find === "A" ? "²" : ""}`,
    meta: { type: "circle", given, value, find, result },
  };
};

/** Area, perimeter and volume of a shape drawn with its measurements. */
export const shapeMeasures: Generator<{ tasks: readonly ShapeTask[]; max: number }> = (rng, { tasks, max }) => {
  const task = pick(rng, tasks);
  const unit = pick(rng, ["cm", "m", "in", "ft"] as const);
  const u = (n: number) => `${formatNumber(n)} ${unit}`;
  // Length is the longer side.
  const l = randInt(rng, 3, max);
  const w = randInt(rng, 2, l - 1);
  let figure: FigureSpec;
  let prompt: string;
  let given: number[];
  let result: number;
  let power: 1 | 2 | 3 = 2;

  switch (task) {
    case "rect-area":
    case "rect-perimeter":
      figure = { type: "rectangle", length: l, width: w, labels: [u(l), u(w)] };
      prompt = task === "rect-area" ? "Find the area." : "Find the perimeter.";
      given = [l, w];
      result = task === "rect-area" ? l * w : 2 * (l + w);
      if (task === "rect-perimeter") power = 1;
      break;
    case "square-area":
    case "square-perimeter":
      figure = { type: "rectangle", length: l, width: l, labels: [u(l), u(l)], square: true };
      prompt = task === "square-area" ? "Find the area." : "Find the perimeter.";
      given = [l];
      result = task === "square-area" ? l * l : 4 * l;
      if (task === "square-perimeter") power = 1;
      break;
    case "missing-side-area":
    case "missing-side-perimeter": {
      const area = task === "missing-side-area";
      figure = {
        type: "rectangle",
        length: l,
        width: w,
        labels: [u(l), "?"],
        inside: area ? `Area = ${u(l * w)}²` : `Perimeter = ${u(2 * (l + w))}`,
      };
      prompt = "Find the missing side.";
      given = [area ? l * w : 2 * (l + w), l];
      result = w;
      power = 1;
      break;
    }
    case "triangle-area":
    case "parallelogram-area": {
      // An even base keeps half of base × height whole.
      const b = task === "triangle-area" && l % 2 ? l + 1 : l;
      const h = randInt(rng, 2, max);
      // The sum picks the look: a third of the triangles are right triangles
      // (apex over one end), and either way the shape may lean left or right.
      const look = b + h;
      const triangle = task === "triangle-area";
      figure = {
        type: "base-height",
        shape: triangle ? "triangle" : "parallelogram",
        base: b,
        height: h,
        apex: triangle && look % 3 === 0 ? 0 : 0.3,
        labels: [u(b), u(h)],
        flip: look % 2 === 1,
      };
      prompt = "Find the area.";
      given = [b, h];
      result = triangle ? (b * h) / 2 : b * h;
      break;
    }
    case "prism-volume": {
      const h = randInt(rng, 2, max);
      figure = { type: "prism", length: l, width: w, height: h, labels: [u(l), u(w), u(h)] };
      prompt = "Find the volume.";
      given = [l, w, h];
      result = l * w * h;
      power = 3;
      break;
    }
  }

  return {
    body: { kind: "figure", figure, prompt },
    answer: `${u(result)}${power === 2 ? "²" : power === 3 ? "³" : ""}`,
    meta: { type: "measure", task, given, result, unit },
  };
};
