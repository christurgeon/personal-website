import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { ArrowRightIcon, GitHubIcon, GoodreadsIcon, LinkedInIcon, SoundCloudIcon, XTwitterIcon, BeliIcon } from "@/components/Icons";
import { Sticker } from "@/components/riso/Sticker";
import { COLOR_PAIRS, type RisoColor } from "@/lib/riso";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}, a software engineer at Point72 sharing blog posts and photography alongside personal coding projects.`,
  alternates: { canonical: "/about" },
};

const socialButtons: Array<{
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: RisoColor;
}> = [
  { name: "GitHub", href: siteConfig.socials.github, icon: GitHubIcon, color: "yellow" },
  { name: "LinkedIn", href: siteConfig.socials.linkedin, icon: LinkedInIcon, color: "blue" },
  { name: "X", href: siteConfig.socials.x, icon: XTwitterIcon, color: "pink" },
  { name: "SoundCloud", href: siteConfig.socials.soundcloud, icon: SoundCloudIcon, color: "green" },
  { name: "Goodreads", href: siteConfig.socials.goodreads, icon: GoodreadsIcon, color: "red" },
  { name: "Beli", href: siteConfig.socials.beli, icon: BeliIcon, color: "yellow" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-7">
      {/* Loud header */}
      <header className="animate-fade-in relative mb-12">
        <div className="font-mono-label text-muted mb-4">[ 04 / ABOUT ]</div>

        <div className="grid items-start gap-8 md:grid-cols-[1fr_auto]">
          <h1 className="font-display text-[clamp(2.8rem,9vw,6rem)] leading-[0.9] tracking-[-0.04em]">
            ABOUT{" "}
            <span
              className="inline-block border-[3px] px-[0.12em]"
              style={{
                background: "var(--yellow)",
                color: "var(--ink)",
                borderColor: "var(--border)",
                boxShadow: "6px 6px 0 var(--border)",
                transform: "rotate(-2deg)",
              }}
            >
              ME
            </span>
          </h1>

          {/* Floating profile photo */}
          <div className="relative mx-auto md:mx-0">
            <div
              className="relative h-40 w-40 overflow-hidden sm:h-48 sm:w-48"
              style={{
                border: "4px solid var(--border)",
                background: "var(--card)",
                boxShadow: "8px 8px 0 var(--border)",
                transform: "rotate(-3deg)",
              }}
            >
              <Image src="/images/profile.jpg" alt={siteConfig.name} fill className="object-cover" priority sizes="(min-width: 640px) 192px, 160px" />
            </div>
            <div className="absolute -top-4 -right-4">
              <Sticker color="red" rotate={10}>
                Hi!
              </Sticker>
            </div>
          </div>
        </div>
      </header>

      {/* Quiet prose card */}
      <article
        className="animate-fade-in-delay-1 mb-14 p-6 sm:p-10"
        style={{
          background: "var(--card)",
          border: "3px solid var(--border)",
          boxShadow: "6px 6px 0 var(--border)",
        }}
      >
        <div className="prose max-w-none">
          <p>
            Howdy! I&apos;m {siteConfig.name}. Thanks for stopping by. This site is equal parts notebook, photo gallery, and experiment: a place where
            I collect and share some of the things I care deeply about.
          </p>

          <h2>What I Do</h2>
          <p>
            I&apos;m a software engineer at{" "}
            <Link href="https://point72.com/" target="_blank" rel="noopener noreferrer">
              Point72
            </Link>
            , where I build automated solutions to difficult infrastructure problems. When I&apos;m not writing{" "}
            <Link href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer">
              code
            </Link>
            , I&apos;m usually <Link href="/blog">writing words</Link>, taking <Link href="/photography">photos</Link> of places I don&apos;t want to
            forget, or producing{" "}
            <Link href={siteConfig.socials.soundcloud} target="_blank" rel="noopener noreferrer">
              electronic music
            </Link>{" "}
            that ranges from barely listenable to occasionally decent.
          </p>

          <h2>Get in Touch</h2>
          <p>
            I&apos;m always interested in hearing from new people. Whether you have a question, want to collaborate, or just want to say hi, feel free
            to reach out. Some of my favorite conversations have started that way.
          </p>
        </div>
      </article>

      {/* Find me elsewhere */}
      <section className="animate-fade-in-delay-2 mb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] leading-[0.95] tracking-[-0.03em]">FIND ME ELSEWHERE</h2>
          <div className="font-mono-label text-muted hidden sm:block">[ ACROSS THE WEB ]</div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {socialButtons
            .filter((s) => s.href)
            .map((s, i) => {
              const Icon = s.icon;
              const { bg, fg } = COLOR_PAIRS[s.color];
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-lift group flex min-w-0 items-center justify-between gap-1.5 px-3 py-3.5 sm:gap-3 sm:p-5"
                  style={{
                    background: bg,
                    color: fg,
                    border: "3px solid var(--border)",
                    boxShadow: "6px 6px 0 var(--border)",
                    transform: i % 2 === 0 ? "rotate(-0.5deg)" : "rotate(0.5deg)",
                  }}
                >
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6" />
                    <span className="font-display min-w-0 text-[0.8rem] leading-tight tracking-tight break-words uppercase sm:text-lg">{s.name}</span>
                  </div>
                  <ArrowRightIcon className="hidden h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
                </a>
              );
            })}
        </div>
      </section>
    </div>
  );
}
