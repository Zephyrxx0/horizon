import type { IPassportLookupService, PassportRecord, ServiceOutcome } from '../types';
import { resolveWithScenario } from './scenarios';

export class MockPassportLookupService implements IPassportLookupService {
  async lookup(passportNumber: string): Promise<ServiceOutcome<PassportRecord>> {
    if (!passportNumber) {
      return {
        status: 'failure',
        code: 'INVALID_INPUT',
        message: 'Passport number is required.',
      };
    }

    return resolveWithScenario('passportLookup', () => ({
      holderName: 'JOHN DOE',
      nationality: 'United States',
      dateOfBirth: '1988-05-12',
    }));
  }
}
