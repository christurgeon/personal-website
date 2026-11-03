// Same pattern zod's `z.email()` uses (zod/v4/core/regexes `email`). Inlined so
// the client-side SubscribeForm, which renders on every page via the footer,
// doesn't pull zod (~30KB gzipped) into the shared browser bundle.
const EMAIL_PATTERN = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

/** Returns the trimmed email if it's valid, otherwise null. */
export function normalizeEmail(input: string): string | null {
  const trimmed = input.trim();
  return EMAIL_PATTERN.test(trimmed) ? trimmed : null;
}
