export interface PlaybackInputs {
  inView: boolean;
  reducedMotion: boolean;
  paused: boolean;
}

export function shouldPlay({ inView, reducedMotion, paused }: PlaybackInputs): boolean {
  return inView && !reducedMotion && !paused;
}

export function nextStep(step: number, total: number, loop: boolean): number {
  if (step + 1 < total) return step + 1;
  return loop ? 0 : step;
}

// Autoplay ticks would otherwise make screen readers announce every step, forever.
export function liveRegion(playing: boolean): "off" | "polite" {
  return playing ? "off" : "polite";
}
