const tips = [
  {
    icon: "\u{1F3AF}",
    title: "Time applications to big expenses",
    text: "Furniture, flights, insurance premiums — hit the minimum spend naturally.",
  },
  { icon: "\u{1F504}", title: "Never close cards", text: "Downgrade to no-fee versions. Closing hurts utilization ratio and average account age." },
  {
    icon: "\u2708\uFE0F",
    title: "Transfer points, don't cash out",
    text: "Point transfers to airline/hotel partners often yield 1.5–2x the value of cash redemption.",
  },
  { icon: "\u{1F4CA}", title: "Track everything", text: "Spreadsheet with open dates, bonus deadlines, annual fee dates, and downgrade windows." },
];

export default function TipGrid() {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {tips.map((item, i) => (
        <div
          key={i}
          style={{
            padding: "1.25rem",
            borderRadius: "10px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "rgba(148,163,184,0.03)",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.35rem" }}>{item.title}</div>
          <div style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>{item.text}</div>
        </div>
      ))}
    </div>
  );
}
