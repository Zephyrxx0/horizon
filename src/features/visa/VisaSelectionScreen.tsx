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
import { ChevronRight, Globe2, Compass } from 'lucide-react';

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
    <div className={`space-y-5 ${className}`}>
      {/* Accessible Error Summary */}
      {errors.length > 0 && <ErrorSummary errors={errors} />}

      {/* Screen Title */}
      <div className="space-y-0.5">
        <h2 className="text-lg font-bold text-[var(--color-ink)]">Select Visa & Destination</h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Choose where you're traveling and why to see matching visa options with fees.
        </p>
      </div>

      {/* Two-column layout on desktop: filters left, visa cards right */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        {/* Left: Filters */}
        <div className="space-y-4">
          {/* Destination */}
          <div className="space-y-1.5" id="destinationCountry">
            <label
              htmlFor="destination-select"
              className="text-xs font-semibold text-[var(--color-ink)] flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Globe2 className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" aria-hidden="true" />
              Destination Country
            </label>
            <Select
              id="destination-select"
              value={destination}
              onChange={handleDestinationChange}
              className="w-full"
            >
              {DESTINATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.flag} {d.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Purpose */}
          <div className="space-y-1.5" id="tripPurpose">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" aria-hidden="true" />
              <span className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider">
                Purpose of Visit
              </span>
            </div>
            <RadioCardGroup
              legend="Trip Purpose"
              value={purpose}
              onChange={handlePurposeChange}
              className="grid grid-cols-2 lg:grid-cols-1 gap-1.5"
            >
              {TRIP_PURPOSES.map((p) => (
                <RadioCard
                  key={p.value}
                  value={p.value}
                  label={p.label}
                  description={p.description}
                />
              ))}
            </RadioCardGroup>
          </div>
        </div>

        {/* Right: Visa options */}
        <div className="space-y-2" id="visaId">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider">
              {availableVisas.length} option{availableVisas.length !== 1 ? 's' : ''} for{' '}
              {destination}
            </h3>
            <span className="text-xs text-[var(--color-ink-muted)]">
              Click a card to expand details
            </span>
          </div>

          <div className="space-y-2">
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
      </div>

      {/* Continue Action */}
      <div className="pt-3 border-t border-[var(--color-border)]">
        <Button
          variant="primary"
          onClick={handleContinue}
          className="w-full sm:w-auto sm:min-w-[240px] min-h-[44px] text-sm font-semibold flex items-center justify-center gap-2"
        >
          <span>Continue to Personal Details</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
