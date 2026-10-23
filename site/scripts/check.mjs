import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { basePath } from './base-path.mjs';
import { patterns } from '../content/patterns.mjs';
const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const origin = 'https://example.test';
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const p = path.join(dir, entry.name);
    files.push(...entry.isDirectory() ? await walk(p) : [p]);
  }
  return files;
}
async function resolveLocal(url) {
  if (url.origin !== origin || !url.pathname.startsWith(basePath)) {
    throw new Error(`Reference escapes the site base path: ${url.href}`);
  }
  let target = path.resolve(root, decodeURIComponent(url.pathname.slice(basePath.length)));
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) throw new Error(`Invalid local path: ${url.href}`);
  const info = await stat(target);
  if (info.isDirectory()) target = path.join(target, 'index.html');
  await stat(target);
  return target;
}
const htmlFiles = (await walk(root)).filter(f => f.endsWith('.html'));
let checked = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (!html.includes('<title>') || !html.includes('id="main"')) throw new Error(`Missing page metadata: ${file}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`Duplicate IDs: ${file}`);
  const relative = path.relative(root, file).split(path.sep).join('/');
  const paths = [basePath + relative.replace(/index\.html$/, '')];
  // GitHub serves the same 404 document at any missing URL, at any depth.
  if (relative === '404.html') paths.push(`${basePath}missing`, `${basePath}missing/deep/page/`);
  for (const pathname of paths) {
    const pageUrl = new URL(pathname, origin);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const ref = match[1];
      if (/^(https?:|mailto:)/.test(ref)) continue;
      try {
        const url = new URL(ref, pageUrl);
        const target = url.pathname === pageUrl.pathname ? file : await resolveLocal(url);
        if (url.hash && !(await readFile(target, 'utf8')).includes(`id="${url.hash.slice(1)}"`)) throw new Error('Missing anchor');
      } catch (error) { throw new Error(`Broken reference ${ref} at ${pathname}: ${error.message}`); }
      checked++;
    }
    const clientBase = html.match(/data-base="([^"]+)"/)?.[1];
    if (!clientBase) throw new Error(`Missing client base path: ${file}`);
    await resolveLocal(new URL(`${clientBase}assets/search-index.json`, pageUrl));
  }
}
const index = JSON.parse(await readFile(path.join(root, 'assets/search-index.json'), 'utf8'));
const expectedSlugs = patterns.map(p => p.slug).sort();
if (new Set(expectedSlugs).size !== expectedSlugs.length) throw new Error('Duplicate chapter slugs');
if (JSON.stringify(index.map(p => p.slug).sort()) !== JSON.stringify(expectedSlugs)) throw new Error('Search index does not match the chapter collection');
for (const entry of index) await resolveLocal(new URL(`${basePath}patterns/${entry.slug}/`, origin));
await stat(path.join(root, '.nojekyll'));
console.log(`Verified ${htmlFiles.length} pages, ${checked} local references, ${index.length} search entries, and nested 404 URLs under ${basePath}`);
