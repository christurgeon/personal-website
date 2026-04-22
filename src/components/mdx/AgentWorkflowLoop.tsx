const steps = [
  { label: "Research", detail: "orient, read the code, surface constraints" },
  { label: "Pushback", detail: "ask the agent to argue against the plan" },
  { label: "Plan", detail: "structured plan, no files touched" },
  { label: "Second opinion", detail: "fresh agent reviews the plan" },
  { label: "Reconcile", detail: "resolve disagreements, pick a path" },
  { label: "Implement", detail: "watch the shape, interrupt if it drifts" },
  { label: "Simplify", detail: "/simplify to strip the noise" },
  { label: "Scan", detail: "periodic security, bug, refactor sweeps" },
];

export default function AgentWorkflowLoop() {
  return (
    <div
      className="not-prose"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "16px",
        padding: "1.5rem 1.25rem",
        margin: "2rem 0",
        color: "#e2e8f0",
      }}
    >
      <div className="mb-5 text-center text-xs tracking-widest text-slate-400 uppercase">The Loop</div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.label}
            style={{
              position: "relative",
              padding: "0.9rem 1rem",
              borderRadius: "12px",
              border: "1px solid rgba(201,85,61,0.3)",
              background: "rgba(201,85,61,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                color: "#c9553d",
                fontWeight: 600,
                letterSpacing: "0.08em",
                marginBottom: "0.25rem",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{step.label}</div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.45 }}>{step.detail}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "1.1rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#64748b",
          letterSpacing: "0.05em",
        }}
      >
        {"\u21BB"} repeat per task &middot; scan runs out-of-band
      </div>
    </div>
  );
}
