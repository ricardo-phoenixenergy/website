// src/components/sections/StrategyProfileChart.tsx
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import type { ChartOptions, ChartDataset } from 'chart.js';
import { STRATEGY_PROFILES } from '@/config/strategyProfiles';
import type { StrategyKey } from '@/lib/strategy/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

const HOUR_LABELS = Array.from({ length: 24 }, (_, h) =>
  h === 0 ? '12am' : h === 6 ? '6am' : h === 12 ? '12pm' : h === 18 ? '6pm' : '',
);

const C = {
  solar: '#E3C58D',
  solarFill: 'rgba(227,197,141,0.35)',
  load: '#0d1f22',
  battery: '#709DA9',
  batteryFill: 'rgba(112,157,169,0.28)',
  grid: '#9CA3AF',
  ceiling: '#6B7280',
  peakBand: 'rgba(217,124,118,0.13)',
  outageBand: 'rgba(107,114,128,0.18)',
};

interface StrategyProfileChartProps {
  strategyKey: string;
}

export function StrategyProfileChart({ strategyKey }: StrategyProfileChartProps) {
  const p = STRATEGY_PROFILES[strategyKey as StrategyKey];
  if (!p) return null;

  // Grid import = load − solar − battery (clamped ≥ 0). Null for off-grid.
  const gridSeries = p.grid
    ? p.load.map((l, i) => Math.max(0, Math.round(l - p.solar[i] - p.battery[i])))
    : null;

  const all = [...p.load, ...p.solar, ...p.battery, ...(gridSeries ?? [])];
  const yMax = Math.ceil((Math.max(...all) * 1.12) / 10) * 10;
  const yMin = Math.floor((Math.min(0, ...p.battery) * 1.18) / 10) * 10;

  const datasets: ChartDataset<'line'>[] = [];

  // Shaded windows (behind everything)
  (p.bands ?? []).forEach((b, idx) => {
    datasets.push({
      label: `band-${idx}`,
      data: HOUR_LABELS.map((_, h) => (h >= b.from && h <= b.to ? yMax : null)) as number[],
      backgroundColor: b.tone === 'peak' ? C.peakBand : C.outageBand,
      borderWidth: 0,
      pointRadius: 0,
      fill: 'origin',
      spanGaps: false,
      order: 10,
    });
  });

  datasets.push({
    label: 'Solar',
    data: p.solar,
    borderColor: C.solar,
    backgroundColor: C.solarFill,
    borderWidth: 1.5,
    pointRadius: 0,
    fill: 'origin',
    tension: 0.4,
    order: 6,
  });

  datasets.push({
    label: 'Battery',
    data: p.battery,
    borderColor: C.battery,
    backgroundColor: C.batteryFill,
    borderWidth: 1.5,
    pointRadius: 0,
    fill: 'origin',
    tension: 0.4,
    cubicInterpolationMode: 'monotone', // smooth but never overshoots → no phantom charge/discharge at sharp steps
    order: 5,
  });

  if (gridSeries) {
    datasets.push({
      label: 'Grid',
      data: gridSeries,
      borderColor: C.grid,
      borderWidth: 1.5,
      borderDash: [4, 3],
      pointRadius: 0,
      fill: false,
      tension: 0.4,
      cubicInterpolationMode: 'monotone',
      order: 4,
    });
  }

  datasets.push({
    label: 'Load',
    data: p.load,
    borderColor: C.load,
    borderWidth: 2.2,
    pointRadius: 0,
    fill: false,
    tension: 0.4,
    order: 2,
  });

  if (p.ceiling != null) {
    datasets.push({
      label: 'Ceiling',
      data: HOUR_LABELS.map(() => p.ceiling as number),
      borderColor: C.ceiling,
      borderWidth: 1.5,
      borderDash: [6, 4],
      pointRadius: 0,
      fill: false,
      order: 1,
    });
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    events: [], // static illustration — no hover/tooltips
    animation: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: false, maxRotation: 0, font: { size: 10 }, color: '#9CA3AF' },
      },
      y: {
        min: yMin,
        max: yMax,
        grid: { color: '#F1F1F1' },
        border: { display: false },
        ticks: { display: false },
      },
    },
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] p-4">
      <p className="font-display font-bold text-[13px] text-[#1A1A1A] mb-3">A typical day</p>
      <div style={{ height: 200 }} aria-hidden="true">
        <Line data={{ labels: HOUR_LABELS, datasets }} options={options} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        <LegendItem color={C.load} label="Load" line />
        <LegendItem color={C.solar} label="Solar" />
        <LegendItem color={C.battery} label="Battery (▲ discharge · ▼ charge)" />
        {gridSeries && <LegendItem color={C.grid} label="Grid" dashed line />}
        {p.ceiling != null && <LegendItem color={C.ceiling} label="Demand Ceiling" dashed line />}
        {p.bands?.some((b) => b.tone === 'peak') && <LegendItem color="rgba(217,124,118,0.45)" label="Peak Windows" />}
        {p.bands?.some((b) => b.tone === 'outage') && <LegendItem color="rgba(107,114,128,0.5)" label="Grid Outage" />}
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  line = false,
  dashed = false,
}: {
  color: string;
  label: string;
  line?: boolean;
  dashed?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-[#4B5563]">
      {line ? (
        <span
          className="inline-block w-4"
          style={{ borderTop: `2px ${dashed ? 'dashed' : 'solid'} ${color}` }}
        />
      ) : (
        <span className="inline-block w-3 h-3 rounded-sm" style={{ background: color }} />
      )}
      {label}
    </span>
  );
}
