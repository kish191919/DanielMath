import type { Generator, Level, WorksheetDef, WorksheetExample } from "./types";

const ALL_LEVELS: readonly Level[] = [1, 2, 3];

// Both close over the generator's param type so the catalog can hold
// worksheets with different param shapes in one array.

/** A topic with Easy / Medium / Hard levels. */
export function defineWorksheet<P>(
  def: Omit<WorksheetDef, "generate" | "levels"> & { generator: Generator<P>; levels: Record<Level, P> },
): WorksheetDef {
  const { generator, levels, ...rest } = def;
  return { ...rest, levels: ALL_LEVELS, generate: (rng, level) => generator(rng, levels[level]) };
}

/** A narrow skill with a single level — the skill list itself is the progression. */
export function defineSkill<P>(
  def: Omit<WorksheetDef, "generate" | "levels" | "examples"> & {
    generator: Generator<P>;
    params: P;
    example: WorksheetExample;
  },
): WorksheetDef {
  const { generator, params, example, ...rest } = def;
  return { ...rest, levels: [1], examples: { 1: example }, generate: (rng) => generator(rng, params) };
}
