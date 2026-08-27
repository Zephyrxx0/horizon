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
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div
      className={`rounded-2xl border transition-all bg-[var(--color-surface-card)] flex flex-col justify-between overflow-hidden ${
        isSelected
          ? 'border-[var(--color-indigo-primary)] shadow-md ring-2 ring-[var(--color-indigo-primary)]/20 bg-[var(--color-surface-card)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-ink-muted)] hover:shadow-xs'
      } ${className}`}
    >
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        {/* ── Top Header Row ── */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              {/* Radio selection indicator */}
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(visa)}
                className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[var(--color-indigo-primary)] bg-[var(--color-indigo-primary)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-ink-muted)]'
                }`}
                aria-label={isSelected ? `${visa.name} selected` : `Select ${visa.name}`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </button>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h4 className="text-sm sm:text-base font-bold text-[var(--color-ink)] leading-snug">
                    {visa.name}
                  </h4>
                  {visa.isRecommended && (
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-saffron-bright)]/15 text-[var(--color-saffron-bright)] dark:text-amber-400 border border-[var(--color-saffron-bright)]/30">
                      Recommended for your trip
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--color-ink-muted)] line-clamp-2 leading-relaxed">
                  {visa.description}
                </p>
              </div>
            </div>

            {/* Total Fee & Expand Button */}
            <div className="text-right shrink-0">
              <div className="text-sm sm:text-base font-bold text-[var(--color-ink)]">
                ₹{visa.totalCost.toLocaleString('en-IN')} total
              </div>
              <div className="flex items-center justify-end gap-1 text-[11px] text-[var(--color-ink-muted)]">
                <Clock className="w-3 h-3" />
                <span>{visa.processingTimeDisplay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Expandable Details (Fee Breakdown & Documents) ── */}
        <div className="pt-2 border-t border-[var(--color-border)]/60">
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="w-full flex items-center justify-between py-1 text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
            aria-expanded={showDetails}
            aria-label={
              showDetails ? 'Hide breakdown and checklist' : 'Show breakdown and checklist'
            }
          >
            <span>
              {showDetails ? 'Hide Details & Checklist' : 'View Fee Breakdown & Documents'}
            </span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="pt-3 space-y-3 animate-in fade-in duration-200">
              {/* Fee Breakdown Table */}
              <div className="rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] p-3 space-y-1.5 text-xs">
                <div className="text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">
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
                <div className="pt-1.5 border-t border-[var(--color-border)] flex justify-between font-bold text-xs sm:text-sm text-[var(--color-ink)]">
                  <span>Total</span>
                  <span>₹{visa.totalCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Document Checklist */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-[var(--color-saffron-bright)]" />
                  Required Document Checklist
                </div>
                <ul className="space-y-1 pl-1">
                  {visa.requiredDocuments.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-start gap-2 text-xs text-[var(--color-ink-muted)]"
                    >
                      <span className="text-[var(--color-success)] font-bold shrink-0">✓</span>
                      <span>
                        <strong className="text-[var(--color-ink)] font-medium">{doc.name}</strong>
                        {' — '}
                        <span className="text-[11px] text-[var(--color-ink-muted)]">
                          {doc.format}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ── Select Button ── */}
        <div className="pt-2">
          <Button
            variant={isSelected ? 'primary' : 'outline'}
            onClick={() => onSelect(visa)}
            aria-pressed={isSelected}
            className={`w-full text-xs font-semibold min-h-[38px] flex items-center justify-center gap-2 rounded-xl transition-all ${
              isSelected ? 'bg-[var(--color-indigo-primary)] text-white shadow-xs' : ''
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Selected Visa</span>
              </>
            ) : (
              <span>Select this Visa</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
