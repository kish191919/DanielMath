import { describe, expect, it } from "vitest";
import { buildWorksheet, parseWorksheetParams } from "./build";
import { getWorksheet, parseGradeSlug, WORKSHEETS } from "./catalog";
import type { Level, ProblemMeta, Rational, WorksheetProblem } from "./types";

const LEVELS: Level[] = [1, 2, 3];
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
  }
}

describe("worksheet catalog", () => {
  it("has unique grade/slug pairs", () => {
    const keys = WORKSHEETS.map((w) => `${w.grade}/${w.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("resolves grade slugs strictly", () => {
    expect(parseGradeSlug("grade-4")).toBe(4);
    expect(parseGradeSlug("grade-2")).toBeNull();
    expect(parseGradeSlug("grade-04")).toBeNull();
    expect(getWorksheet("grade-4", "long-division")?.slug).toBe("long-division");
    expect(getWorksheet("grade-3", "long-division")).toBeUndefined();
  });

  it("falls back to defaults on bad params", () => {
    const def = WORKSHEETS[0];
    const p = parseWorksheetParams({ n: "999", level: "7", seed: "BAD SEED!", key: "x" }, def);
    expect(p.count).toBe(def.counts[1]);
    expect(p.level).toBe(1);
    expect(p.seed).toBeNull();
    expect(p.showKey).toBe(true);
    expect(parseWorksheetParams({ n: String(def.counts[2]), level: "3", seed: "abc123", key: "0" }, def)).toEqual({
      count: def.counts[2],
      level: 3,
      seed: "abc123",
      showKey: false,
    });
  });
});

describe.each(WORKSHEETS.map((w) => [`grade ${w.grade} · ${w.slug}`, w] as const))("%s", (_, def) => {
  const count = def.counts[def.counts.length - 1];

  it.each(LEVELS)("level %i: deterministic, clean, and correct", (level) => {
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
    const problems = buildWorksheet(def, { count: def.counts[0], level: 2, seed: "uniq" });
    const unique = new Set(problems.map((p) => JSON.stringify(p.body)));
    expect(unique.size).toBeGreaterThanOrEqual(Math.ceil(problems.length * 0.8));
  });
});
