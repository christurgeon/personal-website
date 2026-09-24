import GithubSlugger from "github-slugger";

export interface TocEntry {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface TocPart {
  entry: TocEntry;
  children: TocEntry[];
}

const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/;
const FENCE_CLOSE = /^ {0,3}(`{3,}|~{3,})\s*$/;
const ATX_HEADING = /^ {0,3}(#{1,6})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/;

// Link text may itself contain code spans, so links and images are unwrapped before code spans are split out.
const IMAGE = /!\[(?:[^\]`]|`[^`]*`)*\]\([^)]*\)/g;
const LINK = /\[((?:[^\]`]|`[^`]*`)*)\]\([^)]*\)/g;

function stripMarks(text: string): string {
  return text
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/(^|[^\w])_(.+?)_(?=[^\w]|$)/g, "$1$2")
    .replace(/\\([\\`*_{}[\]()#+\-.!>])/g, "$1");
}

// Mirrors what hast-util-to-string yields for a heading: text content with code spans kept verbatim.
function headingText(heading: string): string {
  const raw = heading.replace(IMAGE, "").replace(LINK, "$1");
  const pieces: string[] = [];
  const code = /(`+)([\s\S]*?[^`])\1(?!`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = code.exec(raw))) {
    pieces.push(stripMarks(raw.slice(last, match.index)));
    pieces.push(match[2].trim());
    last = code.lastIndex;
  }
  pieces.push(stripMarks(raw.slice(last)));
  return pieces.join("").trim();
}

export function extractToc(source: string): TocEntry[] {
  // rehype-slug slugs every heading level with one slugger, so h1/h4-h6 must advance the duplicate counter too.
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let fence: string | null = null;

  for (const line of source.split(/\r?\n/)) {
    if (fence) {
      const close = line.match(FENCE_CLOSE);
      if (close && close[1][0] === fence[0] && close[1].length >= fence.length) fence = null;
      continue;
    }
    const open = line.match(FENCE_OPEN);
    if (open) {
      fence = open[1];
      continue;
    }
    const heading = line.match(ATX_HEADING);
    if (!heading) continue;

    const depth = heading[1].length;
    const text = headingText(heading[2]);
    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) entries.push({ depth, text, id });
  }
  return entries;
}

export function groupToc(entries: TocEntry[]): TocPart[] {
  const parts: TocPart[] = [];
  for (const entry of entries) {
    if (entry.depth === 2) parts.push({ entry, children: [] });
    else if (parts.length > 0) parts[parts.length - 1].children.push(entry);
  }
  return parts;
}

export function activeHeadingId(positions: { id: string; top: number }[], offset: number): string | null {
  let current: string | null = null;
  for (const { id, top } of positions) {
    // A heading missing from the page reports Infinity; skip it rather than ending the scan early.
    if (!Number.isFinite(top)) continue;
    if (top > offset) break;
    current = id;
  }
  return current;
}
