"use client";

import { useMemo } from "react";
import DiagramFrame, { StepControls } from "./diagram/DiagramFrame";
import { useDiagramPlayback, useStepper } from "./diagram/useDiagramPlayback";
import { runLru, type LruEvent, type LruOp } from "@/lib/diagrams/lruCache";

const CAPACITY = 3;
const SCRIPT: LruOp[] = [
  { op: "put", key: "A", value: "1" },
  { op: "put", key: "B", value: "2" },
  { op: "put", key: "C", value: "3" },
  { op: "get", key: "A" },
  { op: "put", key: "D", value: "4" },
  { op: "get", key: "B" },
  { op: "put", key: "C", value: "30" },
  { op: "put", key: "E", value: "5" },
  { op: "get", key: "D" },
];

const TONE: Record<LruEvent["kind"], { background: string; color: string }> = {
  hit: { background: "var(--green)", color: "var(--on-green)" },
  miss: { background: "var(--red)", color: "var(--on-red)" },
  insert: { background: "var(--blue)", color: "var(--on-blue)" },
  update: { background: "var(--yellow)", color: "var(--on-yellow)" },
};
const PLAIN = { background: "var(--paper)", color: "var(--ink)" };

function describe(op: LruOp | null, event: LruEvent | null): string {
  if (!op || !event) return `Empty cache with capacity ${CAPACITY}.`;
  const call = op.op === "get" ? `get(${op.key})` : `put(${op.key}, ${op.value})`;
  switch (event.kind) {
    case "hit":
      return `${call}: hit. ${event.key} moves to the head.`;
    case "miss":
      return `${call}: miss. Nothing changes; the caller falls back to the database.`;
    case "update":
      return `${call}: the key exists. Update its value and move it to the head.`;
    case "insert":
      return event.evicted
        ? `${call}: the cache is full. Evict ${event.evicted} from the tail, then insert ${event.key} at the head.`
        : `${call}: insert ${event.key} at the head.`;
  }
}

export default function LruCache() {
  const frames = useMemo(() => runLru(CAPACITY, SCRIPT), []);
  const { ref, playing, reducedMotion, paused, setPaused } = useDiagramPlayback<HTMLElement>();
  const { step, atEnd, next, reset } = useStepper(frames.length, playing, 1600);
  const frame = frames[step];
  const tone = (key: string) => (frame.event && frame.event.key === key ? TONE[frame.event.kind] : PLAIN);
  const evicted = frame.event?.kind === "insert" ? frame.event.evicted : undefined;

  return (
    <DiagramFrame
      ref={ref}
      title="LRU cache: hash map + doubly linked list"
      caption="The hash map finds any node in O(1). The linked list keeps recency order, so moving a node to the head and evicting from the tail are both O(1)."
      controls={
        <StepControls
          step={step}
          total={frames.length}
          atEnd={atEnd}
          onNext={() => {
            setPaused(true);
            next();
          }}
          onReset={reset}
          paused={paused}
          onTogglePause={() => setPaused(!paused)}
          reducedMotion={reducedMotion}
        />
      }
    >
      <p className="mb-4 font-semibold" aria-live="polite">
        {describe(frame.op, frame.event)}
      </p>
      <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div>
          <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }}>
            Hash map
          </div>
          <ul className="flex flex-col gap-1.5">
            {[...frame.state.order].sort().map((key) => (
              <li key={key} className="font-mono-label px-2 py-1" style={{ ...tone(key), border: "2px solid var(--border)" }}>
                {key} → node
              </li>
            ))}
            {frame.state.order.length === 0 && (
              <li className="font-mono-label" style={{ color: "var(--muted)" }}>
                (empty)
              </li>
            )}
          </ul>
        </div>
        <div className="min-w-0">
          <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }}>
            Linked list · head = most recent
          </div>
          <ol className="flex flex-wrap items-center gap-2">
            <li className="font-mono-label" style={{ color: "var(--muted)" }}>
              HEAD
            </li>
            {frame.state.order.map((key) => (
              <li key={key} className="flex items-center gap-2">
                <span aria-hidden="true">⇄</span>
                <span
                  className="px-3 py-2 font-mono text-sm font-bold"
                  style={{ ...tone(key), border: "2.5px solid var(--border)", boxShadow: "3px 3px 0 var(--border)" }}
                >
                  {key}={frame.state.values[key]}
                </span>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span aria-hidden="true">⇄</span>
              <span className="font-mono-label" style={{ color: "var(--muted)" }}>
                TAIL
              </span>
            </li>
            {evicted && (
              <li className="font-mono-label line-through" style={{ color: "var(--red)" }}>
                evicted {evicted}
              </li>
            )}
          </ol>
        </div>
      </div>
    </DiagramFrame>
  );
}
