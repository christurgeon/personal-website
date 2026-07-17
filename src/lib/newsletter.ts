import { z } from "zod";

const emailSchema = z.email();

/** Returns the trimmed email if it's valid, otherwise null. */
export function normalizeEmail(input: string): string | null {
  const trimmed = input.trim();
  return emailSchema.safeParse(trimmed).success ? trimmed : null;
}
