import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { PostMeta } from "@/lib/blog";
import { pickByIndex, TAG_COLORS } from "@/lib/riso";
import { RisoThumbnail } from "./riso/RisoThumbnail";

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article
      className="brutal-lift group relative"
      style={{
        background: "var(--card)",
        border: "3px solid var(--border)",
        boxShadow: "7px 7px 0 var(--border)",
      }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "16 / 10",
            borderBottom: "3px solid var(--border)",
          }}
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="gallery-image-zoom object-cover"
            />
          ) : (
            <RisoThumbnail seed={post.slug} className="h-full w-full" />
          )}
        </div>
      </Link>

      <div style={{ padding: "22px 22px 24px" }}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {post.tags && post.tags.length > 0 && (
            <>
              {post.tags.slice(0, 2).map((tag, tIdx) => (
                <span
                  key={tag}
                  className="pill"
                  style={{ background: pickByIndex(TAG_COLORS, tIdx) }}
                >
                  {tag}
                </span>
              ))}
            </>
          )}
          <span
            className="font-mono-label"
            style={{ color: "var(--muted)", fontSize: "0.72rem" }}
          >
            {format(new Date(post.date), "MMM d · yyyy")}
          </span>
          <span
            className="font-mono-label"
            style={{ color: "var(--muted)", fontSize: "0.72rem" }}
          >
            · {post.readingTime}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3
            className="font-display mb-3 tracking-[-0.03em] uppercase transition-colors group-hover:text-[color:var(--accent)]"
            style={{
              fontSize: featured ? "1.5rem" : "1.25rem",
              lineHeight: "1.02",
            }}
          >
            {post.title}
          </h3>
        </Link>

        <p
          className="mb-5 line-clamp-2"
          style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.5" }}
        >
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="font-mono-label inline-flex items-center gap-1.5"
          style={{
            background: "var(--paper)",
            color: "var(--ink)",
            border: "2.5px solid var(--border)",
            padding: "6px 12px",
            boxShadow: "3px 3px 0 var(--border)",
            fontSize: "0.72rem",
          }}
        >
          Read essay →
        </Link>
      </div>
    </article>
  );
}
