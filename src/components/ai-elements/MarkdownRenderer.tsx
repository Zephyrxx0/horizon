import { useMemo, type ReactNode } from 'react';
import { marked, type Tokens } from 'marked';

export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function renderInlineTokens(tokens?: Tokens.Generic[]): ReactNode {
  if (!tokens || tokens.length === 0) return null;

  return tokens.map((tok, idx) => {
    switch (tok.type) {
      case 'strong':
        return (
          <strong key={idx} className="font-bold text-[var(--color-ink)] dark:text-white">
            {tok.tokens ? renderInlineTokens(tok.tokens) : tok.text}
          </strong>
        );
      case 'em':
        return (
          <em key={idx} className="italic text-[var(--color-ink)] dark:text-white">
            {tok.tokens ? renderInlineTokens(tok.tokens) : tok.text}
          </em>
        );
      case 'codespan':
        return (
          <code
            key={idx}
            className="px-1 py-0.5 rounded bg-[var(--color-surface-subtle)] text-[11px] font-mono text-[var(--color-ink)]"
          >
            {tok.text}
          </code>
        );
      case 'link':
        return (
          <a
            key={idx}
            href={tok.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-indigo-primary)] dark:text-blue-400 underline hover:opacity-80"
          >
            {tok.tokens ? renderInlineTokens(tok.tokens) : tok.text}
          </a>
        );
      case 'text':
      default:
        if (tok.tokens && tok.tokens.length > 0) {
          return <span key={idx}>{renderInlineTokens(tok.tokens)}</span>;
        }
        return tok.text;
    }
  });
}

function renderBlockToken(token: Tokens.Generic, index: number): ReactNode {
  switch (token.type) {
    case 'heading': {
      const headingTok = token as Tokens.Heading;
      const level = headingTok.depth;
      const children = headingTok.tokens ? renderInlineTokens(headingTok.tokens) : headingTok.text;
      if (level === 1 || level === 2) {
        return (
          <h3
            key={index}
            className="text-sm font-bold my-2 text-[var(--color-ink)] dark:text-white"
          >
            {children}
          </h3>
        );
      }
      return (
        <h4
          key={index}
          className="text-xs font-bold my-1.5 text-[var(--color-ink)] dark:text-white"
        >
          {children}
        </h4>
      );
    }
    case 'paragraph': {
      const paraTok = token as Tokens.Paragraph;
      return (
        <p key={index} className="my-1.5 leading-relaxed">
          {paraTok.tokens ? renderInlineTokens(paraTok.tokens) : paraTok.text}
        </p>
      );
    }
    case 'list': {
      const listTok = token as Tokens.List;
      const Tag = listTok.ordered ? 'ol' : 'ul';
      return (
        <Tag
          key={index}
          className={`my-1.5 pl-4 space-y-1 ${listTok.ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {listTok.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item.tokens ? (
                item.tokens.map((t: Tokens.Generic, j: number) => renderBlockToken(t, j))
              ) : (
                <span>{item.text}</span>
              )}
            </li>
          ))}
        </Tag>
      );
    }
    case 'blockquote':
      return (
        <blockquote
          key={index}
          className="pl-3 py-1 my-2 border-l-2 border-[var(--color-indigo-primary)] bg-[var(--color-surface-subtle)]/40 italic rounded-r text-xs text-[var(--color-ink-muted)]"
        >
          {(token as Tokens.Blockquote).tokens.map((t: Tokens.Generic, j: number) =>
            renderBlockToken(t, j),
          )}
        </blockquote>
      );
    case 'code':
      return (
        <pre
          key={index}
          className="p-2.5 my-2 rounded-lg bg-[var(--color-surface-subtle)] overflow-x-auto text-[11px] font-mono text-[var(--color-ink)]"
        >
          <code>{(token as Tokens.Code).text}</code>
        </pre>
      );
    case 'space':
      return null;
    default:
      return token.text ? (
        <p key={index} className="my-1">
          {token.text}
        </p>
      ) : null;
  }
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const elements = useMemo(() => {
    try {
      const tokens = marked.lexer(content, { breaks: true, gfm: true });
      return tokens.map((tok, idx) => renderBlockToken(tok as Tokens.Generic, idx));
    } catch {
      return <p className="leading-relaxed whitespace-pre-wrap">{content}</p>;
    }
  }, [content]);

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed ${className}`}
    >
      {elements}
    </div>
  );
}
