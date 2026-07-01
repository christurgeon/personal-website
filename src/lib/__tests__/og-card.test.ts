import { describe, it, expect } from "vitest";
import { OG_SIZE, loadOgFonts, renderOgCard } from "../og/card";

describe("OG_SIZE", () => {
  it("is the standard OG canvas", () => {
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 });
  });
});

describe("loadOgFonts", () => {
  it("loads both vendored fonts with real data", async () => {
    const fonts = await loadOgFonts();
    expect(fonts.map((f) => f.name).sort()).toEqual(["Archivo Black", "Space Mono"]);
    for (const font of fonts) {
      expect(font.data.byteLength).toBeGreaterThan(10_000);
    }
  });
});

describe("renderOgCard", () => {
  it("includes title, uppercased tag, and uppercased meta in the element tree", () => {
    const el = renderOgCard({
      title: "The Oracle",
      tag: "trading",
      meta: "christurgeon.com · Jun 14, 2026",
      seed: "trading-weather-markets",
    });
    const tree = JSON.stringify(el);
    expect(tree).toContain("The Oracle");
    expect(tree).toContain("TRADING");
    expect(tree).toContain("CHRISTURGEON.COM · JUN 14, 2026");
  });

  it("renders without a tag (pill omitted, spec no-tags case)", () => {
    const el = renderOgCard({ title: "About", meta: "christurgeon.com", seed: "about" });
    const tree = JSON.stringify(el);
    expect(tree).not.toContain("TRADING");
    expect(tree).toContain("About");
  });
});
