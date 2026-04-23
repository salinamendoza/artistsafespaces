export type ActivityType =
  | 'brief_accepted'
  | 'brief_declined'
  | 'invoice_submitted'
  | 'invoice_paid'
  | 'contact_submitted'
  | 'artist_applied'
  | 'partner_applied';

export interface ActivityRow {
  type: ActivityType;
  ts: string;
  actor: string | null;
  title: string | null;
  context: string | null;
  event_id: number | null;
  brief_id: number | null;
}
