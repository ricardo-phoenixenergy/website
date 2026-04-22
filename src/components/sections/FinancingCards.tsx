// src/components/sections/FinancingCards.tsx
export function FinancingCards() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* CapEx */}
      <div className="flex-1 rounded-2xl p-6" style={{ background: '#F5F5F5' }}>
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280] mb-1">CapEx</p>
        <h3 className="font-display font-extrabold text-xl text-[#1A1A1A] mb-3">Purchase outright</h3>
        <ul className="space-y-2">
          {[
            'Full asset ownership from day one',
            'Section 12B tax depreciation (125%)',
            'Highest long-term ROI',
            'No monthly payment obligations',
            'Balance-sheet asset',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm text-[#374151]">
              <span className="mt-0.5 text-[#39575C] flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* OpEx */}
      <div className="flex-1 rounded-2xl p-6" style={{ background: '#0d1f22' }}>
        <p className="font-body text-xs font-bold uppercase tracking-[0.12em] mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>OpEx</p>
        <h3 className="font-display font-extrabold text-xl text-white mb-3">PPA or lease</h3>
        <ul className="space-y-2">
          {[
            'R0 capital — no upfront cost',
            'Fixed tariff below Eskom rate',
            'Operations & maintenance included',
            'Off-balance-sheet financing',
            '10–25 year agreement, purchase option',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <span className="mt-0.5 text-[#709DA9] flex-shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
