import { describe, it, expect } from "vitest";
import { getPostBySlug } from "../blog";

// next-mdx-remote strips {…} expressions without an error, so braces in prose would silently vanish.
describe("guide post prose", () => {
  it("has no braces outside code", () => {
    const post = getPostBySlug("software-engineering-interview-concepts")!;
    const prose = post.content.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, "").replace(/`[^`\n]*`/g, "");
    expect(prose.match(/[{}]/g) ?? []).toEqual([]);
  });
});
