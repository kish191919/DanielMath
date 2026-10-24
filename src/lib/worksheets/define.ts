import type { Generator, Level, WorksheetDef, WorksheetExample } from "./types";

// Both close over the generator's param type so the catalog can hold
// worksheets with different param shapes in one array. Every worksheet has
// Easy / Medium / Hard levels.

/** A topic whose levels may each have their own worked example. */
export function defineWorksheet<P>(
  def: Omit<WorksheetDef, "generate"> & { generator: Generator<P>; levels: Record<Level, P> },
): WorksheetDef {
  const { generator, levels, ...rest } = def;
  return { ...rest, generate: (rng, level) => generator(rng, levels[level]) };
}

/** A narrow skill: one worked example, with smaller or bigger numbers by level. */
export function defineSkill<P>(
  def: Omit<WorksheetDef, "generate" | "examples"> & {
    generator: Generator<P>;
    levels: Record<Level, P>;
    example: WorksheetExample;
  },
): WorksheetDef {
  const { generator, levels, example, ...rest } = def;
  return { ...rest, examples: { 1: example }, generate: (rng, level) => generator(rng, levels[level]) };
}
