import { describe, expect, it } from "vitest";
import { normalizeEmail } from "../newsletter";

describe("normalizeEmail", () => {
  it("returns the email unchanged when valid", () => {
    expect(normalizeEmail("reader@example.com")).toBe("reader@example.com");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeEmail("  reader@example.com \n")).toBe("reader@example.com");
  });

  it("returns null for an invalid address", () => {
    expect(normalizeEmail("not-an-email")).toBeNull();
  });

  it("returns null for a blank string", () => {
    expect(normalizeEmail("   ")).toBeNull();
  });
});
