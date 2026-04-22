import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/config";
import { AnimatedHero } from "@/components/AnimatedHero";
import { PostCard } from "@/components/PostCard";
import { SectionHead } from "@/components/riso/SectionHead";
import { Marquee } from "@/components/riso/Marquee";

const marqueeItems: { label: string; color?: "ink" | "yellow" | "red" | "blue" | "green" | "pink" }[] = [
  { label: "Building", color: "yellow" },
  { label: "✱", color: "red" },
  { label: "Writing", color: "ink" },
  { label: "·", color: "pink" },
  { label: "Shooting", color: "green" },
  { label: "✱", color: "yellow" },
  { label: "Traveling", color: "ink" },
  { label: "·", color: "blue" },
  { label: "Reading", color: "pink" },
  { label: "✱", color: "green" },
  { label: "Making", color: "ink" },
  { label: "·", color: "red" },
];

const categoryTiles = [
  {
    href: "/blog",
    kicker: "01 / Writing",
    title: "Essays & Notes",
    tagline: "Long-form thinking on engineering, travel, and the stuff in between.",
    bg: "var(--yellow)",
    fg: "var(--ink)",
    rotate: "-1deg",
  },
  {
    href: "/projects",
    kicker: "02 / Projects",
    title: "Things I've Shipped",
    tagline: "Side projects, open-source tinkering, and experiments that stuck.",
    bg: "var(--pink)",
    fg: "var(--ink)",
    rotate: "0.8deg",
  },
  {
    href: "/photography",
    kicker: "03 / Photography",
    title: "A Visual Diary",
    tagline: "A visual diary I keep instead of a written one.",
    bg: "var(--blue)",
    fg: "var(--paper)",
    rotate: "-0.6deg",
  },
  {
    href: "/about",
    kicker: "04 / About",
    title: "Who Is This Guy?",
    tagline: "A little about me, what I'm working on, and how to get in touch.",
    bg: "var(--green)",
    fg: "var(--ink)",
    rotate: "1.1deg",
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

      {/* Marquee band — full-bleed */}
      <Marquee items={marqueeItems} repeat={4} speed="normal" />

      {/* Recent Posts */}
      <section className="mx-auto max-w-[1240px] px-5 pt-20 pb-12 sm:px-7 md:pt-24">
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

      {/* Pick Your Lane */}
      <section className="mx-auto max-w-[1240px] px-5 pt-12 pb-24 sm:px-7 md:pb-32">
        <SectionHead number="02" kicker="Explore" title={<>Pick Your</>} highlight="Lane" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="brutal-lift group relative block"
              style={{
                background: tile.bg,
                color: tile.fg,
                border: "3px solid var(--border)",
                boxShadow: "6px 6px 0 var(--border)",
                padding: "22px 22px 24px",
                transform: `rotate(${tile.rotate})`,
              }}
            >
              <div
                className="font-mono-label mb-3"
                style={{
                  color: tile.fg,
                  opacity: 0.8,
                }}
              >
                [ {tile.kicker} ]
              </div>
              <h3
                className="font-display mb-3"
                style={{
                  fontSize: "clamp(1.35rem, 2vw, 1.6rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.03em",
                }}
              >
                {tile.title}
              </h3>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.45, opacity: 0.92 }}>{tile.tagline}</p>
              <div className="font-mono-label mt-5 inline-flex items-center gap-1" style={{ color: tile.fg }}>
                Enter →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
