// JSON.stringify leaves "<" alone, so a "</script>" inside any string would end the tag early.
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
