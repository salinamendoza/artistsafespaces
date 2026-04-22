-- Booking system: artists, events, activation types, briefs, bookings
-- Phase 1 of the booking/portal system. No clients table yet (client_name is text on events).
-- No magic-link auth yet; briefs are accessed via unguessable share_token on bookings.

CREATE TABLE IF NOT EXISTS artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city TEXT,
  bio TEXT,
  portfolio_url TEXT,
  instagram_handle TEXT,
  specialties_json TEXT,
  internal_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  client_name TEXT,
  event_date TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  internal_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activation_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  brief_schema_json TEXT NOT NULL,
  brief_body_template TEXT,
  terms_template TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS briefs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id),
  activation_type_id INTEGER NOT NULL REFERENCES activation_types(id),
  title TEXT NOT NULL,
  brief_data_json TEXT NOT NULL DEFAULT '{}',
  brief_body TEXT,
  terms_markdown TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brief_id INTEGER NOT NULL REFERENCES briefs(id),
  artist_id INTEGER NOT NULL REFERENCES artists(id),
  share_token TEXT NOT NULL UNIQUE,
  rate NUMERIC NOT NULL,
  materials_allowance NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'invited',
  accepted_at TEXT,
  accepted_ip TEXT,
  accepted_terms_snapshot TEXT,
  declined_at TEXT,
  declined_reason TEXT,
  invoice_status TEXT NOT NULL DEFAULT 'not_submitted',
  invoice_submitted_at TEXT,
  invoice_paid_at TEXT,
  invoice_notes TEXT,
  internal_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(brief_id, artist_id)
);

CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(share_token);
CREATE INDEX IF NOT EXISTS idx_bookings_artist ON bookings(artist_id);
CREATE INDEX IF NOT EXISTS idx_briefs_event ON briefs(event_id);

-- Seed: activation types
-- Each has a brief_schema_json (structured fields), brief_body_template (markdown),
-- and terms_template (markdown that becomes briefs.terms_markdown on create).

