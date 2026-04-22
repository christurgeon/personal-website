import { siteConfig } from "@/lib/config";
import { projects, getLanguageColor } from "@/lib/projects";
import { GitHubIcon, ExternalLinkIcon } from "@/components/Icons";
import { Sticker } from "@/components/riso/Sticker";
import { RisoThumbnail } from "@/components/riso/RisoThumbnail";
import { CARD_BGS, CARD_FGS, pickByIndex } from "@/lib/riso";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: `A selection of open-source and personal projects by ${siteConfig.name}.`,
  alternates: { canonical: "/projects" },
};

const stickerLabels = ["OSS", "TOOL", "APP", "EXPERIMENT"] as const;
const stickerColors = ["red", "blue", "green", "yellow", "pink"] as const;
const cardRotations = ["-0.6deg", "0.5deg", "-0.4deg", "0.7deg"] as const;

function LanguagePill({ language }: { language: string }) {
  return (
    <span
      className="font-mono-label inline-flex items-center gap-2 border-[2px] px-2.5 py-1"
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        borderColor: "var(--border)",
      }}
    >
      <span
        aria-hidden
        className="inline-block h-[10px] w-[10px] border-[1.5px]"
        style={{ background: getLanguageColor(language), borderColor: "var(--border)" }}
      />
      {language}
    </span>
  );
}

function TagPill({ tag, bg }: { tag: string; bg: string }) {
  return (
    <span
      className="font-mono-label inline-flex items-center border-[2px] px-2 py-[3px]"
      style={{
        background: bg,
        color: "var(--ink)",
        borderColor: "var(--border)",
      }}
    >
      {tag}
    </span>
  );
}

function IconButton({ href, label, bg, children }: { href: string; label: string; bg: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="brutal-lift-sm inline-flex h-11 w-11 items-center justify-center border-[3px]"
      style={{
        background: bg,
        color: "var(--ink)",
        borderColor: "var(--border)",
        boxShadow: "4px 4px 0 var(--border)",
      }}
    >
      {children}
    </a>
  );
}

