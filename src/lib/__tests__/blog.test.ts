import { describe, it, expect } from "vitest";
import { getPostSlugs, getPostBySlug, getAllPosts } from "../blog";

// These tests run against the real content/posts directory.
// They validate that every MDX file has valid frontmatter (Zod-checked).

describe("getPostSlugs", () => {
  it("returns an array of .mdx filenames", () => {
    const slugs = getPostSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(slug).toMatch(/\.mdx$/);
    }
  });
});

describe("getPostBySlug", () => {
  it("returns null for a nonexistent slug", () => {
    expect(getPostBySlug("this-post-does-not-exist")).toBeNull();
  });

  it("parses a real post with valid frontmatter", () => {
    const slugs = getPostSlugs();
    const slug = slugs[0].replace(/\.mdx$/, "");
    const post = getPostBySlug(slug);

    expect(post).not.toBeNull();
    expect(post!.slug).toBe(slug);
    expect(post!.title).toBeTruthy();
    expect(post!.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(post!.excerpt).toBeTruthy();
    expect(post!.readingTime).toBeTruthy();
    expect(post!.content).toBeTruthy();
  });

  it("validates frontmatter for every post (Zod catches errors at build)", () => {
    const slugs = getPostSlugs();
    for (const filename of slugs) {
      const slug = filename.replace(/\.mdx$/, "");
      // This will throw a ZodError if any post has invalid frontmatter
      expect(() => getPostBySlug(slug)).not.toThrow();
    }
  });

  it("strips .mdx extension from slug input", () => {
    const slugs = getPostSlugs();
    const withExtension = slugs[0]; // e.g. "some-post.mdx"
    const without = withExtension.replace(/\.mdx$/, "");
    expect(getPostBySlug(withExtension)?.slug).toBe(without);
  });
});

describe("getAllPosts", () => {
  it("returns posts sorted by date descending", () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(new Date(posts[i].date).getTime());
    }
  });

  it("does not include content field in PostMeta", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect("content" in post).toBe(false);
    }
  });

  it("returns all posts", () => {
    const posts = getAllPosts();
    const slugs = getPostSlugs();
    expect(posts.length).toBe(slugs.length);
  });
});
