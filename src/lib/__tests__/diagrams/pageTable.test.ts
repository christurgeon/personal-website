import { describe, it, expect } from "vitest";
import { splitAddress, walk, type PageTables } from "@/lib/diagrams/pageTable";

const TABLES: PageTables = { 0x1: { 0xa: 0x3c, 0xc: 0x07 }, 0x2: { 0x1: 0x12 } };

describe("page table walk", () => {
  it("splits a 16-bit address into two 4-bit indexes and an 8-bit offset", () => {
    expect(splitAddress(0x1a2b)).toEqual({ l1: 0x1, l2: 0xa, offset: 0x2b });
  });

  it("composes the physical address from the frame and the untouched offset", () => {
    expect(walk(0x1a2b, TABLES)).toEqual({ ok: true, parts: { l1: 1, l2: 0xa, offset: 0x2b }, frame: 0x3c, physical: 0x3c2b });
  });

  it("faults at the first level when the L1 entry is missing", () => {
    expect(walk(0x5a2b, TABLES)).toMatchObject({ ok: false, faultAt: "l1" });
  });

  it("faults at the second level when the L2 entry is missing", () => {
    expect(walk(0x2f10, TABLES)).toMatchObject({ ok: false, faultAt: "l2" });
  });
});
