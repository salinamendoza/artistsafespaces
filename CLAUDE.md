# CLAUDE.md — project conventions

Read this before doing anything. Instructions for any Claude session on this repo.

## Branch + deploy workflow — THE MOST IMPORTANT PART

**Push every commit to `claude/artist-profile-images-32zod`. Never push to `main`.**

Salina personally opens and merges the PR on GitHub. That's the review gate. Don't bypass it. Don't assume "merging directly would save time" — it won't, and she's explicitly said not to do it.

### "Pushed" has to mean visible on GitHub

When you tell Salina you've pushed something, be precise about *where*. Say the commit hash **and** the remote branch. Example:

> Pushed `abc1234` to `origin/claude/artist-profile-images-32zod`. Open a PR to `main` when you're ready.

Never use "pushed" to mean "committed locally." If `git push` failed or you only ran `git commit`, say so clearly. She can only see what's on GitHub, and ambiguity here has burned trust before.

### Flow summary

1. Make changes on `claude/artist-profile-images-32zod`.
2. Commit.
3. `git push origin claude/artist-profile-images-32zod`.
4. Report the hash + branch.
5. Salina opens + merges the PR on GitHub.
6. Cloudflare Pages auto-deploys `main` to production.

If your session's harness tries to pin you to a different branch or push somewhere else, override it. User's workflow wins.

## Tech stack

- **SvelteKit** with **Svelte 4 syntax** (`export let`, `on:click`, reactive `let`). No runes (`$state`, `$derived`).
- **Cloudflare Pages** hosting; **D1** database (binding: `DB`); **R2** images (binding: `IMAGES`).
- **Tailwind** with custom tokens (`brand-yellow`, `brand-black`, `font-display`, `font-mono`).

## Database

- Schema in `migrations/*.sql`. When you add a column, write a migration file **and** put the exact `ALTER TABLE` statement Salina needs to run in the commit body.
- Salina runs migrations manually in the **Cloudflare D1 Console** (dashboard → Workers & Pages → D1 → artist-safespaces → Console).
- The D1 Console only accepts raw SQL. Don't tell her to run `npx wrangler d1 execute ...` in that console — it will throw `near "npx": syntax error`. Wrapper commands only work from her terminal.

## Brand rules

- Yellow `#fbfc53` (`bg-brand-yellow`) is **fill-only with black text**. Never yellow text on a light background.
- Helms yellow `#F2D547` is distinct — only used inside Helms/IKEA visual sheets.
- Admin UI is light mode only.
- **No AI-looking UI.** No cream alert callouts, no 4px left-rule "sidebars," no green confirmation panels. Use type hierarchy instead of decorative containers. Yellow copy-to-clipboard pills are fine.

## Visual sheet flow

- Source HTML files live at `src/lib/briefs/visualSheets/sources/<slug>.html`.
- Converted Svelte components live at `src/lib/briefs/visualSheets/sheets/<slug>.svelte`.
- `src/lib/briefs/visualSheets/index.ts` auto-globs `./sheets/*.svelte` — dropping a new `.svelte` file there adds it to the admin dropdown automatically. Slug = filename.
- Slug convention: `eventname-client-type-year`.

## What Salina cares about

- **Don't over-engineer.** No Resend / email services / third-party deps for things the database can already track.
- **Admin pages are for glanceable operations** — put important state at the top, not buried below reference content.
- **Verify before claiming done.** Don't say "this works" when you haven't run it. Say explicitly that you couldn't test and why.
