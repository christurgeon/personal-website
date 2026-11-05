"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ReadingProgressBar() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const isBlogPost = /^\/blog\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (!isBlogPost) return;

    // Not a bare `article` selector: PostCards are <article>s too (e.g. on the 404 for an unknown slug).
    const article = document.querySelector<HTMLElement>("[data-post-body]");
    if (!article) {
      if (barRef.current) barRef.current.style.transform = "scaleX(0)";
      return;
    }

    let rafId = 0;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;

        const scrollable = articleHeight - viewportHeight;
        const progress = scrollable > 0 ? (scrollY - articleTop) / scrollable : 1;
        const clamped = Math.min(Math.max(progress, 0), 1);

        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${clamped})`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isBlogPost, pathname]);

  if (!isBlogPost) return null;

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[5px]"
      style={{
        background: "var(--red)",
        borderBottom: "2px solid var(--border)",
        transform: "scaleX(0)",
        transformOrigin: "left",
      }}
    />
  );
}
