import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { r2Get } from '$lib/server/r2';

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
  const path = params.path;
  if (!path) throw error(400, 'Missing image path');

  const env = platform?.env as Record<string, unknown> | undefined;
  const r2res = env ? await r2Get(env, path) : null;

  if (!r2res) {
    return new Response(null, {
      status: 302,
      headers: { location: `/images/${path}` }
    });
  }

  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  const contentType =
    MIME_TYPES[ext] ?? r2res.headers.get('content-type') ?? 'application/octet-stream';

  return new Response(r2res.body, {
    headers: {
      'content-type': contentType,
      'cache-control': `public, max-age=${CACHE_MAX_AGE}, immutable`
    }
  });
};
