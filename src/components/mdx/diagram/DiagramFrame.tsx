import type { ReactNode, Ref } from "react";
import { liveRegion } from "@/lib/diagrams/playback";

interface DiagramFrameProps {
  title: string;
  caption: ReactNode;
  controls?: ReactNode;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

export default function DiagramFrame({ title, caption, controls, children, ref }: DiagramFrameProps) {
  return (
    <figure
      ref={ref}
      className="not-prose my-10"
      style={{ background: "var(--card)", border: "3px solid var(--border)", boxShadow: "var(--shadow-3)" }}
    >
      <div
        className="font-mono-label px-4 py-2 sm:px-5"
        style={{ background: "var(--yellow)", color: "var(--on-yellow)", borderBottom: "3px solid var(--border)" }}
      >
        [ {title} ]
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      {controls && <div className="flex flex-col gap-2 px-4 pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">{controls}</div>}
      <figcaption className="px-4 py-3 text-[0.92rem] leading-snug sm:px-5" style={{ color: "var(--muted)", borderTop: "3px solid var(--border)" }}>
        {caption}
      </figcaption>
    </figure>
  );
}

interface DiagramButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  pressed?: boolean;
}

export function DiagramButton({ onClick, children, disabled, pressed }: DiagramButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className="font-mono-label brutal-lift-sm px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        background: pressed ? "var(--blue)" : "var(--card)",
        color: pressed ? "var(--on-blue)" : "var(--ink)",
        border: "2.5px solid var(--border)",
        boxShadow: "3px 3px 0 var(--border)",
      }}
    >
      {children}
    </button>
  );
}

interface StepControlsProps {
  step: number;
  total: number;
  atEnd: boolean;
  onNext: () => void;
  onReset: () => void;
  paused: boolean;
  onTogglePause: () => void;
  reducedMotion: boolean;
  playing: boolean;
}

export function StepControls({ step, total, atEnd, onNext, onReset, paused, onTogglePause, reducedMotion, playing }: StepControlsProps) {
  return (
    <>
      {!reducedMotion && <DiagramButton onClick={onTogglePause}>{paused ? "Play" : "Pause"}</DiagramButton>}
      <DiagramButton onClick={onNext} disabled={atEnd}>
        Step
      </DiagramButton>
      <DiagramButton onClick={onReset}>Reset</DiagramButton>
      <span className="font-mono-label sm:ml-auto" style={{ color: "var(--muted)" }} aria-live={liveRegion(playing)}>
        Step {step + 1} / {total}
      </span>
    </>
  );
}
