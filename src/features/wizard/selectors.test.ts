import { describe, it, expect } from 'vitest';
import {
  deriveStepStatus,
  deriveStepStatuses,
  deriveProgress,
  isValidPassport,
  isValidEmail,
  isValidPhone,
  isExpiryValid,
} from './selectors';

describe('Wizard Selectors and Validation Predicates', () => {
  describe('validation predicates', () => {
    it('validates passport format strictly', () => {
      expect(isValidPassport('AB1234567')).toBe(true);
      expect(isValidPassport(' ab1234567 ')).toBe(true); // trims and uppercases
      expect(isValidPassport('A123456')).toBe(false); // too short
      expect(isValidPassport('123456789')).toBe(false); // missing letters
    });

    it('validates email format', () => {
      expect(isValidEmail('applicant@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
    });

    it('validates phone numbers with at least 10 digits', () => {
      expect(isValidPhone('+1 (555) 000-1234')).toBe(true);
      expect(isValidPhone('123456789')).toBe(false);
    });

    it('validates passport expiry date is >= 6 months from now', () => {
      const farFuture = new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString();
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      expect(isExpiryValid(farFuture)).toBe(true);
      expect(isExpiryValid(nextMonth)).toBe(false);
    });
  });

  describe('deriveStepStatus & needs-attention logic', () => {
    it('returns needs-attention on dependent step if upstream trip answer is cleared', () => {
      // Step 2 has passport entered, but tripType is missing
      const answers = { passportNumber: 'AB1234567' };
      const status = deriveStepStatus('dependent', answers, 'trip');
      expect(status).toBe('needs-attention');
    });

    it('derives step statuses and progress metrics purely from answers', () => {
      const answersStep1Only = { tripType: 'tourist' };
      const statuses = deriveStepStatuses(answersStep1Only, 'dependent');

      expect(statuses.trip).toBe('complete');
      expect(statuses.dependent).toBe('current');
      expect(statuses.review).toBe('incomplete');

      const progress = deriveProgress(answersStep1Only);
      expect(progress.completed).toBe(1);
      expect(progress.percent).toBe(33);
      expect(progress.minutesRemaining).toBe(4); // 3m dependent + 1m review
    });
  });
});
