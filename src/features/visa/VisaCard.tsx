import React from 'react';
import { Clock, Sparkles, FileText, Check } from 'lucide-react';
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
  return (
    <div
      className={`relative p-5 rounded-[var(--radius-card)] border-2 transition-all bg-[var(--color-surface-card)] ${
        isSelected
          ? 'border-[var(--color-indigo-primary)] shadow-md ring-1 ring-[var(--color-indigo-primary)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-ink-muted)]'
      } ${className}`}
    >
      {/* Recommended Tag */}
      {visa.isRecommended && (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--color-saffron-bright)] text-[var(--color-ink)] mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-indigo-primary)]" aria-hidden="true" />
          <span>Recommended for your trip</span>
        </div>
      )}

      {/* Header & Description */}
      <div className="space-y-1 mb-4">
        <h3 className="text-lg font-bold text-[var(--color-ink)] leading-snug">{visa.name}</h3>
        <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{visa.description}</p>
      </div>

      {/* Processing Time */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[var(--color-surface-bg)] text-[var(--color-ink)] border border-[var(--color-border)] mb-4">
        <Clock className="w-3.5 h-3.5 text-[var(--color-indigo-primary)]" aria-hidden="true" />
        <span>
          Typical processing time: <strong>{visa.processingTimeDisplay}</strong>
        </span>
      </div>

      {/* Itemized Cost Breakdown */}
      <div className="p-3 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border)] mb-4 space-y-1.5 text-xs">
        <div className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">
          Itemized Fee Breakdown
        </div>
        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span>Visa Processing Fee:</span>
          <span className="font-medium text-[var(--color-ink)]">
            ₹{visa.visaFee.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span>Government Embassy Fee:</span>
          <span className="font-medium text-[var(--color-ink)]">
            ₹{visa.govtFee.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span>Platform & Verification Fee:</span>
          <span className="font-medium text-[var(--color-ink)]">
            ₹{visa.platformFee.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="pt-2 border-t border-[var(--color-border)] flex justify-between text-sm font-bold text-[var(--color-ink)]">
          <span>Total Upfront Cost:</span>
          <span className="text-[var(--color-indigo-primary)]">
            ₹{visa.totalCost.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Upfront Document Checklist */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5 text-[var(--color-indigo-primary)]" aria-hidden="true" />
          <span>Required Document Checklist</span>
        </div>
        <ul className="space-y-1.5 pl-1 text-xs">
          {visa.requiredDocuments.map((doc) => (
            <li key={doc.id} className="flex items-start gap-2 text-[var(--color-ink-muted)]">
              <span className="text-[var(--color-success)] font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-[var(--color-ink)]">{doc.name}</strong>
                <span className="text-[11px] block text-[var(--color-ink-muted)]">
                  {doc.description} ({doc.format})
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Select Action Button */}
      <Button
        variant={isSelected ? 'primary' : 'secondary'}
        onClick={() => onSelect(visa)}
        aria-pressed={isSelected}
        className="w-full min-h-[48px] flex items-center justify-center gap-2 font-semibold"
      >
        {isSelected ? (
          <>
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>Selected Visa</span>
          </>
        ) : (
          <span>Select this Visa</span>
        )}
      </Button>
    </div>
  );
};
