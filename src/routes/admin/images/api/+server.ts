import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getR2Creds, r2Put, r2Delete } from '$lib/server/r2';

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/webp',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/avif',
  'image/svg+xml'
]);

function badKey(key: string): boolean {
  if (!key || key.length > 256) return true;
  if (key.startsWith('/') || key.includes('..') || key.includes('\\')) return true;
  return !/^[a-zA-Z0-9/_.-]+$/.test(key);
}

export const POST: RequestHandler = async ({ request, platform }) => {
  const env = platform?.env as Record<string, unknown> | undefined;
  if (!getR2Creds(env)) {
    throw error(
      500,
      'R2 credentials not configured (set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET in Pages env vars)'
    );
  }

  const form = await request.formData();
  const kind = form.get('kind')?.toString();
  const key = form.get('key')?.toString() ?? '';

  if (badKey(key)) throw error(400, 'Invalid path');

  if (kind === 'upload') {
    const file = form.get('file');
    if (!(file instanceof File)) throw error(400, 'No file provided');
    if (file.size === 0) throw error(400, 'Empty file');
    if (file.size > MAX_SIZE) throw error(400, 'File exceeds 10 MB');
    const type = file.type || 'application/octet-stream';
    if (!ALLOWED_TYPES.has(type)) throw error(400, `Unsupported type: ${type}`);

    try {
      await r2Put(env!, key, await file.arrayBuffer(), type);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw error(500, msg);
    }
    return json({ ok: true, key });
  }

  if (kind === 'delete') {
    try {
      await r2Delete(env!, key);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw error(500, msg);
    }
    return json({ ok: true });
  }

  throw error(400, 'Unknown action');
};
