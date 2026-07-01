import { readFile } from "fs/promises";
import path from "path";
import type { ReactElement } from "react";
import { OG_COLORS, pickOgShapes, titleFontSize } from "@/lib/og/palette";

export const OG_SIZE = { width: 1200, height: 630 };

export interface OgCardProps {
  title: string;
  tag?: string;
  meta: string;
  seed: string;
}

// ~2.4px ink dots on an 18px grid, tiled via SVG data URI (Satori supports
// backgroundImage + backgroundRepeat; CSS gradients patterns are flakier).
const DOT_TILE = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><circle cx="4" cy="4" r="2.4" fill="${OG_COLORS.ink}" opacity="0.22"/></svg>`;
const DOT_GRID = `url("data:image/svg+xml,${encodeURIComponent(DOT_TILE)}")`;

const FONTS_DIR = path.join(process.cwd(), "src", "lib", "og", "fonts");

/**
 * Reads vendored TTFs from disk. Requires the Node runtime — og routes must
 * never set `runtime = "edge"`. Safe because every og route is statically
 * prerendered at build time, when src/ is present.
 */
export async function loadOgFonts() {
  const [archivo, spaceMono] = await Promise.all([
    readFile(path.join(FONTS_DIR, "ArchivoBlack-Regular.ttf")),
    readFile(path.join(FONTS_DIR, "SpaceMono-Bold.ttf")),
  ]);
  return [
    { name: "Archivo Black", data: archivo, weight: 400 as const, style: "normal" as const },
    { name: "Space Mono", data: spaceMono, weight: 700 as const, style: "normal" as const },
  ];
}

/** The approved "Card on Paper" layout: white hard-shadow card on dotted warm paper with seeded riso shapes. */
export function renderOgCard({ title, tag, meta, seed }: OgCardProps): ReactElement {
  const shapes = pickOgShapes(seed);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: OG_COLORS.paper,
        border: `14px solid ${OG_COLORS.ink}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          backgroundImage: DOT_GRID,
          backgroundRepeat: "repeat",
          backgroundSize: "18px 18px",
        }}
      />
      {shapes.map((shape, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...shape.pos,
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.color,
            border: `8px solid ${OG_COLORS.ink}`,
            borderRadius: shape.kind === "circle" ? 9999 : 0,
            transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            backgroundColor: OG_COLORS.card,
            border: `10px solid ${OG_COLORS.ink}`,
            boxShadow: `20px 20px 0 ${OG_COLORS.ink}`,
            padding: "44px 48px",
            maxWidth: 980,
          }}
        >
          {tag && (
            <div
              style={{
                display: "flex",
                backgroundColor: OG_COLORS.pink,
                border: `5px solid ${OG_COLORS.ink}`,
                color: OG_COLORS.ink,
                fontFamily: "Space Mono",
                fontSize: 22,
                letterSpacing: "0.12em",
                padding: "6px 16px",
                marginBottom: 24,
              }}
            >
              {tag.toUpperCase()}
            </div>
          )}
          <div
            style={{
              fontFamily: "Archivo Black",
              fontSize: titleFontSize(title),
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: OG_COLORS.ink,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "Space Mono",
              fontSize: 22,
              letterSpacing: "0.08em",
              color: OG_COLORS.muted,
              marginTop: 24,
            }}
          >
            {meta.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
