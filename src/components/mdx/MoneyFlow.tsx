export default function MoneyFlow() {
  return (
    <div
      className="not-prose"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "16px",
        padding: "1.25rem",
        margin: "2rem 0",
        color: "#e2e8f0",
      }}
    >
      <div className="mb-5 text-center text-xs tracking-widest text-slate-400 uppercase">Monthly Money Flow — Automate Everything</div>

      <div className="flex flex-col items-center gap-2">
        <div
          className="w-full max-w-xs rounded-xl px-4 py-3 text-center text-sm font-semibold"
          style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}
        >
          Paycheck
        </div>
        <div className="text-xl text-slate-500">{"\u2193"}</div>
        <div
          className="w-full max-w-xs rounded-xl px-4 py-3 text-center text-sm"
          style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}
        >
          <strong>401(k)</strong> — auto-deducted before it hits your bank
        </div>
        <div className="text-xl text-slate-500">{"\u2193"}</div>
        <div
          className="w-full max-w-xs rounded-xl px-4 py-3 text-center text-sm"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
        >
          <strong>HSA</strong> — auto-deducted or auto-transferred
        </div>
        <div className="text-xl text-slate-500">{"\u2193"}</div>
        <div
          className="w-full max-w-xs rounded-xl px-4 py-3 text-center text-sm"
          style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
        >
          <strong>Checking account</strong> — bills, rent, essentials
        </div>
        <div className="text-xl text-slate-500">{"\u2193"}</div>
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <div
            className="rounded-xl px-3 py-3 text-center text-sm"
            style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}
          >
            <strong>Roth IRA</strong>
            <br />
            auto-transfer monthly
          </div>
          <div
            className="rounded-xl px-3 py-3 text-center text-sm"
            style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)" }}
          >
            <strong>Brokerage</strong>
            <br />
            auto-invest remainder
          </div>
          <div
            className="rounded-xl px-3 py-3 text-center text-sm"
            style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            <strong>Emergency Fund</strong>
            <br />
            HYSA, 3-6 months
          </div>
        </div>
      </div>
    </div>
  );
}
