import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { SupportTicketModal } from './SupportTicketModal';
import { ToastProvider } from '../../components/ui/Toast';

describe('SupportTicketModal', () => {
  it('renders modal when open is true, validates fields and generates ticket ID', async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();

    const { container } = render(
      <ToastProvider>
        <SupportTicketModal open={true} onClose={handleClose} onSuccess={handleSuccess} />
      </ToastProvider>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number or Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Describe your question/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Fill form
    fireEvent.change(screen.getByLabelText(/Your Full Name/i), {
      target: { value: 'Priya Patel' },
    });
    fireEvent.change(screen.getByLabelText(/Mobile Number or Email/i), {
      target: { value: 'priya@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Describe your question/i), {
      target: { value: 'How do I upload scanned passport PDF?' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Submit Query \/ Request Callback/i }));

    expect(handleSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        applicantName: 'Priya Patel',
        contactInfo: 'priya@example.com',
        description: 'How do I upload scanned passport PDF?',
        ticketId: expect.stringMatching(/^TKT-1800-\d{5}$/),
      }),
    );

    expect(screen.getByTestId('ticket-success-view')).toBeInTheDocument();
    expect(screen.getByText(/Query Received Successfully!/i)).toBeInTheDocument();
  });

  it('validates required fields on empty submit', () => {
    render(
      <ToastProvider>
        <SupportTicketModal open={true} onClose={vi.fn()} />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Submit Query \/ Request Callback/i }));

    expect(screen.getByText(/Please enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/Please provide a contact number or email/i)).toBeInTheDocument();
    expect(screen.getByText(/Please provide a brief description/i)).toBeInTheDocument();
  });
});
