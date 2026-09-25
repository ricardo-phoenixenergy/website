// src/components/sections/calculators/CarbonRevenueEstimator.tsx
'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { contactHref } from '@/lib/contactLink';
import { IconArrowRight } from '@/components/ui/Icons';
import { dlPush } from '@/lib/analytics';
import {
  estimateCarbon, CARBON_YIELD_KWH_PER_KWP, CREDIT_PRICE_HIGH, CREDIT_PRICE_LOW, GRID_FACTOR_T_PER_MWH,
} from '@/lib/carbon/estimate';
import { useDebouncedAnnouncement } from '@/hooks/useDebouncedAnnouncement';
import { SOLUTION_META } from '@/types/solutions';

const ACCENT = SOLUTION_META['carbon-credits'].accent;
const ACCENT_TEXT = SOLUTION_META['carbon-credits'].accentText;

// Deterministic thousands separator — avoids toLocaleString() SSR/client
// locale mismatches (e.g. "1 520" on the server vs "1,520" in the browser).
function formatInt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatRand(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${Math.round(n / 1_000)}k`;
  return `R${formatInt(n)}`;
}

function formatSize(kwp: number): string {
  return kwp >= 1000 ? `${(kwp / 1000).toFixed(1)} MWp` : `${kwp} kWp`;
}

// The model's own inputs. Revenue is credits × price with nothing deducted, so
// it's gross; and no credit exists until a project is verified and issued.
const ASSUMPTIONS =
  `Indicative and gross, before verification fees and our share. Assumes R${CREDIT_PRICE_LOW} to R${CREDIT_PRICE_HIGH} per credit, ` +
  `about ${formatInt(CARBON_YIELD_KWH_PER_KWP)} kWh a year per kWp and a grid emissions factor of ${GRID_FACTOR_T_PER_MWH} tCO₂/MWh.`;

export function CarbonRevenueEstimator() {
  const [sizeKwp, setSizeKwp] = useState(1000);
  const [used, setUsed] = useState(false);
  const sliderId = useId();
  const { message, announce } = useDebouncedAnnouncement();

  const est = estimateCarbon(sizeKwp);

  function handleChange(v: number) {
    setSizeKwp(v);
    const next = estimateCarbon(v);
    announce(
      `${formatSize(v)}: about ${formatInt(next.creditsPerYear)} potential credits a year, one per tonne of CO2 avoided. ` +
        `Estimated gross revenue ${formatRand(next.revenueLow)} to ${formatRand(next.revenueHigh)} a year.`,
    );
    if (!used) {
      setUsed(true);
      dlPush({ event: 'carbon_estimate_used', vertical: 'carbon-credits', size_kwp: v });
    }
  }

  return (
    // 55% Night Teal, like the other hero tools, so text contrast doesn't depend on the hero photo.
    <div
      className="rounded-2xl p-6 bg-pe-nav-dark/55"
      style={{ border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--color-on-dark-subtle)' }}>
        Estimate your annual carbon revenue
      </p>

      <div className="flex justify-between mb-2">
        <label htmlFor={sliderId} className="font-body text-sm text-white/70">System size</label>
        <span aria-hidden="true" className="font-display font-extrabold text-sm text-white">{formatSize(sizeKwp)}</span>
      </div>

      <input
        id={sliderId}
        type="range"
        min={100}
        max={10000}
        step={100}
        value={sizeKwp}
        aria-valuetext={formatSize(sizeKwp)}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full mb-6"
        style={{ accentColor: ACCENT }}
      />
      <p role="status" className="sr-only">{message}</p>

      {/* One figure, not the same number twice: credits and tonnes are 1:1. */}
      <div
        className="flex items-center justify-between gap-3 rounded-xl p-4 mb-3"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div>
          {/* on-dark-muted: the tile sits on the hero photo, where on-dark-subtle measured 3.8:1 */}
          <p className="font-body text-xs" style={{ color: 'var(--color-on-dark-muted)' }}>Potential credits a year</p>
          <p className="font-body text-xs mt-0.5" style={{ color: 'var(--color-on-dark-muted)' }}>1 credit = 1 t of CO₂ avoided</p>
        </div>
        <p className="font-display font-extrabold text-xl text-white whitespace-nowrap">~{formatInt(est.creditsPerYear)}</p>
      </div>

      <div className="rounded-xl p-4 text-center" style={{ background: ACCENT }}>
        <p className="font-body text-xs mb-1" style={{ color: ACCENT_TEXT }}>Estimated gross carbon revenue a year</p>
        <p className="font-display font-extrabold text-xl" style={{ color: ACCENT_TEXT }}>
          {formatRand(est.revenueLow)} to {formatRand(est.revenueHigh)}
        </p>
      </div>

      <p className="font-body text-xs mt-3 text-center leading-relaxed" style={{ color: 'var(--color-on-dark-muted)' }}>
        {ASSUMPTIONS}
      </p>
      <Link
        href={contactHref(
          `We have about ${formatSize(sizeKwp)} of solar. Your carbon estimator showed potential gross revenue of ${formatRand(est.revenueLow)} to ${formatRand(est.revenueHigh)} a year. I'd like to check whether our system is eligible for carbon credits.`,
        )}
        onClick={() => dlPush({ event: 'cta_click', cta_label: 'Check my eligibility', cta_location: 'carbon_estimator_result' })}
        className="mt-4 flex items-center justify-center gap-1.5 w-full rounded-full px-5 py-3 font-display font-bold text-sm"
        style={{ background: '#F5F5F5', color: '#0d1f22' }}
      >
        Check my eligibility <IconArrowRight size={14} />
      </Link>
    </div>
  );
}
