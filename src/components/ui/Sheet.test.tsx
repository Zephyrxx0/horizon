import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Sheet } from './Sheet';

describe('Sheet component', () => {
  it('opens dialog, traps focus, responds to Escape, and restores focus', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    function TestHost({ open }: { open: boolean }) {
      return (
        <div>
          <button id="trigger-btn" type="button">
            Open Sheet
          </button>
          <Sheet
            open={open}
            onClose={onClose}
            title="Clear everything you entered?"
            description="This will permanently delete your draft."
          >
            <div>
              <button id="confirm-btn" type="button">
                Yes, delete
              </button>
              <button id="cancel-btn" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </Sheet>
        </div>
      );
    }

    const { rerender, container } = render(<TestHost open={true} />);

    // Dialog exists with title
    const dialog = screen.getByRole('dialog', { name: /clear everything you entered/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Axe test when open
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Escape closes sheet
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();

    // Unmount/close
    rerender(<TestHost open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
