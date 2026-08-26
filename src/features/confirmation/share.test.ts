import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateShareText,
  generateWhatsAppShareUrl,
  copyToClipboard,
  shareApplicationReference,
} from './share';

describe('Share Utilities', () => {
  const reference = 'VR-2026-849201';
  const visaType = 'Tourist Visa';
  const destination = 'United States';

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateShareText', () => {
    it('formats readable message with reference number and visa category', () => {
      const text = generateShareText(reference, visaType, destination);
      expect(text).toContain(reference);
      expect(text).toContain(visaType);
      expect(text).toContain(destination);
    });
  });

  describe('generateWhatsAppShareUrl', () => {
    it('creates encoded wa.me URL', () => {
      const url = generateWhatsAppShareUrl(reference, visaType, destination);
      expect(url.startsWith('https://wa.me/?text=')).toBe(true);
      expect(url).toContain(encodeURIComponent(reference));
    });
  });

  describe('copyToClipboard', () => {
    it('uses navigator.clipboard when available', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const result = await copyToClipboard('test-text');
      expect(result).toBe(true);
      expect(writeTextMock).toHaveBeenCalledWith('test-text');
    });

    it('returns false for empty text', async () => {
      const result = await copyToClipboard('');
      expect(result).toBe(false);
    });
  });

  describe('shareApplicationReference', () => {
    it('calls navigator.share when available', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        configurable: true,
        writable: true,
      });

      const result = await shareApplicationReference(reference, visaType, destination);
      expect(result.shared).toBe(true);
      expect(result.method).toBe('native');
      expect(shareMock).toHaveBeenCalled();
    });

    it('falls back to window.open with WhatsApp URL when navigator.share is not present', async () => {
      // Remove share
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        configurable: true,
        writable: true,
      });
      const openMock = vi.fn();
      window.open = openMock;

      const result = await shareApplicationReference(reference, visaType, destination);
      expect(result.shared).toBe(true);
      expect(result.method).toBe('whatsapp');
      expect(openMock).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/?text='),
        '_blank',
        'noopener,noreferrer',
      );
    });
  });
});
