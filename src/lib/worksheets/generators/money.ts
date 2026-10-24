import { pick, randInt, shuffle, type Rng } from "../rng";
import { moneyLatex } from "../math";
import type { Generator } from "../types";

type Piece = { cents: number; one: string; many: string };

const COINS: Piece[] = [
  { cents: 25, one: "quarter", many: "quarters" },
  { cents: 10, one: "dime", many: "dimes" },
  { cents: 5, one: "nickel", many: "nickels" },
  { cents: 1, one: "penny", many: "pennies" },
];

const ONE_DOLLAR: Piece = { cents: 100, one: "one-dollar bill", many: "one-dollar bills" };

/** 2–4 coin kinds, biggest first, 1–4 of each. */
function coinSet(rng: Rng, kinds: number): [Piece, number][] {
  const chosen = shuffle(rng, COINS).slice(0, kinds);
  return COINS.filter((c) => chosen.includes(c)).map((c) => [c, randInt(rng, 1, 4)]);
}

/** "$3.45" as printed in a vertical problem (plain text, not MathText). */
const dollars = (cents: number) => `$${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;

export const moneyOps: Generator<{ max: number }> = (rng, { max }) => {
  const op = pick(rng, ["+", "-"] as const);
  let a: number;
  let b: number;
  do {
    a = randInt(rng, 100, max);
    b = randInt(rng, 100, max);
  } while (a === b);
  if (op === "-" && a < b) [a, b] = [b, a];
  const result = op === "+" ? a + b : a - b;
  return {
    body: { kind: "vertical", operator: op === "+" ? "+" : "−", top: dollars(a), bottom: dollars(b), align: "decimal" },
    answer: `$${moneyLatex(result)}$`,
    meta: { type: "money-op", op, a, b, result },
  };
};

export const countMoney: Generator<{ mode: "coins" | "bills" | "change" }> = (rng, { mode }) => {
  if (mode === "change") {
    const paid = pick(rng, [100, 500, 1000]);
    let price: number;
    // Never a whole-dollar price — counting up through the cents is the skill.
    do price = randInt(rng, paid === 100 ? 10 : paid - 400, paid - 5);
    while (price % 100 === 0);
    const result = paid - price;
    return {
      body: {
        kind: "text",
        text: `Pay $${moneyLatex(paid)}$ for something that costs $${moneyLatex(price)}$. How much change?`,
        blank: "line",
      },
      answer: `$${moneyLatex(result)}$`,
      meta: { type: "money", items: [[price, 1]], paid, result },
    };
  }

  for (;;) {
    const set: [Piece, number][] =
      mode === "coins"
        ? coinSet(rng, randInt(rng, 2, 4))
        : [[ONE_DOLLAR, randInt(rng, 1, 4)], ...coinSet(rng, randInt(rng, 2, 3))];
    const total = set.reduce((s, [p, n]) => s + p.cents * n, 0);
    // Grade 3 counts coins under $1 and bills with coins up to $5.
    if (mode === "coins" ? total >= 100 : total > 500) continue;
    const text = set.map(([p, n]) => `${n} ${n === 1 ? p.one : p.many}`).join(", ");

    return {
      body: { kind: "text", text, blank: "line" },
      answer: mode === "coins" ? `${total}¢` : `$${moneyLatex(total)}$`,
      meta: { type: "money", items: set.map(([p, n]) => [p.cents, n]), paid: null, result: total },
    };
  }
};
