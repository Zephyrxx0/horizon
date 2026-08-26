import type {
  IPaymentService,
  PaymentInput,
  PaymentIntent,
  PaymentResult,
  ServiceOutcome,
} from '../types';
import { resolveWithScenario } from './scenarios';

export class MockPaymentService implements IPaymentService {
  async initiate(input: PaymentInput): Promise<ServiceOutcome<PaymentIntent>> {
    return resolveWithScenario('payment', () => ({
      intentId: `pi_${Date.now()}_${input.reference.slice(0, 6)}`,
      amountRupees: input.amountRupees,
      status: 'created',
    }));
  }

  async confirm(intentId: string): Promise<ServiceOutcome<PaymentResult>> {
    return resolveWithScenario('payment', () => ({
      reference: `PAY-${intentId.slice(-6).toUpperCase()}`,
      status: 'success',
      paidAt: new Date().toISOString(),
    }));
  }

  async retry(intentId: string): Promise<ServiceOutcome<PaymentResult>> {
    return resolveWithScenario('payment', () => ({
      reference: `PAY-${intentId.slice(-6).toUpperCase()}`,
      status: 'success',
      paidAt: new Date().toISOString(),
    }));
  }
}
