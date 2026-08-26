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
        className="w-10 h-10 -my-2 -mx-1 sm:w-8 sm:h-8 sm:my-0 sm:mx-0 flex items-center justify-center rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors touch-manipulation cursor-pointer"
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
          className="absolute z-50 left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md p-4 rounded-xl bg-white border border-slate-200 shadow-xl text-left animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
              <BookOpen className="w-4 h-4 shrink-0 text-indigo-600" aria-hidden="true" />
              <span>{title}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close explanation"
              className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Explanation Body */}
          <div className="mt-2.5 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>{explanation}</p>

            {/* Example Box */}
            {example && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs">
                <Lightbulb className="w-4 h-4 shrink-0 text-indigo-600 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-bold text-indigo-900 block mb-0.5">Example:</span>
                  <span>{example}</span>
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
