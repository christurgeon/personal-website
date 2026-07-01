import { hashString } from "@/lib/riso";

// Hex mirrors of the light-mode tokens in src/app/globals.css.
// Satori (ImageResponse) cannot resolve CSS variables, so these are
// duplicated here on purpose — keep in sync with globals.css.
export const OG_COLORS = {
  paper: "#fffbe9",
  ink: "#0a0a0a",
  card: "#ffffff",
  muted: "#4a4a4a",
  yellow: "#fde047",
  red: "#f43f5e",
  blue: "#3b5bf1",
  green: "#2cc27a",
  pink: "#f9a8d4",
} as const;

const SHAPE_COLORS = [OG_COLORS.green, OG_COLORS.red, OG_COLORS.yellow, OG_COLORS.pink, OG_COLORS.blue] as const;

export interface OgShape {
  kind: "circle" | "square";
  color: string;
  size: number;
  pos: { top?: number; left?: number; right?: number; bottom?: number };
  rotate?: number;
}

/** Title size tiers so long titles still fit the card: <40 chars → 72px, 40–70 → 60px, >70 → 50px. */
export function titleFontSize(title: string): number {
  if (title.length < 40) return 72;
  if (title.length <= 70) return 60;
  return 50;
}

/** Seeded shape composition, mirroring RisoThumbnail's hash/variant approach. */
export function pickOgShapes(seed: string): OgShape[] {
  const h = hashString(seed);
  const c = (i: number) => SHAPE_COLORS[(h + i) % SHAPE_COLORS.length];
  const variant = (h >>> 4) % 4;

  const compositions: OgShape[][] = [
    [
      { kind: "circle", color: c(0), size: 230, pos: { top: -70, left: -60 } },
      { kind: "circle", color: c(1), size: 250, pos: { bottom: -80, right: -70 } },
      { kind: "square", color: c(2), size: 76, pos: { top: 40, right: 130 }, rotate: 18 },
    ],
    [
      { kind: "circle", color: c(0), size: 240, pos: { top: -80, right: -60 } },
      { kind: "circle", color: c(1), size: 220, pos: { bottom: -70, left: -70 } },
      { kind: "square", color: c(2), size: 80, pos: { bottom: 60, right: 90 }, rotate: -12 },
    ],
    [
      { kind: "circle", color: c(0), size: 260, pos: { left: -90, top: 185 } },
      { kind: "square", color: c(1), size: 84, pos: { top: 40, right: 60 }, rotate: 15 },
      { kind: "circle", color: c(2), size: 180, pos: { bottom: -60, right: 40 } },
    ],
    [
      { kind: "circle", color: c(0), size: 210, pos: { bottom: -60, left: 60 } },
      { kind: "circle", color: c(1), size: 230, pos: { top: -70, right: 40 } },
      { kind: "square", color: c(2), size: 72, pos: { left: 40, top: 60 }, rotate: -8 },
    ],
  ];

  return compositions[variant];
}
