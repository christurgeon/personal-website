import DiagramFrame from "./diagram/DiagramFrame";

const FIELDS = [
  { name: "Sign", bits: 1, background: "var(--paper)", color: "var(--ink)", note: "Always 0 so the ID stays positive in signed 64-bit types." },
  {
    name: "Timestamp",
    bits: 41,
    background: "var(--yellow)",
    color: "var(--on-yellow)",
    note: "Milliseconds since a custom epoch: about 69 years of range.",
  },
  { name: "Datacenter", bits: 5, background: "var(--blue)", color: "var(--on-blue)", note: "Up to 32 datacenters." },
  { name: "Machine", bits: 5, background: "var(--green)", color: "var(--on-green)", note: "Up to 32 machines per datacenter." },
  {
    name: "Sequence",
    bits: 12,
    background: "var(--pink)",
    color: "var(--on-pink)",
    note: "4,096 IDs per millisecond per machine; resets every millisecond.",
  },
];

export default function SnowflakeIdLayout() {
  return (
    <DiagramFrame
      title="Snowflake-style 64-bit ID"
      caption="No coordination at generation time: each machine owns its datacenter and machine bits. Because the timestamp leads, IDs sort roughly by creation time."
    >
      <div className="flex" role="img" aria-label="64-bit ID: 1 sign bit, 41 timestamp bits, 5 datacenter bits, 5 machine bits, 12 sequence bits">
        {FIELDS.map((field) => (
          <div
            key={field.name}
            className="grid min-w-[26px] place-items-center py-3 font-mono text-xs font-bold"
            style={{
              flexGrow: field.bits,
              flexBasis: 0,
              background: field.background,
              color: field.color,
              border: "2.5px solid var(--border)",
              marginLeft: -2.5,
            }}
          >
            {field.bits}
          </div>
        ))}
      </div>
      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-1 h-3 w-3 flex-shrink-0"
              style={{ background: field.background, border: "2px solid var(--border)" }}
            />
            <div>
              <dt className="font-mono-label">
                {field.name} · {field.bits} {field.bits === 1 ? "bit" : "bits"}
              </dt>
              <dd className="text-[0.92rem]">{field.note}</dd>
            </div>
          </div>
        ))}
      </dl>
    </DiagramFrame>
  );
}
