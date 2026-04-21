import type { CSSProperties, ReactNode } from "react";
import { COLOR_PAIRS, type RisoColor } from "@/lib/riso";

interface StickerProps {
  children: ReactNode;
  color?: RisoColor;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}

export function Sticker({ children, color = "red", rotate = 6, className = "", style }: StickerProps) {
  const { bg, fg } = COLOR_PAIRS[color];
  return (
    <span
      className={`font-display inline-block border-[3px] px-3 py-1 text-[0.78rem] tracking-wide uppercase ${className}`}
      style={{
        background: bg,
        color: fg,
        borderColor: "var(--border)",
        boxShadow: "3px 3px 0 var(--border)",
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
