export interface QuorumSets {
  write: number[];
  read: number[];
  overlap: number[];
}

// Worst case for a reader: the write reached the first W replicas and the read asks the last R.
export function worstCaseSets(n: number, w: number, r: number): QuorumSets {
  const write = Array.from({ length: w }, (_, i) => i);
  const read = Array.from({ length: r }, (_, i) => n - r + i);
  return { write, read, overlap: read.filter((i) => i < w) };
}

export function isStrongQuorum(n: number, w: number, r: number): boolean {
  return r + w > n;
}

export function clampQuorum(n: number, w: number, r: number): { w: number; r: number } {
  const clamp = (v: number) => Math.min(n, Math.max(1, v));
  return { w: clamp(w), r: clamp(r) };
}
