import { describe, it, expect } from 'vitest';
import { loadScriptFont, isScriptLoaded, getLoadedScripts } from './fonts';

describe('fonts loader', () => {
  it('recognizes english as immediately loaded without dynamic import', () => {
    expect(isScriptLoaded('en')).toBe(true);
  });

  it('loads Devanagari script fonts for Hindi and Marathi and caches them', async () => {
    await loadScriptFont('hi');
    expect(isScriptLoaded('hi')).toBe(true);
    expect(isScriptLoaded('mr')).toBe(true);
    expect(getLoadedScripts()).toContain('hi');
    expect(getLoadedScripts()).toContain('mr');

    // Calling again does not re-import or fail
    await loadScriptFont('mr');
    expect(isScriptLoaded('mr')).toBe(true);
  });

  it('loads Tamil script fonts on demand', async () => {
    await loadScriptFont('ta');
    expect(isScriptLoaded('ta')).toBe(true);
    expect(getLoadedScripts()).toContain('ta');
  });

  it('loads Telugu script fonts on demand', async () => {
    await loadScriptFont('te');
    expect(isScriptLoaded('te')).toBe(true);
    expect(getLoadedScripts()).toContain('te');
  });

  it('loads Kannada script fonts on demand', async () => {
    await loadScriptFont('kn');
    expect(isScriptLoaded('kn')).toBe(true);
    expect(getLoadedScripts()).toContain('kn');
  });

  it('safely handles unknown or invalid script code without throwing', async () => {
    await expect(loadScriptFont('unknown_code')).resolves.not.toThrow();
  });
});
