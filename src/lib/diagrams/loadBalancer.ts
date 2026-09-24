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

export function lbArrive(state: LbState, strategy: Strategy, arrivals: number): LbState {
  let current = state;
  for (let i = 0; i < arrivals; i++) current = assign(current, strategy).state;
  return current;
}

export function lbServe(state: LbState, speeds: number[]): LbState {
  const queues = state.queues.map((q, i) => Math.max(0, q - speeds[i]));
  return { ...state, queues, tick: state.tick + 1 };
}

export function lbTick(state: LbState, strategy: Strategy, speeds: number[], arrivals: number): LbState {
  return lbServe(lbArrive(state, strategy, arrivals), speeds);
}
