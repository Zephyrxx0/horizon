import { useState } from 'react';
import { Palette, Type, QrCode as QrIcon } from 'lucide-react';
import { GovtBadge } from '../../components/ui/GovtBadge';
import { ThemeSwitcher } from '../../components/ui/ThemeSwitcher';
import { DestinationCarousel } from '../../components/ui/DestinationCarousel';
import { QRCodeGenerator } from '../../components/ui/QRCodeGenerator';
import { DataVisualizer } from '../../components/ui/DataVisualizer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<'tokens' | 'components' | 'interactive'>(
    'tokens',
  );
  const [qrText, setQrText] = useState('https://indianvisaonline.gov.in/evisa/tvoa.html');

  const colors = [
    {
      name: 'Primary Slate',
      token: '--color-indigo-primary',
      hex: '#0F172A',
      text: 'white',
      role: 'Main Actions & Brand Core',
    },
    {
      name: 'Canvas Background',
      token: '--color-surface-bg',
      hex: '#FAFAFA',
      text: 'black',
      role: 'Main Page Canvas',
    },
    {
      name: 'Card Surface',
      token: '--color-surface-card',
      hex: '#FFFFFF',
      text: 'black',
      role: 'Component Enclosures',
    },
    {
      name: 'Border Standard',
      token: '--color-border',
      hex: '#E4E4E7',
      text: 'black',
      role: 'Subtle Structural Outlines',
    },
    {
      name: 'Saffron Accent',
      token: '--color-saffron-bright',
      hex: '#EA580C',
      text: 'white',
      role: 'Restrained High-Priority Highlight',
    },
    {
      name: 'Emerald Success',
      token: '--color-success',
      hex: '#15803D',
      text: 'white',
      role: 'Approved Visas & Success Seals',
    },
    {
      name: 'Error Red',
      token: '--color-error',
      hex: '#DC2626',
      text: 'white',
      role: 'Form Validation Alerts',
    },
    {
      name: 'Muted Ink',
      token: '--color-ink-muted',
      hex: '#71717A',
      text: 'white',
      role: 'Supporting Secondary Labels',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Design Engineering Reference
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Official Visa Portal Design System
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Clean token specifications, Noto Sans typography scales, and accessible component
              primitives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher variant="full" />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 pt-2">
          <button
            type="button"
            onClick={() => setActiveSection('tokens')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSection === 'tokens'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Tokens & Typography
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('components')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSection === 'components'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            UI Primitives & Badges
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('interactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSection === 'interactive'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            Interactive Modules
          </button>
        </div>
      </div>

      {/* SECTION 1: TOKENS & TYPOGRAPHY */}
      {activeSection === 'tokens' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Color Palette */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Core Token Palette
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {colors.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-2xs"
                >
                  <div
                    style={{ backgroundColor: c.hex, color: c.text }}
                    className="h-16 w-full p-2.5 flex flex-col justify-end text-[11px] font-mono font-semibold"
                  >
                    <span>{c.hex}</span>
                  </div>
                  <div className="p-3 space-y-0.5">
                    <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                      {c.name}
                    </h3>
                    <code className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 block">
                      {c.token}
                    </code>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 leading-tight">
                      {c.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Scale */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Typography Scale (Noto Sans)
              </h2>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-4">
              <div className="space-y-1 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400">Display (2rem / 32px)</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Electronic Travel Authorization
                </div>
              </div>

              <div className="space-y-1 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400">
                  Heading 1 (1.5rem / 24px)
                </span>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Government of India e-Visa Portal
                </div>
              </div>

              <div className="space-y-1 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400">
                  Heading 2 (1.125rem / 18px)
                </span>
                <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Biometric Document Verification & Quality Gate
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400">
                  Body Text (0.9375rem / 15px)
                </span>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  Foreign nationals are required to submit authentic identity credentials and valid
                  travel passports. All submissions are encrypted under TLS 1.3 protocol standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: UI PRIMITIVES & BADGES */}
      {activeSection === 'components' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Government Badges */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Government Trust Badges
            </h2>
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-2.5 shadow-2xs">
              <GovtBadge variant="emblem" size="md" />
              <GovtBadge variant="security" size="md" />
              <GovtBadge variant="fast-track" size="md" />
              <GovtBadge variant="verified" size="md" />
              <GovtBadge variant="mea" size="md" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Action Buttons</h2>
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-3 shadow-2xs">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Action</Button>
              <Button variant="ghost">Ghost Action</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Form Controls</h2>
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-2xs">
              <div className="space-y-1.5">
                <label
                  htmlFor="demo-text-field"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Standard Text Input
                </label>
                <Input id="demo-text-field" placeholder="e.g. Given Name as in Passport" />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="demo-select-field"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Select Dropdown
                </label>
                <Select id="demo-select-field">
                  <option>United States of America (USA)</option>
                  <option>United Kingdom (UK)</option>
                  <option>Germany (DEU)</option>
                  <option>Australia (AUS)</option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: INTERACTIVE MODULES */}
      {activeSection === 'interactive' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* QR Pass */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <QrIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Retina QR Code Generator
              </h2>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-2xs">
              <div className="md:col-span-7 space-y-3">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Level-H error correction matrix for instant reading at airport immigration
                  e-gates.
                </p>
                <div className="space-y-1">
                  <label
                    htmlFor="qr-input"
                    className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Encode URL / Reference
                  </label>
                  <input
                    id="qr-input"
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="md:col-span-5 flex justify-center">
                <QRCodeGenerator value={qrText} size={150} title="Interactive Test Pass" />
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Destination Showcase Carousel
            </h2>
            <DestinationCarousel />
          </div>

          {/* Visualizer */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Operational Metrics
            </h2>
            <DataVisualizer />
          </div>
        </div>
      )}
    </div>
  );
}
