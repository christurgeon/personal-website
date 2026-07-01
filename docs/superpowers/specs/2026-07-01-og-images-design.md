# Dynamic OG Image Generation — Design

**Date:** 2026-07-01
**Status:** Approved (pending spec review)

## Goal

Replace the static `/images/profile.jpg` Open Graph fallback with dynamically generated, on-brand share cards so links to christurgeon.com get rich previews on X, LinkedIn, Slack, Discord, iMessage, etc. Motivation: improve click-through on shared links (part of a broader traffic push).

## Decisions Made

| Question | Decision |
|---|---|
| Scope | Blog posts + top-level pages (Home, Blog index, Photography, Projects, About). Root image doubles as fallback for all other routes. |
| Posts with `coverImage` | Always use the generated card. Cover images stay on the page, not in share previews. |
| Layout | "Card on Paper" — white card with hard shadow floating on dotted warm paper, seeded riso shapes bleeding off the edges. |
| Theme | Light (warm paper `#fffbe9`, ink `#0a0a0a`). Fixed — OG images cannot follow viewer theme. |
| Generation | Next.js file-convention `opengraph-image.tsx` routes using `ImageResponse`, delegating to one shared renderer. Blog post images pre-rendered at build via `generateStaticParams`. |

Approved mockups (visual companion session): `.superpowers/brainstorm/37144-1782945056/content/og-layout.html` (layout options) and `og-theme.html` (theme options). Option C ("sticker"/Card on Paper), light variant.

## Architecture

### New files

- **`src/lib/og/card.tsx`** — single source of truth for card rendering:
  - `OG_SIZE = { width: 1200, height: 630 }`
  - `renderOgCard({ title, tag, meta, seed }): ReactElement` — Card-on-Paper JSX consumable by `ImageResponse`. `tag` optional; pill omitted when absent.
  - `loadOgFonts(): Promise<Font[]>` — reads vendored TTFs from `src/lib/og/fonts/`.
  - Seeded variation: reuse `hashString` from `src/lib/riso.ts` on `seed` (post slug or page name) to pick shape colors and one of several corner-shape compositions. Deterministic across rebuilds.
  - Color constants as hex literals (Satori cannot resolve CSS variables), copied from light-mode `globals.css` with a comment pointing there:
    - paper `#fffbe9`, ink `#0a0a0a`, card `#ffffff`, muted `#4a4a4a`
    - yellow `#fde047`, red `#f43f5e`, blue `#3b5bf1`, green `#2cc27a`, pink `#f9a8d4`
- **`src/lib/og/fonts/ArchivoBlack-Regular.ttf`** and **`src/lib/og/fonts/SpaceMono-Bold.ttf`** — vendored font files (Satori requires TTF/OTF/WOFF, not woff2 and not `next/font`; local files avoid a network dependency at build).
- **Route files** (each a thin wrapper: gather data → `renderOgCard`; each exports `alt`, `size`, `contentType`):
  - `src/app/opengraph-image.tsx` — Home; also the automatic fallback for every route without its own (links, referrals, photography categories).
  - `src/app/blog/opengraph-image.tsx`
  - `src/app/blog/[slug]/opengraph-image.tsx` — exports `generateStaticParams` (same list as the page: `getAllPosts()`), so all post images render at build time.
  - `src/app/photography/opengraph-image.tsx`
  - `src/app/projects/opengraph-image.tsx`
  - `src/app/about/opengraph-image.tsx`

### Modified files

- **`src/app/blog/[slug]/page.tsx`** — remove manual `openGraph.images` from `generateMetadata` (file convention injects `og:image` and takes precedence).
- **`src/app/layout.tsx`** — remove static `openGraph.images: [profile.jpg]`. Keep `twitter: { card: "summary_large_image" }`; X falls back to `og:image`, so no `twitter-image.tsx` files are needed.

## Card Contents

| Page | Tag pill | Title | Meta line |
|---|---|---|---|
| Blog post | First tag, uppercased; omitted if post has no tags | Post title | `CHRISTURGEON.COM · JUN 14, 2026` (date via `date-fns` `MMM d, yyyy`, uppercased) |
| Home | — | Chris Turgeon | `BLOG · PHOTOGRAPHY · PROJECTS` |
| Blog index | — | Blog | `WRITING ON SOFTWARE, TRAVEL & LIFE` |
| Photography | — | Photography | `CHRISTURGEON.COM` |
| Projects | — | Projects | `CHRISTURGEON.COM` |
| About | — | About | `CHRISTURGEON.COM` |

`alt` export: post title for posts; page name for static pages; site name for Home.

## Visual Spec

Canvas 1200×630. All measurements at full scale (mockup was half scale).

- **Paper:** `#fffbe9` background; dot grid of `#0a0a0a` dots (~2.4px radius on an ~18px grid, opacity ~0.22). Satori has no `background-image: radial-gradient` pattern support guarantees — implement dots as a tiled inline SVG `backgroundImage` (data URI), which Satori supports.
- **Frame:** 14px solid `#0a0a0a` border around the full canvas.
- **Seeded shapes:** 2–3 large shapes (circles ~220–240px diameter, rotated squares ~76px) with 8px ink borders, colors picked by seed from the riso palette, positioned bleeding off paper corners/edges, behind the card.
- **Card:** white `#ffffff`, 10px solid ink border, hard shadow `20px 20px 0 #0a0a0a` (Satori supports `boxShadow`), padding ~40–48px, max-width ~82% of canvas, centered.
- **Tag pill:** Space Mono Bold ~22px, letter-spacing 0.12em, uppercase, ink text on pink `#f9a8d4`, 5px ink border, padding ~6px 16px, margin-bottom ~24px.
- **Title:** Archivo Black, ink, line-height 1.02, letter-spacing -0.02em. Size tiers by character count: <40 chars → 72px; 40–70 → 60px; >70 → 50px. Longest current title (~57 chars) renders at 60px on ~3 lines.
- **Meta line:** Space Mono Bold ~22px, letter-spacing 0.08em, uppercase, muted `#4a4a4a`, margin-top ~24px.

## Edge Cases

- **No tags:** pill omitted; card layout unaffected.
- **Emoji in titles:** unsupported without an emoji font (Satori limitation). No current titles contain emoji. Documented limitation; do not add an emoji font now.
- **Unknown slug:** mirror the page route's 404 behavior (`notFound()` when `getPostBySlug` misses).
- **Very long titles:** smallest size tier (50px) plus natural wrapping; if a future title exceeds ~120 chars it may clip — acceptable, none exist.

## Testing & Verification

1. `pnpm build` passes — post images render at build time, so a renderer bug fails the build loudly.
2. In dev, eyeball `/opengraph-image`, `/blog/opengraph-image`, and `/blog/<slug>/opengraph-image` for: the longest title (weather-trading post), a short title, a post without tags (all current posts have tags — temporarily strip tags from one in dev to verify the pill-less layout), and each static page.
3. `curl -sI` the image routes on a production build: `200`, `content-type: image/png`.
4. View source on a post page: exactly one `og:image` meta tag pointing at the generated route (manual images removed).
5. Post-deploy: validate with opengraph.xyz and X card validator.
6. `pnpm lint` and `pnpm format:check` pass.

## Out of Scope

- Dark-theme cards, per-photo-category custom cards, `twitter-image.tsx` files, emoji font support, embedding post cover images in the card, and any newsletter/RSS work (separate items from the traffic discussion).
