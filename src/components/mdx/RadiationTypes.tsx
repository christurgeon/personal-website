interface RadKind {
  name: string;
  accent: string; // CSS var for the accent border + label
  what: string;
  stoppedBy: string;
  external: string;
  internal: string;
}

const kinds: RadKind[] = [
  {
    name: "Alpha",
    accent: "var(--red)",
    what: "A helium nucleus (2 protons + 2 neutrons). Heavy, slow, +2 charge.",
    stoppedBy: "Skin, a sheet of paper",
    external: "Basically none",
    internal: "Severe — plutonium, radon, polonium",
  },
  {
    name: "Beta",
    accent: "var(--yellow)",
    what: "An electron or positron. Light, ±1 charge.",
    stoppedBy: "A sheet of aluminum",
    external: "Skin and eye burns",
    internal: "Moderate — strontium-90 mimics calcium and parks in bone",
  },
  {
    name: "Gamma",
    accent: "var(--blue)",
    what: "A photon. No mass, no charge.",
    stoppedBy: "Lead, concrete, water",
    external: "Severe — whole-body",
    internal: "Real, but gentle per unit energy",
  },
  {
    name: "Neutron",
    accent: "var(--green)",
    what: "Uncharged but heavy.",
    stoppedBy: "Water, polyethylene",
    external: "Severe (reactor and criticality only)",
    internal: "Severe, and it makes other things radioactive",
  },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginTop: "0.7rem" }}>
      <div
        className="font-mono-label"
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.12em",
          opacity: 0.7,
          marginBottom: "0.15rem",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "0.9rem", lineHeight: 1.45 }}>{value}</div>
    </div>
  );
}

export default function RadiationTypes() {
  return (
    <div className="not-prose my-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {kinds.map((k) => (
        <div
          key={k.name}
          style={{
            background: "var(--card)",
            border: "3px solid var(--border)",
            borderLeft: `6px solid ${k.accent}`,
            boxShadow: "4px 4px 0 var(--border)",
            padding: "1.1rem 1.3rem",
            color: "var(--ink)",
          }}
        >
          <div className="font-display" style={{ fontSize: "1.25rem", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            {k.name}
          </div>
          <Row label="WHAT IT IS" value={k.what} />
          <Row label="STOPPED BY" value={k.stoppedBy} />
          <Row label="OUTSIDE THE BODY" value={k.external} />
          <Row label="INSIDE THE BODY" value={k.internal} />
        </div>
      ))}
    </div>
  );
}
