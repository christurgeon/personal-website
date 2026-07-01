import { describe, it, expect } from "vitest";
import { OG_COLORS, titleFontSize, pickOgShapes } from "../og/palette";
import { getAllPosts } from "../blog";

describe("titleFontSize", () => {
  it("returns 72 for titles under 40 chars", () => {
    expect(titleFontSize("a".repeat(39))).toBe(72);
  });

  it("returns 60 for titles of 40-70 chars", () => {
    expect(titleFontSize("a".repeat(40))).toBe(60);
    expect(titleFontSize("a".repeat(70))).toBe(60);
  });

  it("returns 50 for titles over 70 chars", () => {
    expect(titleFontSize("a".repeat(71))).toBe(50);
  });

  it("puts the longest real post title in the 50px tier", () => {
    const title = "The Oracle: What a Year of Trading Weather Markets Taught Me About Being Wrong";
    expect(title.length).toBeGreaterThan(70);
    expect(titleFontSize(title)).toBe(50);
  });
});

describe("pickOgShapes", () => {
  it("is deterministic for the same seed", () => {
    expect(pickOgShapes("trading-weather-markets")).toEqual(pickOgShapes("trading-weather-markets"));
  });

  it("returns exactly 3 shapes with palette colors and positive sizes", () => {
    const palette: string[] = [OG_COLORS.yellow, OG_COLORS.red, OG_COLORS.blue, OG_COLORS.green, OG_COLORS.pink];
    for (const shape of pickOgShapes("about")) {
      expect(["circle", "square"]).toContain(shape.kind);
      expect(palette).toContain(shape.color);
      expect(shape.size).toBeGreaterThan(0);
    }
    expect(pickOgShapes("about")).toHaveLength(3);
  });

  it("produces at least two distinct compositions across the real post slugs", () => {
    const slugs = getAllPosts().map((p) => p.slug);
    const distinct = new Set(slugs.map((s) => JSON.stringify(pickOgShapes(s))));
    expect(distinct.size).toBeGreaterThan(1);
  });
});
