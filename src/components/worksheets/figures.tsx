// Print-first SVG figures for worksheet problems. Strokes use the navy-900
// text color via currentColor; shading is light enough to stay readable on a
// black-and-white printer.

import type { ReactNode } from "react";
import type { FigureSpec } from "@/lib/worksheets/types";

const SHADE = "#93afcf"; // navy-300

const r2 = (n: number) => Math.round(n * 100) / 100;

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [r2(cx + r * Math.sin(rad)), r2(cy - r * Math.cos(rad))];
}

export function AnalogClock({
  hour,
  minute,
  className = "h-28 w-28",
}: {
  hour: number;
  minute: number;
  className?: string;
}) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const [hx, hy] = polar(60, 60, 27, hourAngle);
  const [mx, my] = polar(60, 60, 41, minuteAngle);

  return (
    <svg viewBox="0 0 120 120" className={`${className} text-navy-900`} role="img" aria-label="Analog clock">
      <circle cx="60" cy="60" r="55" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        const [x1, y1] = polar(60, 60, major ? 47 : 50, i * 6);
        const [x2, y2] = polar(60, 60, 53, i * 6);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={major ? 2 : 0.8} />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = polar(60, 60, 38, (i + 1) * 30);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontWeight="600"
            fill="currentColor"
          >
            {i + 1}
          </text>
        );
      })}
      <line x1="60" y1="60" x2={hx} y2={hy} stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2={mx} y2={my} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="60" cy="60" r="3" fill="currentColor" />
    </svg>
  );
}

