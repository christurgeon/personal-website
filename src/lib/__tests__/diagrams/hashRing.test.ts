import { describe, it, expect } from "vitest";
import { RING_SPACE, assignKeys, buildRing, hash32, modAssign, movedKeys, ownerOf, ringAngle } from "@/lib/diagrams/hashRing";

const KEYS = Array.from({ length: 200 }, (_, i) => `key-${i}`);
const TEN = Array.from({ length: 10 }, (_, i) => `s${i}`);
const ELEVEN = [...TEN, "s10"];

describe("hash32", () => {
  it("is deterministic and within the ring space", () => {
    expect(hash32("abc")).toBe(hash32("abc"));
    for (const key of KEYS) {
      const h = hash32(key);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(RING_SPACE);
    }
  });
});

describe("buildRing", () => {
  it("places servers × virtual nodes sorted by position", () => {
    const ring = buildRing(["a", "b", "c"], 4);
    expect(ring).toHaveLength(12);
    for (let i = 1; i < ring.length; i++) expect(ring[i].position).toBeGreaterThanOrEqual(ring[i - 1].position);
  });
});

describe("ownerOf", () => {
  it("wraps past the last node to the first", () => {
    const ring = buildRing(["a", "b"], 1);
    expect(ownerOf(RING_SPACE - 1 + 0.5, ring)).toBe(ring[0].server);
  });

  it("throws on an empty ring", () => {
    expect(() => ownerOf(1, [])).toThrow();
  });
});

describe("resizing", () => {
  it("adding a server moves keys only onto the new server", () => {
    const before = assignKeys(KEYS, buildRing(TEN, 50));
    const after = assignKeys(KEYS, buildRing(ELEVEN, 50));
    const moved = movedKeys(before, after);
    expect(moved.length).toBeGreaterThan(0);
    expect(moved.every((k) => after[k] === "s10")).toBe(true);
  });

  it("removing a server moves only the keys it owned", () => {
    const before = assignKeys(KEYS, buildRing(ELEVEN, 50));
    const after = assignKeys(KEYS, buildRing(TEN, 50));
    expect(movedKeys(before, after).every((k) => before[k] === "s10")).toBe(true);
  });

  it("moves far fewer keys than modulo hashing when going from 10 to 11 servers", () => {
    const ringMoved = movedKeys(assignKeys(KEYS, buildRing(TEN, 50)), assignKeys(KEYS, buildRing(ELEVEN, 50))).length;
    const modMoved = movedKeys(modAssign(KEYS, TEN), modAssign(KEYS, ELEVEN)).length;
    expect(ringMoved).toBeLessThan(40);
    expect(modMoved).toBeGreaterThan(140);
  });
});

describe("demo constants used by ConsistentHashRing", () => {
  it("virtual nodes narrow the load spread for 60 keys at every server count", () => {
    const keys = Array.from({ length: 60 }, (_, i) => `key-${i}`);
    const spread = (servers: string[], virtualNodes: number) => {
      const owners = assignKeys(keys, buildRing(servers, virtualNodes));
      const loads = servers.map((s) => keys.filter((k) => owners[k] === s).length);
      return Math.max(...loads) - Math.min(...loads);
    };
    for (let n = 2; n <= 5; n++) {
      const servers = ["A", "B", "C", "D", "E"].slice(0, n);
      expect(spread(servers, 16)).toBeLessThan(spread(servers, 1));
    }
  });
});

describe("ringAngle", () => {
  it("maps the ring space onto 0–360 degrees", () => {
    expect(ringAngle(0)).toBe(0);
    expect(ringAngle(RING_SPACE / 2)).toBe(180);
  });
});
