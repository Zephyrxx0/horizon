import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TrackingModal } from './TrackingModal';
import { ToastProvider } from '../../components/ui/Toast';

describe('TrackingModal Component', () => {
  const renderWithToast = (ui: React.ReactElement) => {
    return render(<ToastProvider>{ui}</ToastProvider>);
  };

  it('renders modal with search input when open', () => {
    renderWithToast(<TrackingModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Track Your Application Status')).toBeInTheDocument();
    expect(screen.getByTestId('tracking-reference-input')).toBeInTheDocument();
    expect(screen.getByTestId('track-submit-btn')).toBeInTheDocument();
  });

  it('searches seeded reference VR-2026-102938 and displays timeline', () => {
    renderWithToast(<TrackingModal isOpen={true} onClose={vi.fn()} />);

    const input = screen.getByTestId('tracking-reference-input');
    fireEvent.change(input, { target: { value: 'VR-2026-102938' } });

    const submitBtn = screen.getByTestId('track-submit-btn');
    fireEvent.click(submitBtn);

    expect(screen.getByText('Vikram Seth')).toBeInTheDocument();
    expect(screen.getByText(/Tourist Visa \(United Kingdom\)/)).toBeInTheDocument();
    expect(screen.getByText('Live Status Timeline')).toBeInTheDocument();
  });

  it('displays error for invalid reference number format', () => {
    renderWithToast(<TrackingModal isOpen={true} onClose={vi.fn()} />);

    const input = screen.getByTestId('tracking-reference-input');
    fireEvent.change(input, { target: { value: 'VR-123' } });

    const submitBtn = screen.getByTestId('track-submit-btn');
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Please enter a valid 14-character reference number/),
    ).toBeInTheDocument();
  });

  it('supports initialReference prop', () => {
    renderWithToast(
      <TrackingModal isOpen={true} onClose={vi.fn()} initialReference="VR-2026-102938" />,
    );

    expect(screen.getByText('Vikram Seth')).toBeInTheDocument();
  });

  it('passes axe accessibility audit with zero violations', async () => {
    const { container } = renderWithToast(<TrackingModal isOpen={true} onClose={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
