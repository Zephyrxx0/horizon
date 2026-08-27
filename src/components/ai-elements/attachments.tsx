import type { HTMLAttributes, ReactNode } from 'react';
import { X, FileImage } from 'lucide-react';

export interface AttachedImage {
  id: string;
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface AttachmentsProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'grid' | 'inline';
  children: ReactNode;
}

export function Attachments({
  variant = 'inline',
  children,
  className = '',
  ...props
}: AttachmentsProps) {
  return (
    <div
      className={`flex flex-wrap gap-2 py-1 ${
        variant === 'grid' ? 'grid grid-cols-3 sm:grid-cols-3' : 'items-center'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface AttachmentProps extends HTMLAttributes<HTMLDivElement> {
  data: AttachedImage;
  onRemove?: () => void;
  children?: ReactNode;
}

export function Attachment({
  data,
  onRemove,
  children,
  className = '',
  ...props
}: AttachmentProps) {
  return (
    <div
      className={`group relative flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] shadow-2xs overflow-hidden transition-all ${className}`}
      {...props}
    >
      {children || (
        <>
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/10 flex items-center justify-center">
            {data.url ? (
              <img src={data.url} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <FileImage className="w-5 h-5 text-[var(--color-ink-muted)]" />
            )}
          </div>
          <div className="flex flex-col pr-5 text-left max-w-[120px]">
            <span
              className="text-[11px] font-medium text-[var(--color-ink)] truncate"
              title={data.name}
            >
              {data.name}
            </span>
            {data.size && (
              <span className="text-[9px] text-[var(--color-ink-muted)]">
                {(data.size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
              aria-label={`Remove ${data.name}`}
              title="Remove attachment"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function AttachmentPreview({
  url,
  alt = 'Attachment preview',
}: {
  url: string;
  alt?: string;
}) {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[var(--color-border)] bg-black/5 shrink-0">
      <img src={url} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
