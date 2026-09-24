import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { nextStep, shouldPlay } from "@/lib/diagrams/playback";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function useDiagramPlayback<T extends Element = HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, playing: shouldPlay({ inView, reducedMotion, paused }), reducedMotion, paused, setPaused };
}

export function useTicker(active: boolean, intervalMs: number, onTick: () => void) {
  const callback = useRef(onTick);
  useEffect(() => {
    callback.current = onTick;
  });

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = performance.now();
    let elapsed = 0;
    const loop = (now: number) => {
      // Cap catch-up so a backgrounded tab does not fire a burst of ticks on return.
      elapsed = Math.min(elapsed + now - last, intervalMs * 3);
      last = now;
      while (elapsed >= intervalMs) {
        elapsed -= intervalMs;
        callback.current();
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [active, intervalMs]);
}

export function useStepper(total: number, playing: boolean, intervalMs: number) {
  const [step, setStep] = useState(0);
  useTicker(playing, intervalMs, () => setStep((s) => nextStep(s, total, true)));
  return {
    step,
    atEnd: step === total - 1,
    next: () => setStep((s) => nextStep(s, total, false)),
    reset: () => setStep(0),
  };
}
