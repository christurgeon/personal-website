const advantages = [
  { emoji: "\u{1F4E5}", label: "Tax-deductible\ncontributions", color: "#3b82f6" },
  { emoji: "\u{1F4C8}", label: "Tax-free\ngrowth", color: "#8b5cf6" },
  { emoji: "\u{1F4E4}", label: "Tax-free\nwithdrawals*", color: "#10b981" },
];

export default function TripleTaxAdvantage() {
  return (
    <>
      <div className="not-prose my-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
        {advantages.map((item, i) => (
          <div
            key={i}
            className="flex min-w-0 flex-col items-center rounded-xl px-5 py-4 text-center sm:min-w-[160px]"
            style={{
              border: `2px solid ${item.color}`,
              background: `${item.color}10`,
            }}
          >
            <span style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.emoji}</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, whiteSpace: "pre-line" }}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="not-prose -mt-4 mb-6 text-center text-xs text-slate-500">
        *For qualified medical expenses. After age 65, non-medical withdrawals are taxed as ordinary income (like a Traditional IRA) but with no
        penalty.
      </div>
    </>
  );
}
