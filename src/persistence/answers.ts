export interface AnswersEnvelope {
  schemaVersion: 1;
  savedAt: number;
  snapshot: unknown;
}

export const ANSWERS_STORAGE_KEY = 'visarethink.draft.v1';

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

export function saveAnswersEnvelope(envelope: AnswersEnvelope): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;
    const serialized = JSON.stringify(envelope);
    storage.setItem(ANSWERS_STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.error('[persistence:answers] Failed to save answers envelope:', err);
    return false;
  }
}

export function loadAnswersEnvelope(): AnswersEnvelope | null {
  try {
    const storage = getStorage();
    if (!storage) return null;

    const raw = storage.getItem(ANSWERS_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      clearAnswersEnvelope();
      return null;
    }

    if (parsed.schemaVersion !== 1) {
      console.warn('[persistence:answers] Incompatible schema version:', parsed.schemaVersion);
      clearAnswersEnvelope();
      return null;
    }

    if (
      !parsed.snapshot ||
      typeof parsed.snapshot !== 'object' ||
      !('context' in parsed.snapshot) ||
      typeof parsed.snapshot.context !== 'object' ||
      !parsed.snapshot.context ||
      !('answers' in parsed.snapshot.context) ||
      !('currentStepId' in parsed.snapshot.context)
    ) {
      console.warn('[persistence:answers] Corrupt snapshot structure detected.');
      clearAnswersEnvelope();
      return null;
    }

    return parsed as AnswersEnvelope;
  } catch (err) {
    console.error('[persistence:answers] Failed to load/parse answers envelope:', err);
    clearAnswersEnvelope();
    return null;
  }
}

export function clearAnswersEnvelope(): void {
  try {
    const storage = getStorage();
    if (storage) {
      storage.removeItem(ANSWERS_STORAGE_KEY);
    }
  } catch (err) {
    console.error('[persistence:answers] Failed to remove storage key:', err);
  }
}
