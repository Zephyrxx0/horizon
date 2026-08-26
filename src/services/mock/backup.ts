import type { IBackupService, DraftBackupSnapshot, ServiceOutcome } from '../types';
import { resolveWithScenario } from './scenarios';

const STORAGE_KEY = 'visarethink_draft_backups';

// Character set excluding ambiguous characters (I, O, 0, 1)
const CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Generates a human-friendly 8-character code: VR-XXXXXX (e.g. VR-784291)
 */
export function generateBackupCode(): string {
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * CODE_CHARS.length);
    suffix += CODE_CHARS[randomIndex];
  }
  return `VR-${suffix}`;
}

export const SEEDED_DEMO_BACKUPS: Record<string, DraftBackupSnapshot> = {
  'VR-DEMO01': {
    code: 'VR-DEMO01',
    createdAt: '2026-08-25T10:00:00.000Z',
    email: 'applicant.demo@example.com',
    answers: {
      destinationCountry: 'United States',
      tripPurpose: 'Education',
      visaType: 'Student Visa (F-1)',
      visaName: 'Student Visa',
      stayDuration: 'Long-term (1-5 years)',
      givenNames: 'Priya',
      surname: 'Sharma',
      passportNumber: 'A1234567',
      dobDay: '15',
      dobMonth: '08',
      dobYear: '1998',
      nationality: 'India',
      passportIssueDate: '2022-01-10',
      passportExpiryDate: '2032-01-09',
      phoneNumber: '+919876543210',
      email: 'applicant.demo@example.com',
      currentAddress: '42 MG Road, Bengaluru, Karnataka',
      intendedArrivalDate: '2026-09-01',
    },
    documentMeta: [
      {
        slotId: 'passport-bio',
        fileName: 'passport_bio_page.jpg',
        fileSize: 1240000,
        fileType: 'image/jpeg',
      },
      {
        slotId: 'passport-address',
        fileName: 'passport_address_page.jpg',
        fileSize: 1100000,
        fileType: 'image/jpeg',
      },
    ],
  },
};

export class MockBackupService implements IBackupService {
  private getStorage(): Record<string, DraftBackupSnapshot> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...SEEDED_DEMO_BACKUPS };
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...SEEDED_DEMO_BACKUPS };
      }
      return { ...SEEDED_DEMO_BACKUPS, ...JSON.parse(raw) };
    } catch {
      return { ...SEEDED_DEMO_BACKUPS };
    }
  }

  private setStorage(data: Record<string, DraftBackupSnapshot>): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // localStorage quota or security error
      }
    }
  }

  async createBackup(
    email: string,
    answers: Record<string, unknown>,
    documentMeta?: DraftBackupSnapshot['documentMeta'],
  ): Promise<ServiceOutcome<{ code: string; createdAt: string }>> {
    const code = generateBackupCode();
    const createdAt = new Date().toISOString();

    const snapshot: DraftBackupSnapshot = {
      code,
      createdAt,
      email: email.trim().toLowerCase(),
      answers: { ...answers },
      documentMeta: documentMeta ? [...documentMeta] : undefined,
    };

    const storage = this.getStorage();
    storage[code.toUpperCase()] = snapshot;
    this.setStorage(storage);

    return resolveWithScenario('backup', () => ({ code, createdAt }));
  }

  async restoreBackup(code: string): Promise<ServiceOutcome<DraftBackupSnapshot>> {
    const normalizedCode = (code || '').trim().toUpperCase();
    const storage = this.getStorage();
    const snapshot = storage[normalizedCode];

    if (!snapshot) {
      return {
        status: 'failure',
        code: 'NOT_FOUND',
        message: 'Backup code not found or expired.',
      };
    }

    return resolveWithScenario('backup', () => ({ ...snapshot }));
  }
}
