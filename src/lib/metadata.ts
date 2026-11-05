import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

// Next replaces `openGraph` wholesale when a page sets it, so every page has to restate the
// site-wide fields or it loses them (and pages that don't set it inherit the homepage's title/url).
export const baseOpenGraph = {
  siteName: siteConfig.name,
  locale: "en_US",
  type: "website",
} as const;

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  // Setting `openGraph` drops the image a parent segment's opengraph-image.tsx would otherwise supply, so pages
  // without their own opengraph-image.tsx must name one. Leave unset when the segment has its own: a config
  // image here would override it.
  ogImage?: string;
}

export function pageMetadata({ title, description, path, ogImage }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...baseOpenGraph,
      title,
      description,
      url: path,
      ...(ogImage && { images: ogImage }),
    },
  };
}
