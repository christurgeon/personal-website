import styles from "./PodcastList.module.css";
import { jsonLdString } from "@/lib/jsonLd";
import {
  appleId,
  appleUrl,
  getPodcasts,
  listenUrl,
  SECTIONS,
  spotifyUrl,
  starterEpisodes,
  type Podcast,
  type Section,
  type Tier,
} from "@/lib/podcasts";

interface PodcastListProps {
  tier: Tier;
  section?: Section;
  compact?: boolean;
}

const STATUS_LABEL: Record<Podcast["status"], string | null> = {
  active: null,
  hiatus: "On hiatus",
  ended: "Ended · archive",
};

function ListenLinks({ p }: { p: Podcast }) {
  return (
    <span className="font-mono-label inline-flex gap-2">
      <a
        href={appleUrl(p)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.listen}
        aria-label={`${appleId(p) ? "" : "Search for "}${p.name} on Apple Podcasts (opens in new tab)`}
      >
        APPLE
      </a>
      <a
        href={spotifyUrl(p)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.listen}
        aria-label={`${p.links.spotify ? "" : "Search for "}${p.name} on Spotify (opens in new tab)`}
      >
        SPOTIFY
      </a>
    </span>
  );
}

function Episodes({ p, max }: { p: Podcast; max: number }) {
  const eps = starterEpisodes(p, max);
  if (!eps.length) return null;
  return (
    <ul className={styles.episodes}>
      {eps.map((e) => {
        const href = listenUrl(e);
        return (
          <li key={e.title}>
            <span aria-hidden>▸ </span>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {e.title}
              </a>
            ) : (
              <span className={styles.title}>{e.title}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Meta({ p, section = false }: { p: Podcast; section?: boolean }) {
  const status = STATUS_LABEL[p.status];
  return (
    <div className={styles.meta}>
      {section && <span className="font-mono-label">{SECTIONS[p.section].toUpperCase()} · </span>}
      {p.hosts.join(", ")}
      {status && <span className={`font-mono-label ${styles.status}`}>{status.toUpperCase()}</span>}
    </div>
  );
}

function Card({ p, episodes }: { p: Podcast; episodes: number }) {
  return (
    <div id={p.id} data-section={p.section} className={`${styles.card} ${styles.accent}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className={`font-display ${styles.name}`}>{p.name}</div>
        <ListenLinks p={p} />
      </div>
      <Meta p={p} />
      <p className={styles.note}>{p.note}</p>
      <Episodes p={p} max={episodes} />
    </div>
  );
}

function Row({ p, episodes }: { p: Podcast; episodes: number }) {
  return (
    <li id={p.id} data-section={p.section} className={`${styles.row} ${styles.accent}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className={`font-display ${styles.name}`}>{p.name}</span>
        <ListenLinks p={p} />
      </div>
      <Meta p={p} section />
      <p className={styles.note}>{p.note}</p>
      <Episodes p={p} max={episodes} />
    </li>
  );
}

export default function PodcastList({ tier, section, compact = false }: PodcastListProps) {
  const shows = getPodcasts({ tier, section });
  // "episodes"-tier shows are only worth it for specific episodes, so surface more of them.
  const episodes = tier === "episodes" ? 3 : compact ? 1 : 2;

  if (compact) {
    return (
      <ul className={`not-prose my-6 list-none p-0 ${styles.compactList}`}>
        {shows.map((p) => (
          <Row key={p.id} p={p} episodes={episodes} />
        ))}
      </ul>
    );
  }

  return (
    <div className={`not-prose my-6 grid grid-cols-1 gap-5 ${styles.list}`}>
      {shows.map((p) => (
        <Card key={p.id} p={p} episodes={episodes} />
      ))}
    </div>
  );
}

// One ItemList for the whole post so search engines see every show, not just the first section rendered.
export function PodcastJsonLd() {
  const shows = getPodcasts();
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "High-signal podcasts",
    numberOfItems: shows.length,
    itemListElement: shows.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "PodcastSeries",
        name: p.name,
        description: p.note,
        // A search URL doesn't identify the show, so only emit url once the Apple ID is resolved.
        ...(appleId(p) && { url: appleUrl(p) }),
        ...(p.links.rss && { webFeed: p.links.rss }),
        author: p.hosts.map((name) => ({ "@type": "Person", name })),
      },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
