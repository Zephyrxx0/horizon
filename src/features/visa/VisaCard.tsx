import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Check, FileText } from 'lucide-react';
import type { VisaItem } from './types';
import { Button } from '../../components/ui/Button';

export interface VisaCardProps {
  visa: VisaItem;
  isSelected: boolean;
  onSelect: (visa: VisaItem) => void;
  className?: string;
}

export const VisaCard: React.FC<VisaCardProps> = ({
  visa,
  isSelected,
  onSelect,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all bg-[var(--color-surface-card)] ${
        isSelected
          ? 'border-[var(--color-indigo-primary)] shadow-sm ring-1 ring-[var(--color-indigo-primary)]/30'
          : 'border-[var(--color-border)] hover:border-[var(--color-ink-muted)]'
      } ${className}`}
    >
      {/* ── Compact header row ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Select toggle */}
        <button
          type="button"
          aria-pressed={isSelected}
          onClick={() => onSelect(visa)}
          className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
            isSelected
              ? 'border-[var(--color-indigo-primary)] bg-[var(--color-indigo-primary)]'
              : 'border-[var(--color-border)]'
          }`}
          aria-label={isSelected ? `${visa.name} selected` : `Select ${visa.name}`}
        >
          {isSelected && (
            <Check className="w-3 h-3 text-[var(--color-surface-bg)]" strokeWidth={3} />
          )}
        </button>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[var(--color-ink)] leading-snug">
              {visa.name}
            </span>
            {visa.isRecommended && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--color-saffron-bright)]/15 text-[var(--color-saffron-bright)] border border-[var(--color-saffron-bright)]/30">
                Recommended
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--color-ink-muted)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {visa.processingTimeDisplay}
            </span>
            <span className="text-[var(--color-border)]">|</span>
            <span className="font-medium text-[var(--color-ink)]">
              ₹{visa.totalCost.toLocaleString('en-IN')} total
            </span>
          </div>
        </div>

        {/* Details toggle */}
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors shrink-0"
          aria-expanded={showDetails}
          aria-label={showDetails ? 'Hide details' : 'Show details'}
        >
          {showDetails ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ── Expanded detail panel ── */}
      {showDetails && (
        <div className="px-4 pb-4 space-y-3 border-t border-[var(--color-border)]">
          {/* Description */}
          <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed pt-3">
            {visa.description}
          </p>

          {/* Fee Breakdown */}
          <div className="rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)] p-3 space-y-1.5 text-xs">
            <div className="text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-2">
              Fee Breakdown
            </div>
            <div className="flex justify-between text-[var(--color-ink-muted)]">
              <span>Processing Fee</span>
              <span className="font-medium text-[var(--color-ink)]">
                ₹{visa.visaFee.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[var(--color-ink-muted)]">
              <span>Government Embassy Fee</span>
              <span className="font-medium text-[var(--color-ink)]">
                ₹{visa.govtFee.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[var(--color-ink-muted)]">
              <span>Platform & Verification</span>
              <span className="font-medium text-[var(--color-ink)]">
                ₹{visa.platformFee.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-1.5 border-t border-[var(--color-border)] flex justify-between font-bold text-sm text-[var(--color-ink)]">
              <span>Total</span>
              <span>₹{visa.totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Document checklist — compact */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
              <FileText className="w-3 h-3" />
              Required Documents
            </div>
            <ul className="space-y-1">
              {visa.requiredDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-start gap-2 text-xs text-[var(--color-ink-muted)]"
                >
                  <span className="text-[var(--color-success)] font-bold shrink-0">✓</span>
                  <span>
                    <strong className="text-[var(--color-ink)]">{doc.name}</strong>
                    {' — '}
                    <span className="text-[11px]">{doc.format}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Select button in expanded view */}
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            onClick={() => onSelect(visa)}
            aria-pressed={isSelected}
            className="w-full text-xs font-semibold min-h-[38px] flex items-center justify-center gap-2"
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Selected</span>
              </>
            ) : (
              <span>Select this Visa</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
