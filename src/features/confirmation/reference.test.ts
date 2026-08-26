import { describe, it, expect } from 'vitest';
import {
  generateReferenceNumber,
  isValidReferenceNumber,
  formatReferenceNumber,
  REFERENCE_REGEX,
} from './reference';

describe('Reference Number Utilities', () => {
  describe('generateReferenceNumber', () => {
    it('generates a string matching the VR-YYYY-XXXXXX format with current year by default', () => {
      const currentYear = new Date().getFullYear();
      const ref = generateReferenceNumber();
      expect(ref).toMatch(REFERENCE_REGEX);
      expect(ref.startsWith(`VR-${currentYear}-`)).toBe(true);
      expect(ref.length).toBe(14);
    });

    it('supports custom year parameter', () => {
      const ref = generateReferenceNumber(2027);
      expect(ref).toMatch(/^VR-2027-\d{6}$/);
    });

    it('generates unique numbers across calls', () => {
      const ref1 = generateReferenceNumber();
      const ref2 = generateReferenceNumber();
      expect(ref1).not.toBe(ref2);
    });
  });

  describe('isValidReferenceNumber', () => {
    it('validates correct reference strings', () => {
      expect(isValidReferenceNumber('VR-2026-849201')).toBe(true);
      expect(isValidReferenceNumber('vr-2026-849201')).toBe(true);
      expect(isValidReferenceNumber('  VR-2025-102938  ')).toBe(true);
    });

    it('rejects invalid or malformed strings', () => {
      expect(isValidReferenceNumber('')).toBe(false);
      expect(isValidReferenceNumber('VR-26-849201')).toBe(false);
      expect(isValidReferenceNumber('VR-2026-84920')).toBe(false);
      expect(isValidReferenceNumber('VR-2026-8492019')).toBe(false);
      expect(isValidReferenceNumber(null as unknown as string)).toBe(false);
      expect(isValidReferenceNumber(undefined as unknown as string)).toBe(false);
    });
  });

  describe('formatReferenceNumber', () => {
    it('formats raw digits and characters cleanly into VR-YYYY-XXXXXX', () => {
      expect(formatReferenceNumber('VR2026849201')).toBe('VR-2026-849201');
      expect(formatReferenceNumber('vr-2026-849201')).toBe('VR-2026-849201');
      expect(formatReferenceNumber('2026849201')).toBe('VR-2026-849201');
    });

    it('formats partial input progressively', () => {
      expect(formatReferenceNumber('2026')).toBe('VR-2026');
      expect(formatReferenceNumber('20268')).toBe('VR-2026-8');
      expect(formatReferenceNumber('')).toBe('');
    });
  });
});
