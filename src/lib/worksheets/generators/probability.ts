import { pick, randInt, shuffle, type Rng } from "../rng";
import { fractionLatex, isPrime, simplify } from "../math";
import type { Generator, ProbabilityEvent } from "../types";

type NumberEvent = { kind: Exclude<ProbabilityEvent, "color" | "not-color" | "either-color">; k?: number };

function holds(e: NumberEvent, x: number): boolean {
  switch (e.kind) {
    case "even":
      return x % 2 === 0;
    case "odd":
      return x % 2 === 1;
    case "prime":
      return isPrime(x);
    case "multiple":
      return x % e.k! === 0;
    case "greater":
      return x > e.k!;
    case "less":
      return x < e.k!;
    case "equal":
      return x === e.k;
  }
}

function eventLabel(e: NumberEvent): string {
  switch (e.kind) {
    case "even":
    case "odd":
    case "prime":
      return e.kind;
    case "multiple":
      return `multiple of ${e.k}`;
    case "greater":
      return `greater than ${e.k}`;
    case "less":
      return `less than ${e.k}`;
    case "equal":
      return String(e.k);
  }
}

const CUBE_EVENTS: readonly NumberEvent["kind"][] = ["even", "odd", "prime", "multiple", "greater", "less", "equal"];

// Number-cube events include one impossible (7) and one certain (less than 7)
// case, so 0 and 1 show up as answers now and then.
function cubeEvent(rng: Rng, kinds: readonly NumberEvent["kind"][]): NumberEvent {
  const kind = pick(rng, kinds);
  if (kind === "multiple") return { kind, k: 3 };
  if (kind === "greater") return { kind, k: randInt(rng, 1, 5) };
  if (kind === "less") return { kind, k: randInt(rng, 2, 7) };
  if (kind === "equal") return { kind, k: randInt(rng, 1, 7) };
  return { kind };
}

function cardEvent(rng: Rng, max: number): NumberEvent {
  const kind = pick(rng, ["even", "odd", "prime", "multiple", "greater"] as const);
  if (kind === "multiple") return { kind, k: randInt(rng, 3, 5) };
  if (kind === "greater") return { kind, k: randInt(rng, 2, max - 2) };
  return { kind };
}

const COLORS = ["red", "blue", "green", "yellow"] as const;

export const probability: Generator<{
  mode: "cube" | "bag" | "cards";
  /** Number-cube events to ask about. */
  events?: readonly NumberEvent["kind"][];
  /** How many cards there may be. */
  cards?: readonly number[];
  /** Range of how many colors are in the bag. */
  colors?: readonly [number, number];
}> = (rng, { mode, events = CUBE_EVENTS, cards = [10, 12, 20], colors: colorRange = [2, 4] }) => {
  if (mode === "bag") {
    const colors: string[] = shuffle(rng, COLORS).slice(0, randInt(rng, colorRange[0], colorRange[1]));
    const counts = colors.map(() => randInt(rng, 1, 6));
    const outcomes = colors.flatMap((c, i) => Array<string>(counts[i]).fill(c));
    const kind = pick(rng, colors.length > 2 ? (["color", "not-color", "either-color"] as const) : (["color", "not-color"] as const));
    const picked = shuffle(rng, colors).slice(0, kind === "either-color" ? 2 : 1);
    const favorable = outcomes.filter((c) => (kind === "not-color" ? c !== picked[0] : picked.includes(c))).length;
    const result = simplify([favorable, outcomes.length]);
    const contents = colors.map((c, i) => `${counts[i]} ${c}`);
    const list = contents.length === 2 ? contents.join(" and ") : `${contents.slice(0, -1).join(", ")}, and ${contents.at(-1)}`;
    const label = kind === "not-color" ? `not ${picked[0]}` : picked.join(" or ");

    return {
      body: {
        kind: "text",
        text: `A bag has ${list} marbles. Pick one without looking. P(${label}) =`,
        blank: "inline",
      },
      answer: `$${fractionLatex(result)}$`,
      meta: { type: "probability", outcomes, event: { kind, colors: picked }, result },
    };
  }

  const max = mode === "cube" ? 6 : pick(rng, cards);
  const event = mode === "cube" ? cubeEvent(rng, events) : cardEvent(rng, max);
  const outcomes = Array.from({ length: max }, (_, i) => i + 1);
  const result = simplify([outcomes.filter((x) => holds(event, x)).length, max]);
  const setup = mode === "cube" ? "Roll a number cube numbered 1 to 6." : `Pick one card from cards numbered 1 to ${max}.`;

  return {
    body: { kind: "text", text: `${setup} P(${eventLabel(event)}) =`, blank: "inline" },
    answer: `$${fractionLatex(result)}$`,
    meta: { type: "probability", outcomes, event, result },
  };
};
