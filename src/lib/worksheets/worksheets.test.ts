import { describe, expect, it } from "vitest";
import { buildWorksheet, exampleFor, parseWorksheetParams } from "./build";
import { getWorksheet, parseGradeSlug, skillPosition, skillsInOrder, WORKSHEET_GRADES, WORKSHEETS, worksheetsInUnit } from "./catalog";
import { describeData, longDivisionSteps, verticalWork } from "./math";
import { createRng, randInt } from "./rng";
import type { ExampleShow, FigureSpec, NumberForm, PatternRule, ProblemMeta, Rational, WorksheetProblem } from "./types";
import { unitLetter, WORKSHEET_UNITS } from "./units";
const SEEDS = Array.from({ length: 30 }, (_, i) => `seed${i}`);

// ── Independent re-derivation helpers (deliberately not imported from math.ts) ──

const gcdI = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcdI(b, a % b));

/** Strips commas / KaTeX `{,}` / `$` so "$1{,}234$" and "1,234" both read as 1234. */
const num = (s: string) => Number(s.replace(/\$|\{,\}|,/g, "").trim());

/** Parses an answer like "$2\frac{3}{4}$", "$-\frac{1}{2}$" or "$5$" into a reduced [n, d]. */
function parseFractionAnswer(answer: string): Rational {
  const s = answer.replace(/\$/g, "").replace(/\{,\}/g, "").trim();
  const m = s.match(/^(-)?(\d+)?(?:\\frac\{(\d+)\}\{(\d+)\})?$/);
  if (!m) throw new Error(`unparseable fraction answer: ${answer}`);
  const sign = m[1] ? -1 : 1;
  const whole = m[2] ? Number(m[2]) : 0;
  const n = m[3] ? Number(m[3]) : 0;
  const d = m[4] ? Number(m[4]) : 1;
  if (m[3] && gcdI(n, d) !== 1) throw new Error(`fraction part not in simplest form: ${answer}`);
  if (m[2] && m[3] && n >= d) throw new Error(`mixed number with improper part: ${answer}`);
  return [sign * (whole * d + n), d];
}

const sameValue = (a: Rational, b: Rational) => a[0] * b[1] === b[0] * a[1];

/** Exact decimal string → [units, 10^scale]. */
function decimal(s: string): [number, number] {
  const neg = s.startsWith("-");
  const [w, f = ""] = s.replace("-", "").split(".");
  const units = Number(w + f) * (neg ? -1 : 1);
  return [units, 10 ** f.length];
}

// The test only ever evaluates expressions the generator built from numbers
// and + - * / ** Math.abs — never user input.
const evalJs = (expr: string, vars: Record<string, number> = {}): number =>
  new Function(...Object.keys(vars), `return (${expr});`)(...Object.values(vars));

/** The contents of every `$...$` span, in order. */
const spans = (text: string) => [...text.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]);

const bodyText = (p: WorksheetProblem) => (p.body.kind === "text" ? p.body.text : "");

/** Any printed number — integer, decimal, fraction, mixed number or percent — exactly; simplest form not required. */
function parseValue(latex: string): Rational {
  const s = latex.replace(/\$|\{,\}|,/g, "").trim();
  if (s.endsWith("\\%")) {
    const [n, d] = parseValue(s.slice(0, -2));
    return [n, d * 100];
  }
  if (/^-?\d+(\.\d+)?$/.test(s)) return decimal(s);
  const m = s.match(/^(-)?(\d+)?\\frac\{(\d+)\}\{(\d+)\}$/);
  if (!m) throw new Error(`unparseable value: ${latex}`);
  const whole = m[2] ? Number(m[2]) : 0;
  return [(m[1] ? -1 : 1) * (whole * Number(m[4]) + Number(m[3])), Number(m[4])];
}

const WORD_VALUES: Record<string, number> = Object.fromEntries(
  [
    ..."zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen"
      .split(" ")
      .map((w, i) => [w, i]),
    ..."twenty thirty forty fifty sixty seventy eighty ninety".split(" ").map((w, i) => [w, (i + 2) * 10]),
  ],
);

/** "forty-two thousand, six hundred five" → 42605. */
function wordsToNumber(words: string): number {
  // Compound tens are hyphenated ("forty-two"), never spaced.
  expect(words).not.toMatch(/(ty) (one|two|three|four|five|six|seven|eight|nine)\b/);
  let total = 0;
  let current = 0;
  for (const w of words.replace(/,/g, "").split(/[\s-]+/)) {
    if (w === "hundred") current *= 100;
    else if (w === "thousand") {
      total += current * 1000;
      current = 0;
    } else {
      expect(WORD_VALUES, `unknown number word "${w}"`).toHaveProperty(w);
      current += WORD_VALUES[w];
    }
  }
  return total + current;
}

function applyRule({ op, k }: PatternRule, x: number): number {
  return op === "+" ? x + k : op === "-" ? x - k : op === "*" ? x * k : x / k;
}

/** Answers like "$21,\ 25$ (add 4)" or "$28,\ 36$ (rule: multiply by 4)". */
function checkRuleAnswer(answer: string, rule: PatternRule, missing: number[]) {
  const m = answer.match(/^\$(.+)\$ \((?:rule: )?(add|subtract|multiply by|divide by) (\d+)\)$/);
  expect(m, answer).not.toBeNull();
  expect(m![1].split(",").map((s) => num(s.replace(/\\ /g, "")))).toEqual(missing);
  expect({ add: "+", subtract: "-", "multiply by": "*", "divide by": "/" }[m![2]]).toBe(rule.op);
  expect(Number(m![3])).toBe(rule.k);
}

/** Answers like "89¢" or "$\text{\textdollar}1.53$". */
function cents(s: string): number {
  const c = s.match(/^(\d+)¢$/);
  if (c) return Number(c[1]);
  const d = s.match(/\\textdollar\}(\d+)\.(\d{2})/);
  if (!d) throw new Error(`unparseable money: ${s}`);
  return Number(d[1]) * 100 + Number(d[2]);
}

const PLACE_VALUES: Record<string, number> = {
  one: 1,
  ten: 10,
  hundred: 100,
  thousand: 1000,
  "ten thousand": 10_000,
  "hundred thousand": 100_000,
};

const DENOMINATOR_NAMES: Record<string, number> = {
  half: 2,
  halves: 2,
  third: 3,
  thirds: 3,
  fourth: 4,
  fourths: 4,
  fifth: 5,
  fifths: 5,
  sixth: 6,
  sixths: 6,
  seventh: 7,
  sevenths: 7,
  eighth: 8,
  eighths: 8,
  ninth: 9,
  ninths: 9,
  tenth: 10,
  tenths: 10,
  twelfth: 12,
  twelfths: 12,
};

/** "three-fourths" → [3, 4]; singular only for a numerator of 1. */
function fractionFromWords(words: string): Rational {
  const m = words.match(/^([a-z]+)-([a-z]+)$/);
  expect(m, words).not.toBeNull();
  const n = WORD_VALUES[m![1]];
  const d = DENOMINATOR_NAMES[m![2]];
  expect(n, words).toBeGreaterThan(0);
  expect(d, words).toBeDefined();
  expect(m![2].endsWith("s"), words).toBe(n !== 1);
  return [n, d];
}

/** Every permutation of `xs`. */
const permutations = (xs: number[]): number[][] =>
  xs.length <= 1 ? [xs] : xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]));

// Every unit in terms of the smallest one of its kind.
const UNIT_BASE: Record<string, [string, number]> = {
  in: ["us-length", 1],
  ft: ["us-length", 12],
  yd: ["us-length", 36],
  c: ["us-volume", 1],
  pt: ["us-volume", 2],
  qt: ["us-volume", 4],
  gal: ["us-volume", 16],
  oz: ["us-weight", 1],
  lb: ["us-weight", 16],
  mm: ["length", 1],
  cm: ["length", 10],
  m: ["length", 1000],
  km: ["length", 1_000_000],
  g: ["mass", 1],
  kg: ["mass", 1000],
  mL: ["volume", 1],
  L: ["volume", 1000],
};

