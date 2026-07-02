import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { format } from "date-fns";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { OG_SIZE, loadOgFonts, renderOgCard } from "@/lib/og/card";

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const alt = "Blog post — Chris Turgeon";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return new ImageResponse(
    renderOgCard({
      title: post.title,
      tag: post.tags?.[0],
      meta: `christurgeon.com · ${format(new Date(post.date), "MMM d, yyyy")}`,
      seed: slug,
    }),
    { ...OG_SIZE, fonts: await loadOgFonts() }
  );
}
