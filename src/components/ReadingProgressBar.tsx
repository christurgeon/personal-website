"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ReadingProgressBar() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const isBlogPost = /^\/blog\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (!isBlogPost) return;

    const article = document.querySelector("article");
    if (!article) return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;

        const progress = (scrollY - articleTop) / (articleHeight - viewportHeight);
        const clamped = Math.min(Math.max(progress, 0), 1);

        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${clamped})`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isBlogPost]);

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
