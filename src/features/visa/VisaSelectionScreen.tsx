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
  FileCheck,
  Camera,
  Landmark,
  GraduationCap,
  Briefcase,
  Calendar,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

export interface VisaSelectionScreenProps {
  className?: string;
}

function getDocumentIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('passport'))
    return (
      <FileCheck className="w-4 h-4 text-[var(--color-indigo-primary)] dark:text-blue-400 shrink-0" />
    );
  if (lower.includes('photo'))
    return <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
  if (
    lower.includes('financial') ||
    lower.includes('bank') ||
    lower.includes('statement') ||
    lower.includes('fund') ||
    lower.includes('affidavit')
  )
    return <Landmark className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
  if (
    lower.includes('academic') ||
    lower.includes('degree') ||
    lower.includes('transcript') ||
    lower.includes('score') ||
    lower.includes('i-20')
  )
    return <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />;
  if (
    lower.includes('employ') ||
    lower.includes('contract') ||
    lower.includes('letter') ||
    lower.includes('job') ||
    lower.includes('business')
  )
    return <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />;
  if (
    lower.includes('itinerary') ||
    lower.includes('hotel') ||
    lower.includes('travel') ||
    lower.includes('booking')
  )
    return <Calendar className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
  return <FileText className="w-4 h-4 text-[var(--color-ink-muted)] shrink-0" />;
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

  const currentDestinationObj = useMemo(() => {
    return DESTINATIONS.find((d) => d.value === destination) || DESTINATIONS[0];
  }, [destination]);

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

      {/* Screen Title & Eyebrow */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-indigo-primary)] dark:text-blue-400">
          <Layers className="w-3.5 h-3.5 text-[var(--color-saffron-bright)]" aria-hidden="true" />
          <span>Stage 1 of 5 • Destination & Visa Classification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] tracking-tight text-balance">
          Select Your Visa & Destination
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] text-pretty leading-relaxed max-w-2xl">
          Choose your destination country and select the visa category that matches your travel
          purpose to review official consular requirements, fee structures, and processing
          timelines.
        </p>
      </div>

      {/* ── Top Destination Bar ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[var(--color-surface-subtle)]/70 via-[var(--color-surface-subtle)]/40 to-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs">
        <div className="space-y-2 w-full md:w-auto" id="destinationCountry">
          <label
            htmlFor="destination-select"
            className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-2 uppercase tracking-wider"
          >
            <div className="w-5 h-5 rounded-md bg-[var(--color-saffron-bright)]/10 border border-[var(--color-saffron-bright)]/20 flex items-center justify-center">
              <Globe2 className="w-3 h-3 text-[var(--color-saffron-bright)]" aria-hidden="true" />
            </div>
            <span>Where are you traveling to?</span>
          </label>

          <div className="flex items-center gap-3">
            <Select
              id="destination-select"
              value={destination}
              onChange={handleDestinationChange}
              containerClassName="w-full sm:w-80"
              className="bg-[var(--color-surface-card)] font-bold text-sm shadow-xs"
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

            <span className="hidden sm:inline-flex text-2xl select-none" aria-hidden="true">
              {currentDestinationObj.flag}
            </span>
          </div>
        </div>

        {/* Consular Guarantee Badge */}
        <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)]/80 shadow-xs text-xs shrink-0 self-stretch md:self-auto">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-[var(--color-ink)] block text-xs">
              Consular Verified Pricing
            </span>
            <span className="text-[var(--color-ink-muted)] text-[11px] block">
              100% transparent fee breakdowns with zero hidden surcharges.
            </span>
          </div>
        </div>
      </div>

      {/* ── Split Layout: Left Options List & Right Open Details ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[360px_1fr] xl:grid-cols-[390px_1fr] gap-6 items-start"
        id="visaId"
      >
        {/* Left Column: Visa Options List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-0.5">
            <h3 className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider flex items-center gap-2">
              <span>Available Visa Types</span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-ink)] font-mono text-[10px] font-semibold border border-[var(--color-border)]">
                {availableVisas.length}
              </span>
            </h3>
            <span className="text-[11px] text-[var(--color-ink-muted)] font-medium">
              Select an option
            </span>
          </div>

          <div className="space-y-3" role="radiogroup" aria-label="Visa categories">
            {availableVisas.map((visa) => {
              const isSelected = selectedVisa?.id === visa.id || selectedVisaId === visa.id;

              return (
                <div
                  key={visa.id}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${visa.name}, ₹${visa.totalCost.toLocaleString('en-IN')}, ${visa.processingTimeDisplay}`}
                  tabIndex={0}
                  onClick={() => handleVisaSelect(visa)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      handleVisaSelect(visa);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none active:scale-[0.98] ${
                    isSelected
                      ? 'border-[var(--color-indigo-primary)] dark:border-blue-400 bg-[var(--color-surface-card)] shadow-sm ring-2 ring-[var(--color-indigo-primary)]/15 dark:ring-blue-400/20'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--color-indigo-primary)]/40 hover:bg-[var(--color-surface-subtle)]/30 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Radio indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[var(--color-indigo-primary)] dark:border-blue-400 bg-[var(--color-indigo-primary)] dark:bg-blue-400'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      {isSelected && (
                        <Check
                          className="w-3 h-3 text-white dark:text-slate-900"
                          strokeWidth={3.5}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <h4 className="text-sm font-bold text-[var(--color-ink)] leading-snug">
                          {visa.name}
                        </h4>
                        {visa.isRecommended && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-saffron-bright)]/15 text-[var(--color-saffron-bright)] dark:text-amber-400 border border-[var(--color-saffron-bright)]/30">
                            <Sparkles className="w-2.5 h-2.5" />
                            Recommended
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--color-border)]/50 mt-2">
                        <span className="font-bold text-[var(--color-ink)] text-sm tabular-nums">
                          ₹{visa.totalCost.toLocaleString('en-IN')}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-ink-muted)]">
                          <Clock className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
                          <span>{visa.processingTimeDisplay}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Visa Details Panel (The Signature Centerpiece) */}
        {selectedVisa && (
          <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs p-5 sm:p-6 space-y-6">
            {/* Header */}
            <div className="border-b border-[var(--color-border)]/70 pb-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-ink)] tracking-tight">
                    {selectedVisa.name}
                  </h3>
                  {selectedVisa.isRecommended && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--color-saffron-bright)]/15 text-[var(--color-saffron-bright)] dark:text-amber-400 border border-[var(--color-saffron-bright)]/30">
                      <Sparkles className="w-3 h-3" />
                      Recommended for your trip
                    </span>
                  )}
                </div>
                <span className="text-xs px-3 py-1 rounded-lg bg-[var(--color-surface-subtle)] font-semibold text-[var(--color-ink)] border border-[var(--color-border)]">
                  {selectedVisa.destination} Consular Category
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] text-pretty leading-relaxed">
                {selectedVisa.description}
              </p>
            </div>

            {/* Transparent Fee Breakdown */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider">
                  Official Fee Breakdown
                </span>
                <span className="text-[11px] text-[var(--color-ink-muted)]">
                  Consular rate locked
                </span>
              </div>

              <div className="rounded-xl bg-[var(--color-surface-subtle)]/60 border border-[var(--color-border)] p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-[var(--color-ink-muted)]">
                  <span>Standard Visa Processing Fee</span>
                  <span className="font-semibold text-[var(--color-ink)] tabular-nums">
                    ₹{selectedVisa.visaFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--color-ink-muted)]">
                  <span>Government Embassy / MEA Consular Fee</span>
                  <span className="font-semibold text-[var(--color-ink)] tabular-nums">
                    ₹{selectedVisa.govtFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--color-ink-muted)]">
                  <span>Digital Verification & Document Archival</span>
                  <span className="font-semibold text-[var(--color-ink)] tabular-nums">
                    ₹{selectedVisa.platformFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between text-sm text-[var(--color-ink)] font-bold">
                  <span>Total Amount Due at Step 4</span>
                  <span className="text-base sm:text-lg text-[var(--color-indigo-primary)] dark:text-blue-400 tabular-nums">
                    ₹{selectedVisa.totalCost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-[var(--color-saffron-bright)]" />
                  <span>Required Documents Checklist</span>
                </div>
                <span className="text-[11px] text-[var(--color-ink-muted)]">
                  Prepare before Step 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedVisa.requiredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--color-indigo-primary)]/30 hover:shadow-2xs transition-all duration-150 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {getDocumentIcon(doc.name)}
                        <span className="font-bold text-[var(--color-ink)] truncate">
                          {doc.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[var(--color-surface-subtle)] text-[var(--color-ink-muted)] border border-[var(--color-border)] shrink-0">
                        {doc.format}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-ink-muted)] text-pretty leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Consular Advisory */}
            <div className="flex items-start gap-3 p-4 rounded-xl border-l-4 border-[var(--color-saffron-bright)] bg-[var(--color-saffron-50)] dark:bg-[var(--color-saffron-bright)]/10 text-xs text-[var(--color-ink)]">
              <Info className="w-4 h-4 text-[var(--color-saffron-bright)] shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <span className="font-bold text-[var(--color-ink)] block">
                  Passport Requirement Notice:
                </span>
                <span>
                  Your passport must have a minimum of <strong>6 months validity</strong> from your
                  planned arrival date and at least <strong>2 blank unstamped pages</strong> for
                  consular endorsement.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="pt-5 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {selectedVisa && (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] text-xs text-[var(--color-ink-muted)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              Total Fee:{' '}
              <strong className="text-[var(--color-ink)] font-bold text-sm tabular-nums">
                ₹{selectedVisa.totalCost.toLocaleString('en-IN')}
              </strong>{' '}
              <span className="text-[var(--color-ink-muted)] font-normal hidden sm:inline">
                (all taxes & fees included)
              </span>
            </span>
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleContinue}
          className="w-full sm:w-auto sm:min-w-[280px] min-h-[48px] text-sm font-bold flex items-center justify-center gap-2 rounded-xl shadow-xs transition-all active:scale-[0.96] cursor-pointer"
        >
          <span>Continue to Personal Details</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
