// Print-first SVG figures for worksheet problems. Strokes use the navy-900
// text color via currentColor; shading is light enough to stay readable on a
// black-and-white printer.

import type { ReactNode } from "react";
import type { FigureSpec } from "@/lib/worksheets/types";

const SHADE = "#93afcf"; // navy-300
const FACE = "#e2eaf4"; // navy-100, for the sides of a solid

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

type Label = {
  at: Pt;
  text: string;
  box: Pt;
  bold?: boolean;
  /** Set in italic just before `text`, like a math variable. */
  variable?: string;
};

/** A label `gap` px clear of `from`, in direction `out`. */
function labelOut(
  from: Pt,
  out: Pt,
  text: string,
  { variable, gap = 3 }: { variable?: string; gap?: number } = {},
): Label {
  const box = labelBox((variable ?? "") + text);
  return { at: add(from, mul(out, reach(box, out) + gap)), text, box, variable };
}

const points = (pts: Pt[]) => pts.map((p) => `${r2(p[0])},${r2(p[1])}`).join(" ");

/** An SVG cropped to the drawing's extent and every label around it. */
function FittedSvg({
  extent,
  labels,
  title,
  children,
}: {
  extent: Pt[];
  labels: Label[];
  title: string;
  children: ReactNode;
}) {
  const xs = [...extent.map((p) => p[0]), ...labels.flatMap(({ at, box }) => [at[0] - box[0], at[0] + box[0]])];
  const ys = [...extent.map((p) => p[1]), ...labels.flatMap(({ at, box }) => [at[1] - box[1], at[1] + box[1]])];
  const [x0, y0] = [Math.min(...xs) - 2, Math.min(...ys) - 2];
  const [w, h] = [Math.max(...xs) + 2 - x0, Math.max(...ys) + 2 - y0];

  return (
    <svg
      viewBox={`${r2(x0)} ${r2(y0)} ${r2(w)} ${r2(h)}`}
      width={r2(w)}
      height={r2(h)}
      className="max-w-full shrink-0 text-navy-900"
      role="img"
      aria-label={title}
    >
      {children}
      {labels.map(({ at, text, bold, variable }, i) => (
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
          {variable && <tspan fontStyle="italic">{variable}</tspan>}
          {text}
        </text>
      ))}
    </svg>
  );
}

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
  const labels: Label[] = [];

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
        points={points(corner)}
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
    labels.push(labelOut(mid, out, text));
  });

  return (
    <FittedSvg extent={pts} labels={labels} title="Triangle">
      <polygon
        points={points(pts)}
        fill="white"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {marks}
    </FittedSvg>
  );
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function Outline({ pts }: { pts: Pt[] }) {
  return <polygon points={points(pts)} fill="white" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />;
}

function Dashed({ from, to }: { from: Pt; to: Pt }) {
  return (
    <line
      x1={r2(from[0])}
      y1={r2(from[1])}
      x2={r2(to[0])}
      y2={r2(to[1])}
      stroke="currentColor"
      strokeWidth="1.2"
      strokeDasharray="4 3"
    />
  );
}

/** The little square at `at`, between unit directions `u` and `w`. */
function RightAngleMark({ at, u, w }: { at: Pt; u: Pt; w: Pt }) {
  const [a, b] = [mul(u, 8), mul(w, 8)];
  return (
    <polyline
      points={points([add(at, a), add(add(at, a), b), add(at, b)])}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  );
}

/** A short tick across the middle of the side from `a` to `b`. */
function Tick({ a, b }: { a: Pt; b: Pt }) {
  const mid = mul(add(a, b), 0.5);
  const n = mul(normal(unit(sub(b, a))), 5);
  const [p1, p2] = [add(mid, n), sub(mid, n)];
  return (
    <line x1={r2(p1[0])} y1={r2(p1[1])} x2={r2(p2[0])} y2={r2(p2[1])} stroke="currentColor" strokeWidth="1.4" />
  );
}

type Figure<T extends FigureSpec["type"]> = Omit<Extract<FigureSpec, { type: T }>, "type"> & { compact?: boolean };

