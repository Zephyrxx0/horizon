import { describe, it, expect } from 'vitest';
import { calculateFeeBreakdown } from './fees';

describe('calculateFeeBreakdown', () => {
  it('calculates default fee breakdown for US Tourist Visa', () => {
    const breakdown = calculateFeeBreakdown({
      destinationCountry: 'US',
      visaType: 'Tourist Visa',
    });

    expect(breakdown.processingFee).toBe(2000);
    expect(breakdown.governmentFee).toBe(5000);
    expect(breakdown.platformFee).toBe(1500);
    expect(breakdown.totalAmount).toBe(8500);
    expect(breakdown.currency).toBe('INR');
  });

  it('calculates custom fee breakdown for US Business Visa', () => {
    const breakdown = calculateFeeBreakdown({
      destinationCountry: 'US',
      visaType: 'Business Visa',
    });

    expect(breakdown.processingFee).toBe(3500);
    expect(breakdown.governmentFee).toBe(5000);
    expect(breakdown.platformFee).toBe(1500);
    expect(breakdown.totalAmount).toBe(10000);
  });

  it('falls back gracefully if answers are empty', () => {
    const breakdown = calculateFeeBreakdown({});
    expect(breakdown.processingFee).toBe(2000);
    expect(breakdown.totalAmount).toBe(8500);
  });
});
