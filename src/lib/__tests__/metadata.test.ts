import { describe, expect, it } from "vitest";
import { pageMetadata } from "@/lib/metadata";

describe("pageMetadata", () => {
  it("sets canonical and a page-specific openGraph that keeps the site-wide fields", () => {
    const meta = pageMetadata({ title: "About", description: "About me", path: "/about" });

    expect(meta.alternates).toEqual({ canonical: "/about" });
    expect(meta.openGraph).toEqual({
      title: "About",
      description: "About me",
      url: "/about",
      siteName: "Chris Turgeon",
      locale: "en_US",
      type: "website",
    });
  });

  it("only sets an image when asked, so a segment's own opengraph-image.tsx isn't overridden", () => {
    const meta = pageMetadata({ title: "Links", description: "Links", path: "/links", ogImage: "/opengraph-image" });

    expect(meta.openGraph).toMatchObject({ images: "/opengraph-image" });
  });
});
