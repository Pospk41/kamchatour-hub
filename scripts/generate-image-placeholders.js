#!/usr/bin/env node
// Generates 1x1 PNG placeholders for app.json image assets
const fs = require('fs');
const path = require('path');

const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAOZQ0EwAAAAASUVORK5CYII=';
const pngBuffer = Buffer.from(pngBase64, 'base64');

const targets = [
  'assets/images/icon.png',
  'assets/images/adaptive-icon.png',
  'assets/images/favicon.png',
  'assets/images/splash-icon.png',
];

for (const rel of targets) {
  const abs = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  if (!fs.existsSync(abs)) {
    fs.writeFileSync(abs, pngBuffer);
    process.stdout.write(`Created ${rel}\n`);
  } else {
    process.stdout.write(`Exists ${rel}\n`);
  }
}
process.stdout.write('Placeholders ready\n');

