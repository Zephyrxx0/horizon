import { ShieldCheck, CheckCircle2, Lock, Landmark, Sparkles } from 'lucide-react';

export type GovtBadgeVariant = 'emblem' | 'security' | 'fast-track' | 'verified' | 'mea';

export interface GovtBadgeProps {
  variant?: GovtBadgeVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GovtBadge({ variant = 'emblem', className = '', size = 'md' }: GovtBadgeProps) {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs sm:text-sm px-3.5 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  const configs: Record<
    GovtBadgeVariant,
    { label: string; icon: typeof Landmark; badgeClass: string; iconClass: string }
  > = {
    emblem: {
      label: 'Government of India • e-Visa Official Portal',
      icon: Landmark,
      badgeClass:
        'bg-[var(--color-saffron-50)] dark:bg-[var(--color-saffron-50)]/10 text-[var(--color-saffron-deep)] dark:text-amber-400 border border-[var(--color-saffron-bright)]/30',
      iconClass: 'text-[var(--color-saffron-bright)] dark:text-amber-500',
    },
    security: {
      label: '256-Bit TLS Encrypted',
      icon: Lock,
      badgeClass:
        'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800',
      iconClass: 'text-slate-400 dark:text-slate-500',
    },
    'fast-track': {
      label: 'Avg. 72h Fast-Track Processing',
      icon: Sparkles,
      badgeClass:
        'bg-[var(--color-saffron-50)] dark:bg-[var(--color-saffron-50)]/10 text-[var(--color-saffron-deep)] dark:text-amber-400 border border-[var(--color-saffron-bright)]/30',
      iconClass: 'text-[var(--color-saffron-bright)] dark:text-amber-500',
    },
    verified: {
      label: 'Official Bureau of Immigration Verified',
      icon: CheckCircle2,
      badgeClass:
        'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/30',
      iconClass: 'text-emerald-600 dark:text-emerald-400',
    },
    mea: {
      label: 'Ministry of External Affairs Authenticated',
      icon: ShieldCheck,
      badgeClass:
        'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800',
      iconClass: 'text-slate-600 dark:text-slate-400',
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md tracking-tight ${config.badgeClass} ${sizeClasses} ${className}`}
      data-testid={`govt-badge-${variant}`}
    >
      <Icon className={`${iconSizes} ${config.iconClass} shrink-0`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
