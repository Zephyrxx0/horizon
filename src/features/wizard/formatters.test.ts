import { describe, it, expect } from 'vitest';
import { formatPassportNumber, formatPhoneNumber, cleanPhoneDigits } from './formatters';

describe('Wizard Input Formatters', () => {
  describe('formatPassportNumber', () => {
    it('uppercases and enforces 2 letters + 7 digits', () => {
      expect(formatPassportNumber('aa1234567')).toBe('AA1234567');
      expect(formatPassportNumber('a a 1 2 3 4 5 6 7')).toBe('AA1234567');
      expect(formatPassportNumber('z9999999')).toBe('Z999999');
      expect(formatPassportNumber('AB12345678999')).toBe('AB1234567');
    });

    it('handles empty or partial inputs', () => {
      expect(formatPassportNumber('')).toBe('');
      expect(formatPassportNumber('a')).toBe('A');
      expect(formatPassportNumber('ab')).toBe('AB');
      expect(formatPassportNumber('ab123')).toBe('AB123');
    });
  });

  describe('formatPhoneNumber', () => {
    it('auto-prefixes +91 and formats 10 digits as +91 XXXXX XXXXX', () => {
      expect(formatPhoneNumber('')).toBe('+91 ');
      expect(formatPhoneNumber('9876543210')).toBe('+91 98765 43210');
      expect(formatPhoneNumber('+91 98765 43210')).toBe('+91 98765 43210');
      expect(formatPhoneNumber('98765')).toBe('+91 98765');
      expect(formatPhoneNumber('987654')).toBe('+91 98765 4');
    });

    it('cleanPhoneDigits extracts 10 digits', () => {
      expect(cleanPhoneDigits('+91 98765 43210')).toBe('9876543210');
      expect(cleanPhoneDigits('9876543210')).toBe('9876543210');
      expect(cleanPhoneDigits('')).toBe('');
    });
  });
});
