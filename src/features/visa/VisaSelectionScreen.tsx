import React, { useState, useMemo } from 'react';
import { useWizardActor } from '../wizard/context';
import { useSelector } from '@xstate/react';
import {
  DESTINATIONS,
  TRIP_PURPOSES,
  type DestinationCountry,
  type TripPurpose,
  type VisaItem,
} from './types';
import { getVisaOptions } from './catalog';
import { VisaCard } from './VisaCard';
import { Select } from '../../components/ui/Select';
import { RadioCardGroup, RadioCard } from '../../components/ui/RadioCard';
import { Button } from '../../components/ui/Button';
import { ErrorSummary, type ErrorSummaryItem } from '../../components/ui/ErrorSummary';
import { validateVisaSelectionStep } from '../wizard/validators';
import { ChevronRight, Globe2, Compass, ShieldCheck } from 'lucide-react';

export interface VisaSelectionScreenProps {
  className?: string;
}

export const VisaSelectionScreen: React.FC<VisaSelectionScreenProps> = ({ className = '' }) => {
  const actor = useWizardActor();
  const answers = useSelector(actor, (s) => s.context.answers);

  const destination = (answers.destinationCountry as DestinationCountry) || 'USA';
  const purpose = (answers.tripPurpose as TripPurpose) || 'tourism';
  const selectedVisaId = (answers.visaId as string) || (destination === 'USA' ? 'usa-b1b2' : '');

  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);

  const availableVisas = useMemo(() => {
    return getVisaOptions(destination, purpose);
  }, [destination, purpose]);

  const selectedVisa = useMemo(() => {
    return availableVisas.find((v) => v.id === selectedVisaId) || availableVisas[0];
  }, [availableVisas, selectedVisaId]);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextDest = e.target.value as DestinationCountry;
    const matching = getVisaOptions(nextDest, purpose);
    const topMatch = matching[0];

    actor.send({
      type: 'ANSWERS_BATCHED',
      answers: {
        destinationCountry: nextDest,
        visaId: topMatch ? topMatch.id : '',
        visaCategory: topMatch ? topMatch.category : '',
        visaName: topMatch ? topMatch.name : '',
        visaTotalCost: topMatch ? topMatch.totalCost : 0,
      },
    });
    setErrors([]);
  };

  const handlePurposeChange = (nextPurpose: string) => {
    const matching = getVisaOptions(destination, nextPurpose as TripPurpose);
    const topMatch = matching[0];

    actor.send({
      type: 'ANSWERS_BATCHED',
      answers: {
        tripPurpose: nextPurpose,
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
        visaCategory: visa.category,
        visaName: visa.name,
        visaTotalCost: visa.totalCost,
      },
    });
    setErrors([]);
  };

  const handleContinue = () => {
    const validationErrors = validateVisaSelectionStep({
      destinationCountry: destination,
      tripPurpose: purpose,
      visaId: selectedVisaId,
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

      {/* Screen Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)] tracking-tight">
          Select Your Visa & Destination
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
          Choose where you're traveling and your primary purpose to view matching visa categories.
        </p>
      </div>

      {/* ── Section 1: Travel Configuration Card ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-subtle)]/50 border border-[var(--color-border)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Destination Selector */}
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

          {/* Quick Info Box */}
          <div className="p-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)]/70 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--color-ink)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-saffron-bright)]" />
              <span>Consular Compliance Guaranteed</span>
            </div>
            <p className="text-[var(--color-ink-muted)] leading-relaxed">
              All categories are vetted against the latest MEA and international immigration
              directives.
            </p>
          </div>
        </div>

        {/* Purpose of Visit Grid */}
        <div className="space-y-2 pt-2 border-t border-[var(--color-border)]/60" id="tripPurpose">
          <div className="flex items-center gap-1.5">
            <Compass
              className="w-3.5 h-3.5 text-[var(--color-saffron-bright)]"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider">
              Purpose of Visit
            </span>
          </div>

          <RadioCardGroup
            legend="Trip Purpose"
            value={purpose}
            onChange={handlePurposeChange}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
          >
            {TRIP_PURPOSES.map((p) => (
              <RadioCard
                key={p.value}
                value={p.value}
                label={p.label}
                description={p.description}
                className="p-3"
              />
            ))}
          </RadioCardGroup>
        </div>
      </div>

      {/* ── Section 2: Matching Visa Options Grid ── */}
      <div className="space-y-3" id="visaId">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-[var(--color-ink)] uppercase tracking-wider">
              Matching Visas for {destination}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-indigo-primary)]/10 text-[var(--color-indigo-primary)] font-semibold">
              {availableVisas.length} Available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableVisas.map((visa) => (
            <VisaCard
              key={visa.id}
              visa={visa}
              isSelected={selectedVisaId === visa.id}
              onSelect={handleVisaSelect}
            />
          ))}
        </div>
      </div>

      {/* ── Section 3: Bottom Action Bar ── */}
      <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {selectedVisa ? (
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
        ) : (
          <div />
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
