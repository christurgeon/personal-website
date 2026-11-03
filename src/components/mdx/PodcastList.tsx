import { appleUrl, getPodcasts, listenUrl, SECTIONS, spotifyUrl, starterEpisodes, type Podcast, type Section, type Tier } from "@/lib/podcasts";

interface PodcastListProps {
  tier: Tier;
  section?: Section;
  compact?: boolean;
}

const ACCENT: Record<Section, string> = {
  generalist: "var(--yellow)",
  "science-math": "var(--blue)",
  "mind-life": "var(--pink)",
  "computing-ai": "var(--red)",
  "engineering-systems": "var(--green)",
  "economics-markets": "var(--yellow)",
  history: "var(--pink)",
  philosophy: "var(--blue)",
};

const STATUS_LABEL: Record<Podcast["status"], string | null> = {
  active: null,
  hiatus: "On hiatus",
  ended: "Ended · archive",
};

function ListenLinks({ p }: { p: Podcast }) {
  const link = {
    border: "2px solid var(--border)",
    padding: "0.15rem 0.55rem",
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    textDecoration: "none",
    color: "var(--ink)",
    background: "var(--card)",
  } as const;
  return (
    <span className="font-mono-label inline-flex gap-2">
      <a href={appleUrl(p)} target="_blank" rel="noopener noreferrer" style={link}>
        APPLE
      </a>
      <a href={spotifyUrl(p)} target="_blank" rel="noopener noreferrer" style={link}>
        SPOTIFY
      </a>
    </span>
  );
}

function Episodes({ p, max }: { p: Podcast; max: number }) {
  const eps = starterEpisodes(p, max);
  if (!eps.length) return null;
  return (
    <ul className="m-0 mt-2 list-none p-0" style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>
      {eps.map((e) => {
        const href = listenUrl(e);
        return (
          <li key={e.title} style={{ color: "var(--muted)" }}>
            <span aria-hidden>▸ </span>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)" }}>
                {e.title}
              </a>
            ) : (
              <span style={{ color: "var(--ink)" }}>{e.title}</span>
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
    <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
      {section && <span className="font-mono-label">{SECTIONS[p.section].toUpperCase()} · </span>}
      {p.hosts.join(", ")}
      {status && (
        <span
          className="font-mono-label"
          style={{ marginLeft: "0.5rem", padding: "0 0.35rem", background: "var(--yellow)", color: "var(--on-yellow)" }}
        >
          {status.toUpperCase()}
        </span>
      )}
    </div>
  );
}

function Card({ p, episodes }: { p: Podcast; episodes: number }) {
  return (
    <div
      id={p.id}
      style={{
        background: "var(--card)",
        border: "3px solid var(--border)",
        borderLeft: `8px solid ${ACCENT[p.section]}`,
        boxShadow: "4px 4px 0 var(--border)",
        padding: "1rem 1.2rem",
        color: "var(--ink)",
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="font-display" style={{ fontSize: "1.05rem", lineHeight: 1.2 }}>
          {p.name}
        </div>
        <ListenLinks p={p} />
      </div>
      <Meta p={p} />
      <p className="m-0 mt-2" style={{ fontSize: "0.92rem", lineHeight: 1.55 }}>
        {p.note}
      </p>
      <Episodes p={p} max={episodes} />
    </div>
  );
}

function Row({ p, episodes }: { p: Podcast; episodes: number }) {
  return (
    <li
      id={p.id}
      style={{ borderBottom: "2px solid var(--border)", padding: "0.8rem 0 0.8rem 0.9rem", borderLeft: `5px solid ${ACCENT[p.section]}` }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display" style={{ fontSize: "0.98rem" }}>
          {p.name}
        </span>
        <ListenLinks p={p} />
      </div>
      <Meta p={p} section />
      <p className="m-0 mt-1" style={{ fontSize: "0.88rem", lineHeight: 1.5 }}>
        {p.note}
      </p>
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
      <ul className="not-prose my-6 list-none p-0" style={{ borderTop: "2px solid var(--border)", color: "var(--ink)" }}>
        {shows.map((p) => (
          <Row key={p.id} p={p} episodes={episodes} />
        ))}
      </ul>
    );
  }

  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-5">
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
        url: appleUrl(p),
        ...(p.links.rss && { webFeed: p.links.rss }),
        author: p.hosts.map((name) => ({ "@type": "Person", name })),
      },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