export function RectangleFigure({ length, width, labels, square, inside, compact }: Figure<"rectangle">) {
  const [maxW, maxH] = compact ? [110, 66] : [150, 92];
  // A square stays square, and a rectangle never passes for one.
  const ratio = square ? 1 : clamp(width / length, 0.35, 0.65);
  const w = Math.min(maxW, maxH / ratio);
  const h = w * ratio;
  const pts: Pt[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  // Clear of the ticks on a square.
  const gap = square ? 9 : 3;
  const text: Label[] = [
    labelOut([w / 2, h], [0, 1], labels[0], { gap }),
    labelOut([w, h / 2], [1, 0], labels[1], { gap }),
  ];
  if (inside) text.push({ at: [w / 2, h / 2], text: inside, box: labelBox(inside) });

  return (
    <FittedSvg extent={pts} labels={text} title={square ? "Square" : "Rectangle"}>
      <Outline pts={pts} />
      {square && pts.map((p, i) => <Tick key={i} a={p} b={pts[(i + 1) % 4]} />)}
    </FittedSvg>
  );
}

export function BaseHeightFigure({ shape, base, height, apex, labels, flip, compact }: Figure<"base-height">) {
  const parallelogram = shape === "parallelogram";
  const [maxW, maxH] = compact ? [110, 62] : [150, 90];
  const ratio = clamp(height / base, 0.35, 0.8);
  // A parallelogram's top side overhangs the base by `apex` bases.
  const span = parallelogram ? 1 + apex : 1;
  const b = Math.min(maxW / span, maxH / ratio);
  const h = b * ratio;
  const top = apex * b;
  const place = ([x, y]: Pt): Pt => [flip ? b * span - x : x, y];
  const pts = (parallelogram ? [[0, h], [b, h], [top + b, 0], [top, 0]] : [[0, h], [b, h], [top, 0]]).map((p) =>
    place(p as Pt),
  );
  // The height goes on the roomier side of the line dropped from the top
  // vertex, or outside when that line is the triangle's own side.
  const side = (parallelogram || top < b - top ? 1 : -1) * (flip ? -1 : 1);
  const onSide = !parallelogram && (apex === 0 || apex === 1);
  const [peak, foot] = [place([top, 0]), place([top, h])];
  // A triangle narrows toward its apex, so the height label goes low enough
  // for its top edge to clear the slanted side, but stays above the
  // right-angle mark.
  const box = labelBox(labels[1]);
  const clearAt = ((2 * box[0] + 7) * h) / Math.max(top, b - top) + box[1];
  const heightAt: Pt = [peak[0], parallelogram ? h / 2 : Math.min(h - 10 - box[1], Math.max(h / 2, clearAt))];
  const heightLabel = onSide
    ? labelOut(heightAt, [-side, 0], labels[1])
    : labelOut(add(heightAt, [side * 2, 0]), [side, 0], labels[1]);

  return (
    <FittedSvg
      extent={pts}
      labels={[labelOut(place([b / 2, h]), [0, 1], labels[0]), heightLabel]}
      title={parallelogram ? "Parallelogram" : "Triangle"}
    >
      <Outline pts={pts} />
      {!onSide && <Dashed from={peak} to={foot} />}
      <RightAngleMark at={foot} u={[side, 0]} w={[0, -1]} />
    </FittedSvg>
  );
}

export function PrismFigure({ length, width, height, labels, compact }: Figure<"prism">) {
  // Eased proportions (a power below 1), so a 12 × 2 × 2 box is no sliver;
  // the depth recedes up and to the right.
  const [l, w, h] = [length, width, height].map((v) => v ** 0.6);
  const [dx, dy] = [0.49, -0.34];
  const [maxW, maxH] = compact ? [110, 70] : [150, 95];
  const k = Math.min(maxW / (l + w * dx), maxH / (h - w * dy));
  const depth: Pt = [w * dx * k, w * dy * k];
  const [L, H] = [l * k, h * k];
  const front: Pt[] = [
    [0, 0],
    [L, 0],
    [L, -H],
    [0, -H],
  ];
  const back = front.map((p) => add(p, depth));
  const visible: Pt[][] = [front, [front[3], front[2], back[2], back[3]], [front[1], back[1], back[2], front[2]]];
  const along = unit(depth);

  return (
    <FittedSvg
      extent={[...front, ...back]}
      labels={[
        labelOut([L / 2, 0], [0, 1], labels[0]),
        labelOut(add(front[1], mul(depth, 0.5)), [-along[1], along[0]], labels[1]),
        labelOut([0, -H / 2], [-1, 0], labels[2]),
      ]}
      title="Rectangular prism"
    >
      {visible.map((face, i) => (
        <polygon
          key={i}
          points={points(face)}
          fill={i === 0 ? "white" : FACE}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      ))}
      {/* The three hidden edges, seen through the faces. */}
      {[back[1], back[3], front[0]].map((p, i) => (
        <Dashed key={i} from={back[0]} to={p} />
      ))}
    </FittedSvg>
  );
}

export function CircleFigure({ segment, label, compact }: Figure<"circle">) {
  const r = compact ? 30 : 42;
  const start: Pt = segment === "d" ? [-r, 0] : [0, 0];
  return (
    <FittedSvg
      extent={[
        [-r, -r],
        [r, r],
      ]}
      labels={[labelOut([r, 0], [1, 0], label.slice(1), { variable: label[0] })]}
      title="Circle"
    >
      <circle cx="0" cy="0" r={r} fill="white" stroke="currentColor" strokeWidth="1.8" />
      <line x1={start[0]} y1="0" x2={r} y2="0" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="0" cy="0" r="2.4" fill="currentColor" />
    </FittedSvg>
  );
}
