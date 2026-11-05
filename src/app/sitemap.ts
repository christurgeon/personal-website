import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/blog";
import { photoCategories } from "@/lib/photography";

// Only emit lastModified where we actually know it. A `new Date()` on every build tells crawlers every page
// changed on every deploy, which teaches them to ignore lastmod entirely, including the accurate post dates.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPost = posts[0] ? new Date(posts[0].date) : undefined;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: latestPost, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/blog`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/photography`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/photography/shuffle`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/links`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/subscribe`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/referrals`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = photoCategories.map((category) => ({
    url: `${siteConfig.url}/photography/${category.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes];
}
