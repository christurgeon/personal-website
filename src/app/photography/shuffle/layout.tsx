import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Shuffled Gallery",
  description: "A randomized selection of photographs from all collections.",
  path: "/photography/shuffle",
  ogImage: "/photography/opengraph-image",
});

export default function ShuffleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
