import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
  const env = platform?.env ?? {};
  const keys = Object.keys(env).sort();

  return json({
    has_platform: !!platform,
    env_keys: keys,
    DB: typeof (env as Record<string, unknown>).DB,
    IMAGES: typeof (env as Record<string, unknown>).IMAGES,
    ADMIN_SECRET: typeof (env as Record<string, unknown>).ADMIN_SECRET === 'string' ? 'string(set)' : 'missing'
  });
};
