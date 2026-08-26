import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockBackupService, generateBackupCode } from './backup';
import { setScenarios, resetScenarios } from './scenarios';

describe('MockBackupService', () => {
  let backupService: MockBackupService;

  beforeEach(() => {
    localStorage.clear();
    setScenarios({ latencyMs: [1, 5] });
    backupService = new MockBackupService();
  });

  afterEach(() => {
    resetScenarios();
  });

  describe('generateBackupCode', () => {
    it('generates a valid 8-character VR-XXXXXX string', () => {
      const code = generateBackupCode();
      expect(code).toMatch(/^VR-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
      expect(code.length).toBe(9);
    });

    it('generates unique codes across calls', () => {
      const code1 = generateBackupCode();
      const code2 = generateBackupCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('createBackup & restoreBackup', () => {
    it('creates and restores a newly generated backup snapshot', async () => {
      const answers = { givenNames: 'Rahul', surname: 'Dravid', passportNumber: 'B9876543' };
      const docMeta = [
        { slotId: 'passport-bio', fileName: 'bio.jpg', fileSize: 5000, fileType: 'image/jpeg' },
      ];

      const createRes = await backupService.createBackup('rahul@example.com', answers, docMeta);
      expect(createRes.status).toBe('success');
      if (createRes.status !== 'success') return;

      const code = createRes.data.code;
      expect(code).toBeDefined();

      const restoreRes = await backupService.restoreBackup(code);
      expect(restoreRes.status).toBe('success');
      if (restoreRes.status !== 'success') return;

      expect(restoreRes.data.email).toBe('rahul@example.com');
      expect(restoreRes.data.answers).toEqual(answers);
      expect(restoreRes.data.documentMeta).toEqual(docMeta);
    });

    it('restores pre-seeded demo draft VR-DEMO01', async () => {
      const restoreRes = await backupService.restoreBackup('VR-DEMO01');
      expect(restoreRes.status).toBe('success');
      if (restoreRes.status !== 'success') return;

      expect(restoreRes.data.code).toBe('VR-DEMO01');
      expect(restoreRes.data.answers.givenNames).toBe('Priya');
      expect(restoreRes.data.answers.destinationCountry).toBe('United States');
    });

    it('is case-insensitive and trims whitespace on restore', async () => {
      const restoreRes = await backupService.restoreBackup('  vr-demo01  ');
      expect(restoreRes.status).toBe('success');
      if (restoreRes.status !== 'success') return;

      expect(restoreRes.data.code).toBe('VR-DEMO01');
    });

    it('returns failure for non-existent backup code', async () => {
      const restoreRes = await backupService.restoreBackup('VR-NONEXIST');
      expect(restoreRes.status).toBe('failure');
    });
  });
});
