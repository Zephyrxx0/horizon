import React from 'react';
import { CheckCircle2, RefreshCw, Trash2, Eye, AlertCircle, Loader2 } from 'lucide-react';
import type { DocumentAttachment } from './types';

export interface StatusBadgeProps {
  status: 'idle' | 'optimizing' | 'ready' | 'error';
  attachment?: DocumentAttachment | null;
  errorMessage?: string;
  onReplace?: () => void;
  onRemove?: () => void;
  onInspect?: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  attachment,
  errorMessage,
  onReplace,
  onRemove,
  onInspect,
}) => {
  if (status === 'idle') {
    return null;
  }

  if (status === 'optimizing') {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-900 rounded-lg text-sm"
        role="status"
        aria-busy="true"
      >
        <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" aria-hidden="true" />
        <span className="font-medium">Optimizing image…</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-900 rounded-lg text-sm"
        role="alert"
      >
        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-semibold">{errorMessage || 'Upload failed. Please try again.'}</p>
        </div>
        {onReplace && (
          <button
            type="button"
            onClick={onReplace}
            className="text-xs font-semibold text-red-800 underline hover:text-red-950 min-h-[48px] px-2"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (status === 'ready' && attachment) {
    const formattedSize =
      attachment.compressedSize < 1024 * 1024
        ? `${Math.round(attachment.compressedSize / 1024)} KB`
        : `${(attachment.compressedSize / (1024 * 1024)).toFixed(1)} MB`;

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-green-50/80 border border-green-200 rounded-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">
              {attachment.fileName}
            </p>
            <p className="text-xs text-gray-600">✓ Ready • {formattedSize}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onInspect && (
            <button
              type="button"
              onClick={onInspect}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-indigo-900 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label={`Preview ${attachment.fileName}`}
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Preview</span>
            </button>
          )}

          {onReplace && (
            <button
              type="button"
              onClick={onReplace}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label={`Replace ${attachment.fileName}`}
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Replace</span>
            </button>
          )}

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-red-600"
              aria-label={`Remove ${attachment.fileName}`}
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
