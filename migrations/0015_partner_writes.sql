-- Partner writes: attribution + status modification timestamp.
-- New columns are added NOT NULL with a literal default so existing rows
-- backfill to 'admin' (the only writer that existed before this migration).
-- status_updated_at is added nullable, then backfilled to created_at for
-- existing tasks so the column has meaningful data on every row from day one.
--
-- D1 console rejects BEGIN/COMMIT; safety is one-shot: re-running this file
-- after a successful run errors on the ALTERs ("duplicate column name") and
-- that is intentional.

ALTER TABLE zones ADD COLUMN created_by TEXT NOT NULL DEFAULT 'admin';
ALTER TABLE activities ADD COLUMN created_by TEXT NOT NULL DEFAULT 'admin';
ALTER TABLE tasks ADD COLUMN created_by TEXT NOT NULL DEFAULT 'admin';
ALTER TABLE tasks ADD COLUMN status_updated_at TEXT;
UPDATE tasks SET status_updated_at = created_at WHERE status_updated_at IS NULL;

-- Verification:
--   PRAGMA table_info(tasks);
--     -- expect created_by (TEXT, notnull=1, default 'admin') and
--     -- status_updated_at (TEXT, nullable) at the bottom.
--   SELECT COUNT(*) FROM tasks WHERE status_updated_at IS NULL;
--     -- expect 0.
