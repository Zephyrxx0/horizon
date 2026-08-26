import React from 'react';
import { AlertTriangle, Camera, Check } from 'lucide-react';

export interface QualityWarningCardProps {
  warnings?: string[];
  onRetake: () => void;
  onAcknowledge: () => void;
  isAcknowledged?: boolean;
}

export const QualityWarningCard: React.FC<QualityWarningCardProps> = ({
  warnings = [],
  onRetake,
  onAcknowledge,
  isAcknowledged = false,
}) => {
  return (
    <div
      className="p-4 bg-amber-50/90 border border-amber-300 rounded-xl space-y-3"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-900">
            Image looks blurry or low-resolution
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">
            All text, numbers, and dates must be sharp and legible to avoid embassy visa delays or
            rejection.
          </p>
          {warnings.length > 0 && (
            <ul className="text-xs text-amber-900 list-disc list-inside mt-1 space-y-0.5">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-800 rounded-lg hover:bg-amber-900 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-sm"
        >
          <Camera className="w-4 h-4" aria-hidden="true" />
          <span>Retake Photo</span>
        </button>

        {!isAcknowledged ? (
          <button
            type="button"
            onClick={onAcknowledge}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-900 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            <span>✓ Use This Image Anyway</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-900 py-2 px-1">
            <Check className="w-4 h-4 text-green-700" aria-hidden="true" />
            <span>Warning acknowledged</span>
          </span>
        )}
      </div>
    </div>
  );
};
