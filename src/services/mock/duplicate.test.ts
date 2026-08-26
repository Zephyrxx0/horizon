import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkForDuplicateApplication,
  saveSubmittedApplication,
  getStoredSubmissions,
  clearStoredSubmissions,
} from './duplicate';

describe('Duplicate Application Detection', () => {
  beforeEach(() => {
    clearStoredSubmissions();
  });

  it('detects seeded demo duplicate passport Z1234567', () => {
    const result = checkForDuplicateApplication('Z1234567');
    expect(result.isDuplicate).toBe(true);
    expect(result.record).toBeDefined();
    expect(result.record?.referenceNumber).toBe('VR-2026-102938');
    expect(result.record?.applicantName).toBe('Vikram Seth');
  });

  it('detects seeded demo duplicate passport T9876543', () => {
    const result = checkForDuplicateApplication('t9876543');
    expect(result.isDuplicate).toBe(true);
    expect(result.record?.referenceNumber).toBe('VR-2026-554433');
  });

  it('returns false for unsubmitted, valid 8-character passport', () => {
    const result = checkForDuplicateApplication('P1234567');
    expect(result.isDuplicate).toBe(false);
    expect(result.record).toBeUndefined();
  });

  it('returns false for partial or malformed passport input', () => {
    expect(checkForDuplicateApplication('').isDuplicate).toBe(false);
    expect(checkForDuplicateApplication('Z1234').isDuplicate).toBe(false);
    expect(checkForDuplicateApplication('Z123456789').isDuplicate).toBe(false);
  });

  it('detects newly submitted applications stored in localStorage', () => {
    const newSubmission = {
      referenceNumber: 'VR-2026-998877',
      passportNumber: 'N7766554',
      applicantName: 'Sneha Patel',
      visaType: 'Business Visa',
      country: 'United States',
      submittedAt: new Date().toISOString(),
      status: 'Application Received',
    };

    saveSubmittedApplication(newSubmission);

    const stored = getStoredSubmissions();
    expect(stored.length).toBe(1);

    const result = checkForDuplicateApplication('N7766554');
    expect(result.isDuplicate).toBe(true);
    expect(result.record?.referenceNumber).toBe('VR-2026-998877');
    expect(result.record?.applicantName).toBe('Sneha Patel');
  });
});
