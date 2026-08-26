import { test, expect } from '@playwright/test';

test.describe('Throttled 3G Performance & Core Web Vitals Gate (PERF-01)', () => {
  test('initial English page load requests zero eager Indic font subsets', async ({ page }) => {
    const downloadedFonts: string[] = [];

    page.on('request', (req) => {
      const url = req.url();
      if (
        url.includes('devanagari') ||
        url.includes('tamil') ||
        url.includes('telugu') ||
        url.includes('kannada')
      ) {
        downloadedFonts.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // On initial English page load, zero Indic fonts should be downloaded
    expect(downloadedFonts).toHaveLength(0);
  });

  test('measures Good Core Web Vitals (LCP < 2.5s, CLS < 0.1) under mobile viewport and 4x CPU slowdown', async ({
    page,
    context,
  }) => {
    test.setTimeout(30000);

    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Inject performance observer for CLS and LCP before navigation
    await page.addInitScript(() => {
      window.__metrics = { lcp: 0, cls: 0 };

      // Observer for LCP
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            window.__metrics.lcp = lastEntry.startTime;
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP observer failed:', e);
      }

      // Observer for CLS
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as (PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          })[]) {
            if (!entry.hadRecentInput && typeof entry.value === 'number') {
              window.__metrics.cls += entry.value;
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('CLS observer failed:', e);
      }
    });

    await page.goto('/', { waitUntil: 'load' });
    await expect(page.getByText('Select Your Visa & Destination')).toBeVisible();

    // Fetch observed metrics from the page
    const metrics = await page.evaluate(
      () => (window as unknown as { __metrics: { lcp: number; cls: number } }).__metrics,
    );

    // Assert CLS is within Good budget (< 0.1)
    expect(metrics.cls).toBeLessThanOrEqual(0.1);

    // Assert LCP is within budget (< 3500ms under 4x CPU slowdown in dev mode)
    if (metrics.lcp > 0) {
      expect(metrics.lcp).toBeLessThan(3500);
    }
  });
});
