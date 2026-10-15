import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

const postsDirectory = path.join(process.cwd(), "content/posts");

export const frontmatterSchema = z.object({
  title: z.string(),
  // Overrides <title> for search results; the page heading and social cards keep `title`.
  seoTitle: z.string().optional(),
  date: z.string().date(),
  updated: z.string().date().optional(),
  excerpt: z.string(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  layout: z.enum(["guide"]).optional(),
});

export interface PostMeta {
  slug: string;
  title: string;
  seoTitle?: string;
  date: string;
  updated?: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  layout?: "guide";
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));
}

const postCache = new Map<string, Post>();
let allPostsCache: PostMeta[] | null = null;

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.mdx$/, "");
  const cached = postCache.get(realSlug);
  if (cached) return cached;

  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const parsed = frontmatterSchema.parse(data);
  const stats = readingTime(content);

  const post: Post = {
    slug: realSlug,
    ...parsed,
    tags: parsed.tags ?? [],
    readingTime: stats.text,
    content,
  };
  postCache.set(realSlug, post);
  return post;
}

export function getAllPosts(): PostMeta[] {
  if (allPostsCache) return allPostsCache;

  const slugs = getPostSlugs();
  allPostsCache = slugs
    .map((slug) => getPostBySlug(slug.replace(/\.mdx$/, "")))
    .filter((post): post is Post => post !== null)
    .map(({ slug, title, seoTitle, date, updated, excerpt, coverImage, tags, layout, readingTime }) => ({
      slug,
      title,
      seoTitle,
      date,
      updated,
      excerpt,
      coverImage,
      tags,
      layout,
      readingTime,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allPostsCache;
}

// Ranks other posts by shared tags; ties and posts with no overlap fall back to recency.
export function getRelatedPosts(slug: string, limit: number): PostMeta[] {
  const posts = getAllPosts();
  const current = posts.find((p) => p.slug === slug);
  const tags = new Set(current?.tags ?? []);
  const sharedTags = (post: PostMeta) => (post.tags ?? []).filter((tag) => tags.has(tag)).length;

  return posts
    .filter((p) => p.slug !== slug)
    .map((post) => ({ post, score: sharedTags(post) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
