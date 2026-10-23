import type { TopicCategory } from "@/lib/curriculum-data";
import type { Quarter } from "@/lib/curriculum-quarter";
import type { Rng } from "./rng";

export type GradeNum = 3 | 4 | 5 | 6;
export type Level = 1 | 2 | 3;

/** [numerator, denominator], denominator > 0. */
export type Rational = readonly [number, number];

export type FigureSpec =
  | { type: "clock"; hour: number; minute: number }
  // One entry per whole drawn; each value is how many of `parts` are shaded.
  | { type: "fraction-model"; shape: "circle" | "bar"; parts: number; shaded: number[] };

// Everything a printed problem shows. Text fields may contain `$...$` LaTeX
// spans (rendered by MathText — same convention as src/lib/ai/math-notation.ts).
export type ProblemBody =
  | { kind: "text"; text: string; blank: "inline" | "line" | "none" }
  | { kind: "vertical"; operator: "+" | "−" | "×"; top: string; bottom: string; align: "right" | "decimal" }
  | { kind: "longdiv"; divisor: string; dividend: string }
  | { kind: "compare"; left: string; right: string }
  | { kind: "figure"; figure: FigureSpec; prompt: string }
  | { kind: "fields"; text: string; fields: string[] };

// Structured facts about each problem, never rendered. They exist so the test
// suite can re-derive every answer independently of the generator that wrote
// the answer text (see worksheets.test.ts).
export type ProblemMeta =
  | { type: "int-op"; op: "+" | "-" | "*" | "/"; a: number; b: number; result: number; unknown: "a" | "b" | "result" }
  | { type: "long-division"; dividend: number; divisor: number; quotient: number; remainder: number }
  | { type: "decimal-op"; op: "+" | "-" | "*" | "/"; a: string; b: string; result: string }
  | { type: "fraction-op"; op: "+" | "-" | "*" | "/"; a: Rational; b: Rational; result: Rational }
  | { type: "fraction-value"; value: Rational }
  | { type: "equivalent"; left: Rational; right: Rational; missingPart: "num" | "den" }
  | { type: "compare"; left: Rational; right: Rational; symbol: "<" | ">" | "=" }
  | { type: "place-value"; n: number; power: number; value: number }
  | { type: "rounding"; n: number; place: number; result: number }
  | { type: "factor-pairs"; n: number; pairs: [number, number][] }
  | { type: "gcf" | "lcm"; numbers: number[]; result: number }
  | { type: "prime-factorization"; n: number; factors: number[] }
  | { type: "prime-check"; n: number; isPrime: boolean }
  // `expr` is a plain JS expression (`*`, `/`, `**`, `Math.abs`) equivalent
  // to the rendered LaTeX, so tests can evaluate it directly.
  | { type: "expression"; expr: string; result: number }
  // `lhs` is a JS expression in `variable`; substituting `solution` must make
  // it equal `rhs`.
  | { type: "equation"; variable: string; lhs: string; rhs: number; solution: number }
  | { type: "stats"; data: number[]; mean: number; median: number; mode: number; range: number }
  | { type: "clock"; hour: number; minute: number };

export type WorksheetProblem = {
  body: ProblemBody;
  /** Answer as shown on the answer key; may contain `$...$`. */
  answer: string;
  meta: ProblemMeta;
};

export type Generator<P> = (rng: Rng, params: P) => WorksheetProblem;

// The worked example printed above the problems. Vertical, long-division and
// stats examples are solved at render time from the numbers given here, so
// only `math` lines and `think` text are hand-written — and the test suite
// checks every `=` chain in those.
export type ExampleShow =
  | { kind: "math"; lines: string[] }
  | { kind: "vertical"; operator: "+" | "−" | "×"; top: string; bottom: string; align: "right" | "decimal" }
  | { kind: "longdiv"; divisor: number; dividend: number }
  | { kind: "compare"; left: string; right: string; symbol: "<" | ">" | "=" }
  | { kind: "figure"; figure: FigureSpec; prompt: string; answer: string }
  | { kind: "stats"; data: number[] };

export type WorksheetExample = {
  show: ExampleShow;
  /** One-line explanation after "Think:"; may contain `$...$`. */
  think: string;
};

export type WorksheetDef = {
  grade: GradeNum;
  slug: string;
  title: { en: string; ko: string };
  description: { en: string; ko: string };
  /** Printed on the sheet — English only (students learn in English). */
  instructions: string;
  category: TopicCategory;
  /** concepts.code in the DB — kept for linking sheets to 오답노트 later. */
  conceptCode: string;
  /** FCPS Standard-track quarter in which the topic is taught. */
  quarter?: Quarter;
  /**
   * Allowed problem counts (2–3), ascending; the middle one — or the larger of
   * two — is the default. Each is a multiple of `columns` and was measured to
   * print on a single Letter page with the example box shown.
   */
  counts: readonly number[];
  columns: 2 | 3 | 4;
  /** A level without its own example uses the nearest lower level's (see exampleFor). */
  examples: { 1: WorksheetExample; 2?: WorksheetExample; 3?: WorksheetExample };
  generate: (rng: Rng, level: Level) => WorksheetProblem;
};
