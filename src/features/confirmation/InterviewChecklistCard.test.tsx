import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { InterviewChecklistCard } from './InterviewChecklistCard';
import { ToastProvider } from '../../components/ui/Toast';

describe('InterviewChecklistCard Component', () => {
  const defaultProps = {
    referenceNumber: 'VR-2026-849201',
    applicantName: 'Priya Sharma',
    visaType: 'Student Visa (F-1)',
    destinationCountry: 'United States',
  };

  const renderWithToast = (ui: React.ReactElement) => {
    return render(<ToastProvider>{ui}</ToastProvider>);
  };

  it('renders student visa tailored checklist items', () => {
    renderWithToast(<InterviewChecklistCard {...defaultProps} />);

    expect(screen.getByText('Interview & Next Steps Checklist')).toBeInTheDocument();
    expect(
      screen.getByText('Official University Admission Letter / I-20 / CAS'),
    ).toBeInTheDocument();
    expect(screen.getByText('Proof of Funds & Sponsorship Affidavit')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-progress-badge')).toHaveTextContent(
      /0 of \d+ items prepared/,
    );
  });

  it('toggles checkboxes and updates the completed items count', () => {
    renderWithToast(<InterviewChecklistCard {...defaultProps} />);

    const itemCheckbox = screen.getByLabelText(
      /Mark Official University Admission Letter \/ I-20 \/ CAS as prepared/i,
    );
    fireEvent.click(itemCheckbox);

    expect(screen.getByTestId('checklist-progress-badge')).toHaveTextContent(
      /1 of \d+ items prepared/,
    );
  });

  it('handles download text file trigger', () => {
    renderWithToast(<InterviewChecklistCard {...defaultProps} />);

    const downloadBtn = screen.getByTestId('download-checklist-btn');
    fireEvent.click(downloadBtn);

    expect(screen.getByText(/Downloaded!/)).toBeInTheDocument();
  });

  it('handles print guide trigger', () => {
    const printMock = vi.fn();
    window.print = printMock;

    renderWithToast(<InterviewChecklistCard {...defaultProps} />);

    const printBtn = screen.getByTestId('print-checklist-btn');
    fireEvent.click(printBtn);

    expect(printMock).toHaveBeenCalled();
  });

  it('passes axe accessibility audit with zero violations', async () => {
    const { container } = renderWithToast(<InterviewChecklistCard {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
