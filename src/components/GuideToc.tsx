"use client";

import { useEffect, useMemo, useState } from "react";
import { activeHeadingId, groupToc, type TocEntry, type TocPart } from "@/lib/toc";

// Distance from the viewport top at which a heading counts as "current": below the jump bar on mobile, near the top on desktop.
// The site header scrolls away (it is not sticky), so neither offset reserves space for it.
const MOBILE_OFFSET = 80;
const DESKTOP_OFFSET = 40;

function useActiveHeading(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = window.matchMedia("(min-width: 1024px)").matches ? DESKTOP_OFFSET : MOBILE_OFFSET;
      const positions = ids.map((id) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity }));
      setActive(activeHeadingId(positions, offset));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}

interface TocListProps {
  parts: TocPart[];
  active: string | null;
  activePartId: string | null;
  expandAll?: boolean;
  onNavigate?: () => void;
}

function TocList({ parts, active, activePartId, expandAll = false, onNavigate }: TocListProps) {
  return (
    <ol className="flex flex-col gap-1.5">
      {parts.map((part) => {
        const isActivePart = part.entry.id === activePartId;
        const expanded = expandAll || isActivePart;
        return (
          <li key={part.entry.id}>
            <a
              href={`#${part.entry.id}`}
              onClick={onNavigate}
              className="guide-toc-link font-semibold"
              data-active-part={isActivePart ? "" : undefined}
              aria-current={active === part.entry.id ? "location" : undefined}
            >
              {part.entry.text}
            </a>
            {expanded && part.children.length > 0 && (
              <ol className="mt-1 mb-2 ml-1 flex flex-col gap-1 pl-3" style={{ borderLeft: "2px solid var(--border)" }}>
                {part.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      onClick={onNavigate}
                      className="guide-toc-link"
                      aria-current={active === child.id ? "location" : undefined}
                    >
                      {child.text}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function GuideToc({ entries }: { entries: TocEntry[] }) {
  const parts = useMemo(() => groupToc(entries), [entries]);
  const ids = useMemo(() => entries.map((e) => e.id), [entries]);
  const active = useActiveHeading(ids);
  const [open, setOpen] = useState(false);

  const activePart = parts.find((p) => p.entry.id === active || p.children.some((c) => c.id === active)) ?? null;

  return (
    <>
      <div
        className="sticky top-0 z-40 -mx-5 mb-8 px-5 sm:-mx-7 sm:px-7 lg:hidden"
        style={{ background: "var(--paper)", borderBottom: "3px solid var(--border)" }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="guide-toc-mobile"
          className="font-mono-label flex w-full items-center justify-between gap-3 py-3 text-left"
        >
          <span className="min-w-0 truncate">{activePart ? activePart.entry.text : "Jump to section"}</span>
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        {/* Overlay the article instead of pushing it down while the bar is stuck. */}
        <nav
          id="guide-toc-mobile"
          aria-label="Sections"
          hidden={!open}
          className="absolute inset-x-0 top-full max-h-[60vh] overflow-y-auto px-5 pt-3 pb-4 sm:px-7"
          style={{ background: "var(--paper)", borderBottom: "3px solid var(--border)" }}
        >
          <TocList parts={parts} active={active} activePartId={activePart?.entry.id ?? null} expandAll onNavigate={() => setOpen(false)} />
        </nav>
      </div>

      <nav aria-label="Sections" className="sticky top-6 hidden max-h-[calc(100vh-3rem)] self-start overflow-y-auto pr-2 lg:block">
        <div className="font-mono-label mb-3" style={{ color: "var(--muted)" }}>
          [ Contents ]
        </div>
        <TocList parts={parts} active={active} activePartId={activePart?.entry.id ?? null} />
      </nav>
    </>
  );
}
