import { describe, it, expect } from "vitest";
import { getPostSlugs, getPostBySlug, getAllPosts, getRelatedPosts, frontmatterSchema } from "../blog";

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

describe("frontmatterSchema layout", () => {
  const base = { title: "T", date: "2026-01-01", excerpt: "E" };

  it("is optional", () => {
    expect(frontmatterSchema.parse(base).layout).toBeUndefined();
  });

  it("accepts guide", () => {
    expect(frontmatterSchema.parse({ ...base, layout: "guide" }).layout).toBe("guide");
  });

  it("rejects any other value", () => {
    expect(() => frontmatterSchema.parse({ ...base, layout: "wide" })).toThrow();
  });
});

describe("frontmatterSchema updated", () => {
  const base = { title: "T", date: "2026-01-01", excerpt: "E" };

  it("accepts an ISO date", () => {
    expect(frontmatterSchema.parse({ ...base, updated: "2026-02-01" }).updated).toBe("2026-02-01");
  });

  it("rejects a non-date string", () => {
    expect(() => frontmatterSchema.parse({ ...base, updated: "last week" })).toThrow();
  });

  it("is never earlier than the publish date in real posts", () => {
    for (const post of getAllPosts()) {
      if (post.updated) expect(post.updated >= post.date).toBe(true);
    }
  });
});

describe("getRelatedPosts", () => {
  const sharedTags = (a: string[] = [], b: string[] = []) => a.filter((tag) => b.includes(tag)).length;

  it("excludes the current post and respects the limit", () => {
    const [first] = getAllPosts();
    const related = getRelatedPosts(first.slug, 2);
    expect(related).toHaveLength(2);
    expect(related.map((p) => p.slug)).not.toContain(first.slug);
  });

  it("ranks by shared tags, then by recency", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      const related = getRelatedPosts(post.slug, posts.length);
      const scores = related.map((r) => sharedTags(post.tags, r.tags));
      for (let i = 1; i < related.length; i++) {
        expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
        if (scores[i - 1] === scores[i]) {
          expect(related[i - 1].date >= related[i].date).toBe(true);
        }
      }
    }
  });

  it("pairs the interview guide with the Linux field guide", () => {
    expect(getRelatedPosts("software-engineering-interview-concepts", 1)[0].slug).toBe("production-engineering-lessons");
  });

  it("falls back to the newest posts for an unknown slug", () => {
    const posts = getAllPosts();
    expect(getRelatedPosts("no-such-post", 2)).toEqual(posts.slice(0, 2));
  });
});
