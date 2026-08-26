import { describe, it, expect } from 'vitest';
import {
  saveDocument,
  getDocument,
  hasDocument,
  deleteDocument,
  StorageUnavailableError,
  isQuotaError,
  type KeyValStoreAdapter,
} from './documents';

describe('Documents Persistence (IndexedDB Wrapper)', () => {
  function createMapStore(): KeyValStoreAdapter {
    const map = new Map<string, unknown>();
    return {
      set: async (key, val) => {
        map.set(key, val);
      },
      get: async (key) => map.get(key),
      del: async (key) => {
        map.delete(key);
      },
    };
  }

  it('performs CRUD operations successfully with injectable store', async () => {
    const store = createMapStore();
    const docId = 'doc-123';
    const blob = new Blob(['test-document-content'], { type: 'text/plain' });

    expect(await hasDocument(docId, store)).toBe(false);

    await saveDocument(docId, blob, store);
    expect(await hasDocument(docId, store)).toBe(true);

    const retrieved = await getDocument(docId, store);
    expect(retrieved).toBe(blob);

    await deleteDocument(docId, store);
    expect(await hasDocument(docId, store)).toBe(false);
  });

  it('wraps store exceptions in StorageUnavailableError', async () => {
    const failingStore: KeyValStoreAdapter = {
      set: async () => {
        throw new Error('Database locked');
      },
      get: async () => {
        throw new Error('Database locked');
      },
      del: async () => {
        throw new Error('Database locked');
      },
    };

    const blob = new Blob(['test']);
    await expect(saveDocument('id', blob, failingStore)).rejects.toThrow(StorageUnavailableError);
  });

  it('accurately identifies quota errors', () => {
    const quotaErr1 = { name: 'QuotaExceededError', message: 'Quota exceeded' };
    const quotaErr2 = { name: 'NS_ERROR_DOM_QUOTA_REACHED' };
    const regularErr = new Error('Network error');

    expect(isQuotaError(quotaErr1)).toBe(true);
    expect(isQuotaError(quotaErr2)).toBe(true);
    expect(isQuotaError(regularErr)).toBe(false);
    expect(isQuotaError(null)).toBe(false);
  });
});
