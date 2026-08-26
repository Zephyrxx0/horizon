import fs from 'node:fs';
import path from 'node:path';

const DIST_ASSETS = path.resolve('dist/assets');
const DIST_INDEX = path.resolve('dist/index.html');
const INDIC_BUDGET_BYTES = 80 * 1024; // 80KB maximum per Indic script subset

console.log('--- Font Budget and Initial Bundle Verification ---');

if (!fs.existsSync(DIST_ASSETS)) {
  console.error('Error: dist/assets not found. Run pnpm build first.');
  process.exit(1);
}

// 1. Verify index.html does not eagerly load Indic fonts
const indexHtml = fs.readFileSync(DIST_INDEX, 'utf-8');
const forbiddenKeywords = ['devanagari', 'tamil', 'telugu', 'kannada'];
for (const kw of forbiddenKeywords) {
  if (indexHtml.toLowerCase().includes(kw)) {
    console.error(`FAIL: Eager reference to Indic script "${kw}" found in initial index.html!`);
    process.exit(1);
  }
}
console.log('✓ Initial index.html is clean (no eager Indic font references).');

// 2. Scan all woff2 files in dist/assets
const files = fs.readdirSync(DIST_ASSETS);
const woff2Files = files.filter((f) => f.endsWith('.woff2'));

if (woff2Files.length === 0) {
  console.error('Error: No woff2 files found in dist/assets.');
  process.exit(1);
}

console.log('\nAsset Size Report:');
console.log('------------------------------------------------------------');
console.log('| Filename                                 | Size (KB)  | Status |');
console.log('------------------------------------------------------------');

let hasViolations = false;

for (const file of woff2Files) {
  const filePath = path.join(DIST_ASSETS, file);
  const stat = fs.statSync(filePath);
  const sizeKb = (stat.size / 1024).toFixed(2);

  const isIndic = forbiddenKeywords.some((kw) => file.toLowerCase().includes(kw));

  let status = 'PASS (Latin)';
  if (isIndic) {
    if (stat.size > INDIC_BUDGET_BYTES) {
      status = 'OVER BUDGET';
      hasViolations = true;
    } else {
      status = 'PASS (Lazy)';
    }
  }

  const paddedName = file.padEnd(40, ' ');
  const paddedSize = sizeKb.padStart(8, ' ');
  console.log(`| ${paddedName} | ${paddedSize} KB | ${status} |`);
}

console.log('------------------------------------------------------------\n');

if (hasViolations) {
  console.error('FAIL: One or more Indic script font files exceeded the 80KB budget limit.');
  process.exit(1);
}

console.log('✓ All font assets satisfy budget constraints.');
process.exit(0);
