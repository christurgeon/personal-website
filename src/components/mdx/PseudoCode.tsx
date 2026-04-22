const steps = [
  {
    number: 1,
    title: "Find your losing positions",
    description: "Review your portfolio for investments trading below your purchase price.",
    color: "#ef4444",
  },
  {
    number: 2,
    title: "Sell to realize the losses",
    description: "Selling locks in the loss on paper, which the IRS lets you use as a deduction.",
    color: "#f59e0b",
  },
  {
    number: 3,
    title: "Offset your gains",
    description: "Your realized losses cancel out capital gains from winning trades, reducing your tax bill.",
    color: "#3b82f6",
  },
  {
    number: 4,
    title: "Deduct up to $3K from income",
    description: "If losses exceed gains, deduct up to $3,000 against ordinary income. The rest carries forward to future years.",
    color: "#8b5cf6",
  },
  {
    number: 5,
    title: "Reinvest in a similar fund",
    description:
      "Buy a similar (but not identical) fund to stay invested. This keeps your portfolio allocation on track while avoiding the wash-sale rule.",
    color: "#10b981",
  },
];

export default function PseudoCode() {
  return (
    <div
      className="not-prose"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "16px",
        padding: "2rem",
        margin: "2rem 0",
        color: "#e2e8f0",
        fontSize: "0.9rem",
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.05em",
          color: "#94a3b8",
          marginBottom: "1.25rem",
        }}
      >
        How Tax-Loss Harvesting Works
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {steps.map((step) => (
          <div
            key={step.number}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              background: `rgba(148,163,184,0.06)`,
              borderLeft: `3px solid ${step.color}`,
              borderRadius: "0 10px 10px 0",
              padding: "0.875rem 1rem",
            }}
          >
            <div
              style={{
                background: step.color,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.75rem",
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "0.1rem",
              }}
            >
              {step.number}
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>{step.title}</div>
              <div style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.5 }}>{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
