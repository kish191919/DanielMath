// Seeded PRNG so a worksheet URL (grade/topic/level/seed) always reproduces
// the exact same problems — that's what lets the printed QR code point at a
// matching answer key without storing anything in the database.

/** Returns a float in [0, 1). */
export type Rng = () => number;

// xmur3 string hash → 32-bit seed for mulberry32.
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export function createRng(seed: string): Rng {
  let a = hashSeed(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Inclusive on both ends. */
export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Random integer with exactly `digits` digits. */
export function randDigits(rng: Rng, digits: number): number {
  return randInt(rng, 10 ** (digits - 1), 10 ** digits - 1);
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const SEED_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";
export const SEED_PATTERN = /^[a-z0-9]{3,12}$/;

/** A fresh, URL-safe seed (not itself seeded — uses Math.random). */
export function newSeed(): string {
  let s = "";
  for (let i = 0; i < 6; i++) s += SEED_ALPHABET[Math.floor(Math.random() * SEED_ALPHABET.length)];
  return s;
}
