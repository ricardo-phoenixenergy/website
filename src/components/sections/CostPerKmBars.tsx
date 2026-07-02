// src/components/sections/CostPerKmBars.tsx — cost-per-km comparison bars.
// Presentational + dark-themed (sits inside the EV Fleets hero widget).
import type { CostPerKm } from '@/lib/evfleet/estimate';

interface CostPerKmBarsProps {
  fuelLabel: string; // 'Diesel' | 'Petrol 93'
  costs: CostPerKm;  // { fuel, grid, solar }
  accent: string;    // grid-bar colour
}

export function CostPerKmBars({ fuelLabel, costs, accent }: CostPerKmBarsProps) {
  const max = Math.max(costs.fuel, costs.grid, costs.solar);
  const rows: { label: string; value: number; color: string }[] = [
    { label: fuelLabel, value: costs.fuel, color: '#C2703D' },
    { label: 'Electric — grid', value: costs.grid, color: accent },
    { label: 'Electric — solar', value: costs.solar, color: '#39575C' },
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-body text-[11px] font-semibold text-white/80">{r.label}</span>
            <span className="font-display font-extrabold text-[11px] text-white">R{r.value.toFixed(2)} / km</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.max(6, (r.value / max) * 100)}%`, background: r.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
