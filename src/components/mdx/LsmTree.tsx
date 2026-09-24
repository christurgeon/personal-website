"use client";

import { useMemo } from "react";
import DiagramFrame, { StepControls } from "./diagram/DiagramFrame";
import { useDiagramPlayback, useStepper } from "./diagram/useDiagramPlayback";
import { runLsm, type LsmFrame, type LsmOp, type ReadStep } from "@/lib/diagrams/lsmTree";

const LIMIT = 3;
const SCRIPT: LsmOp[] = [
  { op: "put", key: "a", value: "1" },
  { op: "put", key: "b", value: "1" },
  { op: "put", key: "c", value: "1" },
  { op: "put", key: "a", value: "2" },
  { op: "put", key: "d", value: "1" },
  { op: "put", key: "e", value: "1" },
  { op: "get", key: "a" },
  { op: "get", key: "c" },
  { op: "get", key: "z" },
  { op: "compact" },
  { op: "get", key: "a" },
];

function describeStep(step: ReadStep): string {
  if (step.where === "memtable") return `memtable ${step.found ? "hit" : "miss"}`;
  if (step.bloom === "no") return `S${step.id} skipped (bloom filter says no)`;
  return `S${step.id} ${step.found ? "hit" : "searched, miss"}`;
}

function describe(frame: LsmFrame): string {
  const { op } = frame;
  if (!op) return `Empty store. The memtable flushes to disk once it holds ${LIMIT} keys.`;
  if (op.op === "put") {
    return frame.flushed
      ? `put(${op.key}, ${op.value}) fills the memtable, so it flushes to a new sorted SSTable on disk.`
      : `put(${op.key}, ${op.value}) goes into the in-memory memtable.`;
  }
  if (op.op === "compact") return "Compaction merges every SSTable into one, keeping only the newest value for each key.";
  const read = frame.read!;
  return `get(${op.key}): ${read.steps.map(describeStep).join(" → ")}. ${read.value === undefined ? "Not found." : `Returns ${read.value}.`}`;
}

function segmentStatus(frame: LsmFrame, id: number) {
  const step = frame.read?.steps.find((s) => s.where === "segment" && s.id === id);
  if (!step || step.where !== "segment") return null;
  if (step.bloom === "no") return { label: "bloom: no", background: "var(--paper)", color: "var(--muted)" };
  if (step.found) return { label: "hit", background: "var(--green)", color: "var(--on-green)" };
  return { label: "miss", background: "var(--red)", color: "var(--on-red)" };
}

export default function LsmTree() {
  const frames = useMemo(() => runLsm(LIMIT, SCRIPT), []);
  const { ref, playing, reducedMotion, paused, setPaused } = useDiagramPlayback<HTMLElement>();
  const { step, atEnd, next, reset } = useStepper(frames.length, playing, 1800);
  const frame = frames[step];
  const memtableStep = frame.read?.steps[0];
  const memtable = Object.entries(frame.state.memtable).sort(([a], [b]) => a.localeCompare(b));

  return (
    <DiagramFrame
      ref={ref}
      title="LSM-tree writes and reads"
      caption="Writes land in a sorted in-memory memtable and flush to immutable SSTables on disk as one sequential write. Reads check the newest data first; a bloom filter lets them skip segments that cannot hold the key."
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
        {describe(frame)}
      </p>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div
          className="p-3"
          style={{
            border: "2.5px solid var(--border)",
            background: memtableStep ? (memtableStep.found ? "var(--green)" : "var(--paper)") : "var(--paper)",
            color: memtableStep?.found ? "var(--on-green)" : "var(--ink)",
          }}
        >
          <div className="font-mono-label mb-2">Memtable (RAM)</div>
          <div className="font-mono text-sm">{memtable.length ? memtable.map(([k, v]) => `${k}=${v}`).join(" · ") : "(empty)"}</div>
        </div>
        <div>
          <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }}>
            SSTables on disk · newest first
          </div>
          <ol className="flex flex-col gap-2">
            {frame.state.segments.map((segment) => {
              const status = segmentStatus(frame, segment.id);
              return (
                <li
                  key={segment.id}
                  className="flex flex-wrap items-center justify-between gap-2 p-2"
                  style={{ border: "2.5px solid var(--border)", background: "var(--card)" }}
                >
                  <span className="font-mono text-sm">
                    <strong>S{segment.id}</strong> {segment.entries.map(([k, v]) => `${k}=${v}`).join(" · ")}
                  </span>
                  {status && (
                    <span
                      className="font-mono-label px-2 py-0.5"
                      style={{ background: status.background, color: status.color, border: "2px solid var(--border)" }}
                    >
                      {status.label}
                    </span>
                  )}
                </li>
              );
            })}
            {frame.state.segments.length === 0 && (
              <li className="font-mono-label" style={{ color: "var(--muted)" }}>
                (none yet)
              </li>
            )}
          </ol>
        </div>
      </div>
    </DiagramFrame>
  );
}
