import { describe, it, expect } from "vitest";
import { createLru, lruGet, lruPut, runLru, type LruOp } from "@/lib/diagrams/lruCache";

describe("LRU cache", () => {
  it("evicts the least recently used key when full", () => {
    let state = createLru(2);
    state = lruPut(state, "a", "1").state;
    state = lruPut(state, "b", "2").state;
    const result = lruPut(state, "c", "3");
    expect(result.event).toEqual({ kind: "insert", key: "c", evicted: "a" });
    expect(result.state.order).toEqual(["c", "b"]);
    expect(result.state.values).toEqual({ b: "2", c: "3" });
  });

  it("get moves a key to the head so it survives the next eviction", () => {
    let state = createLru(2);
    state = lruPut(state, "a", "1").state;
    state = lruPut(state, "b", "2").state;
    const hit = lruGet(state, "a");
    expect(hit.event).toEqual({ kind: "hit", key: "a" });
    const result = lruPut(hit.state, "c", "3");
    expect(result.event).toEqual({ kind: "insert", key: "c", evicted: "b" });
    expect(result.state.order).toEqual(["c", "a"]);
  });

  it("put on an existing key updates it without evicting", () => {
    let state = createLru(2);
    state = lruPut(state, "a", "1").state;
    state = lruPut(state, "b", "2").state;
    const result = lruPut(state, "a", "9");
    expect(result.event).toEqual({ kind: "update", key: "a" });
    expect(result.state.order).toEqual(["a", "b"]);
    expect(result.state.values.a).toBe("9");
  });

  it("a miss leaves the state unchanged", () => {
    const state = lruPut(createLru(2), "a", "1").state;
    const result = lruGet(state, "zzz");
    expect(result.event).toEqual({ kind: "miss", key: "zzz" });
    expect(result.state).toBe(state);
  });

  it("runLru returns the empty start plus one frame per op", () => {
    const ops: LruOp[] = [
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
    const frames = runLru(3, ops);
    expect(frames).toHaveLength(ops.length + 1);
    expect(frames[0].event).toBeNull();
    expect(frames[frames.length - 1].state.order).toEqual(["D", "E", "C"]);
  });
});
