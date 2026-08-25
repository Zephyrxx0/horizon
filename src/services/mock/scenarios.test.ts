import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getService,
  PORTS,
  type IPassportLookupService,
  type IOtpService,
  type INotificationService,
  MOCK_OTP_CODE,
} from '../index';
import { setScenarios, resetScenarios } from './scenarios';

describe('Service Scenario Engine and Mock Adapters', () => {
  beforeEach(() => {
    // Set minimal latency for ultra-fast unit testing
    setScenarios({ latencyMs: [1, 5] });
  });

  afterEach(() => {
    resetScenarios();
  });

  it('resolves success outcome with data by default', async () => {
    const passportService = getService<IPassportLookupService>(PORTS.passportLookup);
    const outcome = await passportService.lookup('A12345678');

    expect(outcome.status).toBe('success');
    if (outcome.status === 'success') {
      expect(outcome.data.holderName).toBe('JOHN DOE');
      expect(outcome.data.nationality).toBe('United States');
    }
  });

  it('resolves failure outcome when configured', async () => {
    setScenarios({
      defaultOutcome: 'failure',
      failureCode: 'INVALID_PASSPORT',
      failureMessage: 'Passport details not found',
    });

    const passportService = getService<IPassportLookupService>(PORTS.passportLookup);
    const outcome = await passportService.lookup('Z99999999');

    expect(outcome.status).toBe('failure');
    if (outcome.status === 'failure') {
      expect(outcome.code).toBe('INVALID_PASSPORT');
      expect(outcome.message).toBe('Passport details not found');
    }
  });

  it('resolves timeout outcome when configured', async () => {
    setScenarios({ defaultOutcome: 'timeout' });

    const passportService = getService<IPassportLookupService>(PORTS.passportLookup);
    const outcome = await passportService.lookup('A12345678');

    expect(outcome.status).toBe('timeout');
  });

  it('verifies OTP codes accurately using MOCK_OTP_CODE', async () => {
    const otpService = getService<IOtpService>(PORTS.otp);

    const validOutcome = await otpService.verify(MOCK_OTP_CODE);
    expect(validOutcome.status).toBe('success');
    if (validOutcome.status === 'success') {
      expect(validOutcome.data.verified).toBe(true);
    }

    const invalidOutcome = await otpService.verify('123456');
    expect(invalidOutcome.status).toBe('success');
    if (invalidOutcome.status === 'success') {
      expect(invalidOutcome.data.verified).toBe(false);
    }
  });

  it('logs notifications to console without throwing', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const notificationService = getService<INotificationService>(PORTS.notification);

    await notificationService.sendEmail('user@example.com', 'application_received', {
      ref: 'VRT-123',
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[mock:email]'),
      expect.anything(),
    );

    consoleSpy.mockRestore();
  });
});
