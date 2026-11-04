"""Fill links.apple / apple_id / rss and episode trackIds in data/podcasts.json via the iTunes Search API.

No key needed; Apple throttles at ~20 req/min. Run locally: python scripts/resolve_links.py
Spotify has no usable public API for solo devs (2026), so spotify links stay manual.

Safe to rerun: shows that already have an Apple ID only get missing artwork/RSS filled and their
standout episodes linked to Apple. Every episode change is printed so it can be reviewed in the diff.
"""
import json, re, sys, time, urllib.parse, urllib.request
from difflib import SequenceMatcher
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "content" / "data" / "podcasts.json"
DELAY = 3.2


def get(url):
    with urllib.request.urlopen(url, timeout=20) as r:
        return json.load(r)


def norm(s):
    return re.sub(r"[^a-z0-9 ]", "", (s or "").lower())


def sim(a, b):
    return SequenceMatcher(None, norm(a), norm(b)).ratio()


def find_show(name, hosts):
    q = urllib.parse.urlencode({"term": name, "media": "podcast", "entity": "podcast", "limit": 10})
    res = get(f"https://itunes.apple.com/search?{q}")["results"]
    host = norm(" ".join(hosts))
    scored = sorted(res, key=lambda r: -(sim(name, r["collectionName"]) + 0.3 * any(
        w in norm(r.get("artistName")) for w in host.split() if len(w) > 3)))
    if scored and sim(name, scored[0]["collectionName"]) > 0.6:
        return scored[0]
    return None


def link_episode(e, collection_id, hit):
    if e.get("url") and "podcasts.apple.com" not in e["url"]:
        e.setdefault("source_url", e["url"])
    e["apple_track_id"] = hit["trackId"]
    e["url"] = f"https://podcasts.apple.com/podcast/id{collection_id}?i={hit['trackId']}"
    e["release_date"] = hit.get("releaseDate", "")[:10]
    print(f"    ep  {e['title'][:60]!r} -> {hit['trackName'][:60]!r} ({e['release_date']})")


def best_match(title, results):
    best = max(results, key=lambda r: sim(title, r.get("trackName", "")), default=None)
    return best if best and sim(title, best["trackName"]) > 0.7 else None


def search_episode(term, collection_id, title=None):
    # Older episodes: search the whole catalog, keeping only this show's results.
    q = urllib.parse.urlencode({"term": term, "media": "podcast", "entity": "podcastEpisode", "limit": 50})
    found = [r for r in get(f"https://itunes.apple.com/search?{q}")["results"] if r.get("collectionId") == collection_id]
    time.sleep(DELAY)
    return best_match(title or term, found)


def resolve_episodes(show, collection_id):
    eps = [e for e in show["standout_episodes"] if not e.get("needs_resolution") and not e.get("apple_track_id")]
    if not eps:
        return
    # The lookup endpoint only returns the most recent 200 episodes.
    recent = get(f"https://itunes.apple.com/lookup?id={collection_id}&media=podcast&entity=podcastEpisode&limit=200")["results"][1:]
    time.sleep(DELAY)
    for e in eps:
        hit = best_match(e["title"], recent)
        if not hit:
            hit = search_episode(e["title"], collection_id) or search_episode(f"{show['name']} {e['title']}", collection_id, e["title"])
        if hit:
            link_episode(e, collection_id, hit)
        else:
            print(f"    --  no Apple match for {e['title'][:60]!r}")


def main():
    shows = json.loads(DATA.read_text())
    unresolved = []
    for s in shows:
        cid = s["links"].get("apple_id")
        if cid:
            try:
                if not s.get("artwork") or not s["links"].get("rss"):
                    found = get(f"https://itunes.apple.com/lookup?id={cid}&entity=podcast")["results"]
                    time.sleep(DELAY)
                    if found:
                        s["links"]["rss"] = s["links"].get("rss") or found[0].get("feedUrl")
                        s["artwork"] = s.get("artwork") or found[0].get("artworkUrl600")
                print(f"ok  {s['name']}")
                resolve_episodes(s, cid)
            except Exception as ex:
                print(f"err {s['name']}: {ex}", file=sys.stderr)
            DATA.write_text(json.dumps(shows, indent=2, ensure_ascii=False) + "\n")
            continue
        # Trust an Apple URL that's already in the data over a fuzzy search match.
        known = re.search(r"/id(\d+)", s["links"].get("apple") or "")
        try:
            if known:
                found = get(f"https://itunes.apple.com/lookup?id={known.group(1)}&entity=podcast")["results"]
                hit = found[0] if found else None
            else:
                hit = find_show(s["name"], s["hosts"])
            time.sleep(DELAY)
            if not hit:
                unresolved.append(s["name"])
                continue
            cid = hit["collectionId"]
            s["links"].update(apple_id=cid, apple=f"https://podcasts.apple.com/podcast/id{cid}",
                              rss=hit.get("feedUrl"), overcast=f"https://overcast.fm/itunes{cid}",
                              pocketcasts=f"https://pca.st/itunes/{cid}")
            s["artwork"] = hit.get("artworkUrl600")
            print(f"ok  {s['name']} -> {hit['collectionName']}")
            resolve_episodes(s, cid)
        except Exception as ex:
            print(f"err {s['name']}: {ex}", file=sys.stderr)
            unresolved.append(s["name"])
        DATA.write_text(json.dumps(shows, indent=2, ensure_ascii=False) + "\n")
    print("\nunresolved (check by hand):", *unresolved, sep="\n  ")


if __name__ == "__main__":
    main()
