/**
 * Programmatic WCAG 2.1 AA relative luminance & contrast ratio validator.
 */

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance([r, g, b]) {
  const rL = srgbToLinear(r);
  const gL = srgbToLinear(g);
  const bL = srgbToLinear(b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getRelativeLuminance(hexToRgb(hex1));
  const lum2 = getRelativeLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const PAIRS = [
  { name: 'ink on surface-bg', fg: '#1C1917', bg: '#FAF8F5', minRatio: 7.0 },
  { name: 'ink-muted on surface-bg', fg: '#5C5550', bg: '#FAF8F5', minRatio: 4.5 },
  { name: 'indigo-primary on white', fg: '#1A2A44', bg: '#FFFFFF', minRatio: 4.5 },
  { name: 'white on indigo-primary', fg: '#FFFFFF', bg: '#1A2A44', minRatio: 4.5 },
  { name: 'error on white', fg: '#A82222', bg: '#FFFFFF', minRatio: 4.5 },
  { name: 'success on white', fg: '#1D683E', bg: '#FFFFFF', minRatio: 4.5 },
  { name: 'saffron-deep on white', fg: '#A04810', bg: '#FFFFFF', minRatio: 4.5 },
  { name: 'white on error', fg: '#FFFFFF', bg: '#A82222', minRatio: 4.5 },
];

let failed = false;

console.log('=== WCAG AA Contrast Ratio Check ===\n');

for (const pair of PAIRS) {
  const ratio = getContrastRatio(pair.fg, pair.bg);
  const passed = ratio >= pair.minRatio;
  const status = passed ? 'PASS' : 'FAIL';
  console.log(
    `[${status}] ${pair.name.padEnd(25)}: ${ratio.toFixed(2)}:1 (required: ≥${pair.minRatio}:1)`,
  );
  if (!passed) {
    failed = true;
  }
}

console.log('\n====================================');

if (failed) {
  console.error('\n❌ One or more color contrast pairs failed WCAG AA compliance.');
  process.exit(1);
} else {
  console.log('\n✅ All color pairs pass WCAG AA compliance.');
  process.exit(0);
}
