import { describe, it, expect } from "vitest";
import { nextStep, shouldPlay } from "@/lib/diagrams/playback";

describe("shouldPlay", () => {
  it("plays only when in view, motion is allowed, and not paused", () => {
    for (const inView of [true, false])
      for (const reducedMotion of [true, false])
        for (const paused of [true, false]) {
          expect(shouldPlay({ inView, reducedMotion, paused })).toBe(inView && !reducedMotion && !paused);
        }
  });
});

describe("nextStep", () => {
  it("advances within range", () => {
    expect(nextStep(0, 3, false)).toBe(1);
  });

  it("stays on the last step when not looping", () => {
    expect(nextStep(2, 3, false)).toBe(2);
  });

  it("wraps to the first step when looping", () => {
    expect(nextStep(2, 3, true)).toBe(0);
  });
});
