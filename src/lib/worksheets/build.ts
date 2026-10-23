import { z } from "zod";
import { createRng, SEED_PATTERN } from "./rng";
import type { Level, WorksheetDef, WorksheetProblem } from "./types";

// Per-slot retry cap for de-duplicating problems. Small problem spaces (e.g.
// 0–5 facts) can run out of unique problems; after this many tries a repeat is
// accepted rather than looping forever.
const UNIQUE_ATTEMPTS = 25;

export type WorksheetOptions = { count: number; level: Level; seed: string };

/**
 * Deterministic: the same def + options always yields the same problems, and
 * raising `count` only appends — the first N problems stay the same.
 */
export function buildWorksheet(def: WorksheetDef, { count, level, seed }: WorksheetOptions): WorksheetProblem[] {
  const rng = createRng(`${def.grade}/${def.slug}/${level}/${seed}`);
  const problems: WorksheetProblem[] = [];
  const seen = new Set<string>();
  while (problems.length < count) {
    let problem = def.generate(rng, level);
    for (let attempt = 1; attempt < UNIQUE_ATTEMPTS && seen.has(JSON.stringify(problem.body)); attempt++) {
      problem = def.generate(rng, level);
    }
    seen.add(JSON.stringify(problem.body));
    problems.push(problem);
  }
  return problems;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (v: unknown) => (Array.isArray(v) ? v[0] : v);

// Every field falls back to undefined on bad input — a mangled URL should
// still render a worksheet with defaults, not 404.
const ParamsSchema = z.object({
  n: z.preprocess(first, z.coerce.number().int()).optional().catch(undefined),
  level: z.preprocess(first, z.enum(["1", "2", "3"])).optional().catch(undefined),
  seed: z.preprocess(first, z.string().regex(SEED_PATTERN)).optional().catch(undefined),
  key: z.preprocess(first, z.enum(["0", "1"])).optional().catch(undefined),
});

export type WorksheetParams = {
  count: number;
  level: Level;
  /** null when the URL had none — the page picks a fresh one. */
  seed: string | null;
  showKey: boolean;
};

export function defaultCount(def: WorksheetDef): number {
  return def.counts[Math.floor(def.counts.length / 2)];
}

export function parseWorksheetParams(raw: RawSearchParams, def: WorksheetDef): WorksheetParams {
  const p = ParamsSchema.parse(raw);
  return {
    count: p.n !== undefined && def.counts.includes(p.n) ? p.n : defaultCount(def),
    level: p.level ? (Number(p.level) as Level) : 1,
    seed: p.seed ?? null,
    showKey: p.key !== "0",
  };
}

export function worksheetQuery({ count, level, seed, showKey }: WorksheetParams & { seed: string }): string {
  const q = new URLSearchParams({ n: String(count), level: String(level), seed });
  if (!showKey) q.set("key", "0");
  return q.toString();
}
