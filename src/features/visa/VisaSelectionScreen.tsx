import React, { useState, useMemo } from 'react';
import { useWizardActor } from '../wizard/context';
import { useSelector } from '@xstate/react';
import { DESTINATIONS, type DestinationCountry, type VisaItem } from './types';
import { getVisaOptions } from './catalog';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { ErrorSummary, type ErrorSummaryItem } from '../../components/ui/ErrorSummary';
import { validateVisaSelectionStep } from '../wizard/validators';
import {
  ChevronRight,
  Globe2,
  Check,
  Clock,
  FileText,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';

export interface VisaSelectionScreenProps {
  className?: string;
}

export const VisaSelectionScreen: React.FC<VisaSelectionScreenProps> = ({ className = '' }) => {
  const actor = useWizardActor();
  const answers = useSelector(actor, (s) => s.context.answers);

  const destination = (answers.destinationCountry as DestinationCountry) || 'USA';
  const selectedVisaId = (answers.visaId as string) || (destination === 'USA' ? 'usa-b1b2' : '');

  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);

  // Get all visas for selected destination
  const availableVisas = useMemo(() => {
    return getVisaOptions(destination);
  }, [destination]);

  // Selected visa item
  const selectedVisa = useMemo(() => {
    return availableVisas.find((v) => v.id === selectedVisaId) || availableVisas[0];
  }, [availableVisas, selectedVisaId]);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextDest = e.target.value as DestinationCountry;
    const matching = getVisaOptions(nextDest);
    const topMatch = matching[0];

    actor.send({
      type: 'ANSWERS_BATCHED',
      answers: {
        destinationCountry: nextDest,
        tripPurpose: topMatch?.purposes?.[0] || 'tourism',
        visaId: topMatch ? topMatch.id : '',
        visaCategory: topMatch ? topMatch.category : '',
        visaName: topMatch ? topMatch.name : '',
        visaTotalCost: topMatch ? topMatch.totalCost : 0,
      },
    });
    setErrors([]);
  };

  const handleVisaSelect = (visa: VisaItem) => {
    actor.send({
      type: 'ANSWERS_BATCHED',
      answers: {
        visaId: visa.id,
        tripPurpose: visa.purposes[0] || 'tourism',
        visaCategory: visa.category,
        visaName: visa.name,
        visaTotalCost: visa.totalCost,
      },
    });
    setErrors([]);
  };

  const handleContinue = () => {
    const purposeToValidate =
      selectedVisa?.purposes?.[0] || (answers.tripPurpose as string) || 'tourism';

    const validationErrors = validateVisaSelectionStep({
      destinationCountry: destination,
      tripPurpose: purposeToValidate,
      visaId: selectedVisa?.id || selectedVisaId,
    });

    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      setErrors(
        errorKeys.map((key) => ({
          fieldId: key,
          label:
            key === 'destinationCountry'
              ? 'Destination'
              : key === 'tripPurpose'
                ? 'Purpose'
                : 'Visa Type',
          message: validationErrors[key],
        })),
      );
      return;
    }

    setErrors([]);
    actor.send({ type: 'NEXT' });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Accessible Error Summary */}
      {errors.length > 0 && <ErrorSummary errors={errors} />}

      {/* Screen Title */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)] tracking-tight">
          Select Your Visa & Destination
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
          Choose your destination country and select a visa category to review requirements and
          fees.
        </p>
      </div>

      {/* ── Top Destination Bar ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-subtle)]/50 border border-[var(--color-border)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-1.5" id="destinationCountry">
            <label
              htmlFor="destination-select"
              className="text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Globe2
                className="w-3.5 h-3.5 text-[var(--color-saffron-bright)]"
                aria-hidden="true"
              />
              Where are you traveling to?
            </label>
            <Select
              id="destination-select"
              value={destination}
              onChange={handleDestinationChange}
              className="w-full bg-[var(--color-surface-card)]"
            >
              {DESTINATIONS.map((d) => (
                <option
                  key={d.value}
                  value={d.value}
                  className="bg-[var(--color-surface-card)] text-[var(--color-ink)]"
                >
                  {d.flag} {d.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)]/70 text-xs">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-saffron-bright)]/10 flex items-center justify-center shrink-0 text-[var(--color-saffron-bright)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[var(--color-ink)] block">
                Consular Verified Pricing
              </span>
              <span className="text-[var(--color-ink-muted)] text-[11px] block">
                100% transparent fee breakdowns with zero hidden surcharge.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Split Layout: Left Options List & Right Open Details ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] gap-6 items-start"
        id="visaId"
      >
        {/* Left Column: Visa Options List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider">
              Available Visa Types ({availableVisas.length})
            </h3>
            <span className="text-[11px] text-[var(--color-ink-muted)]">Select an option</span>
          </div>

          <div className="space-y-2.5" role="radiogroup" aria-label="Visa categories">
            {availableVisas.map((visa) => {
              const isSelected = selectedVisa?.id === visa.id || selectedVisaId === visa.id;

              return (
                <div
                  key={visa.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => handleVisaSelect(visa)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      handleVisaSelect(visa);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-[var(--color-indigo-primary)] bg-[var(--color-surface-card)] shadow-sm ring-2 ring-[var(--color-indigo-primary)]/20'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--color-ink-muted)] hover:bg-[var(--color-surface-subtle)]/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[var(--color-indigo-primary)] bg-[var(--color-indigo-primary)]'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <h4 className="text-sm font-bold text-[var(--color-ink)] leading-snug">
                          {visa.name}
                        </h4>
                        {visa.isRecommended && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--color-saffron-bright)]/15 text-[var(--color-saffron-bright)] dark:text-amber-400 border border-[var(--color-saffron-bright)]/30">
                            Recommended
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-[var(--color-ink-muted)] pt-1">
                        <span className="font-semibold text-[var(--color-ink)] text-sm">
                          ₹{visa.totalCost.toLocaleString('en-IN')}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" />
                          {visa.processingTimeDisplay}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Open Selected Visa Details Panel */}
        {selectedVisa && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-5">
            {/* Header */}
            <div className="border-b border-[var(--color-border)]/60 pb-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-ink)]">
                    {selectedVisa.name}
                  </h3>
                  {selectedVisa.isRecommended && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-saffron-bright)]/15 text-[var(--color-saffron-bright)] dark:text-amber-400 border border-[var(--color-saffron-bright)]/30">
                      <Sparkles className="w-3 h-3" />
                      Recommended for your trip
                    </span>
                  )}
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-surface-subtle)] font-medium text-[var(--color-ink)]">
                  {selectedVisa.destination} Consular Category
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] leading-relaxed">
                {selectedVisa.description}
              </p>
            </div>

            {/* Transparent Fee Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider block">
                Official Fee Breakdown
              </span>
              <div className="rounded-xl bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border)] p-4 space-y-2 text-xs">
                <div className="flex justify-between text-[var(--color-ink-muted)]">
                  <span>Standard Visa Processing Fee</span>
                  <span className="font-medium text-[var(--color-ink)]">
                    ₹{selectedVisa.visaFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--color-ink-muted)]">
                  <span>Government Embassy / MEA Consular Fee</span>
                  <span className="font-medium text-[var(--color-ink)]">
                    ₹{selectedVisa.govtFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--color-ink-muted)]">
                  <span>Digital Verification & Document Archival</span>
                  <span className="font-medium text-[var(--color-ink)]">
                    ₹{selectedVisa.platformFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-[var(--color-border)] flex justify-between font-bold text-sm text-[var(--color-ink)]">
                  <span>Total Amount Due at Step 4</span>
                  <span className="text-base text-[var(--color-indigo-primary)] dark:text-blue-400">
                    ₹{selectedVisa.totalCost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-[var(--color-saffron-bright)]" />
                <span>Required Documents Checklist</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedVisa.requiredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--color-ink)]">{doc.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface-card)] text-[var(--color-ink-muted)] border border-[var(--color-border)]">
                        {doc.format}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-ink-muted)] leading-snug">
                      {doc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Consular Tip */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Passport must have minimum <strong>6 months validity</strong> from travel date with
                at least <strong>2 blank pages</strong>.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {selectedVisa && (
          <div className="text-xs text-[var(--color-ink-muted)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Total Fee:{' '}
              <strong className="text-[var(--color-ink)] font-semibold">
                ₹{selectedVisa.totalCost.toLocaleString('en-IN')}
              </strong>{' '}
              (100% transparent pricing)
            </span>
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleContinue}
          className="w-full sm:w-auto sm:min-w-[240px] min-h-[44px] text-sm font-semibold flex items-center justify-center gap-2 rounded-xl shadow-xs"
        >
          <span>Continue to Personal Details</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
