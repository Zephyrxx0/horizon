import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { FaqSheet } from './FaqSheet';
import { ToastProvider } from '../../components/ui/Toast';

describe('FaqSheet', () => {
  it('renders search input, category chips, FAQ list, helpline, and passes a11y', async () => {
    const handleClose = vi.fn();
    const { container } = render(
      <ToastProvider>
        <FaqSheet open={true} onClose={handleClose} />
      </ToastProvider>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByTestId('faq-category-all')).toBeInTheDocument();
    expect(screen.getByTestId('faq-category-passport')).toBeInTheDocument();
    expect(screen.getByTestId('faq-category-payment')).toBeInTheDocument();
    expect(screen.getByText(/1800-VISA-HELP/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('filters FAQs by keyword query in real time', () => {
    render(
      <ToastProvider>
        <FaqSheet open={true} onClose={vi.fn()} />
      </ToastProvider>,
    );

    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'photo' } });

    expect(
      screen.getByText(/What are the exact specifications for the passport photograph/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/How much passport validity is required/i)).not.toBeInTheDocument();
  });

  it('filters FAQs when clicking category chips', () => {
    render(
      <ToastProvider>
        <FaqSheet open={true} onClose={vi.fn()} />
      </ToastProvider>,
    );

    const paymentChip = screen.getByTestId('faq-category-payment');
    fireEvent.click(paymentChip);

    expect(screen.getByText(/What payment methods are accepted/i)).toBeInTheDocument();
    expect(screen.getByText(/Are visa application fees refundable/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/What are the exact specifications for the passport photograph/i),
    ).not.toBeInTheDocument();
  });

  it('expands FAQ accordion on click and reveals answer', () => {
    render(
      <ToastProvider>
        <FaqSheet open={true} onClose={vi.fn()} />
      </ToastProvider>,
    );

    const firstFaqBtn = screen.getByRole('button', {
      name: /How much passport validity is required before applying for a visa/i,
    });
    expect(firstFaqBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(firstFaqBtn);
    expect(firstFaqBtn).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText(/Your passport must have at least 6 months of validity/i),
    ).toBeInTheDocument();

    // Clicking again collapses it
    fireEvent.click(firstFaqBtn);
    expect(firstFaqBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens support ticket modal when clicking submit support query button', () => {
    render(
      <ToastProvider>
        <FaqSheet open={true} onClose={vi.fn()} />
      </ToastProvider>,
    );

    const ticketBtn = screen.getByTestId('open-support-ticket-btn');
    fireEvent.click(ticketBtn);

    expect(screen.getByLabelText(/Your Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number or Email/i)).toBeInTheDocument();
  });
});
