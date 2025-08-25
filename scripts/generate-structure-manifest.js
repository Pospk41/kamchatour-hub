#!/usr/bin/env node
/*
  Generates a JSON manifest describing the project's structure for visualization.
  - Scans only allowed top-level roots and selected core files
  - Skips heavy/system folders
  - Outputs to assets/structure-manifest.json
*/
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'assets', 'structure-manifest.json');

const CORE_FILES = ['.env', 'app.json', 'package.json', 'tsconfig.json'];
const ALLOWED_ROOTS = [
  'assets',
  'lib',
  'components',
  'contexts',
  'hooks',
  'navigation',
  'screens',
  'services',
  'types',
  'utils',
  'features',
  'scripts',
];

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.expo',
  '.husky',
  '.turbo',
]);

function isSkippableDir(name) {
  return SKIP_DIR_NAMES.has(name);
}

function getStatsSafe(p) {
  try {
    return fs.statSync(p);
  } catch {
    return null;
  }
}

function listDirSafe(p) {
  try {
    return fs.readdirSync(p, { withFileTypes: true });
  } catch {
    return [];
  }
}

function buildTree(absolutePath, baseRelative = '') {
  const name = path.basename(absolutePath);
  const stat = getStatsSafe(absolutePath);
  if (!stat) return null;

  const rel = baseRelative || path.relative(PROJECT_ROOT, absolutePath) || '.';

  if (stat.isDirectory()) {
    if (isSkippableDir(name)) return null;
    const children = listDirSafe(absolutePath)
      .map((entry) => buildTree(path.join(absolutePath, entry.name)))
      .filter(Boolean);
    return {
      name,
      type: 'dir',
      path: rel,
      children,
    };
  }

  return {
    name,
    type: 'file',
    path: rel,
    size: stat.size,
    ext: path.extname(name) || null,
  };
}

function ensureOutputDir() {
  const dir = path.dirname(OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const coreFiles = CORE_FILES
    .map((f) => path.join(PROJECT_ROOT, f))
    .filter((p) => fs.existsSync(p))
    .map((p) => buildTree(p))
    .filter(Boolean);

  const roots = ALLOWED_ROOTS
    .map((dir) => path.join(PROJECT_ROOT, dir))
    .filter((p) => fs.existsSync(p))
    .map((p) => buildTree(p))
    .filter(Boolean);

  const manifest = {
    project: path.basename(PROJECT_ROOT),
    generatedAt: new Date().toISOString(),
    coreFiles,
    roots,
  };

  ensureOutputDir();
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  process.stdout.write(`Manifest written to ${path.relative(PROJECT_ROOT, OUTPUT_PATH)}\n`);
}

main();

