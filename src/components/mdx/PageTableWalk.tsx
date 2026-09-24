"use client";

import { useState } from "react";
import DiagramFrame, { DiagramButton, StepControls } from "./diagram/DiagramFrame";
import { useDiagramPlayback, useStepper } from "./diagram/useDiagramPlayback";
import { walk, type PageTables } from "@/lib/diagrams/pageTable";

const TABLES: PageTables = { 0x1: { 0xa: 0x3c, 0xc: 0x07 }, 0x2: { 0x1: 0x12 } };
const PRESETS = [0x1a2b, 0x1c80, 0x2f10];
const STEP_COUNT = 4;

const hex = (value: number, digits: number) => value.toString(16).toUpperCase().padStart(digits, "0");
const bits = (value: number, width: number) => value.toString(2).padStart(width, "0");

const L1_TONE = { background: "var(--red)", color: "var(--on-red)" };
const L2_TONE = { background: "var(--blue)", color: "var(--on-blue)" };
const OFFSET_TONE = { background: "var(--yellow)", color: "var(--on-yellow)" };
const FRAME_TONE = { background: "var(--green)", color: "var(--on-green)" };

export default function PageTableWalk() {
  const [address, setAddress] = useState(PRESETS[0]);
  const { ref, playing, reducedMotion, paused, setPaused } = useDiagramPlayback<HTMLElement>();
  const { step, atEnd, next, reset } = useStepper(STEP_COUNT, playing, 1500);

  const result = walk(address, TABLES);
  const { l1, l2, offset } = result.parts;
  const secondLevel = TABLES[l1];

  const message = (() => {
    if (step === 0) return `Split 0x${hex(address, 4)} into L1 index ${hex(l1, 1)}, L2 index ${hex(l2, 1)}, and offset 0x${hex(offset, 2)}.`;
    if (step === 1)
      return secondLevel ? `L1 entry ${hex(l1, 1)} points to a second-level table.` : `L1 entry ${hex(l1, 1)} is not present. Page fault.`;
    if (step === 2) {
      if (!secondLevel) return "The walk already stopped at L1.";
      return result.ok ? `L2 entry ${hex(l2, 1)} holds frame 0x${hex(result.frame, 2)}.` : `L2 entry ${hex(l2, 1)} is not present. Page fault.`;
    }
    return result.ok
      ? `Physical address = frame 0x${hex(result.frame, 2)} followed by offset 0x${hex(offset, 2)} = 0x${hex(result.physical, 4)}.`
      : "No physical address. The CPU raises a page fault; the kernel maps a page or sends SIGSEGV.";
  })();

  const choose = (value: number) => {
    setAddress(value);
    reset();
  };

  const segment = (label: string, value: string, tone: { background: string; color: string }, active: boolean) => (
    <div className="flex min-w-0 flex-col" style={{ flexGrow: value.length, flexBasis: 0 }}>
      <span
        className="px-2 py-1 text-center font-mono text-sm tracking-widest break-all"
        style={{ ...tone, border: `${active ? 4 : 2}px solid var(--border)` }}
      >
        {value}
      </span>
      <span className="font-mono-label mt-1 text-center" style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
        {label}
      </span>
    </div>
  );

  const row = (index: number, value: string, active: boolean) => (
    <li
      key={index}
      className="flex justify-between gap-3 px-2 py-1 font-mono text-sm"
      style={{
        border: "2px solid var(--border)",
        background: active ? "var(--yellow)" : "var(--paper)",
        color: active ? "var(--on-yellow)" : "var(--ink)",
      }}
    >
      <span>[{hex(index, 1)}]</span>
      <span>{value}</span>
    </li>
  );

  return (
    <DiagramFrame
      ref={ref}
      title="Virtual to physical address"
      caption="Page tables never store virtual addresses; slices of the address are the indexes into each table level. The MMU walks them, then joins the final frame number to the untouched offset. A TLB caches finished walks so most accesses skip this. Real x86-64 uses four or five levels and 4 KB pages; this model uses two levels and 256-byte pages so the numbers fit."
      controls={
        <>
          {PRESETS.map((value) => (
            <DiagramButton key={value} onClick={() => choose(value)} pressed={value === address}>
              0x{hex(value, 4)}
            </DiagramButton>
          ))}
          <StepControls
            step={step}
            total={STEP_COUNT}
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
        </>
      }
    >
      <p className="mb-4 font-semibold" aria-live="polite">
        {message}
      </p>
      <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }}>
        Virtual address 0x{hex(address, 4)}
      </div>
      <div className="flex gap-1">
        {segment("L1 index", bits(l1, 4), L1_TONE, step === 1)}
        {segment("L2 index", bits(l2, 4), L2_TONE, step === 2)}
        {segment("offset", bits(offset, 8), OFFSET_TONE, step === 3)}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }}>
            L1 table
          </div>
          <ul className="flex flex-col gap-1">
            {Object.keys(TABLES).map((key) => row(Number(key), "→ L2 table", step >= 1 && Number(key) === l1))}
            <li className="font-mono-label px-2" style={{ color: "var(--muted)" }}>
              other entries: not present
            </li>
          </ul>
        </div>
        <div>
          <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }}>
            L2 table {secondLevel ? `for L1[${hex(l1, 1)}]` : ""}
          </div>
          {secondLevel ? (
            <ul className="flex flex-col gap-1">
              {Object.entries(secondLevel).map(([key, frame]) => row(Number(key), `frame 0x${hex(frame, 2)}`, step >= 2 && Number(key) === l2))}
              <li className="font-mono-label px-2" style={{ color: "var(--muted)" }}>
                other entries: not present
              </li>
            </ul>
          ) : (
            <p className="font-mono-label" style={{ color: "var(--muted)" }}>
              (none: L1 entry missing)
            </p>
          )}
        </div>
      </div>
      {step === 3 && (
        <div className="mt-5">
          <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }}>
            Physical address
          </div>
          {result.ok ? (
            <div className="flex gap-1">
              {segment("frame", bits(result.frame, 8), FRAME_TONE, false)}
              {segment("offset", bits(offset, 8), OFFSET_TONE, false)}
            </div>
          ) : (
            <p
              className="px-3 py-2 font-mono font-bold"
              style={{ background: "var(--red)", color: "var(--on-red)", border: "2.5px solid var(--border)" }}
            >
              PAGE FAULT
            </p>
          )}
        </div>
      )}
    </DiagramFrame>
  );
}
