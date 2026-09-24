import { hash32 } from "./hashRing";

export const BLOOM_BITS = 32;

function bloomPositions(key: string): [number, number] {
  return [hash32(key) % BLOOM_BITS, hash32(`${key}#2`) % BLOOM_BITS];
}

export function bloomAdd(mask: number, key: string): number {
  return bloomPositions(key).reduce((m, p) => (m | (1 << p)) >>> 0, mask);
}

export function bloomMightContain(mask: number, key: string): boolean {
  return bloomPositions(key).every((p) => ((mask >>> p) & 1) === 1);
}

export interface Segment {
  id: number;
  entries: [string, string][];
  bloom: number;
}

export interface LsmState {
  memtable: Record<string, string>;
  memtableLimit: number;
  segments: Segment[];
  nextId: number;
}

export type ReadStep = { where: "memtable"; found: boolean } | { where: "segment"; id: number; bloom: "no" | "maybe"; found: boolean };

export type LsmOp = { op: "put"; key: string; value: string } | { op: "get"; key: string } | { op: "compact" };

export interface LsmRead {
  value?: string;
  steps: ReadStep[];
}

export interface LsmFrame {
  state: LsmState;
  op: LsmOp | null;
  flushed: boolean;
  read: LsmRead | null;
}

export function createLsm(memtableLimit: number): LsmState {
  return { memtable: {}, memtableLimit, segments: [], nextId: 1 };
}

function makeSegment(id: number, pairs: [string, string][]): Segment {
  const entries = [...pairs].sort(([a], [b]) => a.localeCompare(b));
  return { id, entries, bloom: entries.reduce((mask, [key]) => bloomAdd(mask, key), 0) };
}

export function flush(state: LsmState): LsmState {
  if (Object.keys(state.memtable).length === 0) return state;
  const segment = makeSegment(state.nextId, Object.entries(state.memtable));
  return { ...state, memtable: {}, segments: [segment, ...state.segments], nextId: state.nextId + 1 };
}

export function lsmPut(state: LsmState, key: string, value: string): { state: LsmState; flushed: boolean } {
  const next = { ...state, memtable: { ...state.memtable, [key]: value } };
  if (Object.keys(next.memtable).length >= state.memtableLimit) return { state: flush(next), flushed: true };
  return { state: next, flushed: false };
}

export function compact(state: LsmState): LsmState {
  if (state.segments.length === 0) return state;
  const merged = new Map<string, string>();
  // Oldest first so newer segments overwrite older values.
  for (const segment of [...state.segments].reverse()) for (const [key, value] of segment.entries) merged.set(key, value);
  return { ...state, segments: [makeSegment(state.nextId, [...merged.entries()])], nextId: state.nextId + 1 };
}

export function lsmGet(state: LsmState, key: string): LsmRead {
  const steps: ReadStep[] = [];
  if (key in state.memtable) {
    steps.push({ where: "memtable", found: true });
    return { value: state.memtable[key], steps };
  }
  steps.push({ where: "memtable", found: false });
  for (const segment of state.segments) {
    if (!bloomMightContain(segment.bloom, key)) {
      steps.push({ where: "segment", id: segment.id, bloom: "no", found: false });
      continue;
    }
    const entry = segment.entries.find(([k]) => k === key);
    steps.push({ where: "segment", id: segment.id, bloom: "maybe", found: entry !== undefined });
    if (entry) return { value: entry[1], steps };
  }
  return { steps };
}

export function runLsm(memtableLimit: number, ops: LsmOp[]): LsmFrame[] {
  const frames: LsmFrame[] = [{ state: createLsm(memtableLimit), op: null, flushed: false, read: null }];
  for (const op of ops) {
    const previous = frames[frames.length - 1].state;
    if (op.op === "put") {
      const result = lsmPut(previous, op.key, op.value);
      frames.push({ state: result.state, op, flushed: result.flushed, read: null });
    } else if (op.op === "get") {
      frames.push({ state: previous, op, flushed: false, read: lsmGet(previous, op.key) });
    } else {
      frames.push({ state: compact(previous), op, flushed: false, read: null });
    }
  }
  return frames;
}
