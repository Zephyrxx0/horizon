import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SentNotificationsCard } from './SentNotificationsCard';

describe('SentNotificationsCard Component', () => {
  const defaultProps = {
    referenceNumber: 'VR-2026-849201',
    email: 'priya.sharma@example.com',
    phoneNumber: '+919876543210',
    applicantName: 'Priya Sharma',
    visaType: 'Student Visa (F-1)',
  };

  it('renders collapsed state by default and expands on click', () => {
    render(<SentNotificationsCard {...defaultProps} />);

    expect(screen.getByText('Simulated Email & SMS Notifications')).toBeInTheDocument();
    expect(screen.queryByText(/Simulated SMS Message/)).not.toBeInTheDocument();

    const toggleBtn = screen.getByTestId('toggle-notifications-disclosure');
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/Simulated SMS Message/)).toBeInTheDocument();
    expect(screen.getByText(/Simulated Email Confirmation/)).toBeInTheDocument();
    expect(screen.getAllByText(/VR-2026-849201/)[0]).toBeInTheDocument();
    expect(screen.getByText(/To: priya.sharma@example.com/)).toBeInTheDocument();
  });

  it('passes axe accessibility audit with zero violations', async () => {
    const { container } = render(<SentNotificationsCard {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
