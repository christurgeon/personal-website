import { hashString } from "@/lib/riso";

interface RisoThumbnailProps {
  seed: string;
  className?: string;
}

const palettes: Array<{ bg: string; shapes: string[] }> = [
  { bg: "var(--yellow)", shapes: ["var(--red)", "var(--blue)", "var(--green)"] },
  { bg: "var(--pink)", shapes: ["var(--blue)", "var(--yellow)", "var(--ink)"] },
  { bg: "var(--blue)", shapes: ["var(--yellow)", "var(--red)", "var(--pink)"] },
  { bg: "var(--green)", shapes: ["var(--red)", "var(--ink)", "var(--yellow)"] },
  { bg: "var(--red)", shapes: ["var(--yellow)", "var(--pink)", "var(--blue)"] },
];

export function RisoThumbnail({ seed, className = "" }: RisoThumbnailProps) {
  const h = hashString(seed);
  const palette = palettes[h % palettes.length];
  const variant = (h >> 4) % 4;
  const dotsId = `riso-dots-${h.toString(36)}`;

  return (
    <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <pattern id={dotsId} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="var(--border)" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={palette.bg} />
      {variant === 0 && (
        <>
          <circle cx="110" cy="125" r="70" fill={palette.shapes[0]} stroke="var(--border)" strokeWidth="3" />
          <circle cx="200" cy="125" r="70" fill={palette.shapes[1]} stroke="var(--border)" strokeWidth="3" opacity="0.9" />
          <circle cx="290" cy="125" r="70" fill={palette.shapes[2]} stroke="var(--border)" strokeWidth="3" opacity="0.9" />
        </>
      )}
      {variant === 1 && (
        <>
          <path
            d="M0 200 L80 140 L160 180 L240 100 L320 160 L400 80 L400 250 L0 250 Z"
            fill={palette.shapes[0]}
            stroke="var(--border)"
            strokeWidth="3"
          />
          <circle cx="330" cy="70" r="32" fill={palette.shapes[1]} stroke="var(--border)" strokeWidth="3" />
          <circle cx="70" cy="60" r="18" fill={palette.shapes[2]} stroke="var(--border)" strokeWidth="3" />
        </>
      )}
      {variant === 2 && (
        <>
          <circle cx="200" cy="125" r="90" fill={palette.shapes[0]} stroke="var(--border)" strokeWidth="3" />
          <path d="M150 125 Q200 80 250 125 Q200 170 150 125 Z" fill={palette.shapes[1]} stroke="var(--border)" strokeWidth="3" />
          <rect x="40" y="40" width="40" height="40" fill={palette.shapes[2]} stroke="var(--border)" strokeWidth="3" transform="rotate(15 60 60)" />
        </>
      )}
      {variant === 3 && (
        <>
          <rect x="40" y="40" width="150" height="170" fill={palette.shapes[0]} stroke="var(--border)" strokeWidth="3" transform="rotate(-6 115 125)" />
          <rect x="180" y="60" width="180" height="140" fill={palette.shapes[1]} stroke="var(--border)" strokeWidth="3" transform="rotate(4 270 130)" />
          <circle cx="320" cy="60" r="28" fill={palette.shapes[2]} stroke="var(--border)" strokeWidth="3" />
        </>
      )}
      <rect width="400" height="250" fill={`url(#${dotsId})`} opacity="0.22" />
    </svg>
  );
}
