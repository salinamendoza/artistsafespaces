-- Event hub — Phase 4: seed zones, activities, and tasks for event id=2
-- (Art Therapy 2026) so the new hub page can be verified with real data.
--
-- No transaction wrapping (D1 console rejects BEGIN/COMMIT). Idempotency comes
-- from the NOT EXISTS guards on every INSERT — re-running this file is a
-- no-op once the seed rows exist. Activities and tasks look up zones by
-- (event_id, name) rather than by hard-coded id so the file is portable
-- across environments whose zones table got different auto-increment ids.
--
-- Salina will rewrite this content via the admin hub UI once the page is
-- live; the seed exists only to give the page real shape during verification.

-- Zones.
INSERT INTO zones (event_id, name, description, display_order)
SELECT 2, 'Outside',
       'Mural wall + check-in table on the patio.', 0
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM zones WHERE event_id = 2 AND name = 'Outside');

INSERT INTO zones (event_id, name, description, display_order)
SELECT 2, 'Inside: Restaurant',
       'Main floor seating and the giveaway QR display.', 1
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM zones WHERE event_id = 2 AND name = 'Inside: Restaurant');

INSERT INTO zones (event_id, name, description, display_order)
SELECT 2, 'Inside: Room Set',
       'Styled room with art-therapy stations.', 2
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM zones WHERE event_id = 2 AND name = 'Inside: Room Set');

-- Activities.
INSERT INTO activities (event_id, zone_id, title, start_time, end_time, notes, display_order)
SELECT 2, (SELECT id FROM zones WHERE event_id = 2 AND name = 'Outside'),
       'Doors open + check-in',
       '2026-06-12T13:30', '2026-06-12T14:00',
       'Volunteers at the patio table with the printed guest list.', 0
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM activities WHERE event_id = 2 AND title = 'Doors open + check-in');

INSERT INTO activities (event_id, zone_id, title, start_time, end_time, notes, display_order)
SELECT 2, (SELECT id FROM zones WHERE event_id = 2 AND name = 'Outside'),
       'Live mural painting',
       '2026-06-12T14:00', '2026-06-12T17:00',
       'Artist paints the patio wall in real time.', 1
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM activities WHERE event_id = 2 AND title = 'Live mural painting');

INSERT INTO activities (event_id, zone_id, title, start_time, end_time, notes, display_order)
SELECT 2, (SELECT id FROM zones WHERE event_id = 2 AND name = 'Inside: Room Set'),
       'Art-therapy stations open',
       '2026-06-12T14:00', '2026-06-12T16:30',
       'Three stations, rotating every 30 minutes.', 2
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM activities WHERE event_id = 2 AND title = 'Art-therapy stations open');

INSERT INTO activities (event_id, zone_id, title, start_time, end_time, notes, display_order)
SELECT 2, (SELECT id FROM zones WHERE event_id = 2 AND name = 'Inside: Restaurant'),
       'Giveaway entry window',
       '2026-06-12T14:00', '2026-06-12T17:30',
       'QR codes on tables; entries close 30 minutes before drawing.', 3
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM activities WHERE event_id = 2 AND title = 'Giveaway entry window');

INSERT INTO activities (event_id, zone_id, title, start_time, end_time, notes, display_order)
SELECT 2, (SELECT id FROM zones WHERE event_id = 2 AND name = 'Inside: Restaurant'),
       'Winner announced',
       '2026-06-12T18:00', NULL,
       'Sam draws and announces from the host stand.', 4
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM activities WHERE event_id = 2 AND title = 'Winner announced');

-- Tasks. Mix of zone-scoped and event-level (zone_id NULL) so the Open Items
-- section has variety on first render.
INSERT INTO tasks (event_id, zone_id, title, owner, status, display_order)
SELECT 2, (SELECT id FROM zones WHERE event_id = 2 AND name = 'Outside'),
       'Confirm wall prep + drop cloths', 'IKEA', 'open', 0
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM tasks WHERE event_id = 2 AND title = 'Confirm wall prep + drop cloths');

INSERT INTO tasks (event_id, zone_id, title, owner, status, display_order)
SELECT 2, (SELECT id FROM zones WHERE event_id = 2 AND name = 'Outside'),
       'Deliver paint + brushes by 12:00', 'Sam', 'open', 1
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM tasks WHERE event_id = 2 AND title = 'Deliver paint + brushes by 12:00');

INSERT INTO tasks (event_id, zone_id, title, owner, status, notes, display_order)
SELECT 2, (SELECT id FROM zones WHERE event_id = 2 AND name = 'Inside: Room Set'),
       'Confirm station supplies inventory', 'Sam', 'blocked',
       'Waiting on IKEA to confirm whether small tables are available on-site.', 0
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM tasks WHERE event_id = 2 AND title = 'Confirm station supplies inventory');

INSERT INTO tasks (event_id, zone_id, title, owner, status, display_order)
SELECT 2, (SELECT id FROM zones WHERE event_id = 2 AND name = 'Inside: Restaurant'),
       'Print QR cards for each table', 'Sam', 'done', 0
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM tasks WHERE event_id = 2 AND title = 'Print QR cards for each table');

INSERT INTO tasks (event_id, zone_id, title, owner, status, display_order)
SELECT 2, NULL,
       'Send partner hub link to IKEA contact', 'Sam', 'open', 0
WHERE EXISTS (SELECT 1 FROM events WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM tasks WHERE event_id = 2 AND title = 'Send partner hub link to IKEA contact');

-- ----------------------------------------------------------------------------
-- Phase 4 verification.
-- ----------------------------------------------------------------------------
--
-- 1. Zones seeded (only if event id=2 exists).
--      SELECT id, name, display_order FROM zones WHERE event_id = 2 ORDER BY display_order;
--      -- expect 3 rows: Outside, Inside: Restaurant, Inside: Room Set
--
-- 2. Activities seeded with zone references resolved.
--      SELECT a.title, a.start_time, z.name AS zone
--        FROM activities a
--        LEFT JOIN zones z ON z.id = a.zone_id
--       WHERE a.event_id = 2
--       ORDER BY a.start_time;
--      -- expect 5 rows, each with a non-null zone name
--
-- 3. Tasks seeded with status mix.
--      SELECT title, status, owner, zone_id IS NULL AS event_level
--        FROM tasks WHERE event_id = 2 ORDER BY id;
--      -- expect 5 rows: 3 open / 1 blocked / 1 done; one with event_level = 1
--
-- 4. No orphaned zone_id references.
--      SELECT COUNT(*) FROM activities a
--       WHERE a.event_id = 2 AND a.zone_id IS NOT NULL
--         AND NOT EXISTS (SELECT 1 FROM zones z WHERE z.id = a.zone_id);
--      SELECT COUNT(*) FROM tasks t
--       WHERE t.event_id = 2 AND t.zone_id IS NOT NULL
--         AND NOT EXISTS (SELECT 1 FROM zones z WHERE z.id = t.zone_id);
--      -- both expect 0
--
-- ----------------------------------------------------------------------------
-- Rollback for Phase 4 (removes only the seed rows for event 2):
--   DELETE FROM tasks      WHERE event_id = 2;
--   DELETE FROM activities WHERE event_id = 2;
--   DELETE FROM zones      WHERE event_id = 2;
-- ----------------------------------------------------------------------------
