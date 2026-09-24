// A toy two-level scheme with 256-byte pages so every number fits on screen; x86-64 uses four or five levels and 4 KB pages.
export const OFFSET_BITS = 8;
export const INDEX_BITS = 4;

export interface AddressParts {
  l1: number;
  l2: number;
  offset: number;
}

export type PageTables = Record<number, Record<number, number>>;

export type WalkResult =
  | { ok: true; parts: AddressParts; frame: number; physical: number }
  | { ok: false; parts: AddressParts; faultAt: "l1" | "l2" };

const INDEX_MASK = (1 << INDEX_BITS) - 1;
const OFFSET_MASK = (1 << OFFSET_BITS) - 1;

export function splitAddress(virtual: number): AddressParts {
  return {
    l1: (virtual >> (OFFSET_BITS + INDEX_BITS)) & INDEX_MASK,
    l2: (virtual >> OFFSET_BITS) & INDEX_MASK,
    offset: virtual & OFFSET_MASK,
  };
}

export function walk(virtual: number, tables: PageTables): WalkResult {
  const parts = splitAddress(virtual);
  const second = tables[parts.l1];
  if (!second) return { ok: false, parts, faultAt: "l1" };
  const frame = second[parts.l2];
  if (frame === undefined) return { ok: false, parts, faultAt: "l2" };
  return { ok: true, parts, frame, physical: (frame << OFFSET_BITS) | parts.offset };
}
