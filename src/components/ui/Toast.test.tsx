import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ToastProvider, useToast } from './Toast';

function ToastHarness() {
  const { show } = useToast();
  return (
    <div>
      <button onClick={() => show({ kind: 'success', message: 'Application saved successfully' })}>
        Trigger Success
      </button>
      <button onClick={() => show({ kind: 'error', message: 'Failed to save changes' })}>
        Trigger Error
      </button>
    </div>
  );
}

describe('Toast component', () => {
  it('renders accessible toast markup without violations', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    const successBtn = screen.getByText('Trigger Success');
    await user.click(successBtn);

    expect(screen.getByText('Application saved successfully')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('auto-dismisses success toast and persists error toast with fake timers', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    const successBtn = screen.getByText('Trigger Success');
    const errorBtn = screen.getByText('Trigger Error');

    act(() => {
      successBtn.click();
    });

    expect(screen.getByText('Application saved successfully')).toBeInTheDocument();

    // Fast-forward 5s
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Application saved successfully')).not.toBeInTheDocument();

    // Trigger error toast
    act(() => {
      errorBtn.click();
    });

    expect(screen.getByText('Failed to save changes')).toBeInTheDocument();

    // Advance timers by 10s: error toast must still persist
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByText('Failed to save changes')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
