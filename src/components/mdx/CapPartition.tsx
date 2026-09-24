import DiagramFrame from "./diagram/DiagramFrame";

// HTML rather than a scaled SVG so the labels stay readable at phone widths.
function Replica({ title, value }: { title: string; value: string }) {
  return (
    <div className="min-w-0 px-3 py-3 text-center" style={{ background: "var(--card)", border: "3px solid var(--border)" }}>
      <div className="font-mono text-sm font-bold">{title}</div>
      <div className="font-mono text-sm" style={{ color: "var(--muted)" }}>
        {value}
      </div>
    </div>
  );
}

export default function CapPartition() {
  return (
    <DiagramFrame
      title="CAP during a network partition"
      caption="Partitions are not optional in a real network, so the real choice is what a cut-off replica does when asked: refuse (consistency) or answer with what it has (availability)."
    >
      <div
        className="grid grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] items-center sm:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)]"
        role="img"
        aria-label="Two replicas separated by a network partition. Replica 1 has x = 2; replica 2 still has x = 1."
      >
        <Replica title="Replica 1" value="x = 2 (latest)" />
        <div className="relative flex h-full flex-col items-center justify-center" aria-hidden="true">
          <div className="absolute inset-x-0 top-1/2" style={{ borderTop: "3px dashed var(--border)" }} />
          <span className="relative px-1 text-xl leading-none font-bold" style={{ background: "var(--card)", color: "var(--red)" }}>
            ✕
          </span>
          <span className="font-mono-label relative mt-1" style={{ color: "var(--red)", fontSize: "0.68rem" }}>
            partition
          </span>
        </div>
        <Replica title="Replica 2" value="x = 1 (stale)" />
      </div>
      <p className="font-mono-label mt-2 text-right" style={{ color: "var(--muted)" }}>
        a client reads x from replica 2
      </p>
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
