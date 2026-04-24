-- Seed: Live Muralists — 2026 Art Therapy Festival campaign.
-- Run this in the Cloudflare D1 Console AFTER migration 0010 has been applied.
-- Artists are intentionally empty — Sam adds them through /admin/artist-profiles
-- and attaches them via /admin/campaigns.

INSERT OR IGNORE INTO campaigns (slug, title, description, event_date, location, is_active)
VALUES (
  'live-muralists-2026-art-therapy',
  'Live Muralists — 2026 Art Therapy Festival',
  'Live muralists painting original work at the 2026 Art Therapy Festival at IKEA Costa Mesa.',
  '2026-05-30',
  'IKEA Costa Mesa',
  1
);
