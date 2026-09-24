"use client";

import { useState } from "react";
import DiagramFrame, { DiagramButton } from "./diagram/DiagramFrame";

const NODES = 12;
const NODE_GB = 8;
const DATASET_GB = 240;
const NODE_RPS = 150;
// Below NODES * NODE_RPS so either layout can lose a node and still carry the load.
const TRAFFIC_RPS = 1500;
const PALETTE = [
  { background: "var(--red)", color: "var(--on-red)" },
  { background: "var(--blue)", color: "var(--on-blue)" },
  { background: "var(--green)", color: "var(--on-green)" },
  { background: "var(--yellow)", color: "var(--on-yellow)" },
  { background: "var(--pink)", color: "var(--on-pink)" },
];

type Mode = "replicated" | "sharded";

export default function ShardedVsReplicatedCache() {
  const [mode, setMode] = useState<Mode>("replicated");
  const cachedGb = mode === "replicated" ? NODE_GB : Math.min(DATASET_GB, NODES * NODE_GB);
  const percent = Math.round((cachedGb / DATASET_GB) * 100);

  return (
    <DiagramFrame
      title="Replicated vs sharded cache"
      caption="Both layouts serve the same traffic. Replicas each hold the same hot set, so memory goes to redundancy. Shards each hold different keys, so the cache covers twelve times more of the dataset, but losing one node loses a twelfth of the cache."
      controls={
        <>
          <DiagramButton onClick={() => setMode("replicated")} pressed={mode === "replicated"}>
            Replicated
          </DiagramButton>
          <DiagramButton onClick={() => setMode("sharded")} pressed={mode === "sharded"}>
            Sharded
          </DiagramButton>
        </>
      }
    >
      <p className="mb-4 text-[0.95rem]">
        {NODES} nodes · {NODE_GB} GB of RAM and {NODE_RPS} requests/second each · {DATASET_GB} GB of possible results ·{" "}
        {TRAFFIC_RPS.toLocaleString("en-US")} RPS of traffic, which both layouts can carry even with one node down.
      </p>
      <ol className="grid grid-cols-4 gap-2 sm:grid-cols-6" aria-label="Cache nodes">
        {Array.from({ length: NODES }, (_, i) => {
          const tone = mode === "replicated" ? PALETTE[1] : PALETTE[i % PALETTE.length];
          return (
            <li key={i} className="flex min-w-0 flex-col items-center p-1.5 text-center" style={{ ...tone, border: "2.5px solid var(--border)" }}>
              <span className="font-mono-label" style={{ fontSize: "0.62rem" }}>
                Node {i + 1}
              </span>
              <span className="text-[0.7rem] leading-tight">{mode === "replicated" ? "same hot set" : `GB ${i * NODE_GB}–${(i + 1) * NODE_GB}`}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-5">
        <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }} aria-live="polite">
          Cache holds {cachedGb} GB of {DATASET_GB} GB ({percent}%)
        </div>
        <div className="h-6" style={{ border: "2.5px solid var(--border)", background: "var(--paper)" }}>
          <div className="h-full" style={{ width: `${percent}%`, background: "var(--green)", transition: "width 0.5s ease" }} />
        </div>
      </div>
      <p className="mt-4 text-[0.95rem]">
        {mode === "replicated"
          ? `Lose a node: the other ${NODES - 1} hold the same data, so the hit rate holds, and ${NODES - 1} × ${NODE_RPS} RPS still covers the load.`
          : "Lose a node: a twelfth of the keys miss until the shard returns or the keys are rebalanced."}
      </p>
    </DiagramFrame>
  );
}
