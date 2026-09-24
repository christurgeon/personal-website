"use client";

import { useState } from "react";
import DiagramFrame from "./diagram/DiagramFrame";
import { clampQuorum, isStrongQuorum, worstCaseSets } from "@/lib/diagrams/quorum";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, onChange }: SliderProps) {
  return (
    <label className="font-mono-label flex flex-col gap-1 sm:min-w-[160px] sm:flex-1">
      <span>
        {label}: {value}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: "var(--accent)" }}
      />
    </label>
  );
}

export default function QuorumReplicas() {
  const [n, setN] = useState(3);
  const [w, setW] = useState(2);
  const [r, setR] = useState(2);

  const sets = worstCaseSets(n, w, r);
  const strong = isStrongQuorum(n, w, r);

  const setReplicas = (next: number) => {
    const clamped = clampQuorum(next, w, r);
    setN(next);
    setW(clamped.w);
    setR(clamped.r);
  };

  const role = (i: number) => {
    const inWrite = sets.write.includes(i);
    const inRead = sets.read.includes(i);
    if (inWrite && inRead) return { label: "W+R", background: "var(--green)", color: "var(--on-green)" };
    if (inWrite) return { label: "W", background: "var(--red)", color: "var(--on-red)" };
    if (inRead) return { label: "R", background: "var(--blue)", color: "var(--on-blue)" };
    return { label: "—", background: "var(--paper)", color: "var(--muted)" };
  };

  return (
    <DiagramFrame
      title="Quorum reads and writes"
      caption="Worst case: the write lands on the first W replicas and the read asks the last R. They are guaranteed to share a replica only when R + W > N."
      controls={
        <>
          <Slider label="N replicas" value={n} min={3} max={7} onChange={setReplicas} />
          <Slider label="W write acks" value={w} min={1} max={n} onChange={setW} />
          <Slider label="R read replicas" value={r} min={1} max={n} onChange={setR} />
        </>
      }
    >
      <ol className="flex flex-wrap justify-center gap-3" aria-label="Replicas">
        {Array.from({ length: n }, (_, i) => {
          const { label, background, color } = role(i);
          return (
            <li key={i} className="flex flex-col items-center gap-1">
              <span
                className="grid h-14 w-14 place-items-center rounded-full font-mono text-sm font-bold"
                style={{ background, color, border: "3px solid var(--border)" }}
              >
                {label}
              </span>
              <span className="font-mono-label" style={{ color: "var(--muted)" }}>
                #{i + 1}
              </span>
            </li>
          );
        })}
      </ol>
      <p
        className="mt-4 px-3 py-2"
        aria-live="polite"
        style={{
          border: "2.5px solid var(--border)",
          background: `color-mix(in srgb, ${strong ? "var(--green)" : "var(--red)"} 22%, var(--card))`,
        }}
      >
        {strong
          ? `R + W = ${r + w} > N = ${n}. Every read shares at least ${sets.overlap.length} replica with the latest write, so it can see the newest value.`
          : `R + W = ${r + w} ≤ N = ${n}. In the worst case the read asks only replicas that missed the write and returns stale data.`}
      </p>
    </DiagramFrame>
  );
}
