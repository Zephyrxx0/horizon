import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { StatusTimelineCard } from './StatusTimelineCard';
import { ToastProvider } from '../../components/ui/Toast';

describe('StatusTimelineCard Component', () => {
  const renderWithToast = (ui: React.ReactElement) => {
    return render(<ToastProvider>{ui}</ToastProvider>);
  };

  it('renders initial timeline stages correctly', () => {
    renderWithToast(<StatusTimelineCard referenceNumber="VR-2026-849201" />);

    expect(screen.getByText('Live Status Timeline')).toBeInTheDocument();
    expect(screen.getByText('Application Received & Logged')).toBeInTheDocument();
    expect(screen.getByText('Documents Under Consular Review')).toBeInTheDocument();
    expect(screen.getByText('Interview & Biometrics Appointment')).toBeInTheDocument();
    expect(screen.getByText('Visa Decision & Passport Dispatch')).toBeInTheDocument();
  });

  it('handles [Advance Status] demo button click', () => {
    renderWithToast(<StatusTimelineCard referenceNumber="VR-2026-849201" />);

    const advanceBtn = screen.getByTestId('demo-advance-btn');
    fireEvent.click(advanceBtn);

    expect(screen.getByText(/Application moved to:/)).toBeInTheDocument();
  });

  it('handles [Simulate Info Request] button click', () => {
    renderWithToast(<StatusTimelineCard referenceNumber="VR-2026-849201" />);

    const infoReqBtn = screen.getByTestId('demo-info-request-btn');
    fireEvent.click(infoReqBtn);

    expect(
      screen.getByText(/Consulate requested additional document clarification/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Action Needed:/)).toBeInTheDocument();
  });

  it('handles [Simulate Approval] button click', () => {
    renderWithToast(<StatusTimelineCard referenceNumber="VR-2026-849201" />);

    const approvalBtn = screen.getByTestId('demo-approval-btn');
    fireEvent.click(approvalBtn);

    expect(screen.getByText(/Visa Approved!/)).toBeInTheDocument();
  });

  it('passes axe accessibility audit with zero violations', async () => {
    const { container } = renderWithToast(<StatusTimelineCard referenceNumber="VR-2026-849201" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
