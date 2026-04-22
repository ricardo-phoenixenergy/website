'use client';
import type { ValuationResult } from '@/lib/valuation/types';

function fmtRand(n: number) {
  return `R ${Math.round(n).toLocaleString('en-ZA')}`;
}

interface ResultsGridProps {
  result: ValuationResult;
  hasBess: boolean;
}

type Card = {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
};

export function ResultsGrid({ result, hasBess }: ResultsGridProps) {
  const cards: Card[] = [
    {
      label: 'Indicative buyback value',
      value: fmtRand(result.total),
      sub: `Range: ${fmtRand(result.rangeLow)} – ${fmtRand(result.rangeHigh)}`,
      accent: true,
    },
    {
      label: 'Solar array value',
      value: fmtRand(result.solarFinal),
    },
    {
      label: 'BESS value',
      value: hasBess ? fmtRand(result.bessVal) : 'N/A',
    },
    {
      label: '10-yr displaced savings (PV)',
      value: fmtRand(result.solarDcf),
    },
    {
      label: 'Replacement cost (new)',
      value: fmtRand(result.solarReplacement + result.bessReplacement),
    },
    {
      label: 'Retained value',
      value: `${result.retained.toFixed(1)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {cards.map(card => (
        <div
          key={card.label}
          className="rounded-xl p-4"
          style={{
            background: card.accent ? '#39575C' : '#F5F5F5',
            border: card.accent ? 'none' : '1px solid #E5E7EB',
          }}
        >
          <p
            className="font-body text-[10px] mb-1 leading-tight"
            style={{ color: card.accent ? 'rgba(255,255,255,0.6)' : '#6B7280' }}
          >
            {card.label}
          </p>
          <p
            className="font-display font-extrabold text-base leading-tight"
            style={{ color: card.accent ? 'white' : '#1A1A1A' }}
          >
            {card.value}
          </p>
          {card.sub && (
            <p
              className="font-body text-[9px] mt-1 leading-tight"
              style={{ color: 'rgba(255,255,255,0.50)' }}
            >
              {card.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
