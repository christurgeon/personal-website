export type RisoColor = "red" | "blue" | "green" | "yellow" | "pink";

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickByIndex<T>(arr: readonly T[], i: number): T {
  return arr[((i % arr.length) + arr.length) % arr.length];
}

// Background/foreground pairs are index-parallel. Text colors use the
// fixed --on-<hue> tokens defined in globals.css (they don't flip with
// theme), so callers get legible contrast in both light and dark modes.

export const CARD_BGS = ["var(--yellow)", "var(--pink)", "var(--blue)", "var(--green)"] as const;
export const CARD_FGS = ["var(--on-yellow)", "var(--on-pink)", "var(--on-blue)", "var(--on-green)"] as const;

export const STRIPE_COLORS = ["var(--yellow)", "var(--pink)", "var(--blue)", "var(--green)", "var(--red)"] as const;

export const TAG_COLORS = ["var(--yellow)", "var(--pink)", "var(--green)", "var(--blue)"] as const;
export const TAG_FGS = ["var(--on-yellow)", "var(--on-pink)", "var(--on-green)", "var(--on-blue)"] as const;

export const COLOR_PAIRS: Record<RisoColor, { bg: string; fg: string }> = {
  red: { bg: "var(--red)", fg: "var(--on-red)" },
  blue: { bg: "var(--blue)", fg: "var(--on-blue)" },
  green: { bg: "var(--green)", fg: "var(--on-green)" },
  yellow: { bg: "var(--yellow)", fg: "var(--on-yellow)" },
  pink: { bg: "var(--pink)", fg: "var(--on-pink)" },
};
