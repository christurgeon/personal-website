export const RING_SPACE = 2 ** 32;

// FNV-1a with a murmur3 finalizer: FNV alone clusters short, similar labels like "A#0" and "A#1".
export function hash32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

export interface RingNode {
  id: string;
  server: string;
  position: number;
}

export function buildRing(servers: string[], virtualNodes: number): RingNode[] {
  const ring: RingNode[] = [];
  for (const server of servers) {
    for (let i = 0; i < virtualNodes; i++) {
      const id = `${server}#${i}`;
      ring.push({ id, server, position: hash32(id) });
    }
  }
  return ring.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
}

export function ownerOf(position: number, ring: RingNode[]): string {
  if (ring.length === 0) throw new Error("ownerOf: ring has no nodes");
  for (const node of ring) {
    if (node.position >= position) return node.server;
  }
  return ring[0].server;
}

export function assignKeys(keys: string[], ring: RingNode[]): Record<string, string> {
  return Object.fromEntries(keys.map((key) => [key, ownerOf(hash32(key), ring)]));
}

export function modAssign(keys: string[], servers: string[]): Record<string, string> {
  return Object.fromEntries(keys.map((key) => [key, servers[hash32(key) % servers.length]]));
}

export function movedKeys(before: Record<string, string>, after: Record<string, string>): string[] {
  return Object.keys(before).filter((key) => before[key] !== after[key]);
}

export function ringAngle(position: number): number {
  return (position / RING_SPACE) * 360;
}

// Rounded so Node (server render) and the browser produce identical SVG attributes; their trig results can differ in the last digit.
export function ringPoint(angleDeg: number, radius: number, center: number): { x: number; y: number } {
  const radians = ((angleDeg - 90) * Math.PI) / 180;
  const round = (v: number) => Math.round(v * 100) / 100;
  return { x: round(center + radius * Math.cos(radians)), y: round(center + radius * Math.sin(radians)) };
}
