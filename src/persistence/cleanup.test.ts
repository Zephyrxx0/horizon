import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearAllDraftData } from './cleanup';

describe('Storage Cleanup Utility', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('purges all visarethink keys from localStorage while preserving unrelated keys', async () => {
    window.localStorage.setItem('visarethink.draft.v1', JSON.stringify({ test: 'draft' }));
    window.localStorage.setItem('visarethink_draft_backups', JSON.stringify({ test: 'backup' }));
    window.localStorage.setItem('visarethink_existing_apps', JSON.stringify({ test: 'duplicate' }));
    window.localStorage.setItem('other_app_key', 'keep_me');

    const clearMock = vi.fn().mockResolvedValue(undefined);
    const mockStore = {
      set: vi.fn(),
      get: vi.fn(),
      del: vi.fn(),
      clear: clearMock,
    };

    await clearAllDraftData(mockStore);

    expect(window.localStorage.getItem('visarethink.draft.v1')).toBeNull();
    expect(window.localStorage.getItem('visarethink_draft_backups')).toBeNull();
    expect(window.localStorage.getItem('visarethink_existing_apps')).toBeNull();
    expect(window.localStorage.getItem('other_app_key')).toBe('keep_me');
    expect(clearMock).toHaveBeenCalledTimes(1);
  });

  it('preserves language preference when requested', async () => {
    window.localStorage.setItem('visarethink.draft.v1', JSON.stringify({ test: 'draft' }));
    window.localStorage.setItem('visarethink.i18n.lng', 'hi');

    const clearMock = vi.fn().mockResolvedValue(undefined);
    const mockStore = { clear: clearMock } as unknown as import('idb-keyval').UseStore;

    await clearAllDraftData(mockStore, { preserveLanguagePreference: true });

    expect(window.localStorage.getItem('visarethink.draft.v1')).toBeNull();
    expect(window.localStorage.getItem('visarethink.i18n.lng')).toBe('hi');
  });

  it('purges visarethink keys from sessionStorage as well', async () => {
    window.sessionStorage.setItem('visarethink.session.v1', 'active');
    window.sessionStorage.setItem('unrelated_session', 'keep');

    const clearMock = vi.fn().mockResolvedValue(undefined);
    const mockStore = { clear: clearMock } as unknown as import('idb-keyval').UseStore;

    await clearAllDraftData(mockStore);

    expect(window.sessionStorage.getItem('visarethink.session.v1')).toBeNull();
    expect(window.sessionStorage.getItem('unrelated_session')).toBe('keep');
  });

  it('handles store clearing errors gracefully without throwing', async () => {
    const errorStore = {
      clear: vi.fn().mockRejectedValue(new Error('IndexedDB failure')),
    } as unknown as import('idb-keyval').UseStore;

    await expect(clearAllDraftData(errorStore)).resolves.not.toThrow();
  });
});
