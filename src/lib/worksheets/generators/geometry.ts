import { pick, randInt, shuffle, type Rng } from "../rng";
import type { FigureSpec, Generator, WorksheetProblem } from "../types";

type TriangleTask =
  /** Two angles given, find the third. */
  | "missing"
  /** …then name it acute, right or obtuse. */
  | "missing-classify"
  /** Side lengths given: equilateral, isosceles or scalene. */
  | "sides"
  /** One acute angle of a right triangle given, find the other. */
  | "right-missing"
  /** Vertex angle of an isosceles triangle given, find a base angle. */
  | "isosceles-base";

type TriangleFigure = Extract<FigureSpec, { type: "triangle" }>;
type Three<T> = [T, T, T];

const deg = (n: number) => `$${n}^\\circ$`;

// Figure labels are SVG text, so plain characters rather than LaTeX.
const degLabel = (n: number) => `${n}°`;

const rotate = <T>(items: Three<T>, by: number): Three<T> => [items[by % 3], items[(by + 1) % 3], items[(by + 2) % 3]];

function angleKind(angles: number[]): string {
  const largest = Math.max(...angles);
  return largest === 90 ? "right" : largest > 90 ? "obtuse" : "acute";
}

// An even mix of acute, right and obtuse triangles, every angle at least 10°.
function triangle(rng: Rng): number[] {
  const kind = pick(rng, ["acute", "right", "obtuse"] as const);
  for (;;) {
    let angles: number[];
    if (kind === "right") {
      const a = randInt(rng, 10, 80);
      angles = [90, a, 90 - a];
    } else if (kind === "obtuse") {
      const big = randInt(rng, 95, 160);
      const a = randInt(rng, 10, 170 - big);
      angles = [big, a, 180 - big - a];
    } else {
      const a = randInt(rng, 20, 85);
      const b = randInt(rng, 20, 85);
      angles = [a, b, 180 - a - b];
    }
    if (angleKind(angles) === kind && angles.every((x) => x >= 10)) return shuffle(rng, angles);
  }
}

/** Interior angles, to 0.1°, of the triangle with these sides (law of cosines). */
function anglesFromSides([a, b, c]: number[]): Three<number> {
  const at = (opp: number, x: number, y: number) =>
    Math.round((Math.acos((x * x + y * y - opp * opp) / (2 * x * y)) * 1800) / Math.PI) / 10;
  return [at(a, b, c), at(b, a, c), at(c, a, b)];
}

function sidesProblem(rng: Rng): WorksheetProblem {
  const kind = rng() < 0.15 ? "equilateral" : pick(rng, ["isosceles", "scalene"] as const);
  let sides: number[];
  for (;;) {
    const a = randInt(rng, 3, 15);
    const b = randInt(rng, 3, 15);
    const c = randInt(rng, 3, 15);
    sides = kind === "equilateral" ? [a, a, a] : kind === "isosceles" ? [a, a, b] : [a, b, c];
    const distinct = new Set(sides).size;
    const [x, y, z] = [...sides].sort((p, q) => p - q);
    if (x + y > z && distinct === { equilateral: 1, isosceles: 2, scalene: 3 }[kind]) break;
  }
  sides = shuffle(rng, sides);
  const unit = pick(rng, ["cm", "in", "m", "ft"] as const);
  const [s0, s1, s2] = sides.map((s) => `${s} ${unit}`);

  return {
    body: {
      kind: "figure",
      figure: {
        type: "triangle",
        angles: anglesFromSides(sides),
        angleLabels: [null, null, null],
        sideLabels: [s0, s1, s2],
        flip: (sides[0] + sides[1]) % 2 === 1,
      },
      prompt: "Equilateral, isosceles, or scalene?",
    },
    answer: kind,
    meta: { type: "triangle", angles: null, sides, unknown: null, classify: "sides" },
  };
}

// Every figure is built from the numbers alone — no extra rng draws — so the
// problems (and the answers behind a printed QR code) are the same as when
// this sheet was text-only.
export const triangleAngles: Generator<{ tasks: readonly TriangleTask[] }> = (rng, { tasks }) => {
  const task = pick(rng, tasks);
  if (task === "sides") return sidesProblem(rng);

  if (task === "right-missing") {
    const a = randInt(rng, 15, 75);
    return {
      body: {
        kind: "figure",
        figure: {
          type: "triangle",
          angles: [90, a, 90 - a],
          angleLabels: [null, degLabel(a), "?"],
          right: 0,
          flip: a % 2 === 1,
        },
        prompt: "Find the missing angle.",
      },
      answer: deg(90 - a),
      meta: { type: "triangle", angles: [90, a, 90 - a], sides: null, unknown: 2, classify: null },
    };
  }

  if (task === "isosceles-base") {
    // An even vertex angle keeps the base angles whole.
    const vertex = 2 * randInt(rng, 10, 70);
    const base = (180 - vertex) / 2;
    return {
      body: {
        kind: "figure",
        figure: {
          type: "triangle",
          angles: [vertex, base, base],
          angleLabels: [degLabel(vertex), "?", "?"],
          ticks: [0, 1, 1],
        },
        prompt: "The triangle is isosceles. Find each base angle.",
      },
      answer: deg(base),
      meta: { type: "triangle", angles: [vertex, base, base], sides: null, unknown: 1, classify: null },
    };
  }

  const angles = triangle(rng);
  const unknown = randInt(rng, 0, 2);
  const known = angles.filter((_, i) => i !== unknown);
  const classify = task === "missing-classify";

  // Turning the figure moves the "?" around the triangle from sheet to sheet.
  const turn = (known[0] + known[1]) % 3;
  const figure: TriangleFigure = {
    type: "triangle",
    angles: rotate([known[0], known[1], angles[unknown]], turn),
    angleLabels: rotate([degLabel(known[0]), degLabel(known[1]), "?"], turn),
    flip: (known[0] + known[1]) % 2 === 1,
  };
  // A given right angle is shown the standard way, with a square.
  const right = figure.angles.findIndex((a, i) => a === 90 && figure.angleLabels[i] !== "?");
  if (right >= 0) {
    figure.right = right;
    figure.angleLabels[right] = null;
  }

  return {
    body: {
      kind: "figure",
      figure,
      prompt: classify ? "Find the missing angle. Acute, right, or obtuse?" : "Find the missing angle.",
    },
    answer: classify ? `${deg(angles[unknown])}, ${angleKind(angles)}` : deg(angles[unknown]),
    meta: { type: "triangle", angles, sides: null, unknown, classify: classify ? "angles" : null },
  };
};
