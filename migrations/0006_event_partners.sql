CREATE TABLE event_partners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  paid_by TEXT NOT NULL DEFAULT 'none',
  amount REAL,
  website TEXT,
  contact TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_partners_event ON event_partners(event_id);
