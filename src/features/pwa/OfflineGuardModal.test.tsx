import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { OfflineGuardModal } from './OfflineGuardModal';

describe('OfflineGuardModal component', () => {
  it('does not render when open is false', () => {
    render(<OfflineGuardModal open={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/internet connection required/i)).not.toBeInTheDocument();
  });

  it('renders modal with draft safety reassurance and passes axe check', async () => {
    const onClose = vi.fn();
    const onRetry = vi.fn();
    const { baseElement } = render(
      <OfflineGuardModal
        open={true}
        onClose={onClose}
        onRetry={onRetry}
        actionName="Payment Processing"
      />,
    );

    expect(screen.getByText(/internet connection required/i)).toBeInTheDocument();
    expect(screen.getByText(/your draft is completely safe/i)).toBeInTheDocument();
    expect(screen.getByText(/payment processing requires live communication/i)).toBeInTheDocument();

    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();

    const user = userEvent.setup();
    const retryBtn = screen.getByTestId('offline-guard-retry-btn');
    await user.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    const closeBtn = screen.getByTestId('offline-guard-close-btn');
    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
