import type { ReactNode } from "react";

export type CalloutType = "note" | "info" | "warning" | "tip" | "quote";

interface VariantSpec {
  label: string;
  accent: string; // CSS var reference for the left border + label color
  bg: string; // tinted background using color-mix
  italic?: boolean;
}

const variants: Record<CalloutType, VariantSpec> = {
  note: {
    label: "Note",
    accent: "var(--blue)",
    bg: "color-mix(in srgb, var(--blue) 18%, var(--card))",
  },
  info: {
    label: "Info",
    accent: "var(--yellow)",
    bg: "color-mix(in srgb, var(--yellow) 28%, var(--card))",
  },
  warning: {
    label: "Warning",
    accent: "var(--red)",
    bg: "color-mix(in srgb, var(--red) 18%, var(--card))",
  },
  tip: {
    label: "Tip",
    accent: "var(--green)",
    bg: "color-mix(in srgb, var(--green) 22%, var(--card))",
  },
  quote: {
    label: "Quote",
    accent: "var(--pink)",
    bg: "color-mix(in srgb, var(--pink) 24%, var(--card))",
    italic: true,
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export default function Callout({ type = "note", title, children }: CalloutProps) {
  const v = variants[type] ?? variants.note;

  return (
    <div
      className="not-prose"
      style={{
        background: v.bg,
        border: "3px solid var(--border)",
        borderLeft: `6px solid ${v.accent}`,
        boxShadow: "4px 4px 0 var(--border)",
        padding: "1.1rem 1.4rem",
        margin: "1.75rem 0",
        fontStyle: v.italic ? "italic" : "normal",
        color: "var(--ink)",
      }}
    >
      <div
        className="font-mono-label mb-1"
        style={{
          fontSize: "0.72rem",
          color: "var(--ink)",
          opacity: 0.75,
          letterSpacing: "0.12em",
        }}
      >
        [ {v.label.toUpperCase()} ]
      </div>
      {title && (
        <div
          className="font-display mb-1.5"
          style={{
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            textTransform: "none",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}
