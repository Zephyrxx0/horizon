import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { ProgressStepper, type StepItem } from './ProgressStepper';

describe('ProgressStepper component', () => {
  const steps: StepItem[] = [
    { id: '1', label: 'Passport Details', status: 'complete' },
    { id: '2', label: 'Personal Information', status: 'current' },
    { id: '3', label: 'Document Upload', status: 'needs-attention' },
    { id: '4', label: 'Payment', status: 'incomplete' },
  ];

  it('renders all four step statuses with accessible labels and polite live region', async () => {
    const { container, rerender } = render(<ProgressStepper steps={steps} />);

    // Check live region announcement
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveTextContent(/Step 2 of 4: Personal Information/i);

    // Current step has aria-current="step"
    const currentItem = screen.getByText('Personal Information').closest('li');
    expect(currentItem).toHaveAttribute('aria-current', 'step');

    // Axe test with all 4 statuses simultaneously
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Rerender with next step
    const updatedSteps: StepItem[] = [
      { id: '1', label: 'Passport Details', status: 'complete' },
      { id: '2', label: 'Personal Information', status: 'complete' },
      { id: '3', label: 'Document Upload', status: 'current' },
      { id: '4', label: 'Payment', status: 'incomplete' },
    ];
    rerender(<ProgressStepper steps={updatedSteps} />);

    expect(screen.getByRole('status')).toHaveTextContent(/Step 3 of 4: Document Upload/i);
  });
});
