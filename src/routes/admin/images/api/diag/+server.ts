import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getR2Creds, r2List } from '$lib/server/r2';

export const GET: RequestHandler = async ({ platform, url, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });

  const env = (platform?.env ?? {}) as Record<string, unknown>;
  const keys = Object.keys(env).sort();
  const has = (k: string) => typeof env[k] === 'string' && (env[k] as string).length > 0;
  const peek = (k: string) => {
    const v = env[k];
    if (typeof v !== 'string' || v.length === 0) return null;
    return {
      length: v.length,
      head: v.slice(0, 6),
      tail: v.slice(-4),
      has_whitespace: /\s/.test(v)
    };
  };

  const base = {
    has_platform: !!platform,
    env_keys: keys,
    deploy_commit: (env.CF_PAGES_COMMIT_SHA as string | undefined)?.slice(0, 7) ?? null,
    deploy_branch: (env.CF_PAGES_BRANCH as string | undefined) ?? null,
    DB_binding: typeof env.DB,
    IMAGES_binding: typeof env.IMAGES,
    R2_ACCOUNT_ID: peek('R2_ACCOUNT_ID'),
    R2_ACCESS_KEY_ID: peek('R2_ACCESS_KEY_ID'),
    R2_SECRET_ACCESS_KEY: peek('R2_SECRET_ACCESS_KEY'),
    R2_BUCKET: has('R2_BUCKET') ? (env.R2_BUCKET as string) : false,
    ADMIN_SECRET: has('ADMIN_SECRET')
  };

  if (url.searchParams.get('test') !== 'r2') {
    return json(base);
  }

  // Active probe — try a list request and report exactly what R2 says
  const creds = getR2Creds(env);
  if (!creds) {
    return json({ ...base, r2_test: 'creds missing' });
  }

  try {
    const items = await r2List(env, 5);
    return json({
      ...base,
      r2_test: 'ok',
      r2_list_count: items.length,
      r2_list_sample: items.slice(0, 3).map((i) => i.key)
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ ...base, r2_test: 'failed', r2_error: msg });
  }
};
