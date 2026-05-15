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
- **Cloudflare Pages** hosting; **D1** database (binding: `DB`); **R2** images via the S3-compatible HTTP API + token (the `IMAGES` binding is declared in `wrangler.toml` but doesn't actually attach in production — see "Images & R2" below).
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

## Copy & voice

These rules came out of a long pre-launch session. They're load-bearing. Don't violate them.

### Headline rule (case studies + any article-style page)

**The on-page H1 is the source of truth.** All of these must match the H1 character-for-character:

- `<title>` tag (may add ` | Artist Safespaces` suffix, nothing else)
- `og:title`
- `twitter:title`
- JSON-LD `headline`

Do not invent a separate "SEO-optimized" headline. If the H1 should change, change the H1 — surface the suggestion to Salina, don't edit silently. Title separator is `|` (pipe), not em dash.

### Em dash rule

**No em dashes (`—`) in body copy.** They've become a stereotypical AI-writing tell and Salina hates them. Use:

- **Colons** for list intros (`The mechanics travel: local artists, art layered into freebies, owned infrastructure`)
- **Semicolons** for parallel contrasts (`We don't paint the mural; we book the muralist`)
- **Periods** to break long sentences
- **Parens** for asides
- **Commas** for loose connectors

Applies everywhere reader-facing: page copy, meta descriptions, image alt text, list-separator UI text. **En dashes (`–`) for ranges are fine** (`2–4× industry average`). Just no em dashes.

### Partner case study voice

**Never frame Artist Safespaces against the partner's own products or merch.** The thesis is *additive*, never subtractive:

- ✅ "Original art layered into the freebie program"
- ❌ "Original art instead of branded merch"
- ❌ "Logo totes end up in storage closets"

A reasonable marketing director at any future client should be able to read the case study and not think "this person dunks on our category." Branded merch is genuinely useful and clients invest in it. Don't bite the hand.

## Data ethics positioning

Public, prominent, and load-bearing for the brand:

**Entry data is collected for the giveaway, used for the giveaway, and deleted after the giveaway concludes.** No list-sharing with partners. No CRM hand-off. No "let's keep them warm for next quarter."

This is the differentiator vs other experiential marketing (Eventbrite/Mailchimp lead-gen pipelines). Don't undermine it by adding email export buttons, retention features, "warm leads" tooling, etc. without explicit Salina sign-off.

## Images & R2

### Storage architecture — IMPORTANT

We do NOT rely on the Cloudflare Pages R2 binding. It was unreliable in production (binding configured in dashboard didn't attach to the runtime). All R2 access goes through the **S3-compatible HTTP API + token**, signed with hand-rolled SigV4 in `src/lib/server/r2.ts` (no external deps, no npm install needed).

Required env vars in Cloudflare Pages → Settings → Environment variables → Production:

- `R2_ACCOUNT_ID` (32 hex chars; the Cloudflare account ID, not a token)
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY` (mark as Secret in Pages)
- `R2_BUCKET` (bucket name, e.g. `artist-safespaces-images`)

If you find yourself reaching for `platform.env.IMAGES`, stop. The binding is declared in `wrangler.toml` but doesn't actually attach in this Pages project. Use the helpers in `$lib/server/r2.ts`: `r2Put`, `r2Delete`, `r2Get`, `r2List`, `getR2Creds`. Creds are auto-trimmed for stray whitespace/slashes.

Diagnostic endpoint: `/admin/images/api/diag?test=r2` runs a live LIST and reports the result. Use it when uploads fail. It also echoes `deploy_commit` and `deploy_branch` so you can confirm which build is live.

### Upload + serving flow

- **Operator upload UI** at `/admin/images`: drag image → browser converts to WebP via `canvas.toBlob` → uploads to R2 → returns `/api/images/<folder>/<file>.webp` URL.
- **Public serving**: `/api/images/[...path]/+server.ts` calls `r2Get(env, path)` then falls back to static `/images/<path>`. Sets `cache-control: public, max-age=2592000, immutable` (30 days) on R2 hits.
- **WebP conversion defaults**: quality 82, max longest edge 2400px. EXIF orientation respected via `createImageBitmap(file, { imageOrientation: 'from-image' })`.
- **Folder structure** in R2 + `static/images/`: `headshots/artist`, `headshots/partner`, `studios`, `style`, `events`, `visual-sheets`, `logos`, `team`, `murals`, `community`, `art-therapy`.

### Originals belong in Drive, not R2

Raw camera/phone exports go in Salina's external Drive/Dropbox per event. R2 only holds the optimized WebP that the public site serves. Don't add a "raw uploads" feature.

## Admin forms

**Every `use:enhance` form in the admin uses `enhanceNoReset` from `$lib/utils/enhance.ts`.**

```svelte
<script>
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
</script>

<form method="POST" action="?/save" use:enhance={enhanceNoReset}>
  ...
</form>
```

Why: SvelteKit's default `use:enhance` calls `form.reset()` on success. Reset reverts inputs to their HTML `defaultValue` / `defaultChecked` attributes — but Svelte writes `value={...}` and `checked={...}` as DOM properties, so reset visibly clears textareas and checkboxes before re-fetched data has a chance to re-render. `enhanceNoReset` does `update({ reset: false })` instead.

When adding a new admin form, default to `enhanceNoReset`. Bare `use:enhance` is a footgun.

## Public giveaway page (`/g/[token]`)

Conventions baked in for press-launch reliability:

- **Edge cache**: `cache-control: public, max-age=0, s-maxage=60, stale-while-revalidate=300`. Browser revalidates each visit (admins see edits instantly); edge caches for 60s + stale-while-revalidate=5min so D1 hits are roughly 1/region/min during traffic spikes.
- **IP rate limit**: 200 entries/hour per IP. Was bumped from 5 because press venues commonly have hundreds of attendees on shared carrier-NAT (T-Mobile, AT&T) and strict limits block legit entries. UNIQUE constraint on email already catches actual duplicates.
- **`no-store` is wrong here.** Don't change the cache header back to `no-store` thinking it's safer. It's not — it forces every visit to hit D1 with a 6-table JOIN.
- **Page rendering**: form auto-fill / persistence on save uses `enhanceNoReset` per the admin forms rule.

## Case studies

`src/lib/data/site.ts` exports `caseStudies: CaseStudy[]`, auto-sorted newest-first by `publishedAt`. The homepage tile, `/partners/apply` social proof block, and the `/case-studies` index all read from this array.

### Adding a new case study

1. Append a new entry to the `allCaseStudies` array in `site.ts`. `publishedAt` is ISO date (e.g. `2026-05-02`) — set newer than existing entries to take the featured slot.
2. Create `src/routes/case-studies/<slug>/+page.svelte`. Use `ikea-culver-city` as the template.
3. Required at the top of the new page:
   - `<script context="module" lang="ts">export const prerender = true;</script>` — static-renders the page at build time so social-share crawlers see meta tags reliably and there's no Worker hit per visit.
   - Full `<svelte:head>` with title, description, canonical, OG, Twitter, and **JSON-LD Article schema**. All URLs absolute (`https://artistsafespaces.org/...`). The headline rule (above) still applies.
4. Cover image goes through `/admin/images` → reference at `/api/images/events/<file>.webp`.
5. JSON-LD `publisher.logo.url` should be `https://artistsafespaces.org/logo-icon.png`.

### CTA destination

Case study pages are sales assets. The bottom CTA points to `/partners/apply`, not `/contact`.

## D1 migrations — gotchas worth not re-learning

- **No `BEGIN`/`COMMIT`.** D1 rejects SQL transaction statements. Multi-statement batches sent in a single `db.batch(...)` call are already atomic at parse time, so wrapping them in a transaction is both unnecessary and an error. Migrations should just be flat statements.
- **`CREATE TABLE IF NOT EXISTS` is safely re-runnable, `ALTER TABLE ADD COLUMN` is not.** When a migration mixes both, expect a "duplicate column name" error on re-runs of the ALTERs. That's fine — Salina runs migrations once in the D1 console and won't re-run them.
- Migrations run **manually in the D1 console** (raw SQL only — no `npx wrangler ...` inside that console). When you add a migration, put the literal SQL Salina needs to paste in the commit body, not a wrapper command.

## Event hub (zones / activities / tasks)

Schema in migrations 0011–0015. Tables: `zones`, `activities`, `tasks`, plus partner-write columns on tasks (`created_by_label`, `status_updated_at`, `status_updated_by_label`). Each event gets a per-event `share_token` for the public partner URL.

- **Public partner hub** at `/events/[id]/hub` — no auth, signed by `share_token`. Partners can create zones/activities/tasks and toggle any task status.
- **Admin hub** at `/admin/events/[id]/hub` — same UI tree, with edit + delete affordances.
- **No edge cache on the partner hub.** `s-maxage` caused toggle state to revert after partner writes. Don't add it back.
- Activities have `start_time` (required) and `end_time` (nullable). Event-level hours are *derived* (`MIN(start_time)` → `MAX(end_time)`) — don't add event-level start/end columns.
- Shared UI components live in `src/lib/components/eventHub/`. Run-of-show, zone pills, task rows. Touch them carefully — both admin and partner views render the same components.

## RSVPs

Migrations 0016 (rsvps) + 0017 (rsvp_activity_interests junction).

- **Public form** at `/r/[token]` — name, email, optional activity interest checkboxes pulled from the event's activities. Honeypot field (`name="website"`, off-screen). 200 RSVPs/hr per CF-Connecting-IP, matching `/g/[token]` (chosen for shared venue WiFi and carrier-NAT).
- **UNIQUE(event_id, email)** — re-submitting updates interests instead of failing.
- **Data ethics still applies.** RSVP data is collected for the event and deleted after. No email export, no "warm leads" tooling, no confirmation emails without explicit Salina sign-off.
- Disclaimer copy on the form + confirmation: "This RSVP lets us know you're coming. It doesn't reserve a headshot slot or guarantee one of the 100 limited-edition prints." Don't drop it — sets expectations correctly.

## Mobile responsiveness

Tailwind `lg:` breakpoint (1024px) is the divider for multi-column tables. Below `lg:`, they should collapse to stacked card rows — events are run in the field on phones and tablets, and three columns crammed into 768px is unreadable. The run-of-show component (`src/lib/components/eventHub/RunOfShow.svelte`) is the reference pattern: header hidden below `lg:`, time/title/zone stack vertically, zone pill and edit link wrap to their own line. **Don't use `md:` (768px) for table → card collapses** — content padding eats too much of the row at that width.

`AdminHeader` follows the same rule: `flex-col` below `lg:`, `flex-row` at `lg:` and up. Nav links wrap. Breadcrumb labels truncate at 200px so a long event name doesn't push the layout.

## Journal

`JOURNAL.md` at the repo root is an append-only log of what shipped per session + lessons learned. Add an entry at the end of any session that produced something worth reflecting on (not every bug fix). Newest entries on top, grouped by session, not calendar date.
