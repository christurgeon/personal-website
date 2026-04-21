interface MarqueeItem {
  label: string;
  color?: "ink" | "yellow" | "red" | "blue" | "green" | "pink";
}

const colorMap: Record<NonNullable<MarqueeItem["color"]>, string> = {
  ink: "var(--paper)",
  yellow: "var(--yellow)",
  red: "var(--red)",
  blue: "var(--blue)",
  green: "var(--green)",
  pink: "var(--pink)",
};

interface MarqueeProps {
  items: MarqueeItem[];
  repeat?: number;
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({ items, repeat = 4, speed = "normal" }: MarqueeProps) {
  const duration = speed === "slow" ? "44s" : speed === "fast" ? "18s" : "28s";
  const tiles = Array.from({ length: repeat }).flatMap(() => items);

  return (
    <div
      className="relative overflow-hidden py-4"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        borderTop: "4px solid var(--border)",
        borderBottom: "4px solid var(--border)",
      }}
    >
      <div
        className="font-display flex gap-12 whitespace-nowrap text-[clamp(1.4rem,3vw,2rem)] tracking-tight uppercase"
        style={{ animation: `marquee-scroll ${duration} linear infinite`, width: "max-content" }}
      >
        {tiles.map((item, i) => (
          <span key={i} style={{ color: colorMap[item.color ?? "ink"] }}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
