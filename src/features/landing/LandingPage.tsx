import {
  ShieldCheck,
  ArrowRight,
  Search,
  FileText,
  CreditCard,
  Plane,
  Milestone,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { GovtBadge } from '../../components/ui/GovtBadge';
import { Button } from '../../components/ui/Button';
import { DestinationCarousel } from '../../components/ui/DestinationCarousel';

export function LandingPage() {
  const { navigate } = useRouter();

  const steps = [
    {
      step: '01',
      title: 'Apply Online',
      desc: 'Complete the structured application form with personal and passport details.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'Upload Documents',
      desc: 'Submit a digital passport photo and passport bio-page scan.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Pay Government Fee',
      desc: 'Secure payment via international credit/debit card or UPI.',
      icon: CreditCard,
    },
    {
      step: '04',
      title: 'Receive ETA & Fly',
      desc: 'Electronic Travel Authorization sent to email. Present QR on arrival.',
      icon: Plane,
    },
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative Traditional Indian Mandala Motif Background (Subtle) */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] dark:opacity-[0.02] pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <svg
          viewBox="0 0 100 100"
          fill="currentColor"
          className="text-[var(--color-saffron-bright)]"
        >
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      {/* ── 1. HERO ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-center">
          {/* Left: Headline + CTAs */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <GovtBadge variant="emblem" size="sm" />
              <GovtBadge variant="fast-track" size="sm" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-[var(--color-ink)]">
                e-Visa{' '}
                <span className="text-[var(--color-saffron-bright)] dark:text-amber-500">
                  India
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed max-w-xl">
                Welcome to the official electronic visa portal for international travelers. Apply,
                track, and receive your official travel authorization completely online.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => navigate('/apply')}
                className="min-h-[50px] min-w-[240px] px-10 text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <span>Start New Application</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/track')}
                className="min-h-[50px] min-w-[220px] px-8 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg transition-all"
              >
                <Search
                  className="w-4 h-4 shrink-0 text-[var(--color-ink-muted)]"
                  aria-hidden="true"
                />
                <span>Track Existing Status</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)] pt-2 border-t border-[var(--color-border-subtle)] max-w-md">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Secure & Encrypted
              </span>
              <span>•</span>
              <span>Direct Ministry Processing</span>
            </div>
          </div>

          {/* Right: Incredible India Destination Carousel */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[var(--color-saffron-bright)] opacity-50 pointer-events-none rounded-tl"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[var(--color-saffron-bright)] opacity-50 pointer-events-none rounded-br"></div>
            <DestinationCarousel className="shadow-lg hover:shadow-xl transition-shadow" />
          </div>
        </div>
      </section>

      {/* ── 2. HORIZONTAL STATS BAR ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] shadow-xs">
          {[
            {
              label: 'Average Processing',
              value: '~72 Hours',
              desc: 'Fast-Track Option Available',
            },
            {
              label: 'Eligible Nationalities',
              value: '165+ Countries',
              desc: 'Global Entry Authorized',
            },
            {
              label: 'Authorized Ports',
              value: '36 Gateways',
              desc: 'Airports & Seaports Combined',
            },
            {
              label: 'Visa Categories',
              value: 'Tourist & Business',
              desc: 'Plus Medical & Conference',
            },
          ].map((fact, idx) => (
            <div
              key={idx}
              className="space-y-1 text-center md:text-left md:px-4 md:border-r last:border-0 border-[var(--color-border)]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)] block">
                {fact.label}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[var(--color-saffron-bright)] block tracking-tight">
                {fact.value}
              </span>
              <span className="text-[10px] text-[var(--color-ink-muted)] block">{fact.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-saffron-bright)]">
            Simple Process Flow
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-ink)]">
            How to Get Your e-Visa
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
            No physical embassy visits. Complete the digital workflow and get authorized in 4 easy
            steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] p-6 space-y-4 shadow-2xs hover:shadow-md hover:border-[var(--color-saffron-bright)]/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-subtle)] group-hover:bg-[var(--color-saffron-50)] flex items-center justify-center text-[var(--color-ink)] group-hover:text-[var(--color-saffron-bright)] transition-colors">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-mono font-black text-[var(--color-ink-muted)] group-hover:text-[var(--color-saffron-bright)] transition-colors opacity-40 tabular-nums">
                    {s.step}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[var(--color-ink)] group-hover:text-[var(--color-saffron-deep)] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. QUICK TRACK CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-[#1a2a44] to-[#15233c] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-md">
          {/* Subtle design pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-xs font-medium text-[var(--color-saffron-100)] border border-white/10">
              <Milestone className="w-3.5 h-3.5" />
              <span>Real-Time Status Tracking</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Already submitted an application?
            </h2>
            <p className="text-sm text-slate-300 max-w-md">
              Verify your application credentials, track processing milestones, or download your
              granted ETA.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/track')}
            className="shrink-0 min-h-[44px] px-6 text-sm font-semibold flex items-center gap-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Track Status</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
