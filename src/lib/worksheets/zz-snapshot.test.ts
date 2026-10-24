import { writeFileSync } from "node:fs";
import { it } from "vitest";
import { WORKSHEETS } from "./catalog";
import { createRng } from "./rng";

// Temporary: generator output per def/level under a level-independent rng key.
// SNAP_MODE=old maps a single-level skill's level 1 to "medium" (2).
it("snapshot", () => {
  const out: Record<string, unknown> = {};
  const old = process.env.SNAP_MODE === "old";
  for (const def of WORKSHEETS) {
    const levels = (def as { levels?: readonly number[] }).levels ?? [1, 2, 3];
    for (const level of levels) {
      const label = old && levels.length === 1 ? 2 : level;
      const key = `${def.grade}/${def.slug}/L${label}`;
      const rows: unknown[] = [];
      for (let s = 0; s < 40; s++) {
        const rng = createRng(`${key}/snap${s}`);
        for (let i = 0; i < 20; i++) rows.push(def.generate(rng, level as 1 | 2 | 3));
      }
      out[key] = rows;
    }
  }
  writeFileSync(process.env.SNAP_OUT!, JSON.stringify(out));
});
