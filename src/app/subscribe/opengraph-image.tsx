import { ImageResponse } from "next/og";
import { OG_SIZE, loadOgFonts, renderOgCard } from "@/lib/og/card";

export const alt = "Subscribe — Chris Turgeon";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(renderOgCard({ title: "Subscribe", meta: "CHRISTURGEON.COM", seed: "subscribe" }), {
    ...OG_SIZE,
    fonts: await loadOgFonts(),
  });
}
