import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
  const env = (platform?.env ?? {}) as Record<string, unknown>;
  const keys = Object.keys(env).sort();

  const has = (k: string) => typeof env[k] === 'string' && (env[k] as string).length > 0;

  return json({
    has_platform: !!platform,
    env_keys: keys,
    DB_binding: typeof env.DB,
    IMAGES_binding: typeof env.IMAGES,
    R2_ACCOUNT_ID: has('R2_ACCOUNT_ID'),
    R2_ACCESS_KEY_ID: has('R2_ACCESS_KEY_ID'),
    R2_SECRET_ACCESS_KEY: has('R2_SECRET_ACCESS_KEY'),
    R2_BUCKET: has('R2_BUCKET') ? (env.R2_BUCKET as string) : false,
    ADMIN_SECRET: has('ADMIN_SECRET')
  });
};