/** A triangle figure is a real triangle whose marks agree with its angles. */
function checkTriangleFigure(fig: Extract<FigureSpec, { type: "triangle" }>) {
  expect(fig.angles.reduce((s, a) => s + a, 0)).toBeCloseTo(180, 0);
  fig.angles.forEach((a) => expect(a).toBeGreaterThan(0));
  fig.angleLabels.forEach((label, i) => {
    if (label !== null && label !== "?") expect(label).toBe(`${fig.angles[i]}°`);
  });
  if (fig.right !== undefined) {
    expect(fig.angles[fig.right]).toBe(90);
    expect(fig.angleLabels[fig.right]).toBeNull();
  }
  // Sides with the same number of ticks are equal, so their opposite angles are too.
  fig.ticks?.forEach((t, i) =>
    fig.ticks!.forEach((u, j) => {
      if (t > 0 && t === u) expect(fig.angles[i]).toBe(fig.angles[j]);
    }),
  );
}

type ShapeFigure = Extract<FigureSpec, { type: "rectangle" | "base-height" | "prism" | "circle" }>;

/** A length label such as "12 ft" or "1,200 cm": [number, unit]. */
function lengthLabel(label: string): [number, string] {
  const m = label.match(/^(\d[\d,]*) ([a-z]+)$/);
  expect(m, label).not.toBeNull();
  return [Number(m![1].replace(/,/g, "")), m![2]];
}

/** A shape's labels agree with the measurements it is drawn from, all in one unit; returns the unit. */
function checkShapeFigure(fig: ShapeFigure): string {
  switch (fig.type) {
    case "rectangle": {
      const [length, unit] = lengthLabel(fig.labels[0]);
      expect(length).toBe(fig.length);
      if (fig.labels[1] !== "?") expect(lengthLabel(fig.labels[1])).toEqual([fig.width, unit]);
      if (fig.square) expect(fig.width).toBe(fig.length);
      if (fig.inside) {
        const area = `Area = ${(fig.length * fig.width).toLocaleString("en-US")} ${unit}²`;
        const perimeter = `Perimeter = ${(2 * (fig.length + fig.width)).toLocaleString("en-US")} ${unit}`;
        expect([area, perimeter]).toContain(fig.inside);
      }
      return unit;
    }
    case "base-height": {
      const [base, unit] = lengthLabel(fig.labels[0]);
      expect([base, unit]).toEqual([fig.base, unit]);
      expect(lengthLabel(fig.labels[1])).toEqual([fig.height, unit]);
      expect(fig.apex).toBeGreaterThanOrEqual(0);
      expect(fig.apex).toBeLessThanOrEqual(1);
      return unit;
    }
    case "prism": {
      const unit = lengthLabel(fig.labels[0])[1];
      expect(fig.labels.map(lengthLabel)).toEqual([fig.length, fig.width, fig.height].map((n) => [n, unit]));
      return unit;
    }
    case "circle": {
      const m = fig.label.match(/^([rd]) = (\d+) ([a-z]+)$/);
      expect(m, fig.label).not.toBeNull();
      expect(m![1]).toBe(fig.segment);
      return m![3];
    }
  }
}

