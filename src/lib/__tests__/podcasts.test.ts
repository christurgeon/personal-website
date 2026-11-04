import { describe, it, expect } from "vitest";
import { podcasts, getPodcasts, appleUrl, spotifyUrl, listenUrl, starterEpisodes, SECTIONS, TIERS } from "../podcasts";

describe("podcasts data", () => {
  it("parses and has unique ids", () => {
    expect(podcasts.length).toBeGreaterThan(0);
    expect(new Set(podcasts.map((p) => p.id)).size).toBe(podcasts.length);
  });

  it("has a core show in every section", () => {
    for (const section of Object.keys(SECTIONS) as (keyof typeof SECTIONS)[]) {
      expect(getPodcasts({ tier: "core", section }).length, section).toBeGreaterThan(0);
    }
    for (const tier of TIERS) expect(getPodcasts({ tier }).length, tier).toBeGreaterThan(0);
  });

  it("builds storefront-neutral Apple links from any stored Apple URL", () => {
    const p = { ...podcasts[0], links: { apple: "https://podcasts.apple.com/it/podcast/x/id123", apple_id: null, spotify: null, rss: null } };
    expect(appleUrl(p)).toBe("https://podcasts.apple.com/podcast/id123");
  });

  it("has consistent, well-formed resolved links", () => {
    for (const p of podcasts) {
      const { apple, apple_id, spotify } = p.links;
      if (apple_id) expect(apple, p.name).toBe(`https://podcasts.apple.com/podcast/id${apple_id}`);
      if (spotify) expect(spotify, p.name).toMatch(/^https:\/\/open\.spotify\.com\/show\/[A-Za-z0-9]{22}$/);
      for (const e of p.standout_episodes) {
        if (e.apple_track_id) expect(e.url, `${p.name}: ${e.title}`).toBe(`https://podcasts.apple.com/podcast/id${apple_id}?i=${e.apple_track_id}`);
      }
    }
    // Every show should link straight to both apps, not to a search page.
    for (const p of podcasts) {
      expect(p.links.apple_id, p.name).toBeTruthy();
      expect(p.links.spotify, p.name).toBeTruthy();
    }
    const ids = podcasts.map((p) => p.links.apple_id).filter(Boolean);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("falls back to search URLs when IDs are missing", () => {
    const p = { ...podcasts[0], links: { apple: null, apple_id: null, spotify: null, rss: null } };
    expect(appleUrl(p)).toContain("/search?term=");
    expect(spotifyUrl(p)).toContain("open.spotify.com/search/");
  });

  it("only links episodes to places you can listen", () => {
    expect(listenUrl({ title: "x", url: "https://www.greaterwrong.com/posts/abc" })).toBeNull();
    expect(listenUrl({ title: "x", url: "https://open.spotify.com/episode/abc" })).not.toBeNull();
    for (const p of podcasts) for (const e of starterEpisodes(p)) expect(e.needs_resolution).not.toBe(true);
  });
});
