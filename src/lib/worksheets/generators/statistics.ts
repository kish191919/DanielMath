import { randInt, shuffle } from "../rng";
import type { Generator, Statistic } from "../types";

const ALL: readonly Statistic[] = ["mean", "median", "mode", "range"];
const LABEL: Record<Statistic, string> = { mean: "Mean", median: "Median", mode: "Mode", range: "Range" };

export const meanMedianModeRange: Generator<{
  size: readonly [number, number];
  maxValue: number;
  /** Odd-sized sets only, so the median is always a listed value. */
  oddOnly: boolean;
  /** Which statistics to ask for. */
  ask?: readonly Statistic[];
}> = (rng, { size, maxValue, oddOnly, ask = ALL }) => {
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
    const values: Record<Statistic, number> = { mean, median, mode, range };

    return {
      body: {
        kind: "fields",
        text: shown.join(", "),
        fields: ask.map((s) => LABEL[s]),
      },
      answer: ask.map((s) => `${LABEL[s]} ${values[s]}`).join(" · "),
      meta: { type: "stats", data: shown, mean, median, mode, range },
    };
  }
};
