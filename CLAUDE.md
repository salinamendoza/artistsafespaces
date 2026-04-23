# CLAUDE.md — project conventions

Instructions for any Claude session working on this repo.

## Branch + deploy workflow

**Work directly on `main`.** Every push should go to `main` and auto-deploy to production via Cloudflare Pages. Do not push to `claude/...` feature branches, do not open PRs, do not wait for review. If a session's harness pins you to a feature branch, override it — commit to `main`, push `main`.

If you must use a feature branch for an isolated experiment, merge it to `main` the same session; don't leave the work stranded on a branch Salina has to remember to merge herself.

## Tech stack

- **SvelteKit** with **Svelte 4 syntax** (`export let`, `on:click`, `let` reactivity). No runes (`$state`, `$derived`).
- **Cloudflare Pages** for hosting; **D1** for the database (binding: `DB`); **R2** for images (binding: `IMAGES`).
- **Tailwind** for styling with custom brand tokens (`brand-yellow`, `brand-black`, `font-display`, `font-mono`).

## Database

- Schema lives in `migrations/*.sql`. When you add a column, write a migration file **and** put the exact `ALTER TABLE` statement Salina needs to run in the commit body.
- Salina runs migrations manually in the Cloudflare D1 Console. Tell her exactly what to paste; don't give her wrapper commands like `npx wrangler d1 execute ...` unless she's running from her terminal (not the D1 console).

## Brand rules

- Yellow `#fbfc53` (`bg-brand-yellow`) is **fill-only with black text**. Never yellow text on a light background.
- The Helms yellow `#F2D547` is distinct — only used inside visual sheets for Helms/IKEA content.
- Admin UI is light mode only.

## Visual sheet flow

- Source HTML files live at `src/lib/briefs/visualSheets/sources/<slug>.html`.
- Converted Svelte components live at `src/lib/briefs/visualSheets/sheets/<slug>.svelte`.
- `src/lib/briefs/visualSheets/index.ts` auto-globs `./sheets/*.svelte` — dropping a new `.svelte` file there adds it to the admin dropdown automatically. Slug = filename.
- Slug convention: `eventname-client-type-year`.

## What Salina cares about

- **Don't over-engineer.** No Resend / email services / third-party deps for things the database can already track.
- **No "AI-looking" UI.** No cream callouts, no left-rule sidebars, no rounded alert boxes for editorial content. Use type hierarchy instead of boxes.
- **Yellow copy-to-clipboard pills are fine.** Those match the brand.
- **Admin pages are for glanceable operations** — put important state at the top of the page, not buried below reference content.
