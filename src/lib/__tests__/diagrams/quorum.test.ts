import { describe, it, expect } from "vitest";
import { clampQuorum, isStrongQuorum, worstCaseSets } from "@/lib/diagrams/quorum";

describe("quorum", () => {
  it("has a worst-case overlap exactly when R + W > N", () => {
    for (let n = 1; n <= 7; n++)
      for (let w = 1; w <= n; w++)
        for (let r = 1; r <= n; r++) {
          const sets = worstCaseSets(n, w, r);
          expect(sets.overlap.length).toBe(Math.max(0, w + r - n));
          expect(isStrongQuorum(n, w, r)).toBe(sets.overlap.length > 0);
        }
  });

  it("uses the first W replicas for writes and the last R for reads", () => {
    expect(worstCaseSets(5, 2, 2)).toEqual({ write: [0, 1], read: [3, 4], overlap: [] });
  });

  it("clamps W and R into 1..N", () => {
    expect(clampQuorum(3, 5, 0)).toEqual({ w: 3, r: 1 });
  });
});
