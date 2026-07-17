import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { GitHubIcon, LinkedInIcon, XTwitterIcon, GoodreadsIcon, SoundCloudIcon } from "./Icons";
import { SubscribeForm } from "./SubscribeForm";

const siteLinks = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Photography", href: "/photography" },
  { name: "About", href: "/about" },
];

const extrasLinks = [
  { name: "Links", href: "/links" },
  { name: "Subscribe", href: "/subscribe" },
  { name: "Resume", href: siteConfig.documents.resume },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-24"
      style={{
        background: "var(--yellow)",
        color: "var(--ink)",
        borderTop: "4px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-[1240px] px-6 py-12 sm:px-7">
        <div className="mb-10">
          <SubscribeForm variant="compact" />
        </div>

        <div className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-3" style={{ borderBottom: "3px solid var(--border)" }}>
          <FooterColumn title="Site">
            {siteLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Social">
            <FooterLink href={siteConfig.socials.github} external icon={<GitHubIcon className="h-3.5 w-3.5" />}>
              GitHub
            </FooterLink>
            <FooterLink href={siteConfig.socials.linkedin} external icon={<LinkedInIcon className="h-3.5 w-3.5" />}>
              LinkedIn
            </FooterLink>
            <FooterLink href={siteConfig.socials.x} external icon={<XTwitterIcon className="h-3.5 w-3.5" />}>
              X
            </FooterLink>
            <FooterLink href={siteConfig.socials.soundcloud} external icon={<SoundCloudIcon className="h-3.5 w-3.5" />}>
              SoundCloud
            </FooterLink>
            <FooterLink href={siteConfig.socials.goodreads} external icon={<GoodreadsIcon className="h-3.5 w-3.5" />}>
              Goodreads
            </FooterLink>
          </FooterColumn>

          <FooterColumn title="Extras">
            {extrasLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.name}
              </FooterLink>
            ))}
            <FooterLink href="/blog/feed.xml" external>
              RSS
            </FooterLink>
          </FooterColumn>
        </div>

        <div className="font-mono-label mt-5 flex flex-wrap justify-between gap-3">
          <span>
            © {year} · {siteConfig.name} · Est. 2024
          </span>
          <span>Made without a design system</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="font-mono-label mb-2.5 text-[0.72rem] font-bold">{title}</h5>
      <ul className="flex flex-col gap-1 text-[0.95rem]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, external, icon, children }: { href: string; external?: boolean; icon?: React.ReactNode; children: React.ReactNode }) {
  if (external) {
    return (
      <li>
        <a href={href} target="_blank" rel="noopener noreferrer" className="footer-link">
          {icon}
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className="footer-link">
        {icon}
        {children}
      </Link>
    </li>
  );
}
