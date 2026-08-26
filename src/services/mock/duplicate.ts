/**
 * Hybrid Duplicate Application Detection Registry
 * Cross-checks active submissions against seeded demo passports and local browser storage.
 */

export interface ApplicationSubmissionRecord {
  referenceNumber: string;
  passportNumber: string;
  applicantName: string;
  visaType: string;
  country: string;
  submittedAt: string;
  status: string;
}

const STORAGE_KEY = 'visarethink_submitted_applications';

export const SEEDED_DUPLICATE_PASSPORTS: Record<string, ApplicationSubmissionRecord> = {
  Z1234567: {
    referenceNumber: 'VR-2026-102938',
    passportNumber: 'Z1234567',
    applicantName: 'Vikram Seth',
    visaType: 'Tourist Visa',
    country: 'United Kingdom',
    submittedAt: '2026-08-22T14:30:00.000Z',
    status: 'Documents Under Review',
  },
  ZZ1234567: {
    referenceNumber: 'VR-2026-102938',
    passportNumber: 'ZZ1234567',
    applicantName: 'Vikram Seth',
    visaType: 'Tourist Visa',
    country: 'United Kingdom',
    submittedAt: '2026-08-22T14:30:00.000Z',
    status: 'Documents Under Review',
  },
  T9876543: {
    referenceNumber: 'VR-2026-554433',
    passportNumber: 'T9876543',
    applicantName: 'Ananya Roy',
    visaType: 'Student Visa (F-1)',
    country: 'United States',
    submittedAt: '2026-08-24T09:15:00.000Z',
    status: 'Interview Scheduling',
  },
};

/**
 * Retrieves all stored locally submitted applications from localStorage.
 */
export function getStoredSubmissions(): ApplicationSubmissionRecord[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Persists a new submitted application record into localStorage.
 */
export function saveSubmittedApplication(record: ApplicationSubmissionRecord): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const current = getStoredSubmissions();
    // Prepend new submission and deduplicate by referenceNumber
    const filtered = current.filter((r) => r.referenceNumber !== record.referenceNumber);
    const updated = [record, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota or permission error
  }
}

/**
 * Clears stored submissions (useful for test resets).
 */
export function clearStoredSubmissions(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Checks whether a given passport number has an active in-progress or submitted application.
 */
export function checkForDuplicateApplication(passportNumber: string): {
  isDuplicate: boolean;
  record?: ApplicationSubmissionRecord;
} {
  if (!passportNumber || typeof passportNumber !== 'string') {
    return { isDuplicate: false };
  }

  const normalized = passportNumber
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (normalized.length < 8 || normalized.length > 9) {
    return { isDuplicate: false };
  }

  // 1. Check Seeded Active Passports
  if (SEEDED_DUPLICATE_PASSPORTS[normalized]) {
    return {
      isDuplicate: true,
      record: { ...SEEDED_DUPLICATE_PASSPORTS[normalized] },
    };
  }

  // 2. Check Locally Submitted Applications
  const stored = getStoredSubmissions();
  const found = stored.find(
    (s) =>
      s.passportNumber
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '') === normalized,
  );

  if (found) {
    return {
      isDuplicate: true,
      record: { ...found },
    };
  }

  return { isDuplicate: false };
}

/**
 * Retrieves a single submitted application record by reference number.
 */
export function getSubmittedApplication(
  referenceNumber: string,
): ApplicationSubmissionRecord | undefined {
  const normalized = referenceNumber.trim().toUpperCase();

  // Check seeded data
  const seeded = Object.values(SEEDED_DUPLICATE_PASSPORTS).find(
    (r) => r.referenceNumber.toUpperCase() === normalized,
  );
  if (seeded) return seeded;

  // Check local storage
  const stored = getStoredSubmissions();
  return stored.find((r) => r.referenceNumber.trim().toUpperCase() === normalized);
}