export default function ProjectsPage() {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const total = projects.length;

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-7">
      {/* Loud hero */}
      <header className="animate-fade-in relative mb-16 md:mb-20">
        <div className="font-mono-label mb-4" style={{ color: "var(--muted)" }}>
          [ 02 / SHIPPING ]
        </div>
        <h1 className="font-display leading-[0.92] tracking-[-0.04em] uppercase" style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}>
          Things I{" "}
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
            Build
          </span>
        </h1>
        <p className="animate-fade-in-delay-1 mt-6 max-w-2xl text-lg md:text-xl" style={{ color: "var(--muted)" }}>
          Things I&apos;ve built, mostly for fun.
        </p>

        {/* Floating stickers — deterministic rotations */}
        <div className="animate-fade-in-delay-2 mt-8 flex flex-wrap items-center gap-5">
          <Sticker color="red" rotate={-5}>
            {total} Projects
          </Sticker>
          <Sticker color="yellow" rotate={4}>
            Always Shipping
          </Sticker>
          <Sticker color="blue" rotate={-2}>
            Open Source Friendly
          </Sticker>
        </div>
      </header>

      {/* Featured */}
      {featured && (
        <section className="animate-fade-in-delay-2 mb-14">
          <div
            className="brutal-lift relative block overflow-hidden border-[3px]"
            style={{
              background: "var(--card)",
              color: "var(--ink)",
              borderColor: "var(--border)",
              boxShadow: "8px 8px 0 var(--border)",
            }}
          >
            {/* Featured sticker */}
            <div className="pointer-events-none absolute top-4 left-4 z-10">
              <Sticker color="red" rotate={-6}>
                Featured
              </Sticker>
            </div>

            <div className="grid md:grid-cols-2">
              {/* Left — details */}
              <div className="flex flex-col gap-6 p-7 md:p-10">
                <div className="font-mono-label pt-2" style={{ color: "var(--muted)" }}>
                  [ 00 / FLAGSHIP ]
                </div>
                <h2 className="font-display leading-[0.92] tracking-[-0.03em] uppercase" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
                  {featured.name}
                </h2>
                <p className="text-lg" style={{ color: "var(--ink)" }}>
                  {featured.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <LanguagePill language={featured.language} />
                  {featured.tags.map((t) => (
                    <TagPill key={t} tag={t} bg="var(--yellow)" />
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                  {featured.github && (
                    <a
                      href={featured.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brutal-lift-sm font-mono-label inline-flex items-center gap-2 border-[3px] px-4 py-2.5"
                      style={{
                        background: "var(--ink)",
                        color: "var(--paper)",
                        borderColor: "var(--border)",
                        boxShadow: "4px 4px 0 var(--border)",
                      }}
                    >
                      <GitHubIcon className="h-4 w-4" />
                      View Source
                    </a>
                  )}
                  {featured.website && (
                    <a
                      href={featured.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brutal-lift-sm font-mono-label inline-flex items-center gap-2 border-[3px] px-4 py-2.5"
                      style={{
                        background: "var(--red)",
                        color: "var(--paper)",
                        borderColor: "var(--border)",
                        boxShadow: "4px 4px 0 var(--border)",
                      }}
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      Visit Site
                    </a>
                  )}
                </div>
              </div>

              {/* Right — riso panel */}
              <div className="relative min-h-[260px] border-t-[3px] md:border-t-0 md:border-l-[3px]" style={{ borderColor: "var(--border)" }}>
                <RisoThumbnail seed={featured.name} className="absolute inset-0 h-full w-full" />
                <div
                  className="font-display pointer-events-none absolute inset-0 flex items-end p-6 leading-[0.85] tracking-[-0.04em] uppercase"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "var(--ink)" }}
                >
                  <span
                    className="inline-block border-[3px] px-2 py-1"
                    style={{
                      background: "var(--paper)",
                      borderColor: "var(--border)",
                      boxShadow: "4px 4px 0 var(--border)",
                      transform: "rotate(-2deg)",
                    }}
                  >
                    {featured.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Non-featured grid */}
      <section className="animate-fade-in-delay-3">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="font-mono-label" style={{ color: "var(--muted)" }}>
              [ THE REST / {String(rest.length).padStart(2, "0")} ]
            </div>
            <h2 className="font-display mt-2 leading-[0.95] tracking-[-0.03em] uppercase" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
              Also in the shed
            </h2>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, index) => {
            const bg = pickByIndex(CARD_BGS, index);
            const fg = pickByIndex(CARD_FGS, index);
            const stickerLabel = project.sticker ?? pickByIndex(stickerLabels, index);
            const stickerColor = pickByIndex(stickerColors, index);
            const rotate = pickByIndex(cardRotations, index);

            return (
              <article
                key={project.name}
                className="brutal-lift relative flex flex-col border-[3px]"
                style={{
                  background: bg,
                  color: fg,
                  borderColor: "var(--border)",
                  boxShadow: "6px 6px 0 var(--border)",
                  transform: `rotate(${rotate})`,
                }}
              >
                <div className="pointer-events-none absolute -top-3 -right-3">
                  <Sticker color={stickerColor} rotate={index % 2 === 0 ? 6 : -6}>
                    {stickerLabel}
                  </Sticker>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h3
                    className="font-display leading-[0.95] tracking-[-0.03em] uppercase"
                    style={{ fontSize: "clamp(1.5rem, 2.2vw, 1.9rem)", color: fg }}
                  >
                    {project.name}
                  </h3>
                  <p className="text-[0.97rem]" style={{ color: fg, opacity: 0.95 }}>
                    {project.description}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <LanguagePill language={project.language} />
                    {project.tags.slice(0, 3).map((tag) => (
                      <TagPill key={tag} tag={tag} bg="var(--paper)" />
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t-[3px] pt-3" style={{ borderColor: "var(--border)" }}>
                    <span className="font-mono-label" style={{ color: fg, opacity: 0.85 }}>
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <IconButton href={project.github} label={`${project.name} on GitHub`} bg="var(--paper)">
                          <GitHubIcon className="h-5 w-5" />
                        </IconButton>
                      )}
                      {project.website && (
                        <IconButton href={project.website} label={`${project.name} website`} bg="var(--paper)">
                          <ExternalLinkIcon className="h-5 w-5" />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
