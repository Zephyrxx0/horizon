import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ErrorSummary } from './ErrorSummary';

describe('ErrorSummary Component', () => {
  const mockErrors = [
    {
      fieldId: 'passportNumber',
      label: 'Passport Number',
      message: 'Invalid format. Use: AA1234567',
    },
    { fieldId: 'phone', label: 'Phone', message: 'Phone must be 10 digits' },
  ];

  it('renders nothing when errors array is empty', () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders role="alert" and lists error links', () => {
    render(<ErrorSummary errors={mockErrors} title="Please fix the errors" />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Please fix the errors')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('Passport Number: Invalid format. Use: AA1234567');
    expect(links[0]).toHaveAttribute('href', '#passportNumber');
  });

  it('scrolls to and focuses the target element when clicked', () => {
    const targetInput = document.createElement('input');
    targetInput.id = 'passportNumber';
    targetInput.focus = vi.fn();
    targetInput.scrollIntoView = vi.fn();
    document.body.appendChild(targetInput);

    render(<ErrorSummary errors={mockErrors} />);

    const link = screen.getByRole('link', { name: /Passport Number/i });
    fireEvent.click(link);

    expect(targetInput.focus).toHaveBeenCalled();
    expect(targetInput.scrollIntoView).toHaveBeenCalled();

    document.body.removeChild(targetInput);
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(<ErrorSummary errors={mockErrors} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
