import { useState } from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

export interface DataVisualizerProps {
  className?: string;
}

export function DataVisualizer({ className = '' }: DataVisualizerProps) {
  const [activeMetric, setActiveMetric] = useState<'turnaround' | 'categories' | 'airports'>(
    'turnaround',
  );

  const turnaroundData = [
    { label: '< 24 Hours (Fast-Track)', count: 48, percentage: 48 },
    { label: '24 - 48 Hours (Standard)', count: 38, percentage: 38 },
    { label: '48 - 72 Hours', count: 11, percentage: 11 },
    { label: '> 72 Hours (Special Review)', count: 3, percentage: 3 },
  ];

  const categoryDistribution = [
    { name: 'e-Tourist (30D / 1Yr / 5Yr)', share: 64 },
    { name: 'e-Business', share: 22 },
    { name: 'e-Conference', share: 7 },
    { name: 'e-Medical & Attendant', share: 5 },
    { name: 'e-Transit', share: 2 },
  ];

  const topAirports = [
    { port: 'Delhi (DEL) — Indira Gandhi Intl', share: 34 },
    { port: 'Mumbai (BOM) — Chhatrapati Shivaji', share: 26 },
    { port: 'Bengaluru (BLR) — Kempegowda Intl', share: 14 },
    { port: 'Chennai (MAA) — Chennai Intl', share: 11 },
    { port: 'Hyderabad (HYD) — Rajiv Gandhi Intl', share: 8 },
    { port: 'Kochi (COK) — Cochin Intl', share: 7 },
  ];

  return (
    <div
      className={`rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-5 ${className}`}
      data-testid="data-visualizer-widget"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Official Operational Metrics
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real-time processing transparency across Indian immigration ports
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveMetric('turnaround')}
            className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeMetric === 'turnaround'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Turnaround
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('categories')}
            className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeMetric === 'categories'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('airports')}
            className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              activeMetric === 'airports'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Entry Ports
          </button>
        </div>
      </div>

      {/* METRIC 1: Turnaround Time */}
      {activeMetric === 'turnaround' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                Avg. Turnaround
              </span>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                48.2 Hours
              </div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">72h SLA window</span>
            </div>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Approval Ratio</span>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                99.4%
              </div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                First-time grants
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Ports Active</span>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                36 Ports
              </div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">31 air + 5 sea</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {turnaroundData.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-zinc-700 dark:bg-zinc-300 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* METRIC 2: Visa Categories */}
      {activeMetric === 'categories' && (
        <div className="space-y-3">
          {categoryDistribution.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">{item.name}</span>
                <span className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                  {item.share}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-zinc-700 dark:bg-zinc-300 rounded-full transition-all duration-500"
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* METRIC 3: Entry Ports */}
      {activeMetric === 'airports' && (
        <div className="space-y-3">
          {topAirports.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">{item.port}</span>
                <span className="font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                  {item.share}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-zinc-700 dark:bg-zinc-300 rounded-full transition-all duration-500"
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Bureau of Immigration verified</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Updated hourly</span>
        </span>
      </div>
    </div>
  );
}
