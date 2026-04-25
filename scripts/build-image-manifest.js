import { readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = 'static/images';
const OUT = 'src/lib/data/imageManifest.json';
const ALLOWED = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif', '.svg']);

async function scan(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await scan(full, out);
    } else if (entry.isFile()) {
      const lower = entry.name.toLowerCase();
      const dot = lower.lastIndexOf('.');
      const ext = dot >= 0 ? lower.slice(dot) : '';
      if (!ALLOWED.has(ext)) continue;
      const s = await stat(full);
      out.push({
        key: relative(ROOT, full).split(sep).join('/'),
        size: s.size,
        uploaded: s.mtime.toISOString()
      });
    }
  }
  return out;
}

async function main() {
  const images = existsSync(ROOT) ? await scan(ROOT) : [];
  images.sort((a, b) => a.key.localeCompare(b.key));
  await mkdir('src/lib/data', { recursive: true });
  await writeFile(OUT, JSON.stringify(images, null, 2) + '\n');
  console.log(`image manifest: ${images.length} file${images.length === 1 ? '' : 's'} → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
