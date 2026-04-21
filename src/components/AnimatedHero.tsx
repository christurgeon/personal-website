import Link from "next/link";
import { ArrowRightIcon, GitHubIcon, LinkedInIcon, XTwitterIcon } from "./Icons";
import { Sticker } from "./riso/Sticker";

interface AnimatedHeroProps {
  name: string;
  description: string;
  socials: {
    github?: string;
    linkedin?: string;
    x?: string;
  };
}

export function AnimatedHero({ name, description, socials }: AnimatedHeroProps) {
  const year = new Date().getFullYear();

  const parts = name.trim().split(" ");
  const firstName = parts[0] ?? name;
  const lastName = parts.slice(1).join(" ") || "";

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-24">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr] md:gap-10">
        <div className="relative">
          <div className="animate-fade-in mb-7">
            <span
              className="inline-flex items-center gap-2 border-[3px] px-4 py-2"
              style={{
                background: "var(--card)",
                color: "var(--ink)",
                borderColor: "var(--border)",
                boxShadow: "3px 3px 0 var(--border)",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              <span
                className="animate-blink inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: "var(--red)" }}
                aria-hidden="true"
              />
              Now Broadcasting · {year}
            </span>
          </div>

          <h1
            className="font-display animate-fade-in-delay-1 mb-7"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
            }}
          >
            <span className="relative inline-flex items-center gap-3">
              <span style={{ color: "var(--ink)" }}>{firstName}</span>
              <span
                className="animate-spin-slow inline-block"
                aria-hidden="true"
                style={{
                  color: "var(--yellow)",
                  fontSize: "0.55em",
                  WebkitTextStroke: "2px var(--border)",
                }}
              >
                ✦
              </span>
            </span>
            {lastName && (
              <>
                <br />
                <span
                  className="inline-block"
                  style={{
                    color: "var(--red)",
                    textShadow: "6px 6px 0 var(--blue)",
                  }}
                >
                  {lastName}
                </span>
              </>
            )}
          </h1>

          <div
            className="animate-fade-in-delay-2 relative mb-8 max-w-xl"
            style={{
              background: "var(--card)",
              color: "var(--ink)",
              border: "3px solid var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              padding: "22px 22px 20px",
            }}
          >
            <Sticker
              color="pink"
              rotate={-4}
              className="absolute"
              style={{ top: "-18px", left: "18px" }}
            >
              About
            </Sticker>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.55 }}>{description}</p>
          </div>

          <div className="animate-fade-in-delay-3 flex flex-wrap items-center gap-4">
            <Link
              href="/blog"
              className="brutal-lift font-display inline-flex items-center gap-2 border-[3px] px-5 py-3 uppercase"
              style={{
                background: "var(--red)",
                color: "var(--paper)",
                borderColor: "var(--border)",
                boxShadow: "6px 6px 0 var(--border)",
                fontSize: "0.95rem",
                letterSpacing: "-0.01em",
              }}
            >
              Read the Blog
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <Link
              href="/photography"
              className="brutal-lift font-display inline-flex items-center gap-2 border-[3px] px-5 py-3 uppercase"
              style={{
                background: "var(--blue)",
                color: "var(--paper)",
                borderColor: "var(--border)",
                boxShadow: "6px 6px 0 var(--border)",
                fontSize: "0.95rem",
                letterSpacing: "-0.01em",
              }}
            >
              Photos →
            </Link>

            <div className="flex items-center gap-3 sm:ml-2">
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="brutal-lift-sm inline-flex h-11 w-11 items-center justify-center border-[3px]"
                  style={{
                    background: "var(--yellow)",
                    color: "var(--ink)",
                    borderColor: "var(--border)",
                    boxShadow: "3px 3px 0 var(--border)",
                  }}
                >
                  <GitHubIcon className="h-5 w-5" />
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="brutal-lift-sm inline-flex h-11 w-11 items-center justify-center border-[3px]"
                  style={{
                    background: "var(--green)",
                    color: "var(--ink)",
                    borderColor: "var(--border)",
                    boxShadow: "3px 3px 0 var(--border)",
                  }}
                >
                  <LinkedInIcon className="h-5 w-5" />
                </a>
              )}
              {socials.x && (
                <a
                  href={socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="brutal-lift-sm inline-flex h-11 w-11 items-center justify-center border-[3px]"
                  style={{
                    background: "var(--pink)",
                    color: "var(--ink)",
                    borderColor: "var(--border)",
                    boxShadow: "3px 3px 0 var(--border)",
                  }}
                >
                  <XTwitterIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div
          className="relative flex flex-col items-center gap-6 md:block md:min-h-[480px]"
          aria-hidden="true"
        >
          <div
            className="animate-fade-in-delay-1 w-full max-w-[340px] md:absolute md:top-[10px] md:right-0 md:w-[min(82%,320px)] md:max-w-none"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              border: "3px solid var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              padding: "18px 20px",
              transform: "rotate(-4deg)",
              zIndex: 3,
            }}
          >
            <div
              className="font-mono-label mb-2"
              style={{ color: "var(--ink)", opacity: 0.75 }}
            >
              ▶ Currently
            </div>
            <div
              className="font-display mb-1.5"
              style={{ fontSize: "1.35rem", lineHeight: 1.02, letterSpacing: "-0.03em" }}
            >
              Writing about AI-agent workflows
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
              Notes on tooling for LLM-assisted dev work.
            </p>
          </div>

          <svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="hidden md:block"
            style={{
              position: "absolute",
              top: "175px",
              right: "40px",
              color: "var(--red)",
              zIndex: 2,
              transform: "rotate(8deg)",
            }}
          >
            <path d="M0 30 Q 20 0, 40 30 T 80 30 T 120 30" />
          </svg>

          <div
            className="animate-fade-in-delay-2 w-full max-w-[340px] md:absolute md:top-[200px] md:left-0 md:w-[min(82%,310px)] md:max-w-none"
            style={{
              background: "var(--blue)",
              color: "var(--paper)",
              border: "3px solid var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              padding: "18px 20px",
              transform: "rotate(3deg)",
              zIndex: 2,
            }}
          >
            <div
              className="font-mono-label mb-2"
              style={{ color: "var(--paper)", opacity: 0.85 }}
            >
              📷 Latest Dispatch
            </div>
            <div
              className="font-display mb-1.5"
              style={{ fontSize: "1.35rem", lineHeight: 1.02, letterSpacing: "-0.03em" }}
            >
              Frames from the field
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
              Ongoing visual diary — 48 keepers and counting.
            </p>
          </div>

          <div
            className="animate-fade-in-delay-3 w-full max-w-[340px] md:absolute md:bottom-0 md:right-[10px] md:w-[min(80%,300px)] md:max-w-none"
            style={{
              background: "var(--pink)",
              color: "var(--ink)",
              border: "3px solid var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              padding: "18px 20px",
              transform: "rotate(-2deg)",
              zIndex: 4,
            }}
          >
            <div
              className="font-mono-label mb-2"
              style={{ color: "var(--ink)", opacity: 0.75 }}
            >
              🎧 Shuffle
            </div>
            <div
              className="font-display mb-1.5"
              style={{ fontSize: "1.35rem", lineHeight: 1.02, letterSpacing: "-0.03em" }}
            >
              Producing barely-listenable electronic music
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
              Listen at your own risk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
