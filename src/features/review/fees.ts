import { GOVERNMENT_FEE, PLATFORM_FEE, processingFeeFor } from '../../services/types';
import type { FeeBreakdown } from './types';

export function calculateFeeBreakdown(answers: Record<string, unknown>): FeeBreakdown {
  const country = String(answers.destinationCountry || 'US');
  const visaType = String(answers.visaType || answers.visaId || 'Tourist Visa');

  const processingFee = processingFeeFor(country, visaType);
  const governmentFee = GOVERNMENT_FEE;
  const platformFee = PLATFORM_FEE;
  const totalAmount = processingFee + governmentFee + platformFee;

  return {
    processingFee,
    governmentFee,
    platformFee,
    totalAmount,
    currency: 'INR',
  };
}
