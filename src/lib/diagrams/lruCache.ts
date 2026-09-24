export interface LruState {
  capacity: number;
  order: string[];
  values: Record<string, string>;
}

export type LruEvent =
  | { kind: "hit"; key: string }
  | { kind: "miss"; key: string }
  | { kind: "insert"; key: string; evicted?: string }
  | { kind: "update"; key: string };

export type LruOp = { op: "get"; key: string } | { op: "put"; key: string; value: string };

export interface LruFrame {
  state: LruState;
  op: LruOp | null;
  event: LruEvent | null;
}

export function createLru(capacity: number): LruState {
  return { capacity, order: [], values: {} };
}

function toFront(order: string[], key: string): string[] {
  return [key, ...order.filter((k) => k !== key)];
}

export function lruGet(state: LruState, key: string): { state: LruState; event: LruEvent } {
  if (!(key in state.values)) return { state, event: { kind: "miss", key } };
  return { state: { ...state, order: toFront(state.order, key) }, event: { kind: "hit", key } };
}

export function lruPut(state: LruState, key: string, value: string): { state: LruState; event: LruEvent } {
  if (key in state.values) {
    return { state: { ...state, order: toFront(state.order, key), values: { ...state.values, [key]: value } }, event: { kind: "update", key } };
  }
  const values = { ...state.values, [key]: value };
  let order = [key, ...state.order];
  let evicted: string | undefined;
  if (order.length > state.capacity) {
    evicted = order[order.length - 1];
    order = order.slice(0, -1);
    delete values[evicted];
  }
  return { state: { ...state, order, values }, event: evicted ? { kind: "insert", key, evicted } : { kind: "insert", key } };
}

export function runLru(capacity: number, ops: LruOp[]): LruFrame[] {
  const frames: LruFrame[] = [{ state: createLru(capacity), op: null, event: null }];
  for (const op of ops) {
    const previous = frames[frames.length - 1].state;
    const result = op.op === "get" ? lruGet(previous, op.key) : lruPut(previous, op.key, op.value);
    frames.push({ state: result.state, op, event: result.event });
  }
  return frames;
}
