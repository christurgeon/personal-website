import { describe, it, expect } from "vitest";
import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import { extractToc, groupToc, activeHeadingId } from "../toc";
import { getPostSlugs, getPostBySlug } from "../blog";

// Compile through the same MDX + rehype-slug pipeline the blog page uses and read the ids it assigns to h2/h3.
async function compiledHeadings(source: string): Promise<string[]> {
  const { compiledSource } = await serialize(source, { mdxOptions: { rehypePlugins: [rehypeSlug] } });
  return [...compiledSource.matchAll(/_components\.h([23]),\s*\{\s*id: "([^"]*)"/g)].map((m) => `${m[1]}:${m[2]}`);
}

function tocHeadings(source: string): string[] {
  return extractToc(source).map((e) => `${e.depth}:${e.id}`);
}

describe("extractToc", () => {
  it("returns h2 and h3 in document order with text and depth", () => {
    expect(extractToc("## Part One\n\ntext\n\n### A Concept\n\n#### Detail\n\n## Part Two")).toEqual([
      { depth: 2, text: "Part One", id: "part-one" },
      { depth: 3, text: "A Concept", id: "a-concept" },
      { depth: 2, text: "Part Two", id: "part-two" },
    ]);
  });

  it("strips inline markdown from display text", () => {
    expect(extractToc("### How `kill` works with [signals](/x) and **bold** *em*")[0].text).toBe("How kill works with signals and bold em");
  });

  it("keeps intraword underscores and underscores inside code", () => {
    expect(extractToc("### `O_DIRECT` and snake_case_name")[0].text).toBe("O_DIRECT and snake_case_name");
  });

  it("ignores headings inside fenced code blocks", () => {
    const source = "## Real\n\n```md\n## Fake\n```\n\n~~~\n### Also fake\n~~~\n\n````md\n```\n## Nested fake\n```\n````\n\n### Real child";
    expect(extractToc(source).map((e) => e.text)).toEqual(["Real", "Real child"]);
  });

  it("matches rehype-slug for duplicates, h4 counters, inline code, links, and punctuation", async () => {
    const source = [
      "## Hello `code` & [link](/x)",
      "#### Hello code  link",
      "## Hello code & link",
      "### R + W > N: *why*?",
      "### `O_DIRECT` and snake_case_name",
      "### TCP vs. UDP (and QUIC)",
      "### [`kill`](https://example.com) and signals",
      "### See [the `fork` docs](/x)",
      "## Closing ##",
    ].join("\n\n");
    expect(tocHeadings(source)).toEqual(await compiledHeadings(source));
  });

  it("strips links whose text contains inline code", () => {
    expect(extractToc("### See [the `fork` docs](/x)")[0].text).toBe("See the fork docs");
  });

  it("matches rehype-slug on every real post", async () => {
    for (const filename of getPostSlugs()) {
      const post = getPostBySlug(filename)!;
      expect(tocHeadings(post.content), filename).toEqual(await compiledHeadings(post.content));
    }
  });
});

describe("groupToc", () => {
  it("nests h3 entries under the preceding h2 and drops leading h3s", () => {
    const parts = groupToc(extractToc("### Orphan\n\n## A\n\n### A1\n\n### A2\n\n## B"));
    expect(parts.map((p) => [p.entry.text, p.children.map((c) => c.text)])).toEqual([
      ["A", ["A1", "A2"]],
      ["B", []],
    ]);
  });
});

describe("activeHeadingId", () => {
  const positions = [
    { id: "a", top: -500 },
    { id: "b", top: -10 },
    { id: "c", top: 50 },
    { id: "d", top: 400 },
  ];

  it("returns the last heading at or above the offset", () => {
    expect(activeHeadingId(positions, 120)).toBe("c");
  });

  it("returns null before the first heading", () => {
    expect(
      activeHeadingId(
        positions.map((p) => ({ ...p, top: p.top + 1000 })),
        120
      )
    ).toBeNull();
  });

  it("skips headings missing from the page instead of stopping at them", () => {
    const withMissing = [positions[0], { id: "gone", top: Infinity }, positions[1], positions[2]];
    expect(activeHeadingId(withMissing, 120)).toBe("c");
  });

  it("returns the last heading after scrolling past everything", () => {
    expect(
      activeHeadingId(
        positions.map((p) => ({ ...p, top: p.top - 1000 })),
        120
      )
    ).toBe("d");
  });
});
