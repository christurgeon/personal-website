import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { PostCard } from "@/components/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function NotFound() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-7">
      <header className="mb-14">
        <div className="font-mono-label mb-5" style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
          [ ERROR / 404 ]
        </div>
        <h1 className="font-display tracking-[-0.04em]" style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)", lineHeight: 0.9 }}>
          PAGE{" "}
          <span
            className="inline-block"
            style={{
              background: "var(--yellow)",
              color: "var(--on-yellow)",
              border: "4px solid var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              padding: "0.02em 0.22em 0.06em",
              transform: "rotate(-1deg)",
            }}
          >
            NOT FOUND
          </span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg md:text-xl" style={{ color: "var(--muted)", lineHeight: 1.5 }}>
          That link is broken or the page moved. Try the{" "}
          <Link href="/blog" className="underline hover:text-[color:var(--accent)]">
            blog
          </Link>{" "}
          or head back{" "}
          <Link href="/" className="underline hover:text-[color:var(--accent)]">
            home
          </Link>
          .
        </p>
      </header>

      {posts.length > 0 && (
        <section>
          <div className="font-mono-label mb-6" style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
            [ RECENT POSTS ]
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
