# AGENTS.md

Personal site and blog for christurgeon.com. Next.js (App Router) + React 19, Tailwind v4, MDX via `next-mdx-remote`, TypeScript, deployed on Vercel. Package manager is pnpm; Node 22.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm dev            # localhost:3000
pnpm format:check   # prettier (printWidth 150, tailwind class sorting)
pnpm lint           # eslint
pnpm test           # vitest
pnpm build          # full Next build; also validates every post's frontmatter
```

CI (`.github/workflows/ci.yml`) runs format:check, lint, test, build in that order. Run all four before calling a change done; use `pnpm format` to fix formatting.

## Layout

- `src/app/` — routes. Each section has its own `opengraph-image.tsx`; `sitemap.ts`, `robots.ts`, and `blog/feed.xml` are generated from content.
- `content/posts/*.mdx` — blog posts. Filename is the slug.
- `content/data/` — JSON data rendered by components (e.g. `podcasts.json`).
- `src/components/mdx/` — components usable inside MDX.
- `src/lib/` — content loading (`blog.ts`), site config (`config.ts`), photo/project data, OG card rendering, and pure diagram logic in `lib/diagrams/`.
- `src/lib/__tests__/` — all tests live here.
- `scripts/` — one-off local maintenance scripts (Python, stdlib only). Not run in CI.

## Conventions

**Posts.** Frontmatter is validated by the zod schema in `src/lib/blog.ts`: `title`, `date` (YYYY-MM-DD), and `excerpt` are required; `seoTitle`, `coverImage`, `tags`, and `layout: "guide"` are optional. Add a field to the schema before using it in a post.

**MDX components.** A new component must be registered in `src/components/mdx/index.ts` or the post will fail to render. Interactive client diagrams go through `next/dynamic` in `lazyDiagrams.tsx` so their JS ships only with posts that use them; keep server-only components out of that file.

**Diagrams.** Keep state/step logic as pure functions in `src/lib/diagrams/<name>.ts` with a matching test, and keep the component a thin renderer wrapped in `DiagramFrame`.

**Styling.** Use the CSS variables in `src/app/globals.css` (`--yellow`, `--on-yellow`, `--border`, `--card`, etc.) rather than raw colors. Text on colored backgrounds uses the matching `--on-<hue>` token so it stays legible in both themes. Check light and dark mode for any visual change.

**Images.** Photos live in `public/images/photography/<category>/` and are registered with explicit `width`/`height` in `src/lib/photography.ts`. Optimized images are cached for 31 days, so rename a file instead of replacing its contents.

**Client bundle.** Anything imported by a component rendered on every page (header, footer, `SubscribeForm`) ends up in the shared bundle. Don't pull heavy deps like zod into client code; see `src/lib/newsletter.ts`.

## Don't

- Don't commit `.env*` files other than `.env.example`. The only env var is `NEXT_PUBLIC_GA_MEASUREMENT_ID`, and analytics must stay optional.
- Don't edit `public/chris_turgeon_resume.pdf`, `LICENSE.md`, or post prose unless asked; content is written in the author's voice.
- Don't add dependencies for things the existing stack already does.
