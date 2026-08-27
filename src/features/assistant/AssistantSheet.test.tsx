import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssistantSheet } from './AssistantSheet';
import { FloatingAssistantButton } from './FloatingAssistantButton';

describe('AssistantSheet Component', () => {
  it('renders hidden companion panel when isOpen is false', () => {
    const { container } = render(<AssistantSheet isOpen={false} onClose={vi.fn()} />);
    const aside = container.querySelector('aside');
    expect(aside).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders header, greeting, and suggestions when open', () => {
    render(<AssistantSheet isOpen={true} onClose={vi.fn()} currentStepId="visa-selection" />);
    expect(screen.getByText('Asha — AI Visa Guide')).toBeInTheDocument();
    expect(screen.getByText(/Namaste!/i)).toBeInTheDocument();
    expect(screen.getByText(/What visa do I need for USA tourism\?/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<AssistantSheet isOpen={true} onClose={onClose} />);
    const closeBtn = screen.getByTitle('Close Assistant');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('renders image attachment button', () => {
    render(<AssistantSheet isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Attach images/i })).toBeInTheDocument();
  });

  it('submits a message and receives assistant response with tool card', async () => {
    render(<AssistantSheet isOpen={true} onClose={vi.fn()} currentStepId="documents" />);

    const textarea = screen.getByPlaceholderText(/Ask Asha about visa fees/i);
    fireEvent.change(textarea, { target: { value: 'What are the photo specifications?' } });
    fireEvent.submit(textarea.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/Document Checklist/i)).toBeInTheDocument();
    });
  });

  it('triggers query on suggestion click', async () => {
    render(<AssistantSheet isOpen={true} onClose={vi.fn()} currentStepId="visa-selection" />);

    const suggestionBtn = screen.getByRole('button', {
      name: /What visa do I need for USA tourism\?/i,
    });
    fireEvent.click(suggestionBtn);

    await waitFor(() => {
      expect(screen.getByText(/B1\/B2 Visitor Visa/i)).toBeInTheDocument();
    });
  });

  it('renders FloatingAssistantButton and triggers onClick', () => {
    const onClick = vi.fn();
    render(<FloatingAssistantButton onClick={onClick} />);
    const btn = screen.getByTestId('floating-assistant-btn');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });
});
