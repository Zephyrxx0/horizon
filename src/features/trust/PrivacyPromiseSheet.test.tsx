import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrivacyPromiseSheet, PRIVACY_SECTIONS } from './PrivacyPromiseSheet';

describe('PrivacyPromiseSheet Component', () => {
  it('renders privacy promise dialog with all core sections when open', () => {
    const handleClose = vi.fn();
    render(<PrivacyPromiseSheet open={true} onClose={handleClose} />);

    expect(screen.getByText(/Our Privacy & Data Protection Promise/i)).toBeInTheDocument();
    expect(screen.getByText(/Government-Grade Client-Side Privacy/i)).toBeInTheDocument();

    PRIVACY_SECTIONS.forEach((section) => {
      expect(screen.getByText(section.title)).toBeInTheDocument();
    });
  });

  it('does not render content when closed', () => {
    const handleClose = vi.fn();
    render(<PrivacyPromiseSheet open={false} onClose={handleClose} />);

    expect(screen.queryByText(/Our Privacy & Data Protection Promise/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button or confirmation button is clicked', () => {
    const handleClose = vi.fn();
    render(<PrivacyPromiseSheet open={true} onClose={handleClose} />);

    const understandBtn = screen.getByRole('button', {
      name: /I Understand My Privacy Guarantees/i,
    });
    fireEvent.click(understandBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
