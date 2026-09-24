export type Strategy = "round-robin" | "least-connections";

export interface LbState {
  queues: number[];
  cursor: number;
  tick: number;
}

export function createLb(servers: number): LbState {
  return { queues: Array(servers).fill(0), cursor: 0, tick: 0 };
}

export function assign(state: LbState, strategy: Strategy): { state: LbState; server: number } {
  let server: number;
  let cursor = state.cursor;
  if (strategy === "round-robin") {
    server = cursor;
    cursor = (cursor + 1) % state.queues.length;
  } else {
    server = state.queues.indexOf(Math.min(...state.queues));
  }
  const queues = state.queues.map((q, i) => (i === server ? q + 1 : q));
  return { state: { ...state, queues, cursor }, server };
}

export function lbTick(state: LbState, strategy: Strategy, speeds: number[], arrivals: number): LbState {
  let current = state;
  for (let i = 0; i < arrivals; i++) current = assign(current, strategy).state;
  const queues = current.queues.map((q, i) => Math.max(0, q - speeds[i]));
  return { ...current, queues, tick: current.tick + 1 };
}
