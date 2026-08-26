import { createStore, set, get, del, type UseStore } from 'idb-keyval';

export const docStore =
  typeof indexedDB !== 'undefined'
    ? createStore('visarethink', 'documents')
    : (null as unknown as UseStore);

export class StorageUnavailableError extends Error {
  override cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'StorageUnavailableError';
    this.cause = cause;
  }
}

export function isQuotaError(e: unknown): boolean {
  if (!e || typeof e !== 'object') return false;
  const err = e as { name?: string; message?: string };
  return (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    (typeof err.message === 'string' && err.message.toLowerCase().includes('quota'))
  );
}

export interface KeyValStoreAdapter {
  set: (key: string, value: unknown) => Promise<void>;
  get: (key: string) => Promise<unknown>;
  del: (key: string) => Promise<void>;
}

export async function saveDocument(
  id: string,
  blob: Blob,
  store: UseStore | KeyValStoreAdapter = docStore,
): Promise<void> {
  try {
    if (store && 'set' in store && typeof store.set === 'function') {
      await store.set(id, blob);
    } else {
      await set(id, blob, store as UseStore);
    }
  } catch (err) {
    throw new StorageUnavailableError('Failed to persist document to storage.', err);
  }
}

export async function getDocument(
  id: string,
  store: UseStore | KeyValStoreAdapter = docStore,
): Promise<Blob | undefined> {
  try {
    if (store && 'get' in store && typeof store.get === 'function') {
      const val = await store.get(id);
      return val as Blob | undefined;
    }
    const val = await get<Blob>(id, store as UseStore);
    return val;
  } catch (err) {
    throw new StorageUnavailableError('Failed to read document from storage.', err);
  }
}

export async function deleteDocument(
  id: string,
  store: UseStore | KeyValStoreAdapter = docStore,
): Promise<void> {
  try {
    if (store && 'del' in store && typeof store.del === 'function') {
      await store.del(id);
    } else {
      await del(id, store as UseStore);
    }
  } catch (err) {
    throw new StorageUnavailableError('Failed to delete document from storage.', err);
  }
}

export async function hasDocument(
  id: string,
  store: UseStore | KeyValStoreAdapter = docStore,
): Promise<boolean> {
  try {
    const doc = await getDocument(id, store);
    return Boolean(doc);
  } catch {
    return false;
  }
}

export async function getStorageEstimate(): Promise<{ usage: number; quota: number } | null> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.usage !== undefined && estimate.quota !== undefined) {
        return { usage: estimate.usage, quota: estimate.quota };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      return await navigator.storage.persist();
    }
    return false;
  } catch {
    return false;
  }
}
