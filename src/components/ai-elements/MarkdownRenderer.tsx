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
          <strong key={idx} className="font-bold text-inherit underline-offset-2">
            {tok.tokens ? renderInlineTokens(tok.tokens) : tok.text}
          </strong>
        );
      case 'em':
        return (
          <em key={idx} className="italic text-inherit">
            {tok.tokens ? renderInlineTokens(tok.tokens) : tok.text}
          </em>
        );
      case 'codespan':
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/15 text-[11px] font-mono text-inherit"
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
            className="text-[var(--color-saffron-bright)] dark:text-amber-400 underline font-medium hover:opacity-80"
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
          <h3 key={index} className="text-sm font-bold my-2 text-inherit">
            {children}
          </h3>
        );
      }
      return (
        <h4 key={index} className="text-xs font-bold my-1.5 text-inherit">
          {children}
        </h4>
      );
    }
    case 'paragraph': {
      const paraTok = token as Tokens.Paragraph;
      return (
        <p key={index} className="my-1.5 leading-relaxed text-inherit">
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
          className={`my-1.5 pl-4 space-y-1 ${listTok.ordered ? 'list-decimal' : 'list-disc'} text-inherit`}
        >
          {listTok.items.map((item, i) => (
            <li key={i} className="leading-relaxed text-inherit">
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
          className="pl-3 py-1 my-2 border-l-2 border-[var(--color-saffron-bright)] bg-black/5 dark:bg-white/5 italic rounded-r text-xs text-inherit opacity-90"
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
          className="p-2.5 my-2 rounded-lg bg-black/10 dark:bg-white/10 overflow-x-auto text-[11px] font-mono text-inherit"
        >
          <code>{(token as Tokens.Code).text}</code>
        </pre>
      );
    case 'space':
      return null;
    default:
      return token.text ? (
        <p key={index} className="my-1 text-inherit">
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
      return <p className="leading-relaxed whitespace-pre-wrap text-inherit">{content}</p>;
    }
  }, [content]);

  return (
    <div className={`text-xs sm:text-sm leading-relaxed text-inherit ${className}`}>{elements}</div>
  );
}
