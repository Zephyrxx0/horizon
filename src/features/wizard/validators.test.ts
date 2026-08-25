import { describe, it, expect } from 'vitest';
import {
  isValidPassport,
  isValidEmail,
  isValidPhone,
  isValidPincode,
  getPassportExpiryStatus,
  validateVisaSelectionStep,
  validateIdentityStep,
  validateContactStep,
  validateVisaSpecificStep,
  getConstructiveError,
} from './validators';

describe('Wizard Validators', () => {
  describe('isValidPassport', () => {
    it('validates standard 2-letter + 7-digit passport numbers', () => {
      expect(isValidPassport('AA1234567')).toBe(true);
      expect(isValidPassport('Z9999999')).toBe(false); // only 1 letter
      expect(isValidPassport('ABC123456')).toBe(false); // 3 letters
      expect(isValidPassport('AA123456')).toBe(false); // 6 digits
      expect(isValidPassport('AA12345678')).toBe(false); // 8 digits
      expect(isValidPassport('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('validates 10-digit Indian mobile numbers', () => {
      expect(isValidPhone('9876543210')).toBe(true);
      expect(isValidPhone('+91 98765 43210')).toBe(true);
      expect(isValidPhone('5876543210')).toBe(false); // starts with 5
      expect(isValidPhone('123')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('validates proper email addresses', () => {
      expect(isValidEmail('applicant@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPincode', () => {
    it('validates 6-digit Indian PIN codes', () => {
      expect(isValidPincode('560001')).toBe(true);
      expect(isValidPincode('110001')).toBe(true);
      expect(isValidPincode('56001')).toBe(false);
      expect(isValidPincode('5600001')).toBe(false);
    });
  });

  describe('getPassportExpiryStatus', () => {
    it('flags expired passports', () => {
      const pastDate = '2020-01-01';
      const status = getPassportExpiryStatus(pastDate);
      expect(status.isValid).toBe(false);
      expect(status.isExpired).toBe(true);
    });

    it('warns on passport expiring within 6 months', () => {
      const threeMonthsAhead = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
      const status = getPassportExpiryStatus(threeMonthsAhead);
      expect(status.isValid).toBe(true);
      expect(status.isNearExpiry).toBe(true);
      expect(status.message).toContain('6 months validity');
    });

    it('passes for passport expiring in 2 years', () => {
      const twoYearsAhead = new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString();
      const status = getPassportExpiryStatus(twoYearsAhead);
      expect(status.isValid).toBe(true);
      expect(status.isNearExpiry).toBe(false);
      expect(status.message).toBe('');
    });
  });

  describe('Constructive error messages', () => {
    it('provides clear, actionable instructions (never generic "Invalid input")', () => {
      const err = getConstructiveError('passportNumber', 'invalid');
      expect(err).toContain('2 letters followed by 7 digits');
      expect(err).not.toBe('Invalid input');
    });
  });

  describe('Step validators', () => {
    it('validates Stage 1 (Visa Selection)', () => {
      expect(Object.keys(validateVisaSelectionStep({}))).toHaveLength(3);
      expect(
        Object.keys(
          validateVisaSelectionStep({
            destinationCountry: 'USA',
            tripPurpose: 'tourism',
            visaId: 'usa-b1b2',
          }),
        ),
      ).toHaveLength(0);
    });

    it('validates Stage 2a (Identity)', () => {
      const futureDate = new Date(Date.now() + 730 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const validIdentity = {
        firstName: 'Rahul',
        lastName: 'Sharma',
        dateOfBirth: '1995-05-15',
        gender: 'male',
        nationality: 'India',
        passportNumber: 'AA1234567',
        passportIssueDate: '2020-01-01',
        passportExpiryDate: futureDate,
      };
      expect(Object.keys(validateIdentityStep(validIdentity))).toHaveLength(0);
    });

    it('validates Stage 2b (Contact)', () => {
      expect(Object.keys(validateContactStep({})).length).toBeGreaterThan(0);
      const validContact = {
        email: 'applicant@example.com',
        phone: '+91 98765 43210',
        addressLine1: '123 MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
      };
      expect(Object.keys(validateContactStep(validContact))).toHaveLength(0);
    });

    it('validates Stage 2c (Visa Specifics)', () => {
      const validTourist = {
        visaCategory: 'tourist',
        travelStartDate: '2026-12-01',
        stayAddress: 'Grand Hotel, NYC',
      };
      expect(Object.keys(validateVisaSpecificStep(validTourist))).toHaveLength(0);
    });
  });
});
