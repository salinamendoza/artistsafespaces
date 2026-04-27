import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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
  const bucket = platform?.env?.IMAGES;
  if (!bucket) throw error(500, 'Image storage not configured');

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

    await bucket.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: type }
    });
    return json({ ok: true, key });
  }

  if (kind === 'delete') {
    await bucket.delete(key);
    return json({ ok: true });
  }

  throw error(400, 'Unknown action');
};
