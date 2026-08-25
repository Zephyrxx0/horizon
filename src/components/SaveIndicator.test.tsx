import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { SaveIndicator } from './SaveIndicator';

describe('SaveIndicator component', () => {
  it('renders exact UI-SPEC copy across all 5 states', async () => {
    const { container, rerender } = render(<SaveIndicator state="idle" />);
    expect(screen.getByText('Not saved')).toBeInTheDocument();

    rerender(<SaveIndicator state="dirty" />);
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();

    rerender(<SaveIndicator state="saving" />);
    expect(screen.getByText('Saving…')).toBeInTheDocument();

    rerender(<SaveIndicator state="saved" />);
    expect(screen.getByText('Saved')).toBeInTheDocument();

    const onRetry = vi.fn();
    rerender(<SaveIndicator state="error" onRetry={onRetry} />);
    const retryBtn = screen.getByRole('button', { name: /couldn't save — retry/i });
    expect(retryBtn).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
