const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IG_RE = /^[A-Za-z0-9._]{1,30}$/;

export interface EntryInput {
  name?: string;
  email?: string;
  phone?: string;
  instagram_handle?: string;
}

export interface CleanEntry {
  name: string;
  email: string;
  phone: string;
  instagram_handle: string | null;
}

export function validateEntry(input: EntryInput): { ok: true; value: CleanEntry } | { ok: false; field: string; error: string } {
  const name = (input.name ?? '').trim();
  if (!name) return { ok: false, field: 'name', error: 'Name is required.' };
  if (name.length > 100) return { ok: false, field: 'name', error: 'Name is too long.' };

  const email = (input.email ?? '').trim().toLowerCase();
  if (!email) return { ok: false, field: 'email', error: 'Email is required.' };
  if (!EMAIL_RE.test(email)) return { ok: false, field: 'email', error: 'That email doesn’t look right.' };
  if (email.length > 200) return { ok: false, field: 'email', error: 'Email is too long.' };

  const phoneRaw = (input.phone ?? '').trim();
  if (!phoneRaw) return { ok: false, field: 'phone', error: 'Phone is required.' };
  const digits = phoneRaw.replace(/\D/g, '');
  if (digits.length < 7) return { ok: false, field: 'phone', error: 'That phone number looks too short.' };
  if (phoneRaw.length > 40) return { ok: false, field: 'phone', error: 'Phone is too long.' };

  let ig: string | null = null;
  const igRaw = (input.instagram_handle ?? '').trim().replace(/^@+/, '');
  if (igRaw) {
    if (!IG_RE.test(igRaw)) {
      return { ok: false, field: 'instagram_handle', error: 'Use letters, numbers, periods, or underscores only.' };
    }
    ig = igRaw;
  }

  return { ok: true, value: { name, email, phone: phoneRaw, instagram_handle: ig } };
}
