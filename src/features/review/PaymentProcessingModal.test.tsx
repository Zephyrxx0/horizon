import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { PaymentProcessingModal } from './PaymentProcessingModal';

describe('PaymentProcessingModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <PaymentProcessingModal isOpen={false} stepIndex={0} amount={8500} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders accessible modal dialog with current step and amount', async () => {
    const { container } = render(
      <PaymentProcessingModal isOpen={true} stepIndex={1} amount={8500} />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/processing ₹8,500/i)).toBeInTheDocument();
    expect(screen.getByText(/authorizing with your bank/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
