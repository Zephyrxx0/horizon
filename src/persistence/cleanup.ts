import { clear, type UseStore } from 'idb-keyval';
import { docStore, type KeyValStoreAdapter } from './documents';

export interface CleanupOptions {
  preserveLanguagePreference?: boolean;
}

/**
 * Purges all VisaReThink draft answers from localStorage/sessionStorage
 * and wipes all locally stored document blobs from IndexedDB.
 * Designed for applicants on shared / cyber-café computers.
 */
export async function clearAllDraftData(
  store: UseStore | KeyValStoreAdapter = docStore,
  options: CleanupOptions = {},
): Promise<void> {
  // 1. Clear localStorage keys starting with visarethink
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (
          key &&
          (key.startsWith('visarethink.') ||
            key.startsWith('visarethink_') ||
            key.startsWith('visarethink'))
        ) {
          if (options.preserveLanguagePreference && key === 'visarethink.i18n.lng') {
            continue;
          }
          keysToRemove.push(key);
        }
      }
      for (const key of keysToRemove) {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      console.error('[persistence:cleanup] Failed to clear localStorage:', err);
    }
  }

  // 2. Clear sessionStorage if present
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (
          key &&
          (key.startsWith('visarethink.') ||
            key.startsWith('visarethink_') ||
            key.startsWith('visarethink'))
        ) {
          sessionKeysToRemove.push(key);
        }
      }
      for (const key of sessionKeysToRemove) {
        window.sessionStorage.removeItem(key);
      }
    } catch (err) {
      console.error('[persistence:cleanup] Failed to clear sessionStorage:', err);
    }
  }

  // 3. Clear IndexedDB document store
  try {
    if (store) {
      if ('clear' in store && typeof (store as { clear?: unknown }).clear === 'function') {
        await (store as { clear: () => Promise<void> }).clear();
      } else if (typeof store === 'function' || (typeof store === 'object' && store !== null)) {
        await clear(store as UseStore);
      }
    }
  } catch (err) {
    console.error('[persistence:cleanup] Failed to clear IndexedDB documents store:', err);
  }
}
