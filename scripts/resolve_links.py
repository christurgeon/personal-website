"""Fill links.apple / apple_id / rss and episode trackIds in data/podcasts.json via the iTunes Search API.

No key needed; Apple throttles at ~20 req/min. Run locally: python scripts/resolve_links.py
Spotify has no usable public API for solo devs (2026), so spotify links stay manual.
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


def resolve_episodes(show, collection_id):
    eps = [e for e in show["standout_episodes"] if not e.get("needs_resolution") and not e.get("apple_track_id")]
    if not eps:
        return
    res = get(f"https://itunes.apple.com/lookup?id={collection_id}&media=podcast&entity=podcastEpisode&limit=200")["results"][1:]
    for e in eps:
        best = max(res, key=lambda r: sim(e["title"], r.get("trackName", "")), default=None)
        if best and sim(e["title"], best["trackName"]) > 0.7:
            e["apple_track_id"] = best["trackId"]
            e["url"] = f"https://podcasts.apple.com/podcast/id{collection_id}?i={best['trackId']}"
            e["release_date"] = best.get("releaseDate", "")[:10]


def main():
    shows = json.loads(DATA.read_text())
    unresolved = []
    for s in shows:
        if s["links"].get("apple_id"):
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
            resolve_episodes(s, cid)
            time.sleep(DELAY)
            print(f"ok  {s['name']} -> {hit['collectionName']}")
        except Exception as ex:
            print(f"err {s['name']}: {ex}", file=sys.stderr)
            unresolved.append(s["name"])
        DATA.write_text(json.dumps(shows, indent=2, ensure_ascii=False))
    print("\nunresolved (check by hand):", *unresolved, sep="\n  ")


if __name__ == "__main__":
    main()
