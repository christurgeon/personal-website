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

export const CARD_BGS = ["var(--yellow)", "var(--pink)", "var(--blue)", "var(--green)"] as const;
export const CARD_FGS = ["var(--ink)", "var(--ink)", "var(--paper)", "var(--ink)"] as const;
export const STRIPE_COLORS = ["var(--yellow)", "var(--pink)", "var(--blue)", "var(--green)", "var(--red)"] as const;
export const TAG_COLORS = ["var(--yellow)", "var(--pink)", "var(--green)", "var(--blue)"] as const;

export const COLOR_PAIRS: Record<RisoColor, { bg: string; fg: string }> = {
  red: { bg: "var(--red)", fg: "var(--paper)" },
  blue: { bg: "var(--blue)", fg: "var(--paper)" },
  green: { bg: "var(--green)", fg: "var(--ink)" },
  yellow: { bg: "var(--yellow)", fg: "var(--ink)" },
  pink: { bg: "var(--pink)", fg: "var(--ink)" },
};
