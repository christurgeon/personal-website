import { describe, it, expect } from "vitest";
import { bloomAdd, bloomMightContain, compact, createLsm, lsmGet, lsmPut, runLsm, type LsmOp, type LsmState } from "@/lib/diagrams/lsmTree";

function putAll(state: LsmState, pairs: [string, string][]): LsmState {
  return pairs.reduce((s, [k, v]) => lsmPut(s, k, v).state, state);
}

describe("LSM-tree", () => {
  it("flushes the memtable into a sorted segment when it reaches the limit", () => {
    let state = createLsm(3);
    state = lsmPut(state, "c", "1").state;
    state = lsmPut(state, "a", "1").state;
    const result = lsmPut(state, "b", "1");
    expect(result.flushed).toBe(true);
    expect(result.state.memtable).toEqual({});
    expect(result.state.segments[0].entries).toEqual([
      ["a", "1"],
      ["b", "1"],
      ["c", "1"],
    ]);
  });

  it("reads the memtable before any segment", () => {
    const state = putAll(createLsm(2), [
      ["a", "1"],
      ["b", "1"],
      ["a", "2"],
    ]);
    const read = lsmGet(state, "a");
    expect(read.value).toBe("2");
    expect(read.steps).toEqual([{ where: "memtable", found: true }]);
  });

  it("returns the newest value across segments", () => {
    const state = putAll(createLsm(2), [
      ["a", "1"],
      ["b", "1"],
      ["a", "2"],
      ["c", "1"],
    ]);
    const read = lsmGet(state, "a");
    expect(read.value).toBe("2");
    expect(read.steps[1]).toMatchObject({ where: "segment", id: state.segments[0].id, found: true });
  });

  it("has no false negatives in its bloom filter", () => {
    const keys = Array.from({ length: 100 }, (_, i) => `key-${i}`);
    const mask = keys.reduce(bloomAdd, 0);
    expect(keys.every((k) => bloomMightContain(mask, k))).toBe(true);
  });

  it("never finds a missing key and never searches a segment whose bloom says no", () => {
    const state = putAll(createLsm(2), [
      ["a", "1"],
      ["b", "1"],
      ["c", "1"],
      ["d", "1"],
    ]);
    const read = lsmGet(state, "missing-key");
    expect(read.value).toBeUndefined();
    expect(read.steps.every((s) => !s.found)).toBe(true);
    for (const s of read.steps) if (s.where === "segment" && s.bloom === "no") expect(s.found).toBe(false);
  });

  it("compaction merges segments into one, keeping the newest value with sorted keys", () => {
    const state = putAll(createLsm(2), [
      ["b", "1"],
      ["a", "1"],
      ["a", "2"],
      ["c", "1"],
    ]);
    const compacted = compact(state);
    expect(compacted.segments).toHaveLength(1);
    expect(compacted.segments[0].entries).toEqual([
      ["a", "2"],
      ["b", "1"],
      ["c", "1"],
    ]);
    expect(lsmGet(compacted, "a").value).toBe("2");
  });

  it("runLsm returns the empty start plus one frame per op", () => {
    const ops: LsmOp[] = [{ op: "put", key: "a", value: "1" }, { op: "get", key: "a" }, { op: "compact" }];
    const frames = runLsm(3, ops);
    expect(frames).toHaveLength(4);
    expect(frames[0].op).toBeNull();
    expect(frames[2].read?.value).toBe("1");
  });
});
