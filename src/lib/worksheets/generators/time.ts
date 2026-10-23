import { randInt } from "../rng";
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
