export interface BucketState {
  capacity: number;
  refillPerSecond: number;
  tokens: number;
  updatedAtMs: number;
}

export function createBucket(capacity: number, refillPerSecond: number, nowMs: number): BucketState {
  return { capacity, refillPerSecond, tokens: capacity, updatedAtMs: nowMs };
}

// Rounded so repeated small refills (ten 0.1s) reach a whole token instead of 0.9999999999999999.
const roundTokens = (tokens: number) => Math.round(tokens * 1e9) / 1e9;

export function refill(state: BucketState, nowMs: number): BucketState {
  const elapsed = Math.max(0, nowMs - state.updatedAtMs);
  return {
    ...state,
    tokens: Math.min(state.capacity, roundTokens(state.tokens + (elapsed * state.refillPerSecond) / 1000)),
    updatedAtMs: Math.max(nowMs, state.updatedAtMs),
  };
}

export function tryTake(state: BucketState, nowMs: number): { state: BucketState; allowed: boolean } {
  const current = refill(state, nowMs);
  if (current.tokens >= 1) return { state: { ...current, tokens: current.tokens - 1 }, allowed: true };
  return { state: current, allowed: false };
}
