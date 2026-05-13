-- Event hub — Phase 1: schema only.
--
-- Adds nullable share_token / share_expires_at to events, and creates the
-- zones / activities / tasks tables that back the new hub page.
--
-- This file does NOT backfill data and does NOT create the UNIQUE index on
-- share_token. Those are split into 0012 (backfill) and 0013 (unique index)
-- so each phase can be verified before the next runs.
--
-- FK semantics:
--   * event_id: ON DELETE RESTRICT — a stray event delete must not silently
--     wipe hub data. Promote intent: deleting an event with hub rows fails
--     loudly; the operator must clear them first.
--   * zone_id / activity_id: ON DELETE SET NULL — deleting a zone or activity
--     orphans its children rather than cascade-deleting them.
--
-- NOT NULL on share_token is enforced at the application layer (event-create
-- path). SQLite cannot retroactively add NOT NULL to a populated column
-- without a full table rebuild, which we are deliberately not doing on live
-- data.

-- No BEGIN/COMMIT: D1's HTTP console rejects SQL transactions outright (the
-- runtime requires JS-side transaction APIs). Statements run sequentially and
-- independently. CREATE ... IF NOT EXISTS makes the table/index statements
-- safely re-runnable; the ALTERs below are deliberately not.

-- Re-running this file after a successful first run produces "duplicate column
-- name" errors on the two ALTERs below. That is expected and intentional: the
-- CREATE statements use IF NOT EXISTS and silently no-op, but ALTER ADD COLUMN
-- does not have an IF NOT EXISTS form in SQLite, and we want a loud failure if
-- someone tries to apply the schema twice.
ALTER TABLE events ADD COLUMN share_token TEXT;
ALTER TABLE events ADD COLUMN share_expires_at TEXT;

CREATE TABLE IF NOT EXISTS zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_zones_event ON zones(event_id, display_order);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
  zone_id INTEGER REFERENCES zones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  notes TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_activities_event ON activities(event_id, start_time);
CREATE INDEX IF NOT EXISTS idx_activities_zone ON activities(zone_id);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
  zone_id INTEGER REFERENCES zones(id) ON DELETE SET NULL,
  activity_id INTEGER REFERENCES activities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  owner TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','blocked','done')),
  due_date TEXT,
  notes TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tasks_event ON tasks(event_id, status, display_order);
CREATE INDEX IF NOT EXISTS idx_tasks_zone ON tasks(zone_id);
CREATE INDEX IF NOT EXISTS idx_tasks_activity ON tasks(activity_id);

-- ----------------------------------------------------------------------------
-- Phase 1 verification — run each query in the D1 console after the block
-- above completes. ALL must hold before moving to 0012.
-- ----------------------------------------------------------------------------
--
-- 1. New tables exist.
--      SELECT name FROM sqlite_master WHERE type='table'
--                                       AND name IN ('zones','activities','tasks');
--      -- expect 3 rows
--
-- 2. New columns exist on events, both nullable.
--      PRAGMA table_info(events);
--      -- expect share_token and share_expires_at present, type TEXT, notnull=0
--
-- 3. FK semantics are as intended.
--      PRAGMA foreign_key_list(zones);
--      PRAGMA foreign_key_list(activities);
--      PRAGMA foreign_key_list(tasks);
--      -- expect event_id -> events with on_delete=RESTRICT on all three
--      -- expect zone_id  -> zones  with on_delete=SET NULL on activities + tasks
--      -- expect activity_id -> activities with on_delete=SET NULL on tasks
--
-- 4. New tables are empty.
--      SELECT COUNT(*) FROM zones;       -- expect 0
--      SELECT COUNT(*) FROM activities;  -- expect 0
--      SELECT COUNT(*) FROM tasks;       -- expect 0
--      If any return non-zero, HALT and investigate before running 0012.
--
-- ----------------------------------------------------------------------------
-- Rollback for Phase 1 (if any of the above checks fail):
--   DROP TABLE IF EXISTS tasks;
--   DROP TABLE IF EXISTS activities;
--   DROP TABLE IF EXISTS zones;
--   ALTER TABLE events DROP COLUMN share_expires_at;
--   ALTER TABLE events DROP COLUMN share_token;
-- Then re-verify PRAGMA table_info(events) matches pre-migration schema.
-- ----------------------------------------------------------------------------
