/**
 * R2 access via the S3-compatible HTTP API with SigV4 auth.
 *
 * Why not platform.env.IMAGES? Cloudflare Pages bindings have proven
 * unreliable in our deploy — dashboard-attached R2 bindings don't make it
 * through to the runtime. This module talks to R2 using a regular API token
 * stored as plain env vars, which Pages handles reliably.
 *
 * Required env vars:
 *   R2_ACCOUNT_ID         — Cloudflare account id (32 hex chars)
 *   R2_ACCESS_KEY_ID      — R2 access key id
 *   R2_SECRET_ACCESS_KEY  — R2 secret access key
 *   R2_BUCKET             — bucket name, e.g. artist-safespaces-images
 */

type Env = Record<string, unknown>;

export interface R2Creds {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

export function getR2Creds(env: Env | undefined): R2Creds | null {
  if (!env) return null;
  const clean = (v: unknown): string | undefined => {
    if (typeof v !== 'string') return undefined;
    const t = v.trim().replace(/^\/+|\/+$/g, '');
    return t.length > 0 ? t : undefined;
  };
  const accountId = clean(env.R2_ACCOUNT_ID);
  const accessKeyId = clean(env.R2_ACCESS_KEY_ID);
  const secretAccessKey = clean(env.R2_SECRET_ACCESS_KEY);
  const bucket = clean(env.R2_BUCKET);
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

export interface R2ListItem {
  key: string;
  size: number;
  uploaded: string;
}

export async function r2Put(
  env: Env,
  key: string,
  body: ArrayBuffer,
  contentType: string
): Promise<void> {
  const creds = requireCreds(env);
  const res = await signedFetch(creds, 'PUT', key, '', body, { 'content-type': contentType });
  if (!res.ok) {
    const text = await safeBody(res);
    throw new Error(`R2 PUT ${res.status}: ${text}`);
  }
}

export async function r2Delete(env: Env, key: string): Promise<void> {
  const creds = requireCreds(env);
  const res = await signedFetch(creds, 'DELETE', key, '');
  if (!res.ok && res.status !== 404) {
    const text = await safeBody(res);
    throw new Error(`R2 DELETE ${res.status}: ${text}`);
  }
}

export async function r2Get(env: Env, key: string): Promise<Response | null> {
  const creds = getR2Creds(env);
  if (!creds) return null;
  const res = await signedFetch(creds, 'GET', key, '');
  if (res.status === 404 || !res.ok) {
    if (res.body) await res.body.cancel();
    return null;
  }
  return res;
}

export async function r2List(env: Env, maxKeys = 1000): Promise<R2ListItem[]> {
  const creds = requireCreds(env);
  const query = `list-type=2&max-keys=${maxKeys}`;
  const res = await signedFetch(creds, 'GET', '', query);
  if (!res.ok) {
    const text = await safeBody(res);
    throw new Error(`R2 LIST ${res.status}: ${text}`);
  }
  const xml = await res.text();
  return parseListResult(xml);
}

function requireCreds(env: Env): R2Creds {
  const c = getR2Creds(env);
  if (!c) {
    throw new Error(
      'R2 credentials missing — set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET'
    );
  }
  return c;
}

async function safeBody(res: Response): Promise<string> {
  try {
    const t = await res.text();
    return t.slice(0, 300);
  } catch {
    return '';
  }
}

/* ---------- SigV4 ---------- */

async function signedFetch(
  creds: R2Creds,
  method: string,
  key: string,
  query: string,
  body?: ArrayBuffer,
  extraHeaders: Record<string, string> = {}
): Promise<Response> {
  const host = `${creds.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = key
    ? `/${creds.bucket}/${key.split('/').map(rfc3986).join('/')}`
    : `/${creds.bucket}`;
  const url = `https://${host}${canonicalUri}${query ? `?${query}` : ''}`;

  const now = new Date();
  const amzDate = toAmzDate(now);
  const dateStamp = amzDate.slice(0, 8);
  const region = 'auto';
  const service = 's3';

  const payloadHash = await sha256Hex(body ?? new ArrayBuffer(0));

  const headers: Record<string, string> = {
    host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    ...lowerKeys(extraHeaders)
  };

  const signedHeaderNames = Object.keys(headers).sort();
  const signedHeaders = signedHeaderNames.join(';');
  const canonicalHeaders = signedHeaderNames.map((k) => `${k}:${headers[k].trim()}\n`).join('');
  const canonicalQuery = canonicalizeQuery(query);

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(new TextEncoder().encode(canonicalRequest))
  ].join('\n');

  const signingKey = await deriveSigningKey(creds.secretAccessKey, dateStamp, region, service);
  const signature = bufToHex(
    await hmac(signingKey, new TextEncoder().encode(stringToSign))
  );

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${creds.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return fetch(url, {
    method,
    headers: { ...headers, Authorization: authorization },
    body: body ?? undefined
  });
}

function toAmzDate(d: Date): string {
  return d.toISOString().replace(/[:-]|\.\d{3}/g, '');
}

function lowerKeys(o: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(o)) out[k.toLowerCase()] = v;
  return out;
}

function rfc3986(s: string): string {
  return encodeURIComponent(s).replace(
    /[!'()*]/g,
    (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

function canonicalizeQuery(query: string): string {
  if (!query) return '';
  const pairs = query.split('&').map((p) => {
    const [k, v = ''] = p.split('=');
    return [rfc3986(decodeURIComponent(k)), rfc3986(decodeURIComponent(v))] as const;
  });
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return pairs.map(([k, v]) => `${k}=${v}`).join('&');
}

async function sha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const buf = data instanceof Uint8Array ? data : new Uint8Array(data);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return bufToHex(hash);
}

async function hmac(key: ArrayBuffer | Uint8Array, msg: Uint8Array): Promise<ArrayBuffer> {
  const k = key instanceof Uint8Array ? key : new Uint8Array(key);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    k,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, msg);
}

async function deriveSigningKey(
  secret: string,
  dateStamp: string,
  region: string,
  service: string
): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const kDate = await hmac(enc.encode('AWS4' + secret), enc.encode(dateStamp));
  const kRegion = await hmac(kDate, enc.encode(region));
  const kService = await hmac(kRegion, enc.encode(service));
  return hmac(kService, enc.encode('aws4_request'));
}

function bufToHex(buf: ArrayBuffer): string {
  const arr = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < arr.length; i++) s += arr[i].toString(16).padStart(2, '0');
  return s;
}

/* ---------- ListObjectsV2 XML parser ---------- */

function parseListResult(xml: string): R2ListItem[] {
  const items: R2ListItem[] = [];
  const blockRe = /<Contents>([\s\S]*?)<\/Contents>/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(xml)) !== null) {
    const block = m[1];
    const key = unescapeXml(extractTag(block, 'Key') ?? '');
    const sizeStr = extractTag(block, 'Size') ?? '0';
    const uploaded = extractTag(block, 'LastModified') ?? '';
    if (key) items.push({ key, size: parseInt(sizeStr, 10) || 0, uploaded });
  }
  return items;
}

function extractTag(xml: string, tag: string): string | null {
  const m = new RegExp(`<${tag}>([^<]*)</${tag}>`).exec(xml);
  return m ? m[1] : null;
}

function unescapeXml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
