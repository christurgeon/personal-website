import DiagramFrame from "./diagram/DiagramFrame";

const MONO = "var(--font-mono), monospace";

function Replica({ x, title, value }: { x: number; title: string; value: string }) {
  return (
    <g>
      <rect x={x} y={30} width={150} height={70} style={{ fill: "var(--card)", stroke: "var(--border)", strokeWidth: 3 }} />
      <text x={x + 75} y={58} textAnchor="middle" style={{ fill: "var(--ink)", fontFamily: MONO, fontSize: 13, fontWeight: 700 }}>
        {title}
      </text>
      <text x={x + 75} y={82} textAnchor="middle" style={{ fill: "var(--muted)", fontFamily: MONO, fontSize: 12 }}>
        {value}
      </text>
    </g>
  );
}

export default function CapPartition() {
  return (
    <DiagramFrame
      title="CAP during a network partition"
      caption="Partitions are not optional in a real network, so the real choice is what a cut-off replica does when asked: refuse (consistency) or answer with what it has (availability)."
    >
      <svg
        viewBox="0 0 520 150"
        className="block h-auto w-full"
        role="img"
        aria-label="Two replicas separated by a network partition. Replica 1 has x = 2; replica 2 still has x = 1."
      >
        <Replica x={30} title="Replica 1" value="x = 2 (latest)" />
        <Replica x={340} title="Replica 2" value="x = 1 (stale)" />
        <line x1={180} y1={65} x2={340} y2={65} style={{ stroke: "var(--border)", strokeWidth: 3, strokeDasharray: "8 6" }} />
        <line x1={248} y1={50} x2={272} y2={80} style={{ stroke: "var(--red)", strokeWidth: 5 }} />
        <line x1={272} y1={50} x2={248} y2={80} style={{ stroke: "var(--red)", strokeWidth: 5 }} />
        <text x={260} y={104} textAnchor="middle" style={{ fill: "var(--red)", fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em" }}>
          PARTITION
        </text>
        <text x={415} y={132} textAnchor="middle" style={{ fill: "var(--ink)", fontFamily: MONO, fontSize: 11 }}>
          a client reads x here
        </text>
      </svg>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="p-3" style={{ border: "2.5px solid var(--border)", background: "color-mix(in srgb, var(--blue) 18%, var(--card))" }}>
          <div className="font-mono-label mb-1">CP · choose consistency</div>
          <p className="text-[0.95rem]">
            Replica 2 refuses the read or times out until the partition heals. No stale answers, but some requests fail.
          </p>
        </div>
        <div className="p-3" style={{ border: "2.5px solid var(--border)", background: "color-mix(in srgb, var(--green) 22%, var(--card))" }}>
          <div className="font-mono-label mb-1">AP · choose availability</div>
          <p className="text-[0.95rem]">Replica 2 answers x = 1. Every request gets a response, but it may be stale until the replicas reconcile.</p>
        </div>
      </div>
    </DiagramFrame>
  );
}
