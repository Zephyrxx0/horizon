import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Message,
  MessageContent,
  MessageResponse,
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  Suggestions,
  Suggestion,
  Tool,
  ToolHeader,
  ToolContent,
  Reasoning,
  Attachments,
  Attachment,
  MarkdownRenderer,
} from './index';

describe('AI Elements Component Suite', () => {
  it('renders Message and MessageContent with correct role styling', () => {
    const { container } = render(
      <Message from="assistant">
        <MessageContent>
          <MessageResponse>Hello from Asha</MessageResponse>
        </MessageContent>
      </Message>,
    );
    expect(screen.getByText('Hello from Asha')).toBeInTheDocument();
    expect(container.querySelector('[data-role="assistant"]')).toBeInTheDocument();
  });

  it('renders Markdown formatting with bold and lists properly', () => {
    render(
      <MarkdownRenderer
        content={`Namaste! I am **Asha**.

- Point 1
- Point 2`}
      />,
    );
    const strongEl = screen.getByText('Asha');
    expect(strongEl.tagName.toLowerCase()).toBe('strong');
    expect(screen.getByText('Point 1')).toBeInTheDocument();
  });

  it('renders MessageResponse with markdown parsing', () => {
    render(<MessageResponse>{'Your passport has **6 months** validity.'}</MessageResponse>);
    const strongEl = screen.getByText('6 months');
    expect(strongEl.tagName.toLowerCase()).toBe('strong');
  });

  it('renders Attachments and Attachment items', () => {
    const onRemove = vi.fn();
    render(
      <Attachments>
        <Attachment
          data={{
            id: '1',
            name: 'passport-scan.jpg',
            url: 'https://example.com/scan.jpg',
            size: 102400,
          }}
          onRemove={onRemove}
        />
      </Attachments>,
    );
    expect(screen.getByText('passport-scan.jpg')).toBeInTheDocument();
    const removeBtn = screen.getByRole('button', { name: /Remove passport-scan.jpg/i });
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalled();
  });

  it('renders Conversation with EmptyState', () => {
    render(
      <Conversation>
        <ConversationContent>
          <ConversationEmptyState
            title="Start your query"
            description="Ask anything about Indian passport visas"
          />
        </ConversationContent>
      </Conversation>,
    );
    expect(screen.getByText('Start your query')).toBeInTheDocument();
    expect(screen.getByText('Ask anything about Indian passport visas')).toBeInTheDocument();
  });

  it('handles PromptInput submission', () => {
    const onSubmit = vi.fn();
    render(
      <PromptInput onSubmit={onSubmit}>
        <PromptInputTextarea placeholder="Ask a question..." />
        <PromptInputSubmit />
      </PromptInput>,
    );

    const textarea = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(textarea, { target: { value: 'How much is USA visa?' } });
    fireEvent.submit(textarea.closest('form')!);

    expect(onSubmit).toHaveBeenCalledWith({ text: 'How much is USA visa?' }, expect.anything());
  });

  it('renders Suggestions and triggers onClick', () => {
    const onClick = vi.fn();
    render(
      <Suggestions>
        <Suggestion suggestion="Photo Specifications" onClick={onClick} />
      </Suggestions>,
    );

    const btn = screen.getByRole('button', { name: /Photo Specifications/i });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });

  it('renders Tool with collapsible header and content', () => {
    const { rerender } = render(
      <Tool defaultOpen={false}>
        <ToolHeader toolName="calculateVisaFees" state="success" isOpen={false} />
        <ToolContent isOpen={false}>
          <div>Fee Calculation Content</div>
        </ToolContent>
      </Tool>,
    );

    expect(screen.getByText(/Calculate Visa Fees/i)).toBeInTheDocument();
    expect(screen.queryByText('Fee Calculation Content')).not.toBeInTheDocument();

    rerender(
      <Tool defaultOpen={true}>
        <ToolHeader toolName="calculateVisaFees" state="success" isOpen={true} />
        <ToolContent isOpen={true}>
          <div>Fee Calculation Content</div>
        </ToolContent>
      </Tool>,
    );
    expect(screen.getByText('Fee Calculation Content')).toBeInTheDocument();
  });

  it('renders Reasoning panel', () => {
    render(
      <Reasoning
        reasoning="Checked 6-month validity against official MEA rules."
        defaultOpen={true}
      />,
    );
    expect(screen.getByText('Reasoning & Consular Guidelines')).toBeInTheDocument();
    expect(
      screen.getByText('Checked 6-month validity against official MEA rules.'),
    ).toBeInTheDocument();
  });
});
