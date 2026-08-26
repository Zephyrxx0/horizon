import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { DuplicateWarningCard } from './DuplicateWarningCard';

describe('DuplicateWarningCard Component', () => {
  const mockRecord = {
    referenceNumber: 'VR-2026-102938',
    passportNumber: 'Z1234567',
    applicantName: 'Vikram Seth',
    visaType: 'Tourist Visa',
    country: 'United Kingdom',
    submittedAt: '2026-08-22T14:30:00.000Z',
    status: 'Documents Under Review',
  };

  it('renders duplicate warning details and action buttons', () => {
    render(
      <DuplicateWarningCard record={mockRecord} onTrackExisting={vi.fn()} onDismiss={vi.fn()} />,
    );

    expect(screen.getByText('Active Application Found for this Passport')).toBeInTheDocument();
    expect(screen.getAllByText(/VR-2026-102938/)[0]).toBeInTheDocument();
    expect(screen.getByText(/Vikram Seth/)).toBeInTheDocument();
    expect(screen.getByTestId('track-existing-app-btn')).toBeInTheDocument();
    expect(screen.getByTestId('dismiss-duplicate-warning-btn')).toBeInTheDocument();
  });

  it('triggers onTrackExisting when track button is clicked', () => {
    const trackMock = vi.fn();
    render(
      <DuplicateWarningCard record={mockRecord} onTrackExisting={trackMock} onDismiss={vi.fn()} />,
    );

    fireEvent.click(screen.getByTestId('track-existing-app-btn'));
    expect(trackMock).toHaveBeenCalledWith('VR-2026-102938');
  });

  it('triggers onDismiss when continue anyway button is clicked', () => {
    const dismissMock = vi.fn();
    render(
      <DuplicateWarningCard
        record={mockRecord}
        onTrackExisting={vi.fn()}
        onDismiss={dismissMock}
      />,
    );

    fireEvent.click(screen.getByTestId('dismiss-duplicate-warning-btn'));
    expect(dismissMock).toHaveBeenCalled();
  });

  it('passes axe accessibility audit with zero violations', async () => {
    const { container } = render(
      <DuplicateWarningCard record={mockRecord} onTrackExisting={vi.fn()} onDismiss={vi.fn()} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
