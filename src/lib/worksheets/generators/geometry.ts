import { pick, randInt, shuffle, type Rng } from "../rng";
import type { Generator, WorksheetProblem } from "../types";

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

const deg = (n: number) => `$${n}^\\circ$`;

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

  return {
    body: {
      kind: "text",
      text: `A triangle has sides of ${sides.map((s) => `${s} ${unit}`).join(", ")}. Classify it by its sides.`,
      blank: "line",
    },
    answer: kind,
    meta: { type: "triangle", angles: null, sides, unknown: null, classify: "sides" },
  };
}

export const triangleAngles: Generator<{ tasks: readonly TriangleTask[] }> = (rng, { tasks }) => {
  const task = pick(rng, tasks);
  if (task === "sides") return sidesProblem(rng);

  if (task === "right-missing") {
    const a = randInt(rng, 15, 75);
    return {
      body: { kind: "text", text: `A right triangle has an acute angle of ${deg(a)}. Find the other acute angle.`, blank: "line" },
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
        kind: "text",
        text: `An isosceles triangle has a vertex angle of ${deg(vertex)}. Find each base angle.`,
        blank: "line",
      },
      answer: deg(base),
      meta: { type: "triangle", angles: [vertex, base, base], sides: null, unknown: 1, classify: null },
    };
  }

  const angles = triangle(rng);
  const unknown = randInt(rng, 0, 2);
  const known = angles.filter((_, i) => i !== unknown);
  const classify = task === "missing-classify";

  return {
    body: {
      kind: "text",
      text:
        `A triangle has angles of ${deg(known[0])} and ${deg(known[1])}. ` +
        (classify ? "Find the third angle and classify the triangle by its angles." : "Find the third angle."),
      blank: "line",
    },
    answer: classify ? `${deg(angles[unknown])}, ${angleKind(angles)}` : deg(angles[unknown]),
    meta: { type: "triangle", angles, sides: null, unknown, classify: classify ? "angles" : null },
  };
};
