const items = [
  {
    level: "P0",
    label: "401(k) → Employer Match",
    desc: "Free money. 100% instant return.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
  },
  {
    level: "P1",
    label: "HSA (if HDHP eligible)",
    desc: "Triple tax advantage. Best account in the tax code.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  {
    level: "P2",
    label: "Max 401(k) employee limit ($23.5K)",
    desc: "Reduce taxable income or build tax-free Roth wealth.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.3)",
  },
  {
    level: "P3",
    label: "Backdoor Roth IRA ($7K)",
    desc: "Bypass income limits. Tax-free growth forever.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.3)",
  },
  {
    level: "P4",
    label: "Mega Backdoor Roth (up to $70K total)",
    desc: "After-tax → Roth conversion. Check if your plan allows it.",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.3)",
  },
  {
    level: "P5",
    label: "Taxable Brokerage",
    desc: "No limits. Tax-efficient index funds. Harvest losses.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  },
];

export default function ContributionStack() {
  return (
    <div
      className="not-prose"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "16px",
        padding: "1.25rem",
        margin: "2rem 0",
        fontFamily: "monospace",
        color: "#e2e8f0",
      }}
    >
      <div className="mb-5 text-center text-xs tracking-widest text-slate-400 uppercase">Contribution Priority Stack — Fund Top to Bottom</div>

      {items.map((item, i) => (
        <div
          key={i}
          className="mb-2 flex items-start gap-3 sm:items-center sm:gap-4"
          style={{
            padding: "0.75rem 0.75rem",
            borderRadius: "10px",
            background: item.bg,
            border: `1px solid ${item.border}`,
          }}
        >
          <span
            className="shrink-0"
            style={{
              background: item.color,
              color: "#fff",
              padding: "0.2rem 0.5rem",
              borderRadius: "6px",
              fontSize: "0.7rem",
              fontWeight: 700,
              minWidth: "2rem",
              textAlign: "center",
            }}
          >
            {item.level}
          </span>
          <div className="min-w-0">
            <div className="text-sm leading-tight font-semibold sm:text-[0.95rem]">{item.label}</div>
            <div className="mt-0.5 text-xs leading-snug text-slate-400 sm:text-sm">{item.desc}</div>
          </div>
        </div>
      ))}

      <div className="mt-4 text-center text-xs text-slate-500">2026 limits shown. Verify current year limits at irs.gov.</div>
    </div>
  );
}
