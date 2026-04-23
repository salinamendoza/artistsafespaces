export interface Artist {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  bio: string | null;
  portfolio_url: string | null;
  instagram_handle: string | null;
  specialties_json: string | null;
  internal_notes: string | null;
  headshot_url: string | null;
  studio_url: string | null;
  style_images_json: string | null;
  created_at: string;
}

export interface Event {
  id: number;
  name: string;
  client_name: string | null;
  event_date: string | null;
  location: string | null;
  status: 'planning' | 'confirmed' | 'live' | 'wrapped' | 'cancelled';
  internal_notes: string | null;
  created_at: string;
}

export interface ActivationType {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  brief_schema_json: string;
  brief_body_template: string | null;
  terms_template: string | null;
  created_at: string;
}

export interface Brief {
  id: number;
  event_id: number;
  activation_type_id: number;
  title: string;
  brief_data_json: string;
  brief_body: string | null;
  terms_markdown: string | null;
  visual_sheet_slug: string | null;
  status: 'draft' | 'ready' | 'sent';
  created_at: string;
  updated_at: string;
}

export interface EventPartner {
  id: number;
  event_id: number;
  name: string;
  role: string | null;
  paid_by: 'us' | 'client' | 'none';
  amount: number | null;
  website: string | null;
  contact: string | null;
  notes: string | null;
  created_at: string;
}

export interface Booking {
  id: number;
  brief_id: number;
  artist_id: number;
  share_token: string;
  rate: number;
  materials_allowance: number | null;
  status: 'invited' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  accepted_at: string | null;
  accepted_ip: string | null;
  accepted_terms_snapshot: string | null;
  declined_at: string | null;
  declined_reason: string | null;
  invoice_status: 'not_submitted' | 'submitted' | 'paid';
  invoice_submitted_at: string | null;
  invoice_paid_at: string | null;
  invoice_notes: string | null;
  invoice_url: string | null;
  payment_link_url: string | null;
  internal_notes: string | null;
  created_at: string;
}