function checkMeta(meta: ProblemMeta, p: WorksheetProblem) {
  switch (meta.type) {
    case "int-op": {
      const { op, a, b, result, unknown } = meta;
      const expected = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
      expect(result).toBe(expected);
      if (op === "/") expect(a % b).toBe(0);
      expect(num(p.answer)).toBe(unknown === "a" ? a : unknown === "b" ? b : result);
      break;
    }
    case "long-division": {
      const { dividend, divisor, quotient, remainder } = meta;
      expect(quotient * divisor + remainder).toBe(dividend);
      expect(remainder).toBeGreaterThanOrEqual(0);
      expect(remainder).toBeLessThan(divisor);
      const [q, r] = p.answer.split(" R");
      expect(num(q)).toBe(quotient);
      expect(r === undefined ? 0 : Number(r)).toBe(remainder);
      break;
    }
    case "decimal-op": {
      const [a, as] = decimal(meta.a);
      const [b, bs] = decimal(meta.b);
      const [r, rs] = decimal(meta.result);
      // Cross-multiply to a common denominator: everything stays integral.
      if (meta.op === "+") expect(r * as * bs).toBe((a * bs + b * as) * rs);
      if (meta.op === "-") expect(r * as * bs).toBe((a * bs - b * as) * rs);
      if (meta.op === "*") expect(r * as * bs).toBe(a * b * rs);
      if (meta.op === "/") expect(r * b * as).toBe(a * rs * bs);
      expect(p.answer).toBe(meta.result);
      expect(meta.result).not.toMatch(/\.\d*0$/);
      break;
    }
    case "fraction-op": {
      const { op, a, b, result } = meta;
      const expected: Rational =
        op === "+"
          ? [a[0] * b[1] + b[0] * a[1], a[1] * b[1]]
          : op === "-"
            ? [a[0] * b[1] - b[0] * a[1], a[1] * b[1]]
            : op === "*"
              ? [a[0] * b[0], a[1] * b[1]]
              : [a[0] * b[1], a[1] * b[0]];
      expect(sameValue(result, expected)).toBe(true);
      expect(sameValue(parseFractionAnswer(p.answer), expected)).toBe(true);
      expect(expected[0] / expected[1]).toBeGreaterThan(0);
      break;
    }
    case "fraction-value": {
      expect(p.body.kind).toBe("figure");
      if (p.body.kind === "figure" && p.body.figure.type === "fraction-model") {
        const { parts, shaded } = p.body.figure;
        const total = shaded.reduce((s, x) => s + x, 0);
        expect(meta.value).toEqual([total, parts]);
        shaded.forEach((s) => expect(s).toBeLessThanOrEqual(parts));
      }
      expect(p.answer.startsWith(`$\\frac{${meta.value[0]}}{${meta.value[1]}}$`)).toBe(true);
      break;
    }
    case "equivalent": {
      expect(sameValue(meta.left, meta.right)).toBe(true);
      expect(Number(p.answer)).toBe(meta.missingPart === "num" ? meta.right[0] : meta.right[1]);
      break;
    }
    case "compare": {
      const c = meta.left[0] * meta.right[1] - meta.right[0] * meta.left[1];
      const expected = c < 0 ? "<" : c > 0 ? ">" : "=";
      expect(meta.symbol).toBe(expected);
      expect(p.answer).toBe(expected);
      break;
    }
    case "place-value": {
      const digit = Math.floor(meta.n / 10 ** meta.power) % 10;
      expect(meta.value).toBe(digit * 10 ** meta.power);
      expect(digit).not.toBe(0);
      expect(num(p.answer)).toBe(meta.value);
      break;
    }
    case "rounding": {
      const lower = Math.floor(meta.n / meta.place) * meta.place;
      const expected = meta.n - lower >= meta.place / 2 ? lower + meta.place : lower;
      expect(meta.result).toBe(expected);
      expect(num(p.answer)).toBe(expected);
      break;
    }
    case "factor-pairs": {
      const expected: [number, number][] = [];
      for (let i = 1; i <= Math.sqrt(meta.n); i++) if (meta.n % i === 0) expected.push([i, meta.n / i]);
      expect(meta.pairs).toEqual(expected);
      expect(p.answer.match(/\\times/g)?.length).toBe(expected.length);
      break;
    }
    case "gcf": {
      expect(meta.result).toBe(meta.numbers.reduce(gcdI));
      expect(Number(p.answer)).toBe(meta.result);
      break;
    }
    case "lcm": {
      const [a, b] = meta.numbers;
      expect(meta.result).toBe((a * b) / gcdI(a, b));
      expect(Number(p.answer)).toBe(meta.result);
      break;
    }
    case "prime-factorization": {
      expect(meta.factors.reduce((x, y) => x * y, 1)).toBe(meta.n);
      for (const f of meta.factors) {
        for (let i = 2; i * i <= f; i++) expect(f % i).not.toBe(0);
      }
      expect([...meta.factors].sort((x, y) => x - y)).toEqual(meta.factors);
      break;
    }
    case "prime-check": {
      let prime = meta.n >= 2;
      for (let i = 2; i * i <= meta.n; i++) if (meta.n % i === 0) prime = false;
      expect(meta.isPrime).toBe(prime);
      expect(p.answer).toBe(prime ? "prime" : "composite");
      break;
    }
    case "expression": {
      const value = evalJs(meta.expr);
      expect(value).toBe(meta.result);
      expect(Number.isInteger(value)).toBe(true);
      expect(num(p.answer)).toBe(value);
      break;
    }
    case "equation": {
      expect(evalJs(meta.lhs, { [meta.variable]: meta.solution })).toBe(meta.rhs);
      const shown = p.answer.replace(/\$/g, "").split("=").pop() ?? "";
      expect(Number(shown.trim())).toBe(meta.solution);
      break;
    }
    case "stats": {
      const d = [...meta.data].sort((a, b) => a - b);
      const n = d.length;
      const mean = d.reduce((s, v) => s + v, 0) / n;
      const median = n % 2 ? d[(n - 1) / 2] : (d[n / 2 - 1] + d[n / 2]) / 2;
      const counts = new Map<number, number>();
      d.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
      const top = Math.max(...counts.values());
      const modes = [...counts].filter(([, c]) => c === top).map(([v]) => v);
      expect(modes).toEqual([meta.mode]);
      expect(meta.mean).toBe(mean);
      expect(Number.isInteger(mean)).toBe(true);
      expect(meta.median).toBe(median);
      expect(meta.range).toBe(d[n - 1] - d[0]);
      // "Mean 6 · Median 7": one entry per field on the sheet, each right.
      const asked = p.body.kind === "fields" ? p.body.fields : [];
      expect(asked.length).toBeGreaterThan(0);
      expect(p.answer.split(" · ")).toEqual(
        asked.map((f) => `${f} ${meta[f.toLowerCase() as "mean" | "median" | "mode" | "range"]}`),
      );
      break;
    }
    case "clock": {
      expect(meta.hour).toBeGreaterThanOrEqual(1);
      expect(meta.hour).toBeLessThanOrEqual(12);
      expect(meta.minute).toBeGreaterThanOrEqual(0);
      expect(meta.minute).toBeLessThan(60);
      expect(p.answer).toBe(`${meta.hour}:${String(meta.minute).padStart(2, "0")}`);
      break;
    }
    case "number-form": {
      const read = (text: string, form: NumberForm): number => {
        if (form === "word") return wordsToNumber(text.trim());
        if (form === "unit") {
          // "4 thousands, 3 hundreds, 5 ones": largest place first, no zero places.
          const parts = text.split(", ").map((part) => {
            const m = part.match(/^([1-9]) (one|ten|hundred|thousand|ten thousand|hundred thousand)(s?)$/);
            expect(m, part).not.toBeNull();
            expect(m![3] === "", part).toBe(m![1] === "1");
            return Number(m![1]) * PLACE_VALUES[m![2]];
          });
          expect(parts).toEqual([...parts].sort((a, b) => b - a));
          return parts.reduce((s, v) => s + v, 0);
        }
        if (form === "standard") {
          expect(spans(text)).toHaveLength(1);
          return num(spans(text)[0]);
        }
        // Each term is one nonzero digit times a power of ten, largest first.
        const terms = spans(text).join(" ").split("+").map(num);
        for (const t of terms) expect(String(t)).toMatch(/^[1-9]0*$/);
        expect(terms).toEqual([...new Set(terms)].sort((a, b) => b - a));
        return terms.reduce((s, t) => s + t, 0);
      };
      const text = bodyText(p);
      const prompt = `Write in ${meta.to} form: `;
      expect(text.startsWith(prompt)).toBe(true);
      expect(read(text.slice(prompt.length), meta.from)).toBe(meta.n);
      expect(read(p.answer, meta.to)).toBe(meta.n);
      break;
    }
    case "elapsed-time": {
      const { start, end, unknown } = meta;
      expect(end).toBeGreaterThan(start);
      // One a.m. or p.m. stretch, from 1:00 on.
      expect(Math.floor(start / 720)).toBe(Math.floor(end / 720));
      expect(start % 720).toBeGreaterThanOrEqual(60);
      const clock = (t: number) =>
        `${Math.floor(t / 60) % 12 || 12}:${String(t % 60).padStart(2, "0")} ${t < 720 ? "a.m." : "p.m."}`;
      if (unknown === "elapsed") {
        const m = p.answer.match(/^(?:(\d+) hours?)? ?(?:(\d+) minutes?)?$/);
        expect(m, p.answer).not.toBeNull();
        expect(Number(m![1] ?? 0) * 60 + Number(m![2] ?? 0)).toBe(end - start);
      } else {
        expect(p.answer).toBe(clock(unknown === "start" ? start : end));
      }
      if (unknown !== "start") expect(bodyText(p)).toContain(clock(start));
      if (unknown !== "end") expect(bodyText(p)).toContain(clock(end));
      break;
    }
    case "money": {
      const total = meta.items.reduce((s, [c, n]) => s + c * n, 0);
      const expected = meta.paid === null ? total : meta.paid - total;
      expect(expected).toBeGreaterThan(0);
      expect(meta.result).toBe(expected);
      expect(cents(p.answer)).toBe(expected);
      const text = bodyText(p);
      if (meta.paid === null) {
        const value: Record<string, number> = {
          quarter: 25,
          dime: 10,
          nickel: 5,
          penny: 1,
          "one-dollar bill": 100,
        };
        const counted = [...text.matchAll(/(\d+) (quarters?|dimes?|nickels?|penny|pennies|one-dollar bills?)/g)].reduce(
          (s, [, n, name]) => s + Number(n) * value[name.replace(/ies$/, "y").replace(/s$/, "")],
          0,
        );
        expect(counted).toBe(total);
      } else {
        const amounts = [...text.matchAll(/\\textdollar\}(\d+)\.(\d{2})/g)].map(([, d, c]) => Number(d) * 100 + Number(c));
        expect(amounts).toEqual([meta.paid, total]);
      }
      break;
    }
    case "estimate": {
      const round = (n: number) => {
        const lower = Math.floor(n / meta.place) * meta.place;
        return n - lower >= meta.place / 2 ? lower + meta.place : lower;
      };
      const ra = round(meta.a);
      const rb = meta.op === "*" ? meta.b : round(meta.b);
      const expected = meta.op === "+" ? ra + rb : meta.op === "-" ? ra - rb : ra * rb;
      expect(expected).toBeGreaterThan(0);
      expect(meta.result).toBe(expected);
      const numbers = (s: string) => s.replace(/\{,\}/g, "").match(/\d+/g)!.map(Number);
      expect(numbers(p.answer)).toEqual([ra, rb, expected]);
      expect(numbers(spans(bodyText(p))[0])).toEqual([meta.a, meta.b]);
      break;
    }
    case "order": {
      const sign = meta.direction === "asc" ? 1 : -1;
      const cmp = (x: Rational, y: Rational) => x[0] * y[1] - y[0] * x[1];
      const text = bodyText(p);
      expect(text.startsWith(meta.direction === "asc" ? "Least to greatest: " : "Greatest to least: ")).toBe(true);
      const shown = spans(text).map(parseValue);
      expect(shown).toHaveLength(4);
      shown.forEach((v, i) => expect(sameValue(v, meta.values[i])).toBe(true));
      // Printed out of order, in both directions.
      const sortedIn = (s: number) => shown.every((v, i) => i === 0 || s * cmp(shown[i - 1], v) < 0);
      expect(sortedIn(1) || sortedIn(-1)).toBe(false);
      const answered = p.answer.split(meta.direction === "asc" ? " < " : " > ").map(parseValue);
      const expected = [...meta.values].sort((x, y) => sign * cmp(x, y));
      expect(answered).toHaveLength(4);
      answered.forEach((v, i) => expect(sameValue(v, expected[i])).toBe(true));
      for (let i = 1; i < 4; i++) expect(sign * cmp(answered[i - 1], answered[i])).toBeLessThan(0);
      break;
    }
    case "pattern": {
      const { terms, rule, missing } = meta;
      terms.forEach((t, i) => {
        expect(Number.isInteger(t) && t > 0).toBe(true);
        if (i > 0) expect(t).toBe(applyRule(rule, terms[i - 1]));
      });
      // The first two terms always show, so the rule can be found.
      expect(missing.every((i) => i >= 2)).toBe(true);
      const shown = spans(bodyText(p))[0].split(",").map((s) => s.replace(/\\ /g, "").trim());
      expect(shown).toHaveLength(terms.length);
      shown.forEach((s, i) => expect(s).toBe(missing.includes(i) ? "\\square" : String(terms[i])));
      checkRuleAnswer(
        p.answer,
        rule,
        missing.map((i) => terms[i]),
      );
      break;
    }
    case "function-table": {
      const { inputs, outputs, rule, missing } = meta;
      outputs.forEach((y, i) => {
        expect(Number.isInteger(y) && y > 0).toBe(true);
        expect(y).toBe(applyRule(rule, inputs[i]));
      });
      expect(missing).not.toContain(0);
      const row = (label: string) =>
        bodyText(p).split(`\\text{${label}}`)[1].split("\\\\")[0].split("&").slice(1).map((s) => s.trim());
      expect(row("In").map(num)).toEqual(inputs);
      row("Out").forEach((s, i) => expect(s).toBe(missing.includes(i) ? "\\square" : String(outputs[i])));
      checkRuleAnswer(
        p.answer,
        rule,
        missing.map((i) => outputs[i]),
      );
      break;
    }
    case "convert": {
      const text = bodyText(p);
      expect(sameValue(parseValue(spans(text)[0].replace(/=\s*$/, "")), meta.value)).toBe(true);
      if (text.includes(" as a ")) expect(text).toContain(` as a ${meta.to}:`);
      const shapes: Record<typeof meta.to, RegExp> = {
        mixed: /^\$\d+(\\frac\{\d+\}\{\d+\})?\$$/,
        improper: /^\$\\frac\{\d+\}\{\d+\}\$$/,
        decimal: /^\$\d+(\.\d*[1-9])?\$$/,
        fraction: /^\$(\d+)?(\\frac\{\d+\}\{\d+\})?\$$/,
        percent: /^\$\d+\\%\$$/,
      };
      expect(p.answer).toMatch(shapes[meta.to]);
      // Fractions and mixed numbers in simplest form; improper ones really improper.
      const value = meta.to === "mixed" || meta.to === "fraction" ? parseFractionAnswer(p.answer) : parseValue(p.answer);
      if (meta.to === "improper") expect(value[0]).toBeGreaterThan(value[1]);
      expect(sameValue(value, meta.value)).toBe(true);
      break;
    }
    case "unit-convert": {
      const kinds = new Set([...meta.from, ...meta.result].map(([, u]) => UNIT_BASE[u][0]));
      expect(kinds.size).toBe(1);
      // In thousandths of the smallest unit, so decimal amounts stay whole.
      const total = (amounts: [string, string][]) =>
        amounts.reduce((s, [v, u]) => {
          const [units, scale] = decimal(v);
          return s + (units * UNIT_BASE[u][1] * 1000) / scale;
        }, 0);
      expect(total(meta.result)).toBe(total(meta.from));
      // "4 ft 2 in": the smaller unit is less than one of the bigger.
      if (meta.result.length === 2) {
        const [[, big], [rest, small]] = meta.result;
        expect(Number(rest)).toBeLessThan(UNIT_BASE[big][1] / UNIT_BASE[small][1]);
      }
      const plain = (v: string) => (v.includes(".") ? v : Number(v).toLocaleString("en-US"));
      expect(p.answer).toBe(meta.result.map(([v, u]) => `${plain(v)} ${u}`).join(" "));
      const [lhs, rhs] = spans(bodyText(p))[0].split("=");
      expect(lhs.replace(/\{,\}/g, "").match(/\d+(\.\d+)?/g)).toEqual(meta.from.map(([v]) => v));
      expect(rhs.match(/\\square/g)).toHaveLength(meta.result.length);
      break;
    }
    case "probability": {
      const { outcomes, event } = meta;
      const isPrimeI = (n: number) => n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every((d) => n % d);
      const holds = (x: number | string): boolean => {
        if (typeof x === "string") {
          const colors = event.colors!;
          return event.kind === "not-color" ? x !== colors[0] : colors.includes(x);
        }
        const k = event.k!;
        return {
          even: x % 2 === 0,
          odd: x % 2 === 1,
          prime: isPrimeI(x),
          multiple: x % k === 0,
          greater: x > k,
          less: x < k,
          equal: x === k,
        }[event.kind as "even"];
      };
      const expected: Rational = [outcomes.filter(holds).length, outcomes.length];
      expect(sameValue(meta.result, expected)).toBe(true);
      expect(sameValue(parseFractionAnswer(p.answer), expected)).toBe(true);
      const text = bodyText(p);
      if (typeof outcomes[0] === "number") {
        expect(outcomes).toEqual(Array.from({ length: outcomes.length }, (_, i) => i + 1));
        expect(text).toContain(`1 to ${outcomes.length}`);
      } else {
        for (const color of new Set(outcomes)) {
          expect(text).toContain(`${outcomes.filter((c) => c === color).length} ${color}`);
        }
      }
      break;
    }
    case "decimal-rounding": {
      const places = meta.places;
      const fracLength = meta.n.split(".")[1]?.length ?? 0;
      expect(fracLength).toBeGreaterThan(places);
      const [units] = decimal(meta.n);
      const factor = 10 ** (fracLength - places);
      const rounded = Math.floor(units / factor) + ((units % factor) * 2 >= factor ? 1 : 0);
      const expected = (rounded / 10 ** places).toFixed(places);
      expect(meta.result).toBe(expected);
      expect(p.answer).toBe(expected);
      expect(bodyText(p)).toContain(`$${meta.n}$`);
      break;
    }
    case "triangle": {
      expect(p.body.kind).toBe("figure");
      if (p.body.kind !== "figure" || p.body.figure.type !== "triangle") break;
      const fig = p.body.figure;
      checkTriangleFigure(fig);
      if (meta.angles) {
        expect(meta.angles.reduce((s, a) => s + a, 0)).toBe(180);
        meta.angles.forEach((a) => expect(Number.isInteger(a) && a > 0).toBe(true));
        expect([...fig.angles].sort((x, y) => x - y)).toEqual([...meta.angles].sort((x, y) => x - y));
        const answer = meta.angles[meta.unknown!];
        // Every vertex is either given (a label, or a square for 90°) or asked
        // for with "?", and no label gives the answer away.
        fig.angleLabels.forEach((label, i) => {
          if (label === "?") expect(fig.angles[i]).toBe(answer);
          else if (label === null) expect(fig.right).toBe(i);
        });
        expect(fig.angleLabels.filter((l) => l === "?").length).toBe(meta.classify === null && fig.ticks ? 2 : 1);
        // An isosceles figure's base angles are found from the vertex angle alone.
        if (fig.ticks) expect(fig.angleLabels.filter((l) => l !== "?" && l !== null)).toHaveLength(1);
      }
      if (meta.unknown !== null) expect(p.answer.startsWith(`$${meta.angles![meta.unknown]}^\\circ$`)).toBe(true);
      if (meta.classify === "angles") {
        const largest = Math.max(...meta.angles!);
        expect(p.answer.endsWith(`, ${largest === 90 ? "right" : largest > 90 ? "obtuse" : "acute"}`)).toBe(true);
      }
      if (meta.classify === "sides") {
        const [a, b, c] = [...meta.sides!].sort((x, y) => x - y);
        expect(a + b).toBeGreaterThan(c);
        expect(p.answer).toBe({ 1: "equilateral", 2: "isosceles", 3: "scalene" }[new Set(meta.sides).size]);
        const labels = fig.sideLabels!.map((l) => l.match(/^(\d+) (cm|in|m|ft)$/));
        labels.forEach((m) => expect(m).not.toBeNull());
        expect(new Set(labels.map((m) => m![2])).size).toBe(1);
        expect(labels.map((m) => Number(m![1]))).toEqual(meta.sides);
        // Drawn to scale: each side over the sine of its opposite angle is the same (law of sines).
        const ratios = meta.sides!.map((side, i) => side / Math.sin((fig.angles[i] * Math.PI) / 180));
        ratios.forEach((r) => expect(r / ratios[0]).toBeCloseTo(1, 2));
        expect(fig.angleLabels).toEqual([null, null, null]);
        expect(fig.ticks).toBeUndefined();
      }
      break;
    }
    case "ratio": {
      const [x, y] = meta.result;
      expect(gcdI(x, y)).toBe(1);
      expect(x * meta.b).toBe(y * meta.a);
      expect(meta.a).toBeGreaterThan(x);
      expect(p.answer.match(/\d+/g)!.map(Number)).toEqual([x, y]);
      expect(bodyText(p).match(/\d+/g)!.map(Number)).toEqual([meta.a, meta.b]);
      break;
    }
    case "unit-rate": {
      expect(meta.rate * meta.count).toBe(meta.total);
      const text = bodyText(p);
      if (meta.money) {
        expect(p.answer).toMatch(/^\$\\text\{\\textdollar\}\d+\.\d{2}\$ per [a-z]+$/);
        expect(cents(p.answer)).toBe(meta.rate);
        expect(cents(text)).toBe(meta.total);
      } else {
        const m = p.answer.match(/^(\d+) ([a-z]+) per ([a-z]+)$/);
        expect(m, p.answer).not.toBeNull();
        expect(Number(m![1])).toBe(meta.rate);
        expect(text.replace(/\{,\}/g, "").match(/\d+/g)!.map(Number)).toEqual([meta.total, meta.count]);
      }
      expect(text).toContain(` ${meta.count} `);
      break;
    }
    case "evaluate": {
      const value = evalJs(meta.expr, meta.vars);
      expect(value).toBe(meta.result);
      expect(Number.isInteger(value) && value > 0).toBe(true);
      expect(num(p.answer)).toBe(value);
      // The printed LaTeX is the same expression: rebuild it as JS and evaluate.
      const text = bodyText(p);
      const js = spans(text)[0]
        .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))")
        .replace(/\^\{(\d+)\}/g, "**$1")
        .replace(/\\div/g, "/")
        .replace(/(\d)([a-z])/g, "$1*$2")
        .replace(/([a-z])([a-z])/g, "$1*$2")
        .replace(/(\d|\))\(/g, "$1*(");
      expect(evalJs(js, meta.vars)).toBe(value);
      for (const [name, v] of Object.entries(meta.vars)) expect(text).toContain(`$${name} = ${v}$`);
      break;
    }
    case "circle": {
      const r = meta.given === "r" ? meta.value : meta.value / 2;
      expect(Number.isInteger(r) && r > 0).toBe(true);
      // In hundredths, with π as 3.14.
      const hundredths = { r: r * 100, d: 2 * r * 100, C: 314 * 2 * r, A: 314 * r * r }[meta.find];
      const [units, scale] = decimal(meta.result);
      expect(units * 100).toBe(hundredths * scale);
      expect(meta.result).not.toMatch(/\.\d*0$/);
      expect(p.answer).toMatch(new RegExp(`^${meta.result.replace(".", "\\.")} (cm|m|mm|in|ft)${meta.find === "A" ? "²" : ""}$`));
      expect(p.body.kind).toBe("figure");
      if (p.body.kind !== "figure" || p.body.figure.type !== "circle") break;
      const unit = checkShapeFigure(p.body.figure);
      expect(p.body.figure.label).toBe(`${meta.given} = ${meta.value} ${unit}`);
      expect(p.answer.split(" ")[1].replace("²", "")).toBe(unit);
      expect(p.body.prompt).toBe(`Find the ${{ r: "radius", d: "diameter", C: "circumference", A: "area" }[meta.find]}.`);
      break;
    }
    case "place-name": {
      const digits = String(meta.n);
      expect(meta.power).toBeLessThan(digits.length);
      // The underlined digit is the one at that place.
      const underlined = bodyText(p).match(/\\underline\{(\d)\}/);
      expect(underlined).not.toBeNull();
      expect(underlined![1]).toBe(digits[digits.length - 1 - meta.power]);
      expect(num(bodyText(p).replace(/\\underline\{(\d)\}/, "$1"))).toBe(meta.n);
      expect(p.answer).toBe(
        ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands", "millions"][meta.power],
      );
      break;
    }
    case "parity": {
      expect(num(bodyText(p))).toBe(meta.n);
      expect(p.answer).toBe(meta.n % 2 === 0 ? "even" : "odd");
      break;
    }
    case "make-number": {
      const { digits, goal, result } = meta;
      expect(new Set(digits).size).toBe(digits.length);
      const candidates = permutations(digits)
        .filter((perm) => perm[0] !== 0)
        .map((perm) => Number(perm.join("")));
      expect(result).toBe(goal === "greatest" ? Math.max(...candidates) : Math.min(...candidates));
      expect(num(p.answer)).toBe(result);
      expect(spans(bodyText(p))[0].split(",").map((d) => Number(d.replace(/\\ /g, "")))).toEqual(digits);
      expect(bodyText(p)).toContain(`the ${goal} number`);
      break;
    }
    case "place-units": {
      const total = meta.from.reduce((s, [count, power]) => s + count * 10 ** power, 0);
      expect(total).toBe(meta.result * 10 ** meta.to);
      expect(Number.isInteger(meta.result) && meta.result > 0).toBe(true);
      expect(num(p.answer)).toBe(meta.result);
      // "3 hundreds 4 tens = □ tens": every amount printed with its place word.
      const [lhs, rhs] = bodyText(p).split(" = ");
      const amounts = [...lhs.matchAll(/\$([^$]+)\$ ([a-z]+)/g)].map(
        ([, count, word]) => [num(count), ["one", "ten", "hundred", "thousand"].indexOf(word.replace(/s$/, ""))] as [number, number],
      );
      expect(amounts).toEqual(meta.from);
      expect(rhs).toBe(`$\\square$ ${["ones", "tens", "hundreds", "thousands"][meta.to]}`);
      break;
    }
    case "repeated-addition": {
      const [sum] = spans(bodyText(p))[0].split("=");
      const addends = sum.split("+").map(num);
      expect(addends).toEqual(Array.from({ length: meta.times }, () => meta.addend));
      expect(p.answer.match(/\d+/g)!.map(Number)).toEqual([meta.times, meta.addend, meta.times * meta.addend]);
      break;
    }
    case "fraction-words": {
      const [n, d] = meta.value;
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThan(d);
      const text = bodyText(p);
      if (meta.to === "number") {
        expect(fractionFromWords(text.replace("Write as a fraction: ", ""))).toEqual(meta.value);
        expect(p.answer).toBe(`$\\frac{${n}}{${d}}$`);
      } else {
        expect(text).toBe(`Write in words: $\\frac{${n}}{${d}}$`);
        expect(fractionFromWords(p.answer)).toEqual(meta.value);
      }
      break;
    }
    case "unit-fraction-sum": {
      const [n, d] = meta.value;
      const [sumSide, fractionSide] = meta.to === "fraction" ? [bodyText(p), p.answer] : [p.answer, bodyText(p)];
      expect(sumSide.match(/\\frac\{(\d+)\}\{(\d+)\}/g)).toEqual(Array.from({ length: n }, () => `\\frac{1}{${d}}`));
      expect(fractionSide).toContain(`$\\frac{${n}}{${d}}$`);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(d);
      break;
    }
    case "factor-check": {
      expect(bodyText(p)).toBe(`Is ${meta.k} a factor of ${meta.n}?`);
      expect(p.answer).toBe(meta.n % meta.k === 0 ? "yes" : "no");
      break;
    }
    case "factor-list": {
      const expected = Array.from({ length: meta.n }, (_, i) => i + 1).filter((d) => meta.n % d === 0);
      expect(expected.length).toBeGreaterThan(2);
      expect(p.answer.split(", ").map(Number)).toEqual(expected);
      expect(bodyText(p)).toContain(` ${meta.n}.`);
      break;
    }
    case "multiples": {
      expect(p.answer.split(", ").map(Number)).toEqual(Array.from({ length: meta.count }, (_, i) => meta.k * (i + 1)));
      expect(bodyText(p)).toContain(`multiples of ${meta.k}.`);
      break;
    }
    case "decimal-digit": {
      const frac = meta.n.split(".")[1];
      const digit = frac[meta.place - 1];
      // The printed number is n with that one digit underlined.
      expect(bodyText(p).replace(/\$|\{,\}/g, "").replace(`\\underline{${digit}}`, digit)).toBe(meta.n);
      expect(bodyText(p)).toMatch(new RegExp(`\\.\\d{${meta.place - 1}}\\\\underline\\{${digit}\\}`));
      if (meta.ask === "value") {
        expect(digit).not.toBe("0");
        const [units, scale] = decimal(p.answer);
        expect(units * 10 ** meta.place).toBe(Number(digit) * scale);
      } else {
        expect(p.answer).toBe(["tenths", "hundredths", "thousandths"][meta.place - 1]);
      }
      break;
    }
    case "decimal-words": {
      // "four and thirty-seven hundredths" → 4.37
      const fromWords = (words: string): string => {
        const m = words.match(/^(?:(.+) and )?(.+) (tenths?|hundredths?|thousandths?)$/);
        expect(m, words).not.toBeNull();
        const scale = { tenth: 1, hundredth: 2, thousandth: 3 }[m![3].replace(/s$/, "") as "tenth"];
        const frac = wordsToNumber(m![2]);
        expect(m![3].endsWith("s"), words).toBe(frac !== 1);
        expect(frac).toBeLessThan(10 ** scale);
        const whole = m![1] ? wordsToNumber(m![1]) : 0;
        return `${whole}.${String(frac).padStart(scale, "0")}`;
      };
      expect(meta.n).not.toMatch(/0$/);
      const text = bodyText(p);
      if (meta.to === "number") {
        expect(fromWords(text.replace("Write as a decimal: ", ""))).toBe(meta.n);
        expect(p.answer).toBe(meta.n);
      } else {
        expect(text).toBe(`Write in words: $${meta.n}$`);
        expect(fromWords(p.answer)).toBe(meta.n);
      }
      break;
    }
    case "measure": {
      const g = meta.given;
      const expected = {
        "rect-area": () => g[0] * g[1],
        "rect-perimeter": () => 2 * (g[0] + g[1]),
        "square-area": () => g[0] * g[0],
        "square-perimeter": () => 4 * g[0],
        "missing-side-area": () => g[0] / g[1],
        "missing-side-perimeter": () => g[0] / 2 - g[1],
        "triangle-area": () => (g[0] * g[1]) / 2,
        "parallelogram-area": () => g[0] * g[1],
        "prism-volume": () => g[0] * g[1] * g[2],
      }[meta.task]();
      expect(Number.isInteger(expected) && expected > 0).toBe(true);
      expect(meta.result).toBe(expected);
      // A rectangle's length is its longer side, so a missing width is the shorter one.
      if (meta.task.startsWith("missing-side")) expect(expected).toBeLessThan(g[1]);
      const power = /area/.test(meta.task) && !meta.task.startsWith("missing") ? "²" : meta.task === "prism-volume" ? "³" : "";
      expect(p.answer).toBe(`${expected.toLocaleString("en-US")} ${meta.unit}${power}`);
      // The figure shows exactly the given numbers, each in its role.
      expect(p.body.kind).toBe("figure");
      if (p.body.kind !== "figure") break;
      const fig = p.body.figure as ShapeFigure;
      expect(checkShapeFigure(fig)).toBe(meta.unit);
      const shown = {
        "rect-area": { type: "rectangle", length: g[0], width: g[1] },
        "rect-perimeter": { type: "rectangle", length: g[0], width: g[1] },
        "square-area": { type: "rectangle", length: g[0], width: g[0], square: true },
        "square-perimeter": { type: "rectangle", length: g[0], width: g[0], square: true },
        "missing-side-area": { type: "rectangle", length: g[1], width: expected, labels: [`${g[1]} ${meta.unit}`, "?"], inside: `Area = ${g[0].toLocaleString("en-US")} ${meta.unit}²` },
        "missing-side-perimeter": { type: "rectangle", length: g[1], width: expected, labels: [`${g[1]} ${meta.unit}`, "?"], inside: `Perimeter = ${g[0].toLocaleString("en-US")} ${meta.unit}` },
        "triangle-area": { type: "base-height", shape: "triangle", base: g[0], height: g[1] },
        "parallelogram-area": { type: "base-height", shape: "parallelogram", base: g[0], height: g[1] },
        "prism-volume": { type: "prism", length: g[0], width: g[1], height: g[2] },
      }[meta.task];
      expect(fig).toMatchObject(shown);
      if (fig.type === "rectangle") {
        expect(fig.square ?? false).toBe(meta.task.startsWith("square"));
        expect(fig.inside !== undefined).toBe(meta.task.startsWith("missing"));
      }
      const asked = meta.task.startsWith("missing") ? "missing side" : meta.task === "prism-volume" ? "volume" : meta.task.split("-")[1];
      expect(p.body.prompt).toBe(`Find the ${asked}.`);
      break;
    }
    case "money-op": {
      const { op, a, b, result } = meta;
      expect(result).toBe(op === "+" ? a + b : a - b);
      expect(result).toBeGreaterThan(0);
      expect(cents(p.answer)).toBe(result);
      expect(p.body.kind).toBe("vertical");
      if (p.body.kind === "vertical") {
        const amount = (s: string) => {
          const m = s.match(/^\$(\d+)\.(\d{2})$/);
          expect(m, s).not.toBeNull();
          return Number(m![1]) * 100 + Number(m![2]);
        };
        expect([amount(p.body.top), amount(p.body.bottom)]).toEqual([a, b]);
        expect(p.body.operator).toBe(op === "+" ? "+" : "−");
      }
      break;
    }
  }
}

