import { pick, randInt } from "../rng";
import type { Generator } from "../types";

export const tellingTime: Generator<{ minuteStep: 30 | 5 | 1 }> = (rng, { minuteStep }) => {
  const hour = randInt(rng, 1, 12);
  const minute = randInt(rng, 0, 60 / minuteStep - 1) * minuteStep;

  return {
    body: { kind: "figure", figure: { type: "clock", hour, minute }, prompt: "Time:" },
    answer: `${hour}:${String(minute).padStart(2, "0")}`,
    meta: { type: "clock", hour, minute },
  };
};

/** Minutes after midnight → "4:15 p.m." */
function clockTime(t: number): string {
  const hour = Math.floor(t / 60) % 12 || 12;
  return `${hour}:${String(t % 60).padStart(2, "0")} ${t >= 720 ? "p.m." : "a.m."}`;
}

function duration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const parts = [h && `${h} hour${h === 1 ? "" : "s"}`, m && `${m} minute${m === 1 ? "" : "s"}`];
  return parts.filter(Boolean).join(" ");
}

export const elapsedTime: Generator<{
  unknowns: readonly ("elapsed" | "start" | "end")[];
  wholeHours: boolean;
  /** Minute step for start times and durations. */
  step: 1 | 5 | 15;
}> = (rng, { unknowns, wholeHours, step }) => {
  const unknown = pick(rng, unknowns);
  for (;;) {
    // Grade 3 stays within one a.m. or p.m. stretch: 1:00 to 11:55.
    const half = pick(rng, [0, 720]);
    const start = half + 60 + randInt(rng, 0, Math.floor(655 / step)) * step;
    const elapsed = wholeHours ? randInt(rng, 1, 6) * 60 : randInt(rng, 3, Math.floor(300 / step)) * step;
    const end = start + elapsed;
    if (end > half + 715) continue;
    // The hours-and-minutes levels always have leftover minutes.
    if (!wholeHours && elapsed % 60 === 0) continue;

    const text =
      unknown === "elapsed"
        ? `From ${clockTime(start)} to ${clockTime(end)}:`
        : unknown === "end"
          ? `Starts at ${clockTime(start)} and lasts ${duration(elapsed)}. Ends at:`
          : `Ends at ${clockTime(end)} after ${duration(elapsed)}. Started at:`;

    return {
      body: { kind: "text", text, blank: "inline" },
      answer: unknown === "elapsed" ? duration(elapsed) : clockTime(unknown === "end" ? end : start),
      meta: { type: "elapsed-time", start, end, unknown },
    };
  }
};
