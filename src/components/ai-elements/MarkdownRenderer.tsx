import { useMemo, type ReactNode } from 'react';
import { marked, type Tokens } from 'marked';

export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function isUnsafeOrFileUrl(url: string): boolean {
  if (!url) return true;
  const trimmed = url.trim();
  // Catch file: / file/// / local paths / windows drives / home dirs
  if (/^(file:|file\/|\/home\/|\/Users\/|[a-zA-Z]:\\|\.\/|\.\.\/)/i.test(trimmed)) {
    return true;
  }
  // Catch dangerous execution protocols
  if (/^(javascript:|vbscript:|data:(?!image\/))/i.test(trimmed)) {
    return true;
  }
  return false;
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
      case 'del':
        return (
          <del key={idx} className="line-through text-inherit opacity-75">
            {tok.tokens ? renderInlineTokens(tok.tokens) : tok.text}
          </del>
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
      case 'image': {
        const src = tok.href || '';
        if (
          isUnsafeOrFileUrl(src) ||
          (!src.startsWith('http://') &&
            !src.startsWith('https://') &&
            !src.startsWith('data:image/') &&
            !src.startsWith('/'))
        ) {
          return (
            <span
              key={idx}
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[11px] font-mono text-inherit opacity-80"
            >
              📄 {tok.text || 'Document Asset'}
            </span>
          );
        }
        return (
          <img
            key={idx}
            src={src}
            alt={tok.text || ''}
            className="max-w-full h-auto rounded my-1 object-contain"
            loading="lazy"
          />
        );
      }
      case 'link': {
        const href = tok.href || '';
        const isSafeWebLink =
          (href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('#')) &&
          !isUnsafeOrFileUrl(href);

        if (!isSafeWebLink) {
          return (
            <code
              key={idx}
              title={`Reference: ${href}`}
              className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/15 text-[11px] font-mono text-inherit"
            >
              {tok.tokens ? renderInlineTokens(tok.tokens) : tok.text}
            </code>
          );
        }
        return (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-saffron-bright)] dark:text-amber-400 underline font-medium hover:opacity-80"
          >
            {tok.tokens ? renderInlineTokens(tok.tokens) : tok.text}
          </a>
        );
      }
      case 'html':
        return (
          <span key={idx} className="text-inherit">
            {tok.text}
          </span>
        );
      case 'br':
        return <br key={idx} />;
      case 'escape':
        return tok.text;
      case 'text':
      default:
        if (tok.tokens && tok.tokens.length > 0) {
          return <span key={idx}>{renderInlineTokens(tok.tokens)}</span>;
        }
        return tok.text;
    }
  });
}

function renderListItem(item: Tokens.ListItem, index: number): ReactNode {
  return (
    <li key={index} className="leading-relaxed text-inherit">
      {item.tokens && item.tokens.length > 0 ? (
        item.tokens.map((t, j) => {
          if (t.type === 'text') {
            const textTok = t as Tokens.Text;
            return textTok.tokens && textTok.tokens.length > 0 ? (
              <span key={j}>{renderInlineTokens(textTok.tokens)}</span>
            ) : (
              <span key={j}>{textTok.text}</span>
            );
          }
          if (t.type === 'paragraph') {
            const pTok = t as Tokens.Paragraph;
            return (
              <span key={j} className="block my-0.5">
                {pTok.tokens ? renderInlineTokens(pTok.tokens) : pTok.text}
              </span>
            );
          }
          return renderBlockToken(t, j);
        })
      ) : (
        <span>{item.text}</span>
      )}
    </li>
  );
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
    case 'text': {
      const textTok = token as Tokens.Text;
      return (
        <p key={index} className="my-1.5 leading-relaxed text-inherit">
          {textTok.tokens ? renderInlineTokens(textTok.tokens) : textTok.text}
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
          {listTok.items.map((item, i) => renderListItem(item, i))}
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
    case 'hr':
      return <hr key={index} className="my-3 border-black/10 dark:border-white/10" />;
    case 'table': {
      const tableTok = token as Tokens.Table;
      return (
        <div key={index} className="my-2 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-black/10 dark:border-white/10">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5">
                {tableTok.header.map((cell, cIdx) => (
                  <th
                    key={cIdx}
                    className="p-1.5 border border-black/10 dark:border-white/10 font-semibold"
                  >
                    {cell.tokens ? renderInlineTokens(cell.tokens) : cell.text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableTok.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-black/5 dark:border-white/5">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-1.5 border border-black/10 dark:border-white/10">
                      {cell.tokens ? renderInlineTokens(cell.tokens) : cell.text}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'image': {
      const imgTok = token as Tokens.Image;
      const src = imgTok.href || '';
      if (
        isUnsafeOrFileUrl(src) ||
        (!src.startsWith('http://') &&
          !src.startsWith('https://') &&
          !src.startsWith('data:image/') &&
          !src.startsWith('/'))
      ) {
        return (
          <p key={index} className="my-1 text-xs opacity-75 font-mono">
            📄 {imgTok.text || 'Document Asset'}
          </p>
        );
      }
      return (
        <img
          key={index}
          src={src}
          alt={imgTok.text || ''}
          className="max-w-full h-auto rounded my-2 object-contain"
          loading="lazy"
        />
      );
    }
    case 'html':
      return (
        <p key={index} className="my-1 text-inherit">
          {token.text}
        </p>
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
