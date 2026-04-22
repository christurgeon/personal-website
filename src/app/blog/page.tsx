import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/blog";
import { PostCard } from "@/components/PostCard";
import { Sticker } from "@/components/riso/Sticker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: `Where ${siteConfig.name} writes about whatever is on his mind - blog posts about life, technology, science, travel, and things he's learned along the way.`,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  // Derive year range for the sticker (deterministic — purely from data)
  const years = posts.map((p) => new Date(p.date).getFullYear()).filter((y) => !Number.isNaN(y));
  const yearRange = years.length > 0 ? (years[0] === years[years.length - 1] ? `${years[0]}` : `${Math.min(...years)}–${Math.max(...years)}`) : "";

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-7">
      {/* Hero — CHROME-LOUD */}
      <header className="animate-fade-in relative mb-14 md:mb-20">
        {/* Eyebrow */}
        <div className="font-mono-label mb-5" style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
          [ WRITING / ESSAYS ]
        </div>

        {/* Massive display headline */}
        <h1
          className="font-display tracking-[-0.04em]"
          style={{
            fontSize: "clamp(3rem, 9vw, 6.5rem)",
            lineHeight: 0.9,
          }}
        >
          ALL{" "}
          <span
            className="inline-block"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              border: "4px solid var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              padding: "0.02em 0.22em 0.06em",
              transform: "rotate(-1deg)",
            }}
          >
            POSTS
          </span>
        </h1>

        {/* Intro line */}
        <p className="mt-8 max-w-2xl text-lg md:text-xl" style={{ color: "var(--muted)", lineHeight: 1.5 }}>
          Stories, essays, advice, and the occasional rabbit hole.
        </p>

        {/* Floating stickers — top-right, only if we have posts */}
        {posts.length > 0 && (
          <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 hidden flex-col items-end gap-3 md:flex">
            <Sticker color="red" rotate={6}>
              {posts.length} {posts.length === 1 ? "Post" : "Posts"}
            </Sticker>
            {yearRange && (
              <Sticker color="blue" rotate={-4}>
                {yearRange}
              </Sticker>
            )}
          </div>
        )}
      </header>

      {/* Divider line */}
      <div
        className="animate-fade-in-delay-1 mb-10"
        style={{
          height: 0,
          borderTop: "3px solid var(--border)",
        }}
      />

      {/* Posts grid */}
      {posts.length > 0 ? (
        <div className="animate-fade-in-delay-2 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard key={post.slug} post={post} featured={index === 0} />
          ))}
        </div>
      ) : (
        <div
          className="animate-fade-in-delay-2 py-20 text-center"
          style={{
            background: "var(--card)",
            border: "3px dashed var(--border)",
            boxShadow: "6px 6px 0 var(--border)",
          }}
        >
          <h2 className="font-display mb-3 text-3xl tracking-[-0.02em]">NO POSTS YET</h2>
          <p style={{ color: "var(--muted)" }}>Check back soon — something is cooking.</p>
        </div>
      )}
    </div>
  );
}
