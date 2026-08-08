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
  const parts = name.trim().split(" ");
  const firstName = parts[0] ?? name;
  const lastName = parts.slice(1).join(" ") || "";

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-24">
      <div className="relative max-w-2xl md:mx-auto">
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
          <Sticker color="pink" rotate={-4} className="absolute" style={{ top: "-18px", left: "18px" }}>
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
    </section>
  );
}