INSERT OR IGNORE INTO activation_types (slug, name, description, brief_schema_json, brief_body_template, terms_template) VALUES
(
  'live-painting',
  'Live Painting',
  'Artist paints live at an event — canvas, panel, or surface provided.',
  '[{"key":"event_date","label":"Event Date","type":"date","required":true},{"key":"location","label":"Location","type":"text","required":true},{"key":"call_time","label":"Call Time","type":"text","required":true,"help":"When the artist should arrive"},{"key":"duration","label":"Duration","type":"text","required":true,"help":"e.g. 4 hours live painting + 30 min setup"},{"key":"surface","label":"Surface / Substrate","type":"text","required":true,"help":"Canvas, panel, wood, etc."},{"key":"dimensions","label":"Dimensions","type":"dimensions","required":true},{"key":"theme","label":"Theme","type":"text","required":true},{"key":"deliverables","label":"Deliverables","type":"textarea","required":true,"help":"What goes home with the client vs the artist"},{"key":"materials_provided","label":"Materials Provided by Org","type":"textarea"},{"key":"materials_byo","label":"Artist Brings","type":"textarea"}]',
  '## Overview
Brief overview of the event and why you''re part of it.

## What You''re Making
Describe the piece, theme, and aesthetic direction.

## Logistics
- **Date:**
- **Location:**
- **Call time:**
- **Duration:**
- **Surface:**
- **Dimensions:**

## Market Context
Who the client is and how the work will be seen.

## Compensation
- **Rate:** (see booking)
- **Materials allowance:** (see booking)

## Contact
Sam — hello@artistsafespaces.org',
  '## Terms of Engagement

**Compensation.** The rate and materials allowance shown above are the full compensation for this engagement. Payment is made by the organization or client within 30 days of invoice submission. Invoicing flow for this specific event will be confirmed by Sam.

**Scope.** The artist agrees to create the work described in this brief during the time and at the location specified. Substantial changes to scope must be agreed in writing.

**Ownership & usage.** The artist retains copyright of the work created. Artist Safespaces and the client may photograph and document the activation and use those images for portfolio, promotional, and archival purposes, crediting the artist. Any commercial reproduction of the work itself (prints, merchandise) requires a separate agreement.

**Cancellation.** Either party may cancel up to 14 days before the event date without penalty. Cancellation by the client within 14 days results in payment of 50% of the rate. No-show by the artist forfeits the rate.

**Credit.** The artist agrees to credit Artist Safespaces when posting or publishing images of the work from this engagement.'
),
(
  'live-screen-printing',
  'Live Screen Printing',
  'Live screen-printing station at an event. Attendees receive a printed item.',
  '[{"key":"event_date","label":"Event Date","type":"date","required":true},{"key":"location","label":"Location","type":"text","required":true},{"key":"call_time","label":"Call Time","type":"text","required":true},{"key":"duration","label":"Duration","type":"text","required":true},{"key":"print_dimensions","label":"Print Dimensions","type":"select","required":true,"options":["8x10","11x14","16x20","18x24","Other"],"help":"Standard IKEA US frame sizes"},{"key":"color_count","label":"Number of Colors","type":"number","required":true},{"key":"edition_size","label":"Edition Size","type":"number","required":true,"help":"How many prints total"},{"key":"substrate","label":"Substrate","type":"text","required":true,"help":"Paper stock, poster, fabric, etc."},{"key":"design_source","label":"Design Source","type":"textarea","required":true,"help":"Artist-designed or provided? Any prompts?"},{"key":"materials_provided","label":"Materials Provided by Org","type":"textarea","help":"Press, inks, substrate, squeegees, etc."},{"key":"materials_byo","label":"Artist Brings","type":"textarea"}]',
  '## Overview
Brief overview of the event and the printing setup.

## What You''re Making
Design concept, edition size, color breakdown.

## Logistics
- **Date:**
- **Location:**
- **Call time:**
- **Print size:**
- **Color count:**
- **Edition size:**

## Market Context
Who''s attending and how the prints fit the event.

## Compensation
- **Rate:** (see booking)
- **Materials allowance:** (see booking)

## Contact
Sam — hello@artistsafespaces.org',
  '## Terms of Engagement

**Compensation.** The rate and materials allowance shown above are the full compensation for this engagement. Payment is made by the organization or client within 30 days of invoice submission. Invoicing flow for this specific event will be confirmed by Sam.

**Scope.** The artist runs the screen-printing station for the duration specified, producing the edition described above. Any additional prints beyond the edition are discretionary and unpaid.

**Ownership & usage.** The artist retains the design copyright. Artist Safespaces and the client may photograph the station, the artist at work, and the finished prints for portfolio, promotional, and archival purposes, crediting the artist. Printed items given away at the event are for personal use only by recipients.

**Cancellation.** Either party may cancel up to 14 days before the event date without penalty. Cancellation by the client within 14 days results in payment of 50% of the rate plus any materials already purchased. No-show by the artist forfeits the rate.

**Credit.** The artist agrees to credit Artist Safespaces when posting or publishing images of the work from this engagement.'
),
(
  'community-mural',
  'Community Mural',
  'Artist leads a community-participation mural over one or more sessions.',
  '[{"key":"start_date","label":"Start Date","type":"date","required":true},{"key":"completion_date","label":"Target Completion","type":"date","required":true},{"key":"location","label":"Wall Location","type":"text","required":true},{"key":"wall_dimensions","label":"Wall Dimensions","type":"dimensions","required":true},{"key":"wall_prep","label":"Wall Prep State","type":"select","required":true,"options":["Raw","Primed","Painted base","Unknown — needs site visit"]},{"key":"permit_status","label":"Permit Status","type":"select","required":true,"options":["Not required","Obtained","In progress","Client responsibility"]},{"key":"theme","label":"Theme","type":"text","required":true},{"key":"community_involvement","label":"Community Involvement Plan","type":"textarea","required":true,"help":"How participants contribute — painting sections, designing motifs, etc."},{"key":"sessions","label":"Session Structure","type":"textarea","required":true,"help":"Number of sessions, duration each"},{"key":"materials_provided","label":"Materials Provided by Org","type":"textarea"},{"key":"materials_byo","label":"Artist Brings","type":"textarea"}]',
  '## Overview
Brief overview of the community and the site.

## What You''re Making
Mural theme, how the community participates, what the finished piece looks like.

## Logistics
- **Start date:**
- **Completion target:**
- **Wall location:**
- **Dimensions:**
- **Prep state:**
- **Permit status:**
- **Session structure:**

## Market Context
Who the community is and what the mural means for them.

## Compensation
- **Rate:** (see booking)
- **Materials allowance:** (see booking)

## Contact
Sam — hello@artistsafespaces.org',
  '## Terms of Engagement

**Compensation.** The rate and materials allowance shown above are the full compensation for this engagement, across all sessions. Payment terms and invoicing flow will be confirmed by Sam before work begins.

**Scope.** The artist leads the design and execution of the mural, facilitating community participation as described above. Touch-ups and sealing are included if specified; otherwise handled separately.

**Ownership & usage.** The artist retains copyright of the design. The property owner owns the physical mural. Artist Safespaces and the client may photograph the process, participants, and finished work for portfolio, promotional, and archival purposes, crediting the artist.

**Cancellation.** Either party may cancel up to 21 days before the start date without penalty. Cancellation by the client within 21 days results in payment of 50% of the rate. Weather delays are not cancellations and will be rescheduled.

**Credit.** A small artist credit plaque or painted signature near the mural is expected. The artist agrees to credit Artist Safespaces when posting or publishing images from this engagement.'
),
(
  'commission',
  'Commission',
  'Off-site studio commission — finished work delivered on a date.',
  '[{"key":"delivery_date","label":"Delivery Date","type":"date","required":true},{"key":"medium","label":"Medium","type":"text","required":true,"help":"Acrylic on canvas, ink on paper, etc."},{"key":"dimensions","label":"Dimensions","type":"dimensions","required":true},{"key":"subject","label":"Subject / Concept","type":"textarea","required":true},{"key":"reference_notes","label":"References / Direction","type":"textarea"},{"key":"revision_rounds","label":"Revision Rounds","type":"number","required":true,"help":"How many rounds of feedback included"},{"key":"delivery_method","label":"Delivery Method","type":"text","required":true,"help":"Ship, pickup, digital files"},{"key":"materials_byo","label":"Materials Plan","type":"textarea"}]',
  '## Overview
Brief overview of the commission and who it''s for.

## What You''re Making
Subject, medium, size, style direction.

## Logistics
- **Delivery date:**
- **Medium:**
- **Dimensions:**
- **Revisions included:**
- **Delivery method:**

## Market Context
Any relevant context about the commissioning party and the intended use.

## Compensation
- **Rate:** (see booking)
- **Materials allowance:** (see booking)

## Contact
Sam — hello@artistsafespaces.org',
  '## Terms of Engagement

**Compensation.** The rate and materials allowance shown above are the full compensation for this commission. Payment is made within 30 days of delivery unless otherwise agreed. Invoicing flow will be confirmed by Sam.

**Scope.** The artist produces the work described above and delivers on the stated date. The included revision rounds cover reasonable direction changes within the original concept. Additional revisions or scope changes require a revised agreement.

**Ownership & usage.** On payment in full, physical ownership of the work transfers to the commissioning party for personal display. The artist retains copyright and the right to reproduce the image (prints, portfolio, social media). Commercial reproduction by the commissioning party requires a separate license.

**Cancellation.** If the commissioning party cancels after work has begun, 50% of the rate is due, and any materials purchased are owed. If the artist is unable to deliver, the rate is not owed and any deposit is refunded.

**Credit.** The artist agrees to credit Artist Safespaces when posting or publishing images of this commission.'
),
(
  'live-muralist',
  'Live Muralist',
  'Artist paints their own mural on-site while the public watches.',
  '[{"key":"event_date","label":"Event Date","type":"date","required":true},{"key":"location","label":"Location","type":"text","required":true},{"key":"call_time","label":"Call Time","type":"text","required":true},{"key":"duration","label":"Duration","type":"text","required":true,"help":"Active painting time on-site"},{"key":"wall_or_panel","label":"Wall or Panel","type":"select","required":true,"options":["Wall — permanent","Panel — portable","Other"]},{"key":"dimensions","label":"Dimensions","type":"dimensions","required":true},{"key":"theme","label":"Theme / Direction","type":"textarea","required":true},{"key":"finished_piece_handling","label":"Finished Piece","type":"textarea","required":true,"help":"Who keeps it, where it goes"},{"key":"materials_provided","label":"Materials Provided by Org","type":"textarea"},{"key":"materials_byo","label":"Artist Brings","type":"textarea"}]',
  '## Overview
Brief overview of the event and the site.

## What You''re Making
Mural concept, scale, aesthetic direction.

## Logistics
- **Date:**
- **Location:**
- **Call time:**
- **Active painting duration:**
- **Surface:**
- **Dimensions:**

## Market Context
Who will be watching and what the audience is there for.

## Compensation
- **Rate:** (see booking)
- **Materials allowance:** (see booking)

## Contact
Sam — hello@artistsafespaces.org',
  '## Terms of Engagement

**Compensation.** The rate and materials allowance shown above are the full compensation for this engagement. Payment is made by the organization or client within 30 days of invoice submission. Invoicing flow will be confirmed by Sam.

**Scope.** The artist paints their own mural during the stated duration. Creative direction is the artist''s, within any theme agreed in the brief.

**Ownership & usage.** The artist retains copyright of the work. Physical ownership of the finished piece is as specified in the brief. Artist Safespaces and the client may photograph the process and finished work for portfolio, promotional, and archival purposes, crediting the artist.

**Cancellation.** Either party may cancel up to 14 days before the event date without penalty. Cancellation by the client within 14 days results in payment of 50% of the rate. No-show by the artist forfeits the rate.

**Credit.** The artist agrees to credit Artist Safespaces when posting or publishing images of the work from this engagement.'
),
(
  'poetry-set',
  'Poetry Set',
  'Spoken-word performance set at an event.',
  '[{"key":"event_date","label":"Event Date","type":"date","required":true},{"key":"location","label":"Location","type":"text","required":true},{"key":"call_time","label":"Call Time","type":"text","required":true},{"key":"set_length","label":"Set Length","type":"text","required":true,"help":"e.g. 15 minutes, 3–4 pieces"},{"key":"theme","label":"Theme","type":"text","help":"If the event has a theme to orient around"},{"key":"equipment_provided","label":"Equipment Provided","type":"textarea","help":"Mic, stand, monitors, lighting"},{"key":"stage_notes","label":"Stage / Audience Notes","type":"textarea","help":"Indoor/outdoor, seated/standing, rough headcount"}]',
  '## Overview
Brief overview of the event and the audience.

## What You''re Performing
Set length, direction, any must-include or avoid topics.

## Logistics
- **Date:**
- **Location:**
- **Call time:**
- **Set length:**
- **Equipment:**

## Market Context
Who the audience is and what the night feels like.

## Compensation
- **Rate:** (see booking)

## Contact
Sam — hello@artistsafespaces.org',
  '## Terms of Engagement

**Compensation.** The rate shown above is the full compensation for this engagement. Payment is made by the organization or client within 30 days of invoice submission. Invoicing flow will be confirmed by Sam.

**Scope.** The artist performs a set of the length specified. Content is the artist''s; the brief may specify a theme but does not dictate individual pieces.

**Ownership & usage.** The artist retains all rights to their work. Artist Safespaces and the client may record audio/video of the performance for portfolio, promotional, and archival purposes, crediting the artist. Full-piece publication on the client''s channels requires the artist''s consent.

**Cancellation.** Either party may cancel up to 14 days before the event date without penalty. Cancellation by the client within 14 days results in payment of 50% of the rate. No-show by the artist forfeits the rate.

**Credit.** The artist agrees to credit Artist Safespaces when posting about this engagement.'
),
(
  'dj-set',
  'DJ Set',
  'DJ set at an event — vinyl, CDJ, or controller.',
  '[{"key":"event_date","label":"Event Date","type":"date","required":true},{"key":"location","label":"Location","type":"text","required":true},{"key":"call_time","label":"Call Time","type":"text","required":true},{"key":"set_length","label":"Set Length","type":"text","required":true,"help":"e.g. 90 minutes"},{"key":"set_slot","label":"Slot","type":"text","help":"Opener, peak, closer, background"},{"key":"genre_vibe","label":"Genre / Vibe","type":"text","required":true},{"key":"equipment_provided","label":"Equipment Provided","type":"textarea","required":true,"help":"Decks, CDJs, mixer, monitors, sound system"},{"key":"equipment_byo","label":"DJ Brings","type":"textarea","help":"Controller, USBs, headphones, etc."}]',
  '## Overview
Brief overview of the event, the room, and the energy.

## What You''re Playing
Vibe, slot, any do''s and don''ts.

## Logistics
- **Date:**
- **Location:**
- **Call time:**
- **Set length:**
- **Equipment provided:**

## Market Context
Who''s in the room and what they came for.

## Compensation
- **Rate:** (see booking)

## Contact
Sam — hello@artistsafespaces.org',
  '## Terms of Engagement

**Compensation.** The rate shown above is the full compensation for this engagement. Payment is made by the organization or client within 30 days of invoice submission. Invoicing flow will be confirmed by Sam.

**Scope.** The DJ plays a set of the length specified, within the agreed genre/vibe. Set content is the DJ''s.

**Ownership & usage.** Artist Safespaces and the client may record audio/video of the set for portfolio, promotional, and archival purposes, crediting the DJ. Full-set publication requires the DJ''s consent.

**Cancellation.** Either party may cancel up to 14 days before the event date without penalty. Cancellation by the client within 14 days results in payment of 50% of the rate. No-show by the DJ forfeits the rate.

**Credit.** The DJ agrees to credit Artist Safespaces when posting about this engagement.'
);
