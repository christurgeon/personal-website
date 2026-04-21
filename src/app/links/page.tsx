import Image from "next/image";
import { siteConfig } from "@/lib/config";
import {
  BeliIcon,
  GitHubIcon,
  LinkedInIcon,
  GoodreadsIcon,
  SoundCloudIcon,
  XTwitterIcon,
  ResumeIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  PencilIcon,
  CameraIcon,
  GiftIcon,
  TendIcon,
} from "@/components/Icons";
import { STRIPE_COLORS, pickByIndex } from "@/lib/riso";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links",
  description: `All of ${siteConfig.name}'s links in one place - blog, photos, music, social profiles, and more.`,
  alternates: { canonical: "/links" },
};

type LinkItem = {
  name: string;
  href: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  external: boolean;
};

type Section = {
  title: string;
  links: LinkItem[];
};

const sections: Section[] = [
  {
    title: "Site",
    links: [
      { name: "Blog", href: "/blog", icon: PencilIcon, external: false },
      { name: "Photography", href: "/photography", icon: CameraIcon, external: false },
      { name: "About", href: "/about", icon: ArrowRightIcon, external: false },
    ],
  },
  {
    title: "Projects",
    links: [
      { name: "Tend", href: "https://usetend.org", description: "Nurture your relationships", icon: TendIcon, external: true },
    ],
  },
  {
    title: "Socials & More",
    links: [
      { name: "LinkedIn", href: siteConfig.socials.linkedin, icon: LinkedInIcon, external: true },
      { name: "GitHub", href: siteConfig.socials.github, icon: GitHubIcon, external: true },
      { name: "What I'm Reading", href: siteConfig.socials.goodreads, icon: GoodreadsIcon, external: true },
      { name: "SoundCloud", href: siteConfig.socials.soundcloud, icon: SoundCloudIcon, external: true },
      { name: "X", href: siteConfig.socials.x, icon: XTwitterIcon, external: true },
      { name: "Beli", href: siteConfig.socials.beli, icon: BeliIcon, external: true },
      { name: "Resume", href: siteConfig.documents.resume, description: "Download the PDF", icon: ResumeIcon, external: true },
      { name: "Referrals", href: "/referrals", description: "Services I use", icon: GiftIcon, external: false },
    ],
  },
];

const sectionsWithOffsets = sections.reduce<
  Array<{ title: string; links: LinkItem[]; offset: number }>
>((acc, section) => {
  const prev = acc[acc.length - 1];
  const offset = prev ? prev.offset + prev.links.length : 0;
  acc.push({ title: section.title, links: section.links.filter((l) => l.href), offset });
  return acc;
}, []);

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-[540px] px-5 py-10">
      {/* Profile block */}
      <div className="animate-fade-in mb-10 flex flex-col items-center text-center">
        <div
          className="relative mb-5 h-28 w-28 overflow-hidden"
          style={{
            border: "4px solid var(--border)",
            background: "var(--card)",
            boxShadow: "6px 6px 0 var(--border)",
            transform: "rotate(-3deg)",
          }}
        >
          <Image
            src="/images/profile.jpg"
            alt={siteConfig.name}
            fill
            className="object-cover"
            priority
            sizes="112px"
          />
        </div>

        <h1 className="font-display text-[clamp(2rem,8vw,3rem)] leading-none tracking-tight">
          {siteConfig.name.toUpperCase()}
        </h1>

        <p className="font-mono-label text-muted mt-4 max-w-[34ch]">
          {siteConfig.linksPageDescription}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sectionsWithOffsets.map((section) => (
            <div key={section.title}>
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono-label text-muted">[ {section.title.toUpperCase()} ]</span>
                <span
                  className="h-[3px] flex-1"
                  style={{ background: "var(--border)" }}
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-4">
                {section.links.map((link, i) => {
                  const Icon = link.icon;
                  const globalIndex = section.offset + i;
                  const stripe = pickByIndex(STRIPE_COLORS, globalIndex);
                  const rotate = globalIndex % 2 === 0 ? -0.3 : 0.3;

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="brutal-lift-sm group flex w-full items-stretch overflow-hidden"
                      style={{
                        background: "var(--card)",
                        color: "var(--ink)",
                        border: "3px solid var(--border)",
                        boxShadow: "4px 4px 0 var(--border)",
                        transform: `rotate(${rotate}deg)`,
                      }}
                    >
                      {/* Left color stripe */}
                      <div
                        aria-hidden="true"
                        className="w-3 flex-shrink-0"
                        style={{ background: stripe, borderRight: "3px solid var(--border)" }}
                      />

                      {/* Content */}
                      <div className="flex flex-1 items-center gap-4 px-4 py-4 sm:px-5">
                        <Icon className="h-6 w-6 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-display text-base tracking-tight sm:text-lg">
                            {link.name.toUpperCase()}
                          </div>
                          {link.description && (
                            <div className="font-mono-label text-muted mt-0.5">
                              {link.description}
                            </div>
                          )}
                        </div>
                        {link.external ? (
                          <ExternalLinkIcon className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        ) : (
                          <ArrowRightIcon className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
        ))}
      </div>

      {/* Footer */}
      <p className="font-mono-label text-muted animate-fade-in-delay-3 mt-12 text-center">
        © {new Date().getFullYear()} {siteConfig.name.toUpperCase()}
      </p>
    </div>
  );
}
