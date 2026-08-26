import React, { useState, useCallback } from 'react';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Field, FieldLabel, FieldHint, FieldError } from '../../components/ui/Field';
import { StatusTimelineCard } from './StatusTimelineCard';
import { formatReferenceNumber, isValidReferenceNumber } from './reference';
import {
  getStoredSubmissions,
  SEEDED_DUPLICATE_PASSPORTS,
  type ApplicationSubmissionRecord,
} from '../../services/mock/duplicate';
import { Search, RotateCcw } from 'lucide-react';

export interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReference?: string;
}

function findSubmissionRecord(targetRef: string): ApplicationSubmissionRecord | null {
  if (!isValidReferenceNumber(targetRef)) return null;

  // 1. Check local submissions
  const local = getStoredSubmissions();
  const foundLocal = local.find((r) => r.referenceNumber.toUpperCase() === targetRef);
  if (foundLocal) return foundLocal;

  // 2. Check seeded passports
  const seededList = Object.values(SEEDED_DUPLICATE_PASSPORTS);
  const foundSeeded = seededList.find((r) => r.referenceNumber.toUpperCase() === targetRef);
  if (foundSeeded) return foundSeeded;

  // 3. Fallback mock record for valid format demo references
  return {
    referenceNumber: targetRef,
    passportNumber: 'P8765432',
    applicantName: 'Applicant',
    visaType: 'Tourist Visa',
    country: 'International',
    submittedAt: new Date().toISOString(),
    status: 'Documents Under Review',
  };
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  initialReference = '',
}) => {
  const [referenceInput, setReferenceInput] = useState(initialReference);
  const [searchedRecord, setSearchedRecord] = useState<ApplicationSubmissionRecord | null>(() =>
    initialReference ? findSubmissionRecord(initialReference.trim().toUpperCase()) : null,
  );
  const [hasSearched, setHasSearched] = useState(Boolean(initialReference));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitRef, setPrevInitRef] = useState(initialReference);

  if (isOpen !== prevIsOpen || initialReference !== prevInitRef) {
    setPrevIsOpen(isOpen);
    setPrevInitRef(initialReference);
    if (isOpen && initialReference) {
      setReferenceInput(initialReference);
      setSearchedRecord(findSubmissionRecord(initialReference.trim().toUpperCase()));
      setHasSearched(true);
      setErrorMsg(null);
    } else if (isOpen && !initialReference) {
      setSearchedRecord(null);
      setHasSearched(false);
      setErrorMsg(null);
    }
  }

  const handleLookup = useCallback(
    (refToLookup?: string) => {
      const targetRef = (refToLookup || referenceInput).trim().toUpperCase();
      setHasSearched(true);
      setErrorMsg(null);

      if (!isValidReferenceNumber(targetRef)) {
        setErrorMsg('Please enter a valid 14-character reference number (e.g., VR-2026-849201).');
        setSearchedRecord(null);
        return;
      }

      setSearchedRecord(findSubmissionRecord(targetRef));
    },
    [referenceInput],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatReferenceNumber(e.target.value);
    setReferenceInput(formatted);
    if (errorMsg) setErrorMsg(null);
  };

  const handleResetSearch = () => {
    setReferenceInput('');
    setSearchedRecord(null);
    setHasSearched(false);
    setErrorMsg(null);
  };

  return (
    <Sheet open={isOpen} onClose={onClose} title="Track Your Application Status">
      <div className="space-y-6 pt-2">
        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="space-y-3"
        >
          <Field invalid={Boolean(errorMsg)}>
            <FieldLabel>Application Reference Number</FieldLabel>
            <FieldHint>Enter your 14-character reference (e.g. VR-2026-849201)</FieldHint>
            <div className="flex gap-2">
              <Input
                value={referenceInput}
                onChange={handleInputChange}
                placeholder="VR-2026-XXXXXX"
                maxLength={14}
                className="font-mono text-base tracking-wide flex-1 uppercase"
                data-testid="tracking-reference-input"
              />
              <Button
                type="submit"
                variant="primary"
                className="min-h-[48px] px-5 font-semibold text-sm flex items-center gap-1.5 shrink-0"
                data-testid="track-submit-btn"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>Track</span>
              </Button>
            </div>
            {errorMsg && <FieldError>{errorMsg}</FieldError>}
          </Field>
        </form>

        {/* Search Results */}
        {hasSearched && searchedRecord && (
          <div className="space-y-5 animate-fadeIn">
            {/* Record Summary */}
            <div className="p-4 rounded-[var(--radius-card)] bg-slate-50 border border-[var(--color-border)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Application Summary
                </span>
                <span className="font-mono font-bold text-[var(--color-green-success,#166534)] text-sm">
                  {searchedRecord.referenceNumber}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-[var(--color-ink-muted)] block">Applicant</span>
                  <strong className="text-[var(--color-ink)] font-semibold truncate block">
                    {searchedRecord.applicantName}
                  </strong>
                </div>
                <div>
                  <span className="text-[var(--color-ink-muted)] block">Category</span>
                  <strong className="text-[var(--color-ink)] font-semibold truncate block">
                    {searchedRecord.visaType} ({searchedRecord.country})
                  </strong>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[var(--color-ink-muted)] block">Status</span>
                  <strong className="text-[var(--color-indigo-primary)] font-semibold block">
                    {searchedRecord.status}
                  </strong>
                </div>
              </div>
            </div>

            {/* Embedded Live Status Timeline */}
            <StatusTimelineCard referenceNumber={searchedRecord.referenceNumber} />
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
          {hasSearched ? (
            <Button
              variant="outline"
              onClick={handleResetSearch}
              className="text-xs font-semibold text-[var(--color-ink-muted)] flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Search Another Reference</span>
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="secondary"
            onClick={onClose}
            className="min-h-[44px] px-5 font-semibold text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </Sheet>
  );
};
