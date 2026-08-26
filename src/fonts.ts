import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-600.css';

const loadedScripts = new Set<string>();

export function isScriptLoaded(lng: string): boolean {
  if (lng === 'en') return true;
  return loadedScripts.has(lng);
}

export function getLoadedScripts(): readonly string[] {
  return Array.from(loadedScripts);
}

export async function loadScriptFont(lng: string): Promise<void> {
  if (lng === 'en' || loadedScripts.has(lng)) return;

  if (lng === 'hi' || lng === 'mr') {
    await Promise.all([
      import('@fontsource/noto-sans-devanagari/400.css'),
      import('@fontsource/noto-sans-devanagari/600.css'),
    ]);
    loadedScripts.add('hi');
    loadedScripts.add('mr');
  } else if (lng === 'ta') {
    await Promise.all([
      import('@fontsource/noto-sans-tamil/400.css'),
      import('@fontsource/noto-sans-tamil/600.css'),
    ]);
    loadedScripts.add('ta');
  } else if (lng === 'te') {
    await Promise.all([
      import('@fontsource/noto-sans-telugu/400.css'),
      import('@fontsource/noto-sans-telugu/600.css'),
    ]);
    loadedScripts.add('te');
  } else if (lng === 'kn') {
    await Promise.all([
      import('@fontsource/noto-sans-kannada/400.css'),
      import('@fontsource/noto-sans-kannada/600.css'),
    ]);
    loadedScripts.add('kn');
  }
}
