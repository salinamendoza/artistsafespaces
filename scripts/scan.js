#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'fs';
import { join, relative, resolve, dirname, extname } from 'path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const SRC = join(ROOT, 'src');
const STATIC = join(ROOT, 'static');
const ROUTES = join(SRC, 'routes');
const COMPONENTS = join(SRC, 'lib', 'components');
const IMAGES_DIR = join(STATIC, 'images');
const IMAGES_TS = join(SRC, 'lib', 'data', 'images.ts');

const FIX_MODE = process.argv.includes('--fix');
const CHECK_MODE = process.argv.includes('--check');

let errors = 0;
let warnings = 0;
let fixes = 0;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getAllFiles(dir, exts) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(full, exts));
    } else if (!exts || exts.some(e => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function closestMatch(name, candidates, maxDist = 3) {
  let best = null, bestDist = Infinity;
  for (const c of candidates) {
    const d = levenshtein(name, c);
    if (d < bestDist) { bestDist = d; best = c; }
  }
  return bestDist <= maxDist ? best : null;
}

function print(icon, msg) {
  console.log(`  ${icon} ${msg}`);
}

// ---------------------------------------------------------------------------
// 1. Image references
// ---------------------------------------------------------------------------

function checkImages() {
  console.log('');
  const content = readFileSync(IMAGES_TS, 'utf-8');

  // Extract image paths from template literals like ${CDN}/murals/file.webp
  // and direct strings like /api/images/murals/file.webp
  const cdnPaths = [];

  // Match ${CDN}/path/to/file.ext patterns
  const templateRegex = /\$\{CDN\}\/([^\s'"`},]+)/g;
  let match;
  while ((match = templateRegex.exec(content)) !== null) {
    cdnPaths.push(match[1]);
  }

  // Also match literal /api/images/ paths
  const literalRegex = /\/api\/images\/([^\s'"`},]+)/g;
  while ((match = literalRegex.exec(content)) !== null) {
    if (!cdnPaths.includes(match[1])) {
      cdnPaths.push(match[1]);
    }
  }

  console.log(`[Images] Checking ${cdnPaths.length} image references in images.ts...`);

  // Get all actual image files for suggestions
  const allImageFiles = getAllFiles(IMAGES_DIR)
    .map(f => relative(IMAGES_DIR, f));

  let localErrors = 0;
  for (const imgPath of cdnPaths) {
    const fullPath = join(IMAGES_DIR, imgPath);
    if (!existsSync(fullPath)) {
      localErrors++;
      errors++;
      const filename = imgPath.split('/').pop();
      const suggestion = closestMatch(filename, allImageFiles.map(f => f.split('/').pop()));
      print('✗', `ERROR: static/images/${imgPath} not found`);
      if (suggestion) {
        print(' ', `       Did you mean: ${suggestion}?`);
      }
    }
  }

  if (localErrors === 0) {
    print('✓', 'All image references valid');
  }
}

// ---------------------------------------------------------------------------
// 2. Component imports
// ---------------------------------------------------------------------------

function checkComponents() {
  console.log('');
  const srcFiles = getAllFiles(SRC, ['.svelte', '.ts']);
  const importRegex = /from\s+['"](\$lib\/components\/[^'"]+)['"]/g;

  const allImports = [];
  for (const file of srcFiles) {
    const content = readFileSync(file, 'utf-8');
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      allImports.push({ importPath, file });
    }
  }

  console.log(`[Components] Checking ${allImports.length} component imports...`);

  const existingComponents = existsSync(COMPONENTS)
    ? readdirSync(COMPONENTS).filter(f => f.endsWith('.svelte') || f.endsWith('.ts'))
    : [];

  let localErrors = 0;
  for (const { importPath, file } of allImports) {
    // Resolve $lib/components/Foo → src/lib/components/Foo
    // Try with and without .svelte extension
    const relPath = importPath.replace('$lib', 'src/lib');
    const fullPath = join(ROOT, relPath);
    const withSvelte = fullPath + '.svelte';
    const withTs = fullPath + '.ts';
    const asIndex = join(fullPath, 'index.ts');

    if (!existsSync(fullPath) && !existsSync(withSvelte) && !existsSync(withTs) && !existsSync(asIndex)) {
      localErrors++;
      errors++;
      const componentName = importPath.split('/').pop();
      const suggestion = closestMatch(
        componentName,
        existingComponents.map(f => f.replace(/\.(svelte|ts)$/, ''))
      );
      print('✗', `ERROR: ${importPath} not found (imported in ${relative(ROOT, file)})`);
      if (suggestion) {
        print(' ', `       Did you mean: $lib/components/${suggestion}?`);
      }
    }
  }

  if (localErrors === 0) {
    print('✓', `All ${allImports.length} component imports valid`);
  }
}

// ---------------------------------------------------------------------------
// 3. Internal links
// ---------------------------------------------------------------------------

function getValidRoutes() {
  const routes = new Set();
  routes.add('/'); // root always valid

  const routeFiles = getAllFiles(ROUTES, ['+page.svelte']);
  for (const file of routeFiles) {
    const routeDir = dirname(file);
    let routePath = '/' + relative(ROUTES, routeDir).replace(/\\/g, '/');
    if (routePath === '/.') routePath = '/';

    // Store both the literal path and mark dynamic segments
    routes.add(routePath);
  }
  return routes;
}

function matchesRoute(href, routes) {
  if (routes.has(href)) return true;

  // Check dynamic routes - e.g., /art-therapy/2024 matches /art-therapy/[year]
  for (const route of routes) {
    if (!route.includes('[')) continue;
    const routeParts = route.split('/');
    const hrefParts = href.split('/');
    if (routeParts.length !== hrefParts.length) continue;

    let match = true;
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith('[')) continue; // dynamic segment, anything matches
      if (routeParts[i] !== hrefParts[i]) { match = false; break; }
    }
    if (match) return true;
  }
  return false;
}

function checkLinks() {
  console.log('');
  const svelteFiles = getAllFiles(SRC, ['.svelte']);
  const hrefRegex = /href=["'](\/([\w\-/.]*))["']/g;
  const routes = getValidRoutes();

  const allLinks = [];
  for (const file of svelteFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
      const href = match[1];
      // Skip anchor links, API routes, and image paths
      if (href.startsWith('/api/') || href.startsWith('/images/') || href === '#') continue;
      // Find line number
      const pos = match.index;
      const line = content.substring(0, pos).split('\n').length;
      allLinks.push({ href, file, line });
    }
  }

  console.log(`[Links] Checking ${allLinks.length} internal links...`);

  let localErrors = 0;
  for (const { href, file, line } of allLinks) {
    if (!matchesRoute(href, routes)) {
      localErrors++;
      errors++;
      print('✗', `ERROR: ${href} has no matching route (${relative(ROOT, file)}:${line})`);
    }
  }

  if (localErrors === 0) {
    print('✓', `All ${allLinks.length} internal links valid`);
  }
}

// ---------------------------------------------------------------------------
// 4. Unused images
// ---------------------------------------------------------------------------

function checkUnusedImages() {
  console.log('');
  if (!existsSync(IMAGES_DIR)) {
    print('⚠', 'WARNING: static/images/ directory not found');
    warnings++;
    return;
  }

  const imageFiles = getAllFiles(IMAGES_DIR);
  const srcFiles = getAllFiles(SRC, ['.svelte', '.ts', '.js']);
  const allSrcContent = srcFiles.map(f => readFileSync(f, 'utf-8')).join('\n');

  console.log(`[Assets] Checking for unused images in static/images/...`);

  let localWarnings = 0;
  for (const imgFile of imageFiles) {
    const filename = imgFile.split('/').pop();
    if (!allSrcContent.includes(filename)) {
      localWarnings++;
      warnings++;
      print('⚠', `WARNING: static/images/${relative(IMAGES_DIR, imgFile)} not referenced in src/`);
    }
  }

  if (localWarnings === 0) {
    print('✓', `All ${imageFiles.length} images are referenced`);
  }
}

// ---------------------------------------------------------------------------
// 5. Missing alt text
// ---------------------------------------------------------------------------

function checkAltText() {
  console.log('');
  const svelteFiles = getAllFiles(SRC, ['.svelte']);
  // Match <img tags that don't have alt= attribute before the closing >
  const imgRegex = /<img\b([^>]*)>/g;

  console.log(`[Alt Text] Checking for missing alt attributes...`);

  let localWarnings = 0;
  let fixableFiles = [];

  for (const file of svelteFiles) {
    let content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let match;
    let needsFix = false;

    while ((match = imgRegex.exec(content)) !== null) {
      const attrs = match[1];
      // Check for alt attribute (including {alt} for Svelte props)
      if (!/\balt\b/.test(attrs)) {
        const pos = match.index;
        const line = content.substring(0, pos).split('\n').length;
        localWarnings++;
        warnings++;
        print('⚠', `WARNING: <img> missing alt in ${relative(ROOT, file)}:${line}`);
        needsFix = true;
      }
    }

    if (needsFix && FIX_MODE) {
      // Add alt="" to img tags missing it
      const fixed = content.replace(/<img\b((?:(?!\balt\b)[^>])*)>/g, (m, attrs) => {
        if (/\balt\b/.test(attrs)) return m;
        fixes++;
        return `<img${attrs} alt="">`;
      });
      if (fixed !== content) {
        writeFileSync(file, fixed, 'utf-8');
        print('🔧', `FIXED: Added alt="" to img tags in ${relative(ROOT, file)}`);
      }
    }
  }

  if (localWarnings === 0) {
    print('✓', 'All <img> tags have alt attributes');
  }
}

// ---------------------------------------------------------------------------
// 6. Build health (optional --check)
// ---------------------------------------------------------------------------

async function checkBuild() {
  if (!CHECK_MODE) return;
  console.log('');
  console.log('[Build] Running svelte-check...');

  const { execSync } = await import('child_process');
  try {
    execSync('npx svelte-check --tsconfig ./tsconfig.json', {
      cwd: ROOT,
      stdio: 'pipe',
      timeout: 60000
    });
    print('✓', 'svelte-check passed');
  } catch (err) {
    errors++;
    const output = err.stdout?.toString() || err.stderr?.toString() || 'Unknown error';
    print('✗', 'ERROR: svelte-check failed');
    // Show just the error summary lines
    const errorLines = output.split('\n').filter(l => /error/i.test(l)).slice(0, 10);
    for (const line of errorLines) {
      print(' ', `  ${line.trim()}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('=== Artist Safespaces Site Scanner ===');
if (FIX_MODE) console.log('(Running in --fix mode)');

checkImages();
checkComponents();
checkLinks();
checkUnusedImages();
checkAltText();
await checkBuild();

console.log('');
console.log('─'.repeat(40));
const parts = [];
if (errors > 0) parts.push(`${errors} error${errors !== 1 ? 's' : ''}`);
if (warnings > 0) parts.push(`${warnings} warning${warnings !== 1 ? 's' : ''}`);
if (fixes > 0) parts.push(`${fixes} fix${fixes !== 1 ? 'es' : ''} applied`);
if (parts.length === 0) parts.push('No issues found');
console.log(`Summary: ${parts.join(', ')}`);
console.log('');

process.exit(errors > 0 ? 1 : 0);
