import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { ReceiptCard } from './ReceiptCard';
import type { PaymentReceiptData } from './types';

describe('ReceiptCard', () => {
  const mockReceipt: PaymentReceiptData = {
    transactionId: 'PAY-893421',
    referenceNumber: 'VRK-2026-US-893421',
    paidAt: '2026-08-26T12:00:00Z',
    applicantName: 'Rahul Sharma',
    passportNumber: 'AA1234567',
    destinationCountry: 'United States',
    visaType: 'Tourist Visa (B1/B2)',
    paymentMethod: 'upi',
    paymentMethodDetails: 'applicant@okhdfcbank',
    feeBreakdown: {
      processingFee: 2000,
      governmentFee: 5000,
      platformFee: 1500,
      totalAmount: 8500,
      currency: 'INR',
    },
  };

  it('renders receipt details, applicant data, fees, and print button', async () => {
    const handlePrint = vi.fn();
    const { container } = render(<ReceiptCard receipt={mockReceipt} onPrint={handlePrint} />);

    expect(screen.getByText(/payment receipt & confirmation/i)).toBeInTheDocument();
    expect(screen.getByText('PAY-893421')).toBeInTheDocument();
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('AA1234567')).toBeInTheDocument();
    expect(screen.getByText('₹8,500')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('triggers onPrint when print button is clicked', async () => {
    const user = userEvent.setup();
    const handlePrint = vi.fn();
    render(<ReceiptCard receipt={mockReceipt} onPrint={handlePrint} />);

    const printBtn = screen.getByRole('button', { name: /print \/ download/i });
    await user.click(printBtn);
    expect(handlePrint).toHaveBeenCalledTimes(1);
  });
});
