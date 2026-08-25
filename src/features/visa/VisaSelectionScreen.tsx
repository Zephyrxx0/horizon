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

  // Compute available matching visas
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
    <div className={`space-y-6 max-w-xl mx-auto ${className}`}>
      {/* Top Accessible Error Summary */}
      {errors.length > 0 && <ErrorSummary errors={errors} />}

      {/* Screen Title & Subtitle */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
          Select Your Visa & Destination
        </h2>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Choose where you are traveling and why. We will recommend the exact visa type, show
          transparent fees, and list your required documents upfront.
        </p>
      </div>

      {/* Step 1: Destination Country */}
      <div className="space-y-2" id="destinationCountry">
        <label
          htmlFor="destination-select"
          className="text-base font-semibold text-[var(--color-ink)] flex items-center gap-2"
        >
          <Globe2 className="w-4 h-4 text-[var(--color-indigo-primary)]" aria-hidden="true" />
          <span>Where are you traveling to?</span>
        </label>
        <Select
          id="destination-select"
          value={destination}
          onChange={handleDestinationChange}
          className="w-full min-h-[48px] text-base"
        >
          {DESTINATIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.flag} {d.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Step 2: Trip Purpose */}
      <div className="space-y-3" id="tripPurpose">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[var(--color-indigo-primary)]" aria-hidden="true" />
          <span className="text-base font-semibold text-[var(--color-ink)]">
            What is the primary purpose of your trip?
          </span>
        </div>
        <RadioCardGroup
          legend="Trip Purpose"
          value={purpose}
          onChange={handlePurposeChange}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          {TRIP_PURPOSES.map((p) => (
            <RadioCard key={p.value} value={p.value} label={p.label} description={p.description} />
          ))}
        </RadioCardGroup>
      </div>

      {/* Step 3: Matching Visa Cards */}
      <div className="space-y-3 pt-2" id="visaId">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--color-ink)]">
            Available Visa Options for {destination} ({availableVisas.length})
          </h3>
          <span className="text-xs text-[var(--color-ink-muted)]">Pick one to proceed</span>
        </div>

        <div className="space-y-4">
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

      {/* Continue Action */}
      <div className="pt-4 border-t border-[var(--color-border)]">
        <Button
          variant="primary"
          onClick={handleContinue}
          className="w-full min-h-[50px] text-base font-semibold flex items-center justify-center gap-2"
        >
          <span>Continue to Personal Details</span>
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
