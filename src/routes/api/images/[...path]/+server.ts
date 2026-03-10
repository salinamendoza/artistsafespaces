import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const CACHE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const MIME_TYPES: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  avif: 'image/avif'
};

export const GET: RequestHandler = async ({ params, platform }) => {
  const bucket = platform?.env?.IMAGES;
  if (!bucket) throw error(500, 'Image storage not configured');

  const path = params.path;
  if (!path) throw error(400, 'Missing image path');

  const object = await bucket.get(path);
  if (!object) throw error(404, 'Image not found');

  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';

  return new Response(object.body as ReadableStream, {
    headers: {
      'content-type': contentType,
      'cache-control': `public, max-age=${CACHE_MAX_AGE}, immutable`,
      etag: object.httpEtag
    }
  });
};
