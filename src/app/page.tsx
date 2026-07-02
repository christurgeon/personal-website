import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/config";
import { AnimatedHero } from "@/components/AnimatedHero";
import { PostCard } from "@/components/PostCard";
import { SectionHead } from "@/components/riso/SectionHead";
import { COLOR_PAIRS, type RisoColor } from "@/lib/riso";

const categoryTiles: { href: string; number: string; title: string; tagline: string; color: RisoColor }[] = [
  {
    href: "/blog",
    number: "01",
    title: "Writing",
    tagline: "Essays and notes on engineering, travel, and the stuff in between.",
    color: "yellow",
  },
  {
    href: "/projects",
    number: "02",
    title: "Projects",
    tagline: "Side projects, open-source tinkering, and experiments that stuck.",
    color: "pink",
  },
  {
    href: "/photography",
    number: "03",
    title: "Photography",
    tagline: "A visual diary I keep instead of a written one.",
    color: "blue",
  },
  {
    href: "/about",
    number: "04",
    title: "About",
    tagline: "A little about me, what I'm working on, and how to get in touch.",
    color: "green",
  },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-7">
        <AnimatedHero name={siteConfig.name} description={siteConfig.description} socials={siteConfig.socials} />
      </div>

      {/* Recent Posts */}
      <section className="mx-auto max-w-[1240px] px-5 pt-12 pb-12 sm:px-7 md:pt-16">
        <SectionHead number="01" kicker="Writing" title={<>Recent</>} highlight="Posts" more={{ label: "All Posts", href: "/blog" }} />

        {posts.length > 0 ? (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard key={post.slug} post={post} featured={index === 0} />
            ))}
          </div>
        ) : (
          <div
            className="animate-fade-in-delay-3 py-16 text-center"
            style={{
              background: "var(--card)",
              border: "3px dashed var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
            }}
          >
            <h3 className="font-display mb-3 text-2xl uppercase">No posts yet</h3>
            <p style={{ color: "var(--muted)" }}>Check back soon for new content.</p>
          </div>
        )}
      </section>

      {/* Around the Site */}
      <section className="mx-auto max-w-[1240px] px-5 pt-12 pb-24 sm:px-7 md:pb-32">
        <SectionHead number="02" kicker="Explore" title={<>Around the</>} highlight="Site" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="lane-tile group relative flex flex-col"
              style={{
                background: "var(--card)",
                color: "var(--ink)",
                border: "3px solid var(--border)",
                padding: "22px 22px 24px",
              }}
            >
              <div className="mb-4">
                <span
                  className="pill"
                  style={{
                    background: COLOR_PAIRS[tile.color].bg,
                    color: COLOR_PAIRS[tile.color].fg,
                  }}
                >
                  {tile.number}
                </span>
              </div>
              <h3
                className="font-display mb-3 uppercase transition-colors group-hover:text-[color:var(--accent)]"
                style={{
                  fontSize: "clamp(1.35rem, 2vw, 1.6rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.03em",
                }}
              >
                {tile.title}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.45 }}>{tile.tagline}</p>
              <div className="font-mono-label mt-auto inline-flex items-center gap-1 pt-5">→</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
