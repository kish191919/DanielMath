import { randInt, shuffle } from "../rng";
import type { Generator } from "../types";

export const meanMedianModeRange: Generator<{
  size: readonly [number, number];
  maxValue: number;
  /** Odd-sized sets only, so the median is always a listed value. */
  oddOnly: boolean;
}> = (rng, { size, maxValue, oddOnly }) => {
  for (;;) {
    let n = randInt(rng, size[0], size[1]);
    if (oddOnly && n % 2 === 0) n += n < size[1] ? 1 : -1;
    // Exactly one value appears twice and the rest once, so the mode is unique.
    const mode = randInt(rng, 1, maxValue);
    const pool = shuffle(
      rng,
      Array.from({ length: maxValue }, (_, i) => i + 1).filter((v) => v !== mode),
    );
    const data = [mode, mode, ...pool.slice(0, n - 2)];
    const sum = data.reduce((s, v) => s + v, 0);
    // Whole-number means only.
    if (sum % n !== 0) continue;

    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const mean = sum / n;
    const range = sorted[n - 1] - sorted[0];
    const shown = shuffle(rng, data);

    return {
      body: {
        kind: "fields",
        text: shown.join(", "),
        fields: ["Mean", "Median", "Mode", "Range"],
      },
      answer: `Mean ${mean} · Median ${median} · Mode ${mode} · Range ${range}`,
      meta: { type: "stats", data: shown, mean, median, mode, range },
    };
  }
};