function FractionCircle({ parts, shaded }: { parts: number; shaded: number }) {
  const step = 360 / parts;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 text-navy-900">
      {Array.from({ length: parts }, (_, i) => {
        const [x1, y1] = polar(32, 32, 29, i * step);
        const [x2, y2] = polar(32, 32, 29, (i + 1) * step);
        return (
          <path
            key={i}
            d={`M32 32 L${x1} ${y1} A29 29 0 ${step > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
            fill={i < shaded ? SHADE : "white"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}

function FractionBar({ parts, shaded }: { parts: number; shaded: number }) {
  const w = 120 / parts;
  return (
    <svg viewBox="0 0 124 28" className="h-7 w-[124px] text-navy-900">
      {Array.from({ length: parts }, (_, i) => (
        <rect
          key={i}
          x={r2(2 + i * w)}
          y="2"
          width={r2(w)}
          height="24"
          fill={i < shaded ? SHADE : "white"}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

export function FractionModel({
  shape,
  parts,
  shaded,
}: {
  shape: "circle" | "bar";
  parts: number;
  shaded: number[];
}) {
  const Whole = shape === "circle" ? FractionCircle : FractionBar;
  return (
    <div
      className={shape === "circle" ? "flex gap-2" : "flex flex-col gap-1.5"}
      role="img"
      aria-label={`Fraction model with ${shaded.length} whole${shaded.length > 1 ? "s" : ""}`}
    >
      {shaded.map((s, i) => (
        <Whole key={i} parts={parts} shaded={s} />
      ))}
    </div>
  );
}

type Pt = [number, number];

const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
const cross = (a: Pt, b: Pt) => a[0] * b[1] - a[1] * b[0];
const unit = (a: Pt): Pt => mul(a, 1 / Math.hypot(a[0], a[1]));
const normal = (a: Pt): Pt => [-a[1], a[0]];

const LABEL_FONT = 13;

/** Half width and half height of a label, generously estimated. */
function labelBox(text: string): Pt {
  return [text.length * LABEL_FONT * 0.3 + 2, LABEL_FONT / 2 + 1];
}

/** How far a label box reaches in direction `n` from its center. */
const reach = ([hw, hh]: Pt, n: Pt) => Math.abs(n[0]) * hw + Math.abs(n[1]) * hh;

const overlap = (p: Pt, a: Pt, q: Pt, b: Pt) =>
  Math.abs(p[0] - q[0]) < a[0] + b[0] + 1 && Math.abs(p[1] - q[1]) < a[1] + b[1] + 1;

// Which vertices sit at the base's left and right ends and which on top. A
// marked right angle goes in the bottom corner with the longer leg as the
// base; otherwise vertex A is on top unless that would leave an obtuse or
// needle-thin shape, in which case the largest angle is.
function triangleLayout(angles: number[], right?: number): [number, number, number] {
  if (right !== undefined) {
    const [p, q] = [0, 1, 2].filter((i) => i !== right);
    return angles[p] <= angles[q] ? [right, p, q] : [right, q, p];
  }
  const apex = angles[1] < 90 && angles[2] < 90 && angles[0] >= 20 ? 0 : angles.indexOf(Math.max(...angles));
  const [l, r] = [0, 1, 2].filter((i) => i !== apex);
  return [l, r, apex];
}

/**
 * Where an angle label can go: inside the angle, just past its arc, when it
 * fits between the sides (else null), and just outside the vertex.
 */
function angleLabelSpots(v: Pt, a: Pt, b: Pt, box: Pt, arc: number): { inside: Pt | null; outside: Pt } {
  const u = unit(sub(a, v));
  const w = unit(sub(b, v));
  const bisector = unit(add(u, w));
  const sinHalf = Math.sin(Math.acos(u[0] * w[0] + u[1] * w[1]) / 2);
  const d = Math.max(
    arc + 3 + reach(box, bisector),
    (reach(box, normal(u)) + 2) / sinHalf,
    (reach(box, normal(w)) + 2) / sinHalf,
  );
  const inside = add(v, mul(bisector, d));
  // Signed distances from the opposite side: same side as the vertex, and clear of it.
  const side = unit(sub(b, a));
  const vertexSide = Math.sign(cross(side, sub(v, a)));
  const clearance = vertexSide * cross(side, sub(inside, a));
  return {
    inside: d <= 42 && clearance >= reach(box, normal(side)) + 2 ? inside : null,
    outside: sub(v, mul(bisector, reach(box, bisector) + 4)),
  };
}

export function TriangleFigure({
  angles,
  angleLabels,
  sideLabels,
  right,
  ticks,
  flip,
  compact,
}: Omit<Extract<FigureSpec, { type: "triangle" }>, "type"> & { compact?: boolean }) {
  // The triangle is scaled to fit this box (px); labels sit around it.
  const [maxW, maxH] = compact ? [120, 70] : [170, 85];
  const [l, r, top] = triangleLayout(angles, right);
  const rad = (i: number) => (angles[i] * Math.PI) / 180;
  // Base along y = 0 (y up for now), apex placed by the law of sines.
  const toApex = Math.sin(rad(r)) / Math.sin(rad(l) + rad(r));
  const apex: Pt = [Math.cos(rad(l)) * toApex, Math.sin(rad(l)) * toApex];
  const s = Math.min(maxW / (Math.max(1, apex[0]) - Math.min(0, apex[0])), maxH / apex[1]);
  const place = ([x, y]: Pt): Pt => [(flip ? -x : x) * s, -y * s];
  const pts: Pt[] = [];
  [pts[l], pts[r], pts[top]] = [place([0, 0]), place([1, 0]), place(apex)];

  const others = (i: number): [Pt, Pt] => [pts[(i + 1) % 3], pts[(i + 2) % 3]];
  const arcRadius = (i: number) => {
    const [a, b] = others(i);
    return Math.min(14, 0.3 * Math.hypot(...sub(a, pts[i])), 0.3 * Math.hypot(...sub(b, pts[i])));
  };

  const marks: ReactNode[] = [];
  const labels: { at: Pt; text: string; box: Pt; bold?: boolean }[] = [];

  const angleMarks = angleLabels.flatMap((text, i) => {
    if (text === null) return [];
    const [a, b] = others(i);
    const arc = arcRadius(i);
    const box = labelBox(text);
    return [{ i, text, arc, box, ...angleLabelSpots(pts[i], a, b, box, arc) }];
  });
  for (const { i, text, arc, box, inside, outside } of angleMarks) {
    const [a, b] = others(i);
    const u = unit(sub(a, pts[i]));
    const w = unit(sub(b, pts[i]));
    const [p1, p2] = [add(pts[i], mul(u, arc)), add(pts[i], mul(w, arc))];
    marks.push(
      <path
        key={`arc${i}`}
        d={`M${r2(p1[0])} ${r2(p1[1])} A${r2(arc)} ${r2(arc)} 0 0 ${cross(u, w) > 0 ? 1 : 0} ${r2(p2[0])} ${r2(p2[1])}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />,
    );
    // Labels that would crowd each other inside a small triangle both move
    // out, which keeps an isosceles figure symmetric.
    const crowded = angleMarks.some((m) => m.i !== i && inside && m.inside && overlap(inside, box, m.inside, m.box));
    labels.push({ at: inside && !crowded ? inside : outside, text, box, bold: text === "?" });
  }

  if (right !== undefined) {
    const [a, b] = others(right);
    const size = Math.min(10, arcRadius(right));
    const u = mul(unit(sub(a, pts[right])), size);
    const w = mul(unit(sub(b, pts[right])), size);
    const corner = [add(pts[right], u), add(add(pts[right], u), w), add(pts[right], w)];
    marks.push(
      <polyline
        key="right"
        points={corner.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />,
    );
  }

  // Side i runs between the two vertices other than i.
  const sides = [0, 1, 2].map((i) => {
    const [a, b] = others(i);
    const along = unit(sub(b, a));
    let out = normal(along);
    if (cross(along, sub(pts[i], a)) * cross(along, out) > 0) out = mul(out, -1);
    return { mid: mul(add(a, b), 0.5), along, out };
  });

  ticks?.forEach((count, i) => {
    const { mid, along, out } = sides[i];
    for (let k = 0; k < count; k++) {
      const c = add(mid, mul(along, (k - (count - 1) / 2) * 4));
      const [p1, p2] = [add(c, mul(out, 5)), sub(c, mul(out, 5))];
      marks.push(
        <line
          key={`tick${i}-${k}`}
          x1={r2(p1[0])}
          y1={r2(p1[1])}
          x2={r2(p2[0])}
          y2={r2(p2[1])}
          stroke="currentColor"
          strokeWidth="1.4"
        />,
      );
    }
  });

  sideLabels?.forEach((text, i) => {
    const { mid, out } = sides[i];
    const box = labelBox(text);
    labels.push({ at: add(mid, mul(out, reach(box, out) + 3)), text, box });
  });

  // Fit the view to the triangle and every label box.
  const xs = [...pts.map((p) => p[0]), ...labels.flatMap(({ at, box }) => [at[0] - box[0], at[0] + box[0]])];
  const ys = [...pts.map((p) => p[1]), ...labels.flatMap(({ at, box }) => [at[1] - box[1], at[1] + box[1]])];
  const [x0, y0] = [Math.min(...xs) - 2, Math.min(...ys) - 2];
  const [w, h] = [Math.max(...xs) + 2 - x0, Math.max(...ys) + 2 - y0];

  return (
    <svg
      viewBox={`${r2(x0)} ${r2(y0)} ${r2(w)} ${r2(h)}`}
      width={r2(w)}
      height={r2(h)}
      className="max-w-full shrink-0 text-navy-900"
      role="img"
      aria-label="Triangle"
    >
      <polygon
        points={pts.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" ")}
        fill="white"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {marks}
      {labels.map(({ at, text, bold }, i) => (
        <text
          key={i}
          x={r2(at[0])}
          y={r2(at[1])}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={LABEL_FONT}
          fontWeight={bold ? 700 : 500}
          fill="currentColor"
        >
          {text}
        </text>
      ))}
    </svg>
  );
}
