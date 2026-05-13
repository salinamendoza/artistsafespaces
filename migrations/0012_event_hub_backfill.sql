-- Event hub — Phase 2: backfill share_token and share_expires_at on existing
-- events.
--
-- randomblob(16) produces 16 random bytes (128 bits of entropy); hex() encodes
-- to 32 lowercase hex chars. SQLite evaluates randomblob() once per row inside
-- an UPDATE, so a single UPDATE statement assigns a distinct token to every
-- row. Collision probability across thousands of rows is effectively zero, but
-- we still verify uniqueness explicitly before adding the UNIQUE index in 0013.
--
-- Rows with event_date IS NULL get share_expires_at = NULL. Such an event
-- can't have a working partner link until a date is set; the partner route
-- treats NULL share_expires_at as expired.
--
-- D1's HTTP console rejects SQL transactions outright (the runtime requires
-- JS-side transaction APIs: DO storage or wrangler db.batch). However, an
-- empirical test on 2026-05-13 found that when both UPDATEs are submitted as
-- a single multi-statement request, D1 rolls the first UPDATE back if the
-- second errors at parse time — a deliberately-broken second UPDATE
-- referencing a non-existent column left missing_token = N (no rows updated),
-- not 0 (first UPDATE persisted).
--
-- This appears to be parse-time atomicity: D1 prepares the whole batch before
-- executing any of it, and a prepare failure aborts the batch. Runtime errors
-- mid-execution (e.g. a constraint violation) were not tested and may behave
-- differently. Statements submitted in separate requests have no shared
-- transaction.
--
-- Either way, the idempotent WHERE ... IS NULL guards on both UPDATEs make
-- this file safe to re-run: a partial backfill is recovered by re-applying,
-- and a fully-applied file is a no-op. Treat the D1 atomicity as a bonus, not
-- a guarantee.

UPDATE events
   SET share_token = lower(hex(randomblob(16)))
 WHERE share_token IS NULL;

UPDATE events
   SET share_expires_at = date(event_date, '+30 days')
 WHERE share_expires_at IS NULL
   AND event_date IS NOT NULL;

-- ----------------------------------------------------------------------------
-- Phase 2 verification — ALL must hold before running 0013.
-- ----------------------------------------------------------------------------
--
-- A. No event left without a token.
--      SELECT COUNT(*) AS missing_token FROM events WHERE share_token IS NULL;
--      -- expect 0
--
-- B. Every token is exactly 32 lowercase hex chars.
--      SELECT COUNT(*) AS bad_token_shape
--        FROM events
--       WHERE share_token IS NOT NULL
--         AND (length(share_token) <> 32 OR share_token GLOB '*[^0-9a-f]*');
--      -- expect 0
--
-- C. No duplicate tokens.
--      SELECT share_token, COUNT(*) AS n
--        FROM events
--       GROUP BY share_token
--      HAVING n > 1;
--      -- expect 0 rows
--
-- D. share_expires_at = event_date + 30 days for every row where event_date
--    is set.
--      SELECT id, name, event_date, share_expires_at
--        FROM events
--       WHERE event_date IS NOT NULL
--         AND (share_expires_at IS NULL
--              OR share_expires_at <> date(event_date, '+30 days'));
--      -- expect 0 rows
--
-- E. List events with NULL event_date (acknowledged: share_expires_at also
--    NULL; partner link will read as expired until a date is set).
--      SELECT id, name FROM events WHERE event_date IS NULL;
--      -- review this list; not a failure, just visibility
--
-- F. Original column data is byte-identical to the pre-migration dump.
--    Run on staging (terminal, not D1 console):
--      sqlite3 staging.db "SELECT id, name, client_name, event_date, location,
--                                 status, internal_notes, billing_to,
--                                 invoice_email, created_at
--                          FROM events ORDER BY id" > after.tsv
--      sqlite3 dump.db    "SELECT id, name, client_name, event_date, location,
--                                 status, internal_notes, billing_to,
--                                 invoice_email, created_at
--                          FROM events ORDER BY id" > before.tsv
--      diff before.tsv after.tsv
--      -- expect no output
--
-- ----------------------------------------------------------------------------
-- Rollback for Phase 2:
--   The recovery path is to re-run this file. The WHERE ... IS NULL clauses
--   skip already-backfilled rows, so a partial failure is recovered by simply
--   re-applying — there is no separate "preferred" vs "fallback" path.
--   Nuclear option (clears all backfill, leaves schema in place):
--     UPDATE events SET share_token = NULL, share_expires_at = NULL;
-- ----------------------------------------------------------------------------
