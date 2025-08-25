#!/usr/bin/env node
// Generate valid PNG assets for Expo: icon, adaptive icon, favicon, splash source
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ROOT = process.cwd();
const out = (p) => path.join(ROOT, p);

function createSolidPng(filePath, size, rgba) {
  const png = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      png.data[idx] = rgba[0];
      png.data[idx + 1] = rgba[1];
      png.data[idx + 2] = rgba[2];
      png.data[idx + 3] = rgba[3];
    }
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  png.pack().pipe(fs.createWriteStream(filePath));
}

function main() {
  fs.mkdirSync(out('assets/images'), { recursive: true });

  // Teal brand color RGBA
  const teal = [8, 145, 178, 255];

  createSolidPng(out('assets/images/icon.png'), 1024, teal);
  createSolidPng(out('assets/images/adaptive-icon.png'), 1024, teal);
  createSolidPng(out('assets/images/favicon.png'), 64, teal);
  createSolidPng(out('assets/images/splash-icon.png'), 1024, teal);

  // Slight delay to ensure streams flushed
  setTimeout(() => process.stdout.write('Brand assets generated.\n'), 300);
}

main();

