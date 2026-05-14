# Journal

A loose log of what shipped, what got dropped, and what we learned. Newest entries on top. Append-only — don't rewrite history.

Entries are grouped by session, not date, since work tends to span a session that runs past midnight.

---

## 2026-05-13 → 2026-05-14 — Event hub + RSVP launch

**Shipped (20 commits, 7 migrations):**

Two new public surfaces:
- `/events/[id]/hub` — partner-facing event hub. Reads zones/activities/tasks, partners can add new ones and toggle any task status. No auth, signed via per-event `share_token`.
- `/r/[token]` — public RSVP page. Name + email + activity interest checkboxes, honeypot bot trap, 200/hr per-IP rate limit, multiline address support, hours derived from activities, "RSVP doesn't reserve a headshot or print" disclaimer.

Admin built up phase-by-phase:
- `/admin/events/[id]/hub` with separate new/edit/delete flows for zones, activities, and tasks (3 sub-features in one session).
- RSVP list with interest pills on the admin event detail page.
- UI polish: stripped colored dots/chrome from task status pills + zone labels to avoid the "AI demo card" look.

Migrations 0011–0017: event hub schema + backfill + unique index + event-2 seed, partner writes (attribution + `status_updated_at`), rsvps table, rsvp activity interests junction.

**Caught + fixed mid-flight:**
- D1 rejects SQL `BEGIN/COMMIT`. Multi-statement batches are atomic at parse time, so transactions are a no-op anyway. Stripped from 0011/0012/0014.
- Edge cache (`s-maxage`) on the partner hub was reverting partner toggle state on next read. Dropped the edge cache.
- Tasks created in admin weren't stamping `status_updated_at`, so they looked older than backfilled rows. Fixed.

**Decisions worth remembering:**
- RSVP rate limit set to 200/hr/IP, mirroring `/g/[token]`. Real attendees on shared venue WiFi or carrier-NAT stay well under; a script from one IP hits the wall. The 5/hr default we briefly considered would have blocked legitimate event traffic.
- Event hours are *derived* from `MIN(activity.start_time)` and `MAX(activity.end_time)` rather than added as a new event-level column. No schema change, hours stay in sync with the actual schedule.
- Interest selection is a proper junction table (`rsvp_activity_interests`), not a JSON column. Queryable, ON DELETE CASCADE both ways.

**What didn't ship (intentionally):**
- No email confirmation on RSVP. The data ethics positioning says we don't keep emails warm — sending one would lean us toward CRM territory.
- No "raw uploads" R2 feature. Originals stay in Drive.
- No event-level start/end columns. Derived from activities instead.

**Status at end of session:** RSVP and partner hub URLs both live and tested by Salina. All migrations 0011–0017 already applied to production D1.
