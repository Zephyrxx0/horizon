import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { FeeBreakdownCard } from './FeeBreakdownCard';

describe('FeeBreakdownCard', () => {
  const mockFees = {
    processingFee: 2000,
    governmentFee: 5000,
    platformFee: 1500,
    totalAmount: 8500,
    currency: 'INR',
  };

  it('renders itemized fee rows, trust badge, and total amount', async () => {
    const { container } = render(<FeeBreakdownCard feeBreakdown={mockFees} />);

    expect(screen.getByText(/total amount due/i)).toBeInTheDocument();
    expect(screen.getByText(/zero hidden charges/i)).toBeInTheDocument();
    expect(screen.getByText('₹2,000')).toBeInTheDocument();
    expect(screen.getByText('₹5,000')).toBeInTheDocument();
    expect(screen.getByText('₹1,500')).toBeInTheDocument();
    expect(screen.getByText('₹8,500')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
