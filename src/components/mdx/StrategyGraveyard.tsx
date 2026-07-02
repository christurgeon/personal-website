import { COLOR_PAIRS, pickByIndex, type RisoColor } from "@/lib/riso";

interface Grave {
  name: string;
  was: string;
  cause: string;
  epitaph: string; // the damning stat, shown as a pill
}

// Cause-of-death rotates through the riso hues for variety. Order is
// roughly chronological — the order I killed them in.
const HUES: readonly RisoColor[] = ["red", "blue", "green", "yellow", "pink"];

const graves: Grave[] = [
  {
    name: "SPX 0DTE Brackets",
    was: "Priced same-day S&P 500 brackets with a one-knob volatility model.",
    cause: "A single log-normal can't out-price a full options chain. The market sees the whole smile; my model saw one number.",
    epitaph: "−76% to −99% ROI",
  },
  {
    name: "The Daily “Between” Book",
    was: "The core bet: that the day's high lands inside a specific 1°F bracket.",
    cause:
      "No demonstrated edge against the efficient morning market. Every rescue I tried — adverse-selection, directional residue, a suppressive filter — falsified.",
    epitaph: "bleed ≈ the fee rate",
  },
  {
    name: "Tail-NO Harvest",
    was: "Sell the unlikely wings, collect the premium people overpay for longshots.",
    cause: "The spread already prices the mispricing. The famous 1.27× implied/realized edge didn't replicate — I measured 0.62.",
    epitaph: "n=6312, −0.3% ROI",
  },
  {
    name: "Overnight Stale-Quote",
    was: "React to the fresh 00Z/12Z model run before the resting book repriced.",
    cause: "The book already out-predicts the fresh run. There was no latency gap to harvest — the quotes weren't stale, my model was.",
    epitaph: "Brier 0.085 vs 0.190",
  },
  {
    name: "NBM-Gap Directional",
    was: "Trade when my forecast disagreed with the National Blend of Models.",
    cause: "The market is roughly 3× sharper than NBM. The gap I was trading was my error, not the market's.",
    epitaph: "n=776, well-powered null",
  },
  {
    name: "Maker / Rebate Harvest",
    was: "Post passive quotes, earn the spread and the exchange's liquidity rebate.",
    cause: "1¢ real spreads, one-sided books, and adverse selection that eats the rebate alive. You only get filled when you're wrong.",
    epitaph: "−5 to −6¢ per fill",
  },
  {
    name: "Off-Weather Frontier",
    was: "Sports vs. sharp books, cross-venue arbitrage, crypto, entertainment.",
    cause: "The professionals are already there. Every lane was efficient, market-made, or latency-arbed by someone faster and better-capitalized.",
    epitaph: "multi-agent sweep, zero survivors",
  },
  {
    name: "HRRR Intraday Nowcast",
    was: "Feed a high-resolution short-range model into the same-day posterior.",
    cause:
      "The apparent accuracy win was an artifact of a max() floor. The real defect — a settlement-source gap — was something no model could fix.",
    epitaph: "NO-GO at re-cut",
  },
];

export default function StrategyGraveyard() {
  return (
    <div className="not-prose" style={{ margin: "2rem 0" }}>
      <div className="font-mono-label mb-4" style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.14em" }}>
        [ THE GRAVEYARD ]
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {graves.map((g, i) => {
          const hue = COLOR_PAIRS[pickByIndex(HUES, i)];
          return (
            <div
              key={g.name}
              style={{
                background: "var(--card)",
                border: "3px solid var(--border)",
                borderTop: `7px solid ${hue.bg}`,
                boxShadow: "var(--shadow-2)",
                padding: "1.1rem 1.25rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono-label" style={{ fontSize: "0.64rem", color: "var(--muted)", letterSpacing: "0.16em" }}>
                  R.I.P.
                </span>
                <span
                  className="font-mono-label"
                  style={{
                    background: hue.bg,
                    color: hue.fg,
                    border: "2px solid var(--border)",
                    padding: "0.12rem 0.5rem",
                    fontSize: "0.64rem",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {g.epitaph}
                </span>
              </div>

              <div className="font-display" style={{ fontSize: "1.15rem", lineHeight: 1.1, letterSpacing: "-0.01em", textTransform: "none" }}>
                {g.name}
              </div>

              <div style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--muted)" }}>{g.was}</div>

              <div style={{ borderTop: "2px dashed var(--border)", opacity: 0.4, margin: "0.1rem 0" }} />

              <div>
                <div className="font-mono-label mb-1" style={{ fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.14em" }}>
                  CAUSE OF DEATH
                </div>
                <div style={{ fontSize: "0.9rem", lineHeight: 1.55, color: "var(--ink)" }}>{g.cause}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
