import { z } from "zod";
import raw from "../../content/data/podcasts.json";

export const TIERS = ["core", "deep-cut", "episodes"] as const;

export const SECTIONS = {
  generalist: "Generalist",
  "science-math": "Science & math",
  "mind-life": "Mind & life",
  "computing-ai": "Computing & AI",
  "engineering-systems": "Engineering & systems",
  "economics-markets": "Economics & markets",
  history: "History",
  philosophy: "Philosophy",
} as const;

export type Tier = (typeof TIERS)[number];
export type Section = keyof typeof SECTIONS;

const episodeSchema = z.object({
  title: z.string(),
  guest: z.string().optional(),
  why: z.string().optional(),
  url: z.string().url().optional(),
  needs_resolution: z.boolean().optional(),
  apple_track_id: z.number().optional(),
  release_date: z.string().optional(),
});

const podcastSchema = z.object({
  id: z.string(),
  name: z.string(),
  hosts: z.array(z.string()),
  tier: z.enum(TIERS),
  section: z.enum(Object.keys(SECTIONS) as [Section, ...Section[]]),
  categories: z.array(z.string()),
  status: z.enum(["active", "hiatus", "ended"]),
  format: z.string(),
  start_year: z.number().nullable(),
  note: z.string(),
  standout_episodes: z.array(episodeSchema),
  links: z.object({
    apple: z.string().url().nullable(),
    apple_id: z.number().nullable(),
    spotify: z.string().url().nullable(),
    rss: z.string().url().nullable(),
    overcast: z.string().url().optional(),
    pocketcasts: z.string().url().optional(),
  }),
  artwork: z.string().url().optional(),
});

export type Podcast = z.infer<typeof podcastSchema>;
export type Episode = z.infer<typeof episodeSchema>;

// Extra fields (evidence, sources, artwork, overcast…) pass through untouched for future consumers.
export const podcasts: Podcast[] = z.array(podcastSchema.passthrough()).parse(raw);

export function getPodcasts(filter: { tier?: Tier; section?: Section } = {}): Podcast[] {
  const order = Object.keys(SECTIONS);
  return podcasts
    .filter((p) => (!filter.tier || p.tier === filter.tier) && (!filter.section || p.section === filter.section))
    .sort((a, b) => order.indexOf(a.section) - order.indexOf(b.section));
}

export function appleId(p: Podcast): number | null {
  if (p.links.apple_id) return p.links.apple_id;
  const m = p.links.apple?.match(/\/id(\d+)/);
  return m ? Number(m[1]) : null;
}

// Storefront-neutral links; fall back to search until scripts/resolve_links.py fills real IDs.
export function appleUrl(p: Podcast): string {
  const id = appleId(p);
  return id ? `https://podcasts.apple.com/podcast/id${id}` : `https://podcasts.apple.com/search?term=${encodeURIComponent(p.name)}`;
}

export function spotifyUrl(p: Podcast): string {
  return p.links.spotify ?? `https://open.spotify.com/search/${encodeURIComponent(p.name)}/podcasts`;
}

// Episode URLs in the seed are often the research source (a blog roundup, a forum comment), not a place to listen.
const LISTEN_HOSTS = [
  "podcasts.apple.com",
  "open.spotify.com",
  "youtube.com",
  "youtu.be",
  "overcast.fm",
  "pca.st",
  "changelog.com",
  "acquired.fm",
  "oxide.computer",
  "complexsystemspodcast.com",
  "corecursive.com",
  "dancarlin.com",
  "econtalk.org",
  "signalsandthreads.com",
  "bbc.co.uk",
  "conversationswithtyler.com",
];

export function listenUrl(e: Episode): string | null {
  if (!e.url) return null;
  const host = new URL(e.url).hostname.replace(/^(www|m)\./, "");
  return LISTEN_HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) ? e.url : null;
}

export function starterEpisodes(p: Podcast, max = 2): Episode[] {
  return p.standout_episodes.filter((e) => !e.needs_resolution).slice(0, max);
}