describe("worksheet catalog", () => {
  it("has unique grade/slug pairs", () => {
    const keys = WORKSHEETS.map((w) => `${w.grade}/${w.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("offers two or three ascending counts that fill whole rows", () => {
    for (const def of WORKSHEETS) {
      expect([2, 3], def.slug).toContain(def.counts.length);
      expect([...def.counts].sort((a, b) => a - b), def.slug).toEqual([...def.counts]);
      for (const c of def.counts) expect(c % def.columns, `${def.slug} ${c}`).toBe(0);
    }
  });

  it("resolves grade slugs strictly", () => {
    expect(parseGradeSlug("grade-4")).toBe(4);
    expect(parseGradeSlug("grade-2")).toBeNull();
    expect(parseGradeSlug("grade-04")).toBeNull();
    expect(getWorksheet("grade-4", "long-division")?.slug).toBe("long-division");
    expect(getWorksheet("grade-3", "long-division")).toBeUndefined();
  });

  it("falls back to defaults on bad params", () => {
    const def = getWorksheet("grade-3", "place-value")!;
    const p = parseWorksheetParams({ n: "999", level: "7", seed: "BAD SEED!", key: "x" }, def);
    expect(p.count).toBe(def.counts[1]);
    expect(p.level).toBe(1);
    expect(p.seed).toBeNull();
    expect(p.showKey).toBe(true);
    expect(p.showExample).toBe(true);
    expect(
      parseWorksheetParams({ n: String(def.counts[2]), level: "3", seed: "abc123", key: "0", ex: "0" }, def),
    ).toEqual({
      count: def.counts[2],
      level: 3,
      seed: "abc123",
      showKey: false,
      showExample: false,
    });
  });

  it("files every skill under a unit of its own grade and category", () => {
    for (const def of WORKSHEETS) {
      const unit = WORKSHEET_UNITS.find((u) => u.grade === def.grade && u.key === def.unit);
      expect(unit, `${def.grade}/${def.slug}`).toBeDefined();
      expect(def.category, def.slug).toBe(unit!.category);
    }
    for (const u of WORKSHEET_UNITS) {
      expect(worksheetsInUnit(u.grade, u.key).length, `${u.grade}/${u.key}`).toBeGreaterThan(0);
    }
    const keys = WORKSHEET_UNITS.map((u) => `${u.grade}/${u.key}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("gives every skill a unique code in display order", () => {
    for (const grade of WORKSHEET_GRADES) {
      const codes = skillsInOrder(grade).map((d) => skillPosition(d).code);
      expect(codes).toHaveLength(WORKSHEETS.filter((w) => w.grade === grade).length);
      expect(new Set(codes).size).toBe(codes.length);
    }
    expect(skillPosition(getWorksheet("grade-3", "place-value")!).code).toBe("A.2");
    expect([0, 25, 26, 27].map(unitLetter)).toEqual(["A", "Z", "AA", "BB"]);
  });

  it("keeps a unit's tile (chip) skills next to each other", () => {
    for (const u of WORKSHEET_UNITS) {
      const chips = worksheetsInUnit(u.grade, u.key).map((d) => d.chip !== undefined);
      expect(chips.filter((c, i) => c && !chips[i - 1]).length, u.key).toBeLessThanOrEqual(1);
    }
  });

  it("offers all three levels or just one", () => {
    for (const def of WORKSHEETS) {
      expect([[1], [1, 2, 3]], def.slug).toContainEqual([...def.levels]);
      if (def.levels.length === 1) expect(def.examples[2] ?? def.examples[3], def.slug).toBeUndefined();
    }
    // A single-level skill ignores a level from the URL.
    expect(parseWorksheetParams({ level: "3" }, getWorksheet("grade-3", "multiply-by-7")!).level).toBe(1);
  });

  it("lets answer pages take any count so older QR codes keep working", () => {
    const def = getWorksheet("grade-3", "place-value")!;
    expect(parseWorksheetParams({ n: "30" }, def).count).toBe(def.counts[1]);
    expect(parseWorksheetParams({ n: "30" }, def, { anyCount: true }).count).toBe(30);
    expect(parseWorksheetParams({ n: "41" }, def, { anyCount: true }).count).toBe(def.counts[1]);
    expect(parseWorksheetParams({ n: "0" }, def, { anyCount: true }).count).toBe(def.counts[1]);
  });
});

describe.each(WORKSHEETS.map((w) => [`grade ${w.grade} · ${w.slug}`, w] as const))("%s", (_, def) => {
  const count = def.counts[def.counts.length - 1];

  it.each([...def.levels])("level %i: deterministic, clean, and correct", (level) => {
    for (const seed of SEEDS) {
      const problems = buildWorksheet(def, { count, level, seed });
      expect(problems).toHaveLength(count);
      expect(buildWorksheet(def, { count, level, seed })).toEqual(problems);
      // Raising the count only appends.
      expect(buildWorksheet(def, { count: def.counts[0], level, seed })).toEqual(problems.slice(0, def.counts[0]));

      const json = JSON.stringify(problems);
      expect(json).not.toMatch(/NaN|undefined|Infinity/);
      expect(json).not.toMatch(/\d\.\d{7,}/);

      for (const p of problems) {
        expect(p.answer.trim()).not.toBe("");
        checkMeta(p.meta, p);
      }
    }
  });

  it("produces mostly unique problems", () => {
    const problems = buildWorksheet(def, { count: def.counts[0], level: def.levels.includes(2) ? 2 : 1, seed: "uniq" });
    const unique = new Set(problems.map((p) => JSON.stringify(p.body)));
    expect(unique.size).toBeGreaterThanOrEqual(Math.ceil(problems.length * 0.8));
  });
});

// ── Worked examples ──────────────────────────────────────────────────────────

const gcdN = (...xs: number[]) => xs.reduce((a, b) => gcdI(a, b));
const lcmN = (...xs: number[]) => xs.reduce((a, b) => (a * b) / gcdI(a, b));

/**
 * The hand-written LaTeX we use in examples, as a JS expression — or null
 * when the piece isn't plain arithmetic (a variable, a word, an arrow).
 */
function latexToJs(latex: string): string | null {
  const js = latex
    .replace(/\\boxed\{([^{}]*)\}/g, "$1")
    .replace(/\\underline\{([^{}]*)\}/g, "$1")
    .replace(/\{,\}/g, "")
    .replace(/\\text\{GCF\}/g, "gcd")
    .replace(/\\text\{LCM\}/g, "lcm")
    .replace(/(\d+)\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1+($2)/($3))")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))")
    .replace(/\\lvert/g, "Math.abs(")
    .replace(/\\rvert/g, ")")
    .replace(/\^\\circ/g, "")
    .replace(/\\%/g, "/100")
    // A ratio a : b compares like the fraction a/b.
    .replace(/:/g, "/")
    .replace(/\^\{([^{}]+)\}/g, "**($1)")
    .replace(/\\times/g, "*")
    .replace(/\\div/g, "/")
    .replace(/−/g, "-")
    .trim();
  if (js === "" || /[a-zA-Z\\<>]/.test(js.replace(/Math\.abs|gcd|lcm/g, ""))) return null;
  return js;
}

const evalLatex = (latex: string): number | null => {
  const js = latexToJs(latex);
  return js === null ? null : new Function("gcd", "lcm", `return (${js});`)(gcdN, lcmN);
};

/** Every `$…$` span: all computable sides of an `=` chain agree, and each step of a `<`/`>`/`\ge` chain holds. */
function checkMathSpans(text: string) {
  for (const [, span] of text.matchAll(/\$([^$]+)\$/g)) {
    if (span.includes("=")) {
      const values = span
        .split("=")
        .map(evalLatex)
        .filter((v): v is number => v !== null);
      for (const v of values) expect(v, span).toBeCloseTo(values[0], 9);
      continue;
    }
    // [term, symbol, term, symbol, term, …]
    const parts = span.split(/(<|>|\\ge|\\le)/);
    for (let i = 0; i + 2 < parts.length; i += 2) {
      const [left, right] = [evalLatex(parts[i]), evalLatex(parts[i + 2])];
      if (left === null || right === null) continue;
      const holds = { "<": left < right, ">": left > right, "\\ge": left >= right, "\\le": left <= right }[parts[i + 1]];
      expect(holds, span).toBe(true);
    }
  }
}

/** What a worked example's prompt asks for, worked out from its figure (π as 3.14). */
function shapeAnswer(f: ShapeFigure, prompt: string): number {
  if (f.type === "circle") {
    const n = Number(f.label.split(" ")[2]);
    const r = f.segment === "r" ? n : n / 2;
    return { "r =": r, "d =": 2 * r, "C =": (314 * 2 * r) / 100, "A =": (314 * r * r) / 100 }[prompt]!;
  }
  if (f.type === "rectangle") return { "Area =": f.length * f.width, "Perimeter =": 2 * (f.length + f.width), "? =": f.width }[prompt]!;
  if (f.type === "prism") return f.length * f.width * f.height;
  expect(prompt).toBe("Area =");
  return f.shape === "triangle" ? (f.base * f.height) / 2 : f.base * f.height;
}

function checkExampleShow(show: ExampleShow) {
  switch (show.kind) {
    case "math":
      show.lines.forEach(checkMathSpans);
      break;
    case "vertical": {
      const work = verticalWork(show.operator, show.top, show.bottom);
      if (show.operator === "×") {
        expect(Number(work.result)).toBe(Number(show.top) * Number(show.bottom));
        if (work.partials.length) expect(work.partials.reduce((s, p) => s + Number(p), 0)).toBe(Number(work.result));
      } else {
        const [a, as] = decimal(show.top);
        const [b, bs] = decimal(show.bottom);
        const [r, rs] = decimal(work.result);
        const sign = show.operator === "+" ? 1 : -1;
        expect(r * as * bs).toBe((a * bs + sign * b * as) * rs);
        expect(r).toBeGreaterThan(0);
      }
      break;
    }
    case "longdiv": {
      const { quotient, remainder } = longDivisionSteps(show.dividend, show.divisor);
      expect(quotient * show.divisor + remainder).toBe(show.dividend);
      expect(remainder).toBeLessThan(show.divisor);
      break;
    }
    case "compare": {
      const [l, r] = [evalLatex(show.left.replace(/\$/g, "")), evalLatex(show.right.replace(/\$/g, ""))];
      expect(l).not.toBeNull();
      expect(r).not.toBeNull();
      expect(show.symbol).toBe(l! < r! ? "<" : l! > r! ? ">" : "=");
      break;
    }
    case "figure": {
      const f = show.figure;
      if (f.type === "clock") {
        expect(show.answer).toBe(`${f.hour}:${String(f.minute).padStart(2, "0")}`);
      } else if (f.type === "triangle") {
        checkTriangleFigure(f);
        const asked = f.angles.filter((_, i) => f.angleLabels[i] === "?");
        expect(asked.length).toBeGreaterThan(0);
        asked.forEach((a) => expect(show.answer.startsWith(`$${a}^\\circ$`)).toBe(true));
      } else if (f.type !== "fraction-model") {
        const unit = checkShapeFigure(f);
        expect(show.answer).toBe(`${shapeAnswer(f, show.prompt)} ${unit}${{ "Area =": "²", "A =": "²", "Volume =": "³" }[show.prompt] ?? ""}`);
      } else {
        const total = f.shaded.reduce((s, x) => s + x, 0);
        expect(show.answer.startsWith(`$\\frac{${total}}{${f.parts}}$`)).toBe(true);
        checkMathSpans(`$${show.answer.replace(/\$/g, "")}$`);
      }
      break;
    }
    case "stats": {
      const counts = new Map<number, number>();
      show.data.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
      const top = Math.max(...counts.values());
      expect([...counts.values()].filter((c) => c === top)).toHaveLength(1);
      expect(Number.isInteger(describeData(show.data).mean)).toBe(true);
      break;
    }
  }
}

describe("worked examples", () => {
  it.each(WORKSHEETS.map((w) => [`grade ${w.grade} · ${w.slug}`, w] as const))("%s", (_, def) => {
    for (const level of def.levels) {
      const example = exampleFor(def, level);
      expect(example.think.trim()).not.toBe("");
      checkMathSpans(example.think);
      checkExampleShow(example.show);
    }
  });

  it("falls back to the nearest lower level", () => {
    const def = getWorksheet("grade-3", "place-value")!;
    expect(exampleFor(def, 3)).toBe(def.examples[2]);
    expect(exampleFor(def, 1)).toBe(def.examples[1]);
  });

  it("checks the chain checker itself", () => {
    expect(evalLatex("2\\frac{3}{4} + 1\\frac{3}{4}")).toBeCloseTo(4.5, 9);
    expect(evalLatex("\\lvert -8 \\rvert + (-3) \\times 2")).toBe(2);
    expect(evalLatex("\\text{GCF}(24, 36)")).toBe(12);
    expect(evalLatex("x + 7")).toBeNull();
    expect(() => checkMathSpans("$7 \\times 8 = 54$")).toThrow();
    expect(() => checkMathSpans("$3 > 5$")).toThrow();
    expect(evalLatex("45\\%")).toBeCloseTo(0.45, 9);
    expect(evalLatex("180^\\circ - 48^\\circ")).toBe(132);
    expect(evalLatex("12 : 18")).toBeCloseTo(2 / 3, 9);
    expect(() => checkMathSpans("$1 < 3 < 2$")).toThrow();
    expect(() => checkMathSpans("$12 : 18 = 3 : 4$")).toThrow();
  });
});

describe("worked-example helpers", () => {
  const rng = createRng("worked-example-helpers");
  const digitsOf = (n: number) => String(n).length;

  it("verticalWork: carries, partial products and results match plain arithmetic", () => {
    for (let i = 0; i < 200; i++) {
      const a = randInt(rng, 10, 99999);
      const b = randInt(rng, 1, 9999);
      const add = verticalWork("+", String(a), String(b));
      expect(Number(add.result)).toBe(a + b);
      // The carry into column k is the overflow of the k lower columns.
      add.carries.forEach((c, k) => {
        const expected = k === 0 ? 0 : Math.floor(((a % 10 ** k) + (b % 10 ** k)) / 10 ** k);
        expect(c ?? 0).toBe(expected);
      });

      const big = Math.max(a, b);
      const small = Math.min(a, b);
      expect(Number(verticalWork("−", String(big), String(small)).result)).toBe(big - small);

      const m = randInt(rng, 2, 9);
      const times = verticalWork("×", String(a), String(m));
      expect(Number(times.result)).toBe(a * m);
      times.carries.forEach((c, k) => {
        const expected = k === 0 ? 0 : Math.floor(((a % 10 ** k) * m) / 10 ** k);
        expect(c ?? 0).toBe(expected);
      });

      const long = verticalWork("×", String(a), String(b));
      expect(Number(long.result)).toBe(a * b);
      const nonzero = [...String(b)].filter((d) => d !== "0").length;
      expect(long.partials).toHaveLength(nonzero > 1 ? nonzero : 0);
      if (long.partials.length) expect(long.partials.reduce((s, p) => s + Number(p), 0)).toBe(a * b);
      expect(digitsOf(a)).toBe(times.carries.length);
    }
  });

  it("verticalWork keeps decimals exact and aligned", () => {
    expect(verticalWork("+", "7.5", "2.36").result).toBe("9.86");
    expect(verticalWork("+", "12.4", "5.8")).toEqual({ carries: [null, 1, null], partials: [], result: "18.2" });
    expect(verticalWork("−", "23.45", "8.17").result).toBe("15.28");
    expect(verticalWork("+", "2.35", "1.65").result).toBe("4.00");
  });

  it("longDivisionSteps writes out a correct division", () => {
    for (let i = 0; i < 200; i++) {
      const divisor = randInt(rng, 2, 9);
      const dividend = randInt(rng, divisor, 99999);
      const { quotient, remainder, firstCol, steps } = longDivisionSteps(dividend, divisor);
      expect(quotient).toBe(Math.floor(dividend / divisor));
      expect(remainder).toBe(dividend % divisor);
      expect(digitsOf(quotient)).toBe(digitsOf(dividend) - firstCol);
      expect(steps).toHaveLength(digitsOf(quotient));
      for (const s of steps) {
        expect(s.product % divisor).toBe(0);
        expect(s.difference).toBeGreaterThanOrEqual(0);
        expect(s.difference).toBeLessThan(divisor);
      }
    }
  });

  it("describeData matches a direct calculation", () => {
    expect(describeData([4, 7, 2, 7, 10])).toMatchObject({ mean: 6, median: 7, mode: 7, range: 8 });
    expect(describeData([3, 8, 5, 8, 6, 12])).toMatchObject({ mean: 7, median: 7, mode: 8, range: 9 });
  });
});
