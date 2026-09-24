import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { mdxComponents } from "@/components/mdx";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/config";
import { ShareButtons } from "@/components/ShareButtons";
import { SubscribeForm } from "@/components/SubscribeForm";
import { RisoThumbnail } from "@/components/riso/RisoThumbnail";
import { TAG_COLORS, TAG_FGS, pickByIndex } from "@/lib/riso";
import { GuideToc } from "@/components/GuideToc";
import { extractToc } from "@/lib/toc";
import type { Metadata } from "next";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const upNext = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  const isGuide = post.layout === "guide";
  const toc = isGuide ? extractToc(post.content) : [];
  // Guide posts align every block with the content column to the right of the 240px nav + 48px gap.
  const column = isGuide ? "max-w-[80ch] lg:ml-[288px]" : "mx-auto max-w-[68ch]";
  const content = <MDXRemote source={post.content} options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }} components={mdxComponents} />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(post.coverImage && { image: `${siteConfig.url}${post.coverImage}` }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[1240px] px-5 py-8 sm:px-7 md:py-12">
        <div className="animate-fade-in mb-8">
          <Link
            href="/blog"
            className="font-mono-label inline-flex items-center gap-2 transition-colors hover:text-[color:var(--accent)]"
            style={{ color: "var(--muted)", fontSize: "0.78rem" }}
          >
            <span aria-hidden="true">←</span> Back to Blog
          </Link>
        </div>

        <header className={`animate-fade-in mb-10 ${column}`}>
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="pill"
                  style={{
                    background: pickByIndex(TAG_COLORS, idx),
                    color: pickByIndex(TAG_FGS, idx),
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1
            className="font-display mb-6 tracking-[-0.03em]"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              lineHeight: 0.98,
              textTransform: "none",
            }}
          >
            {post.title}
          </h1>

          <div className="font-mono-label flex flex-wrap items-center gap-x-2 gap-y-1" style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
            <span>{format(parseISO(post.date), "MMM d, yyyy")}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>{siteConfig.name}</span>
          </div>
        </header>

        {post.coverImage && (
          <div className={`animate-fade-in-delay-1 mb-14 ${column}`}>
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "16 / 10",
                border: "3px solid var(--border)",
                boxShadow: "7px 7px 0 var(--border)",
              }}
            >
              <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 1024px) 768px, 100vw" className="object-cover" priority />
            </div>
          </div>
        )}

        {isGuide ? (
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
            <GuideToc entries={toc} />
            <article className="prose prose-lg guide-article animate-fade-in-delay-2 max-w-none min-w-0">{content}</article>
          </div>
        ) : (
          <article className="prose prose-lg animate-fade-in-delay-2 mx-auto max-w-[68ch]">{content}</article>
        )}

        <div className={column}>
          <ShareButtons title={post.title} slug={slug} />
        </div>

        <div className={`mt-14 ${column}`}>
          <SubscribeForm variant="card" />
        </div>

        {upNext.length > 0 && (
          <section className={`mt-20 ${column}`}>
            <div className="font-mono-label mb-5" style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
              [ UP NEXT ]
            </div>
            <ul className="flex flex-col gap-5">
              {upNext.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="brutal-lift-sm group flex items-stretch gap-4"
                    style={{
                      background: "var(--card)",
                      border: "3px solid var(--border)",
                      boxShadow: "5px 5px 0 var(--border)",
                      padding: "12px",
                    }}
                  >
                    <div
                      className="flex-shrink-0 overflow-hidden"
                      style={{
                        width: 80,
                        height: 80,
                        border: "2.5px solid var(--border)",
                      }}
                    >
                      {p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <RisoThumbnail seed={p.slug} className="h-full w-full" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <h3
                        className="font-display mb-1 tracking-[-0.02em] transition-colors group-hover:text-[color:var(--accent)]"
                        style={{
                          fontSize: "1.05rem",
                          lineHeight: 1.05,
                          textTransform: "none",
                        }}
                      >
                        {p.title}
                      </h3>
                      <div className="font-mono-label" style={{ color: "var(--muted)", fontSize: "0.7rem" }}>
                        {format(parseISO(p.date), "MMM d, yyyy")} · {p.readingTime}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
