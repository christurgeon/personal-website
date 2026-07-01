import { ImageResponse } from "next/og";
import { OG_SIZE, loadOgFonts, renderOgCard } from "@/lib/og/card";

export const alt = "Chris Turgeon";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(renderOgCard({ title: "Chris Turgeon", meta: "BLOG · PHOTOGRAPHY · PROJECTS", seed: "home" }), {
    ...OG_SIZE,
    fonts: await loadOgFonts(),
  });
}
