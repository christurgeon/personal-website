"use client";

import { useState, useCallback } from "react";
import { XTwitterIcon, LinkedInIcon } from "@/components/Icons";
import { siteConfig } from "@/lib/config";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

type Variant = {
  bg: string;
  fg: string;
};

const variants: Record<"yellow" | "blue" | "pink", Variant> = {
  yellow: { bg: "var(--yellow)", fg: "var(--ink)" },
  blue: { bg: "var(--blue)", fg: "var(--paper)" },
  pink: { bg: "var(--pink)", fg: "var(--ink)" },
};

function LinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${siteConfig.url}/blog/${slug}`;

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const shareToX = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
  };

  const buttonBase = "brutal-lift-sm font-mono-label inline-flex items-center gap-2 px-3.5 py-2 text-[0.72rem]";

  const buttonStyle = (v: Variant) => ({
    background: v.bg,
    color: v.fg,
    border: "2.5px solid var(--border)",
    boxShadow: "3px 3px 0 var(--border)",
  });

  return (
    <div className="mt-16">
      <div className="mb-6">
        <hr
          style={{
            border: 0,
            borderTop: "3px solid var(--border)",
            margin: 0,
          }}
        />
        <hr
          style={{
            border: 0,
            borderTop: "3px solid var(--border)",
            marginTop: "4px",
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono-label mr-2" style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
          Share →
        </span>

        <button onClick={copyLink} className={buttonBase} style={buttonStyle(variants.yellow)} aria-label="Copy link to clipboard" type="button">
          {copied ? <CheckIcon className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
          <span>{copied ? "Copied" : "Copy Link"}</span>
        </button>

        <button onClick={shareToX} className={buttonBase} style={buttonStyle(variants.blue)} aria-label="Post on X" type="button">
          <XTwitterIcon className="h-4 w-4" />
          <span>Post on X</span>
        </button>

        <button onClick={shareToLinkedIn} className={buttonBase} style={buttonStyle(variants.pink)} aria-label="Share to LinkedIn" type="button">
          <LinkedInIcon className="h-4 w-4" />
          <span>Share to LinkedIn</span>
        </button>
      </div>
    </div>
  );
}
