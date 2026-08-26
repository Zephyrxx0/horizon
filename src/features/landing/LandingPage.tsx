import { ShieldCheck, ArrowRight, Search, FileText, CreditCard, Plane } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { GovtBadge } from '../../components/ui/GovtBadge';
import { Button } from '../../components/ui/Button';

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
    <div className="space-y-20 py-10 sm:py-16">
      {/* ── 1. HERO ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Headline + CTAs */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <GovtBadge variant="emblem" size="sm" />
              <GovtBadge variant="security" size="sm" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--color-ink)] [text-wrap:balance] leading-[1.05]">
                e-Visa India
              </h1>
              <p className="text-base text-[var(--color-ink-muted)] leading-relaxed max-w-md">
                The official electronic visa portal for international travelers visiting India.
                Tourism, business, medical, and conference visas — entirely online.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                variant="primary"
                onClick={() => navigate('/apply')}
                className="min-h-[44px] px-6 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <span>Start New Application</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/track')}
                className="min-h-[44px] px-5 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-[var(--color-ink-muted)]" aria-hidden="true" />
                <span>Track Existing Status</span>
              </Button>
            </div>
          </div>

          {/* Right: Key facts panel */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] divide-y divide-[var(--color-border)]">
            {[
              { label: 'Average Processing', value: '~72 Hours' },
              { label: 'Eligible Nationalities', value: '165+ Countries' },
              { label: 'Authorized Entry Points', value: '36 Airports & Seaports' },
              { label: 'Visa Categories', value: 'Tourist, Business, Medical, Conference' },
            ].map((fact) => (
              <div key={fact.label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-xs text-[var(--color-ink-muted)]">{fact.label}</span>
                <span className="text-sm font-semibold text-[var(--color-ink)] text-right max-w-[200px]">
                  {fact.value}
                </span>
              </div>
            ))}
            <div className="px-5 py-3.5">
              <button
                type="button"
                onClick={() => navigate('/apply')}
                className="w-full text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] text-center transition-colors cursor-pointer"
              >
                See visa fees & eligibility →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. HOW IT WORKS ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="space-y-1 pb-4 border-b border-[var(--color-border)]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-muted)]">
            Simple Process
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            How to Get Your e-Visa
          </h2>
          <p className="text-sm text-[var(--color-ink-muted)] max-w-xl">
            No embassy visits or physical passport submissions. The entire process is online.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-ink)]">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--color-ink-muted)] tabular-nums">
                    {s.step}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[var(--color-ink)]">{s.title}</h3>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. QUICK TRACK CTA ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-xl bg-[var(--color-ink)] text-[var(--color-surface-bg)] px-6 py-8 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-lg font-bold tracking-tight">Already submitted an application?</h2>
            <p className="text-sm opacity-70">
              Track real-time status or reprint your Electronic Travel Authorization (ETA).
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/track')}
            className="shrink-0 min-h-[40px] px-5 text-sm font-semibold flex items-center gap-2"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Track Status</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
