import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { SaveIndicator } from './SaveIndicator';

describe('SaveIndicator component', () => {
  it('renders exact UI-SPEC copy across all 6 states', async () => {
    const { container, rerender } = render(<SaveIndicator state="idle" isOnline={true} />);
    expect(screen.getByText('Not saved')).toBeInTheDocument();

    rerender(<SaveIndicator state="dirty" isOnline={true} />);
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();

    rerender(<SaveIndicator state="saving" isOnline={true} />);
    expect(screen.getByText('Saving…')).toBeInTheDocument();

    rerender(<SaveIndicator state="saved" isOnline={true} />);
    expect(screen.getByText('Saved')).toBeInTheDocument();

    rerender(<SaveIndicator state="saved" isOnline={false} />);
    expect(screen.getByText('Saved Offline')).toBeInTheDocument();

    rerender(<SaveIndicator state="offline" isOnline={true} />);
    expect(screen.getByText('Saved Offline')).toBeInTheDocument();

    const onRetry = vi.fn();
    rerender(<SaveIndicator state="error" onRetry={onRetry} isOnline={true} />);
    const retryBtn = screen.getByRole('button', { name: /couldn't save — retry/i });
    expect(retryBtn).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles click to backup draft when saved offline', async () => {
    const onClickSaved = vi.fn();
    render(<SaveIndicator state="saved" isOnline={false} onClickSaved={onClickSaved} />);

    const badgeBtn = screen.getByTestId('save-indicator-badge');
    expect(badgeBtn).toBeInTheDocument();
    expect(screen.getByText('Saved Offline')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(badgeBtn);
    expect(onClickSaved).toHaveBeenCalledTimes(1);
  });
});
