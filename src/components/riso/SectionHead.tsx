import Link from "next/link";
import type { ReactNode } from "react";

interface SectionHeadProps {
  number: string;
  kicker: string;
  title: ReactNode;
  highlight?: string;
  more?: { label: string; href: string };
  align?: "left" | "center";
}

export function SectionHead({ number, kicker, title, highlight, more, align = "left" }: SectionHeadProps) {
  return (
    <div
      className={`mb-10 flex flex-col gap-5 sm:flex-row sm:items-end ${align === "center" ? "sm:justify-center sm:text-left" : "sm:justify-between"}`}
    >
      <div>
        <div className="font-mono-label text-muted mb-3">
          [ {number} / {kicker} ]
        </div>
        <h2 className="font-display text-[clamp(2.2rem,5vw,3.75rem)] leading-[0.95] tracking-[-0.04em] uppercase">
          {title}
          {highlight && (
            <>
              {" "}
              <span
                className="inline-block border-[3px] px-[0.15em]"
                style={{
                  background: "var(--yellow)",
                  color: "var(--ink)",
                  borderColor: "var(--border)",
                  boxShadow: "4px 4px 0 var(--border)",
                  transform: "rotate(-1deg)",
                }}
              >
                {highlight}
              </span>
            </>
          )}
        </h2>
      </div>
      {more && (
        <Link
          href={more.href}
          className="brutal-lift-sm font-mono-label inline-flex items-center gap-2 self-start border-[3px] px-4 py-2.5 sm:self-end"
          style={{
            background: "var(--card)",
            color: "var(--ink)",
            borderColor: "var(--border)",
            boxShadow: "4px 4px 0 var(--border)",
          }}
        >
          {more.label} →
        </Link>
      )}
    </div>
  );
}
