import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrivacyTrustCard, PRIVACY_PILLARS } from './PrivacyTrustCard';

describe('PrivacyTrustCard Component', () => {
  it('renders pre-flight trust card with 3 core pillars', () => {
    render(<PrivacyTrustCard />);

    expect(screen.getByText(/Your Data & Privacy are Protected/i)).toBeInTheDocument();

    PRIVACY_PILLARS.forEach((pillar) => {
      expect(screen.getByText(pillar.title)).toBeInTheDocument();
      expect(screen.getByText(pillar.description)).toBeInTheDocument();
    });

    expect(screen.getByText(/Read our Privacy Promise/i)).toBeInTheDocument();
  });

  it('opens PrivacyPromiseSheet when clicking "Read our Privacy Promise"', () => {
    const handleOpen = vi.fn();
    render(<PrivacyTrustCard onOpenPromise={handleOpen} />);

    const promiseBtn = screen.getByRole('button', { name: /Read our Privacy Promise/i });
    fireEvent.click(promiseBtn);

    expect(handleOpen).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Our Privacy & Data Protection Promise/i)).toBeInTheDocument();
  });
});
