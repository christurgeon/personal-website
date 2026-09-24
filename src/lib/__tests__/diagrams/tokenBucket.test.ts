import { describe, it, expect } from "vitest";
import { createBucket, refill, tryTake, type BucketState } from "@/lib/diagrams/tokenBucket";

function burst(state: BucketState, nowMs: number, count: number) {
  let current = state;
  let allowed = 0;
  for (let i = 0; i < count; i++) {
    const result = tryTake(current, nowMs);
    current = result.state;
    if (result.allowed) allowed++;
  }
  return { state: current, allowed };
}

describe("token bucket", () => {
  it("starts full", () => {
    expect(createBucket(5, 1, 0).tokens).toBe(5);
  });

  it("allows a burst up to capacity and rejects the rest", () => {
    expect(burst(createBucket(5, 1, 0), 0, 7).allowed).toBe(5);
  });

  it("refills at the configured rate", () => {
    const drained = burst(createBucket(5, 2, 0), 0, 5).state;
    expect(burst(drained, 1000, 5).allowed).toBe(2);
  });

  it("never exceeds capacity after a long idle period", () => {
    const drained = burst(createBucket(5, 1, 0), 0, 5).state;
    expect(refill(drained, 600_000).tokens).toBe(5);
  });

  it("ignores a clock that moves backwards", () => {
    const drained = burst(createBucket(5, 1, 1000), 1000, 5).state;
    const later = refill(drained, 0);
    expect(later.tokens).toBe(0);
    expect(later.updatedAtMs).toBe(1000);
  });
});
