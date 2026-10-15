import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { ArrowRightIcon, GitHubIcon, GoodreadsIcon, LinkedInIcon, SoundCloudIcon, XTwitterIcon, BeliIcon } from "@/components/Icons";
import { Sticker } from "@/components/riso/Sticker";
import { COLOR_PAIRS, type RisoColor } from "@/lib/riso";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}, a software engineer at Point72 and solo traveler sharing blog posts, travel photography, and personal coding projects.`,
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
            Howdy! I&apos;m Chris. I&apos;m a software engineer in NYC, a solo traveler, and someone who can&apos;t leave a question alone until
            I&apos;ve read three studies about it. This site is where those things end up.
          </p>

          <h2>What I Do</h2>
          <p>
            I&apos;m a software engineer at{" "}
            <Link href="https://point72.com/" target="_blank" rel="noopener noreferrer">
              Point72
            </Link>
            , where I build automated solutions to difficult infrastructure problems. On my own time I build and <Link href="/blog">write about</Link>{" "}
            side projects: a <Link href="/blog/trading-weather-markets">weather-market trading bot</Link> that mostly taught me how to be wrong
            cheaply, a <Link href="/blog/code-from-anywhere">setup for running coding agents from my phone</Link>, and a lot of notes on{" "}
            <Link href="/blog/vibe-coding-with-guardrails">working with AI</Link> without letting it run off a cliff. My{" "}
            <Link href="/projects">projects</Link> and{" "}
            <Link href="/chris_turgeon_resume.pdf" target="_blank" rel="noopener noreferrer">
              resume
            </Link>{" "}
            have the details.
          </p>

          <h2>Where I&apos;ve Been</h2>
          <p>
            A semester studying abroad in Singapore showed me a whole new way to travel, and I&apos;ve been chasing that feeling ever since. Since
            then I&apos;ve backpacked through Europe and Latin America, road-tripped across Jordan and Cura&ccedil;ao, climbed Acatenango in
            Guatemala, and hiked to the edge of the Southern Patagonian Ice Field. I go alone when I can, and I{" "}
            <Link href="/blog/solo-travel">stay in hostels on purpose</Link>. The <Link href="/photography">photos</Link> are the places I didn&apos;t
            want to forget.
          </p>

          <h2>Other Things I&apos;m Into</h2>
          <ul>
            <li>
              Making cocktails. I keep a <Link href="/blog/cocktails">running recipe collection</Link>.
            </li>
            <li>Eating my way through NYC. My Beli is below if you want recommendations.</li>
            <li>
              Reading. Current favorite: <em>A Gentleman in Moscow</em>.
            </li>
            <li>
              Over-optimizing things, from <Link href="/blog/optimizing-your-finances">my finances</Link> to{" "}
              <Link href="/blog/four-actives-and-a-language-model">my skincare</Link>.
            </li>
            <li>
              Producing{" "}
              <Link href={siteConfig.socials.soundcloud} target="_blank" rel="noopener noreferrer">
                electronic music
              </Link>
              , with mixed results.
            </li>
          </ul>

          <h2>Get in Touch</h2>
          <p>
            Email me at <Link href={`mailto:${siteConfig.socials.email}`}>{siteConfig.socials.email}</Link> about anything on this site, a trip
            you&apos;re planning, or something you&apos;re building. Or <Link href="/subscribe">subscribe</Link> and I&apos;ll send new posts when
            they&apos;re out.
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
