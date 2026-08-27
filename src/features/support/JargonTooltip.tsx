import React, { useState, useRef, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, X, Lightbulb, BookOpen } from 'lucide-react';
import type { JargonKey } from './types';
import { JARGON_DEFINITIONS } from './faqCatalog';
import { PassportDiagram, type PassportHighlightZone } from './PassportDiagram';

export interface JargonTooltipProps {
  jargonKey?: JargonKey;
  title?: string;
  explanation?: string;
  example?: string;
  showDiagram?: boolean;
  diagramZone?: PassportHighlightZone;
  ariaLabel?: string;
  className?: string;
}

export const JargonTooltip: React.FC<JargonTooltipProps> = ({
  jargonKey,
  title: customTitle,
  explanation: customExplanation,
  example: customExample,
  showDiagram,
  diagramZone,
  ariaLabel,
  className = '',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const popoverId = `jargon-popover-${id}`;

  const def = jargonKey ? JARGON_DEFINITIONS[jargonKey] : undefined;

  const title =
    customTitle ||
    (def ? t(def.titleKey, def.defaultTitle) : t('common.help', 'Help & Explanation'));

  const explanation =
    customExplanation || (def ? t(def.explanationKey, def.defaultExplanation) : '');

  const example = customExample || (def ? t(def.exampleKey, def.defaultExample) : '');

  const shouldRenderDiagram = showDiagram !== undefined ? showDiagram : Boolean(def?.hasDiagram);

  const activeDiagramZone: PassportHighlightZone =
    diagramZone ||
    (jargonKey === 'givenNameVsSurname'
      ? 'names'
      : jargonKey === 'dateOfIssueVsExpiry'
        ? 'dates'
        : jargonKey === 'placeOfIssue'
          ? 'placeOfIssue'
          : jargonKey === 'mrz'
            ? 'mrz'
            : 'all');

  const buttonAriaLabel =
    ariaLabel ||
    (jargonKey === 'cvv'
      ? 'Help: card security code'
      : jargonKey === 'vpa'
        ? 'Help: UPI payment ID'
        : jargonKey === 'dateOfIssueVsExpiry'
          ? 'Help: passport validity dates'
          : jargonKey === 'givenNameVsSurname'
            ? 'Help: given name and surname'
            : `Help: ${title}`);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* 48px touch target wrapper button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        aria-label={buttonAriaLabel}
        data-testid={`jargon-trigger-${jargonKey || 'custom'}`}
        className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-ink-muted)] hover:text-[var(--color-indigo-primary)] hover:bg-[var(--color-surface-subtle)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-indigo-primary)] transition-colors touch-manipulation cursor-pointer"
      >
        <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
      </button>

      {/* Inline Micro-Popover Card */}
      {isOpen && (
        <div
          ref={popoverRef}
          id={popoverId}
          role="region"
          aria-label={title}
          className="absolute z-50 left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xl text-left animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-[var(--color-border)] pb-2.5">
            <div className="flex items-center gap-2 text-[var(--color-indigo-primary)] dark:text-blue-400 font-bold text-sm">
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{title}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close explanation"
              className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Explanation Body */}
          <div className="mt-2.5 space-y-3 text-xs sm:text-sm text-[var(--color-ink)] leading-relaxed">
            <p className="text-[var(--color-ink-muted)] text-pretty">{explanation}</p>

            {/* Example Box */}
            {example && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-ink)] text-xs">
                <Lightbulb
                  className="w-4 h-4 shrink-0 text-[var(--color-saffron-bright)] mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <span className="font-bold text-[var(--color-ink)] block mb-0.5">Example:</span>
                  <span className="text-[var(--color-ink-muted)]">{example}</span>
                </div>
              </div>
            )}

            {/* Visual Passport Diagram */}
            {shouldRenderDiagram && (
              <div className="pt-1">
                <PassportDiagram highlightZone={activeDiagramZone} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
