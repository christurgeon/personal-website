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

  it("omits the tag pill when no tag is given", () => {
    const withTag = JSON.stringify(renderOgCard({ title: "About", tag: "travel", meta: "christurgeon.com", seed: "about" }));
    const withoutTag = JSON.stringify(renderOgCard({ title: "About", meta: "christurgeon.com", seed: "about" }));
    // The pill is the only element with 0.12em letter-spacing.
    expect(withTag).toContain("TRAVEL");
    expect(withTag).toContain("0.12em");
    expect(withoutTag).not.toContain("0.12em");
    expect(withoutTag).not.toContain("TRAVEL");
  });

  it("never emits style properties with undefined values (Satori rejects them)", () => {
    const seeds = ["home", "blog", "photography", "projects", "about", "trading-weather-markets"];
    const walk = (node: unknown): void => {
      if (node == null || typeof node !== "object") return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      const el = node as { props?: { style?: Record<string, unknown>; children?: unknown } };
      if (el.props?.style) {
        for (const [key, value] of Object.entries(el.props.style)) {
          expect(value, `style.${key} must not be undefined`).not.toBeUndefined();
        }
      }
      if (el.props && "children" in el.props) walk(el.props.children);
    };
    for (const seed of seeds) {
      walk(renderOgCard({ title: "T", meta: "M", seed }));
      walk(renderOgCard({ title: "T", tag: "x", meta: "M", seed }));
    }
  });
});
