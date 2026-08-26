import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ReferenceCard } from './ReferenceCard';
import { ToastProvider } from '../../components/ui/Toast';

describe('ReferenceCard Component', () => {
  const defaultProps = {
    referenceNumber: 'VR-2026-849201',
    applicantName: 'Vikram Seth',
    visaType: 'Tourist Visa',
    destinationCountry: 'United Kingdom',
    submittedAt: '2026-08-26T10:00:00.000Z',
  };

  const renderWithToast = (ui: React.ReactElement) => {
    return render(<ToastProvider>{ui}</ToastProvider>);
  };

  it('renders reference number and applicant metadata correctly', () => {
    renderWithToast(<ReferenceCard {...defaultProps} />);

    expect(screen.getByText('Application Submitted Successfully!')).toBeInTheDocument();
    expect(screen.getByTestId('reference-number-display')).toHaveTextContent('VR-2026-849201');
    expect(screen.getByText('Vikram Seth')).toBeInTheDocument();
    expect(screen.getByText(/Tourist Visa \(United Kingdom\)/)).toBeInTheDocument();
  });

  it('handles copy reference button click with toast feedback', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    renderWithToast(<ReferenceCard {...defaultProps} />);

    const copyBtn = screen.getByTestId('copy-reference-btn');
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith('VR-2026-849201');
      expect(screen.getByText('Reference Copied')).toBeInTheDocument();
    });
  });

  it('handles WhatsApp share button click', () => {
    const openMock = vi.fn();
    window.open = openMock;

    renderWithToast(<ReferenceCard {...defaultProps} />);

    const whatsappBtn = screen.getByTestId('share-whatsapp-btn');
    fireEvent.click(whatsappBtn);

    expect(openMock).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/?text='),
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('passes axe accessibility audit with zero violations', async () => {
    const { container } = renderWithToast(<ReferenceCard {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

