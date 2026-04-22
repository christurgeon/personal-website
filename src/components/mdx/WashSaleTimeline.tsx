export default function WashSaleTimeline() {
  return (
    <div
      className="not-prose"
      style={{
        margin: "2rem 0",
        padding: "1.25rem",
        background: "rgba(99,102,241,0.05)",
        borderRadius: "12px",
        border: "1px solid rgba(99,102,241,0.15)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          fontSize: "0.8rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#6366f1",
        }}
      >
        Wash-Sale Danger Zone
      </div>
      <div className="flex flex-col items-stretch justify-center sm:flex-row sm:items-center">
        <div
          className="rounded-t-lg px-4 py-3 text-center sm:rounded-l-lg sm:rounded-tr-none sm:py-2"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", minWidth: "140px" }}
        >
          <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 600 }}>NO BUY ZONE</div>
          <div style={{ fontSize: "0.85rem" }}>30 days before</div>
        </div>
        <div className="z-10 px-5 py-3 text-center" style={{ background: "rgba(245,158,11,0.15)", border: "2px solid #f59e0b", minWidth: "100px" }}>
          <div style={{ fontSize: "0.7rem", color: "#f59e0b", fontWeight: 700 }}>SELL DAY</div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Loss realized</div>
        </div>
        <div
          className="rounded-b-lg px-4 py-3 text-center sm:rounded-r-lg sm:rounded-bl-none sm:py-2"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", minWidth: "140px" }}
        >
          <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 600 }}>NO BUY ZONE</div>
          <div style={{ fontSize: "0.85rem" }}>30 days after</div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.8rem", color: "#64748b" }}>
        Buying a &ldquo;substantially identical&rdquo; security in this 61-day window disallows the loss.
      </div>
    </div>
  );
}
