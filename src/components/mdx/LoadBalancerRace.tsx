"use client";

import { useState } from "react";
import DiagramFrame, { DiagramButton } from "./diagram/DiagramFrame";
import { useDiagramPlayback, useTicker } from "./diagram/useDiagramPlayback";
import { createLb, lbTick, type LbState, type Strategy } from "@/lib/diagrams/loadBalancer";

const SPEEDS = [3, 3, 1];
const ARRIVALS = 6;
const MAX_TICKS = 30;
const BAR_MAX = 20;
const LABELS = ["S1 · fast", "S2 · fast", "S3 · slow"];
const STRATEGIES: { id: Strategy; title: string }[] = [
  { id: "round-robin", title: "Round robin" },
  { id: "least-connections", title: "Least connections" },
];

type Race = Record<Strategy, LbState>;

function initialRace(): Race {
  return { "round-robin": createLb(SPEEDS.length), "least-connections": createLb(SPEEDS.length) };
}

function advance(race: Race): Race {
  if (race["round-robin"].tick >= MAX_TICKS) return initialRace();
  return {
    "round-robin": lbTick(race["round-robin"], "round-robin", SPEEDS, ARRIVALS),
    "least-connections": lbTick(race["least-connections"], "least-connections", SPEEDS, ARRIVALS),
  };
}

export default function LoadBalancerRace() {
  const { ref, playing, reducedMotion, paused, setPaused } = useDiagramPlayback<HTMLElement>();
  const [race, setRace] = useState(initialRace);
  useTicker(playing, 700, () => setRace(advance));

  return (
    <DiagramFrame
      ref={ref}
      title="Round robin vs least connections"
      caption="Round robin splits requests evenly, so the slow server's backlog grows without bound. Least connections sends each request to whoever is least busy and keeps every queue short."
      controls={
        <>
          {!reducedMotion && <DiagramButton onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</DiagramButton>}
          <DiagramButton
            onClick={() => {
              setPaused(true);
              setRace(advance);
            }}
          >
            Step
          </DiagramButton>
          <DiagramButton onClick={() => setRace(initialRace())}>Reset</DiagramButton>
          <span className="font-mono-label sm:ml-auto" style={{ color: "var(--muted)" }}>
            Tick {race["round-robin"].tick} / {MAX_TICKS}
          </span>
        </>
      }
    >
      <p className="mb-4 text-[0.95rem]">
        {ARRIVALS} requests arrive per tick. The fast servers finish {SPEEDS[0]} per tick; the slow one finishes {SPEEDS[2]}.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {STRATEGIES.map(({ id, title }) => (
          <div key={id} className="p-3" style={{ border: "2.5px solid var(--border)", background: "var(--paper)" }}>
            <div className="font-mono-label mb-3">{title}</div>
            <ul className="flex flex-col gap-2">
              {race[id].queues.map((queue, i) => (
                <li key={LABELS[i]} className="grid grid-cols-[5.5rem_minmax(0,1fr)_2rem] items-center gap-2">
                  <span className="font-mono-label" style={{ fontSize: "0.68rem" }}>
                    {LABELS[i]}
                  </span>
                  <span className="h-5 overflow-hidden" style={{ border: "2px solid var(--border)", background: "var(--card)" }}>
                    <span
                      className="block h-full"
                      style={{
                        width: `${(Math.min(queue, BAR_MAX) / BAR_MAX) * 100}%`,
                        background: queue > 5 ? "var(--red)" : "var(--green)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </span>
                  <span className="text-right font-mono text-sm">{queue}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DiagramFrame>
  );
}
