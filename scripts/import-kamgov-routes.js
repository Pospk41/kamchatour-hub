#!/usr/bin/env node
// Fetches kamgov.ru/mintur/dla-investorov page, extracts PDF links, downloads them,
// and builds assets/cultural_db/routes.json with metadata.
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const BASE_URL = 'https://kamgov.ru/mintur/dla-investorov';
const OUTPUT_DIR = path.join(process.cwd(), 'assets', 'cultural_db', 'routes_pdfs');
const OUTPUT_JSON = path.join(process.cwd(), 'assets', 'cultural_db', 'routes.json');

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 Kamchatka-Safe-Tour Bot' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

function unique(arr) {
  return Array.from(new Set(arr));
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_');
}

function extractPdfAnchors(html) {
  const anchors = [];
  const re = /<a\b[^>]*href\s*=\s*"([^"]+?\.pdf)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    const inner = m[2].replace(/<[^>]+>/g, '').trim();
    anchors.push({ href, title: inner });
  }
  return anchors;
}

async function downloadTo(url, filePath) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 Kamchatka-Safe-Tour Bot' } });
  if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
}

async function main() {
  const html = await fetchText(BASE_URL);
  const anchors = extractPdfAnchors(html);
  const pdfUrls = unique(anchors.map((a) => new URL(a.href, BASE_URL).href));

  const records = [];
  for (const u of pdfUrls) {
    const title = anchors.find((a) => new URL(a.href, BASE_URL).href === u)?.title || '';
    const basename = sanitizeFilename(path.basename(new URL(u).pathname) || 'route.pdf');
    const outPath = path.join(OUTPUT_DIR, basename);
    try {
      await downloadTo(u, outPath);
      records.push({ url: u, file: path.relative(path.join(process.cwd(), 'assets'), outPath).replace(/\\/g, '/'), title, source: BASE_URL });
      process.stdout.write(`Downloaded: ${basename}\n`);
    } catch (e) {
      process.stderr.write(`Skip ${u}: ${e.message}\n`);
    }
  }
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(records, null, 2), 'utf8');
  process.stdout.write(`Written: ${path.relative(process.cwd(), OUTPUT_JSON)} (${records.length} items)\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

