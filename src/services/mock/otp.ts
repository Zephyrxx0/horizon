import type { IOtpService, ServiceOutcome } from '../types';
import { MOCK_OTP_CODE } from '../types';
import { resolveWithScenario } from './scenarios';

export class MockOtpService implements IOtpService {
  async send(phone: string): Promise<ServiceOutcome<{ delivered: true }>> {
    return resolveWithScenario('otp', () => {
      console.log(`[mock:otp] Verification code sent to ${phone}: ${MOCK_OTP_CODE}`);
      return { delivered: true as const };
    });
  }

  async verify(code: string): Promise<ServiceOutcome<{ verified: boolean }>> {
    return resolveWithScenario('otp', () => {
      const verified = code === MOCK_OTP_CODE;
      return { verified };
    });
  }
}
