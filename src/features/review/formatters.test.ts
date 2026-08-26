import { describe, it, expect } from 'vitest';
import {
  formatCardNumber,
  formatCardExpiry,
  formatCvv,
  isValidUpiVpa,
  isValidCardNumber,
  isValidCardExpiry,
  isValidCvv,
  getCardBrand,
} from './formatters';

describe('review and payment formatters', () => {
  describe('formatCardNumber', () => {
    it('formats raw digits into 4-digit grouped blocks', () => {
      expect(formatCardNumber('4111222233334444')).toBe('4111 2222 3333 4444');
      expect(formatCardNumber('41112222')).toBe('4111 2222');
      expect(formatCardNumber('4111')).toBe('4111');
    });

    it('ignores non-digit characters and caps at 16 digits', () => {
      expect(formatCardNumber('4111-2222-3333-4444-9999')).toBe('4111 2222 3333 4444');
    });
  });

  describe('formatCardExpiry', () => {
    it('auto-formats MM/YY', () => {
      expect(formatCardExpiry('1228')).toBe('12/28');
      expect(formatCardExpiry('12')).toBe('12');
      expect(formatCardExpiry('1')).toBe('1');
    });
  });

  describe('formatCvv', () => {
    it('strips non-digits and caps at 4 characters', () => {
      expect(formatCvv('123')).toBe('123');
      expect(formatCvv('12345')).toBe('1234');
      expect(formatCvv('abc')).toBe('');
    });
  });

  describe('isValidUpiVpa', () => {
    it('validates correct UPI VPA addresses', () => {
      expect(isValidUpiVpa('applicant@okhdfcbank')).toBe(true);
      expect(isValidUpiVpa('9876543210@paytm')).toBe(true);
      expect(isValidUpiVpa('user.name-1@upi')).toBe(true);
    });

    it('rejects invalid UPI VPAs', () => {
      expect(isValidUpiVpa('invalid-vpa')).toBe(false);
      expect(isValidUpiVpa('@okaxis')).toBe(false);
      expect(isValidUpiVpa('user@')).toBe(false);
      expect(isValidUpiVpa('')).toBe(false);
    });
  });

  describe('isValidCardNumber', () => {
    it('validates card numbers using Luhn check', () => {
      expect(isValidCardNumber('4111111111111111')).toBe(true);
      expect(isValidCardNumber('4111 1111 1111 1111')).toBe(true);
    });

    it('rejects invalid card numbers', () => {
      expect(isValidCardNumber('4111111111111112')).toBe(false);
      expect(isValidCardNumber('123')).toBe(false);
      expect(isValidCardNumber('')).toBe(false);
    });
  });

  describe('isValidCardExpiry', () => {
    it('validates future expiry date', () => {
      expect(isValidCardExpiry('12/30')).toBe(true);
      expect(isValidCardExpiry('1230')).toBe(true);
    });

    it('rejects expired or invalid month dates', () => {
      expect(isValidCardExpiry('13/30')).toBe(false);
      expect(isValidCardExpiry('00/30')).toBe(false);
      expect(isValidCardExpiry('01/20')).toBe(false); // 2020 past
    });
  });

  describe('isValidCvv', () => {
    it('validates 3 or 4 digit CVVs', () => {
      expect(isValidCvv('123')).toBe(true);
      expect(isValidCvv('1234')).toBe(true);
      expect(isValidCvv('12')).toBe(false);
      expect(isValidCvv('12345')).toBe(false);
    });
  });

  describe('getCardBrand', () => {
    it('detects Visa, Mastercard, and RuPay card brands', () => {
      expect(getCardBrand('4111 2222')).toBe('visa');
      expect(getCardBrand('5123 4567')).toBe('mastercard');
      expect(getCardBrand('6081 2345')).toBe('rupay');
      expect(getCardBrand('3712 3456')).toBe('unknown');
    });
  });
});
