-- Retroactively swap hello@artistsafespaces.org → salina@artistsafespaces.org
-- in brief bodies, brief-specific terms, and frozen accepted-terms snapshots.
-- Idempotent: running this more than once is safe (REPLACE on an already-replaced
-- string is a no-op).
UPDATE briefs SET brief_body = REPLACE(brief_body, 'hello@artistsafespaces.org', 'salina@artistsafespaces.org') WHERE brief_body LIKE '%hello@artistsafespaces.org%';
UPDATE briefs SET terms_markdown = REPLACE(terms_markdown, 'hello@artistsafespaces.org', 'salina@artistsafespaces.org') WHERE terms_markdown LIKE '%hello@artistsafespaces.org%';
UPDATE bookings SET accepted_terms_snapshot = REPLACE(accepted_terms_snapshot, 'hello@artistsafespaces.org', 'salina@artistsafespaces.org') WHERE accepted_terms_snapshot LIKE '%hello@artistsafespaces.org%';
