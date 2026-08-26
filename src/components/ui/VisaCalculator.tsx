import { useState, useMemo } from 'react';
import {
  DESTINATIONS,
  TRIP_PURPOSES,
  type DestinationCountry,
  type TripPurpose,
} from '../../features/visa/types';
import { getVisaOptions } from '../../features/visa/catalog';
import { Select } from './Select';
import { Button } from './Button';
import { Calculator, ArrowRight } from 'lucide-react';

export interface VisaCalculatorProps {
  onSelectVisa?: (visaId: string, destination: DestinationCountry, purpose: TripPurpose) => void;
  className?: string;
  headingLevel?: 'h2' | 'h3' | 'div';
}

export function VisaCalculator({
  onSelectVisa,
  className = '',
  headingLevel = 'h2',
}: VisaCalculatorProps) {
  const [destination, setDestination] = useState<DestinationCountry>('USA');
  const [purpose, setPurpose] = useState<TripPurpose>('tourism');

  const matchingVisas = useMemo(() => {
    return getVisaOptions(destination, purpose);
  }, [destination, purpose]);

  const recommendedVisa = matchingVisas[0] || null;

  return (
    <div
      className={`rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs p-5 sm:p-6 space-y-5 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3.5">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-zinc-700 dark:text-zinc-300" aria-hidden="true" />
          {headingLevel === 'h2' && (
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Visa & Tariff Checker
            </h2>
          )}
          {headingLevel === 'h3' && (
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Visa & Tariff Checker
            </h3>
          )}
          {headingLevel === 'div' && (
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Visa & Tariff Checker
            </div>
          )}
        </div>
        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          Official MEA Tariff
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label
            htmlFor="calc-destination"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Passport / Nationality
          </label>
          <Select
            id="calc-destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value as DestinationCountry)}
            className="w-full text-xs"
          >
            {DESTINATIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.flag} {d.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="calc-purpose"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Purpose of Visit
          </label>
          <Select
            id="calc-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as TripPurpose)}
            className="w-full text-xs"
          >
            {TRIP_PURPOSES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Recommended Visa Result Card */}
      {recommendedVisa && (
        <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Recommended
              </span>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {recommendedVisa.name}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {recommendedVisa.description}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Total Fee</span>
              <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                ${recommendedVisa.totalCost} USD
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700 text-xs">
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Processing</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {recommendedVisa.processingTimeDisplay}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Govt Fee</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200 tabular-nums">
                ${recommendedVisa.govtFee} USD
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Validity</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {recommendedVisa.processingDaysMax} Days
              </span>
            </div>
          </div>

          {onSelectVisa && (
            <div className="pt-1">
              <Button
                variant="primary"
                onClick={() => onSelectVisa(recommendedVisa.id, destination, purpose)}
                className="w-full text-xs font-medium py-2 min-h-[36px]"
              >
                <span>Apply for this Visa</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
