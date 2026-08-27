import {
  ShieldCheck,
  ArrowRight,
  Search,
  FileText,
  CreditCard,
  Plane,
  Milestone,
  Globe2,
  Clock3,
  Users,
  Layers,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { GovtBadge } from '../../components/ui/GovtBadge';
import { Button } from '../../components/ui/Button';
import { DestinationCarousel } from '../../components/ui/DestinationCarousel';
import branchAscii from '../../assets/cultural/branch-ascii.png';
import lotusElephantAscii from '../../assets/cultural/lotus-elephant-ascii.png';

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

  const stats = [
    {
      label: 'Average Processing',
      value: '~72 Hours',
      desc: 'Fast-Track Option Available',
      icon: Clock3,
    },
    {
      label: 'Eligible Nationalities',
      value: '165+ Countries',
      desc: 'Global Entry Authorized',
      icon: Globe2,
    },
    {
      label: 'Authorized Ports',
      value: '36 Gateways',
      desc: 'Airports & Seaports Combined',
      icon: Layers,
    },
    {
      label: 'Visa Categories',
      value: 'Tourist & Business',
      desc: 'Plus Medical & Conference',
      icon: Users,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* ── 1. HERO — full-width split ── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center border-b border-[var(--color-border)]">
        {/* Subtle background mandala */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.025] dark:opacity-[0.015] pointer-events-none transform translate-x-1/3 -translate-y-1/4">
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            className="text-[var(--color-saffron-bright)]"
          >
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
            {[...Array(36)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 40 * Math.cos((i * 10 * Math.PI) / 180)}
                y2={50 + 40 * Math.sin((i * 10 * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="0.3"
              />
            ))}
          </svg>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)]">
          {/* Left: Headline + CTAs */}
          <div className="relative flex items-center px-8 sm:px-12 xl:px-20 2xl:px-28 py-16 lg:py-0 bg-[var(--color-surface-bg)]">
            {/* ASCII Art Branch — Top Left Corner */}
            <div
              className="absolute top-2 -left-4 sm:top-6 sm:left-6 w-56 sm:w-72 md:w-88 pointer-events-none opacity-85 dark:opacity-80 select-none z-0 transition-all duration-300"
              aria-hidden="true"
            >
              <img
                src={branchAscii}
                alt=""
                className="w-full h-auto object-contain"
                style={{
                  scale: '-2',
                  transform: 'rotate(-160deg)',
                }}
                loading="eager"
              />
            </div>

            <div className="space-y-8 max-w-2xl w-full relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <GovtBadge variant="emblem" size="sm" />
                <GovtBadge variant="fast-track" size="sm" />
              </div>

              <div className="space-y-5">
                <h1 className="text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tight leading-[1.0] text-[var(--color-ink)]">
                  e-Visa{' '}
                  <span className="text-[var(--color-saffron-bright)] dark:text-amber-500">
                    India
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-[var(--color-ink-muted)] leading-relaxed max-w-lg">
                  Official electronic visa portal for international travelers. Apply, track, and
                  receive your travel authorization completely online.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={() => navigate('/apply')}
                  className="min-h-[52px] px-10 text-base font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <span>Start New Application</span>
                  <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/track')}
                  className="min-h-[52px] px-8 text-base font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl transition-all"
                >
                  <Search
                    className="w-5 h-5 shrink-0 text-[var(--color-ink-muted)]"
                    aria-hidden="true"
                  />
                  <span>Track Existing Status</span>
                </Button>
              </div>

              <div className="flex items-center gap-3 text-sm text-[var(--color-ink-muted)] pt-1">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Secure & Encrypted
                </span>
                <span>•</span>
                <span>Direct Ministry Processing</span>
                <span>•</span>
                <span>TLS 1.3</span>
              </div>
            </div>
          </div>

          {/* Right: Destination Carousel — fills full height */}
          <div className="relative hidden lg:flex items-stretch bg-[var(--color-surface-subtle)] border-l border-[var(--color-border)]">
            <div className="absolute inset-0 flex items-center justify-center p-10 xl:p-16">
              <div className="relative w-full h-full max-h-[600px]">
                {/* ASCII Art Lotus — BEHIND the Carousel Layer (z-0), Top-Right Corner, Tilted 45°, Scaled 2x */}
                <div
                  className="absolute -top-16 -right-16 xl:-top-20 xl:-right-20 w-44 sm:w-56 xl:w-68 pointer-events-none opacity-90 dark:opacity-85 select-none z-0 transform rotate-45 scale-[2.0] origin-center transition-all duration-300 drop-shadow-xl"
                  aria-hidden="true"
                >
                  <img
                    src={lotusElephantAscii}
                    alt=""
                    className="w-full h-auto object-contain"
                    loading="eager"
                  />
                </div>

                {/* Carousel Card in Foreground (z-10) */}
                <DestinationCarousel className="relative z-10 shadow-2xl w-full h-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FULL-WIDTH STATS STRIP ── */}
      <section className="bg-[var(--color-surface-card)] border-b border-[var(--color-border)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--color-border)]">
          {stats.map((fact, idx) => {
            const Icon = fact.icon;
            return (
              <div
                key={idx}
                className="px-8 xl:px-12 py-8 xl:py-10 space-y-2 text-center lg:text-left hover:bg-[var(--color-surface-subtle)] transition-colors"
              >
                <Icon
                  className="w-5 h-5 text-[var(--color-saffron-bright)] mb-3 mx-auto lg:mx-0"
                  aria-hidden="true"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)] block">
                  {fact.label}
                </span>
                <span className="text-2xl xl:text-3xl font-black text-[var(--color-saffron-bright)] block tracking-tight">
                  {fact.value}
                </span>
                <span className="text-xs text-[var(--color-ink-muted)] block">{fact.desc}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS — full-width alternating ── */}
      <section className="py-20 xl:py-28 border-b border-[var(--color-border)]">
        <div className="px-8 sm:px-12 xl:px-20 2xl:px-28 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-saffron-bright)]">
                Simple Process Flow
              </span>
              <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-[var(--color-ink)]">
                How to Get Your e-Visa
              </h2>
            </div>
            <p className="text-base text-[var(--color-ink-muted)] leading-relaxed max-w-md">
              No physical embassy visits. Complete the digital workflow and get authorized in 4 easy
              steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0 border border-[var(--color-border)] rounded-2xl overflow-hidden">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className={`relative p-8 xl:p-10 space-y-5 bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-subtle)] transition-colors group ${
                    idx < steps.length - 1
                      ? 'border-b sm:border-b-0 xl:border-b-0 sm:border-r border-[var(--color-border)]'
                      : ''
                  } ${idx === 2 ? 'sm:border-b xl:border-b-0' : ''}`}
                >
                  {/* Step Number — large background watermark */}
                  <span className="absolute top-4 right-5 text-6xl font-black text-[var(--color-border)] select-none tabular-nums opacity-60">
                    {s.step}
                  </span>

                  <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-subtle)] group-hover:bg-[var(--color-saffron-bright)]/10 flex items-center justify-center text-[var(--color-ink-muted)] group-hover:text-[var(--color-saffron-bright)] transition-all">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[var(--color-ink)] group-hover:text-[var(--color-saffron-deep)] transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. TRACK CTA — full-width dark band ── */}
      <section className="bg-gradient-to-r from-[#1a2a44] to-[#15233c] border-b border-[var(--color-border)]">
        <div className="px-8 sm:px-12 xl:px-20 2xl:px-28 py-16 xl:py-20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="space-y-3 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-amber-300 border border-white/10">
              <Milestone className="w-3.5 h-3.5" />
              <span>Real-Time Status Tracking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold tracking-tight text-white">
              Already submitted an application?
            </h2>
            <p className="text-base text-slate-300 max-w-lg">
              Verify your application credentials, track processing milestones, or download your
              granted ETA.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => navigate('/track')}
            className="shrink-0 min-h-[52px] px-10 text-base font-semibold flex items-center gap-2 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] z-10"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            <span>Track Status</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
