// src/components/sections/CostPerKmBars.tsx — CSS cost-per-km comparison (light delivery van)
import {
  FLEET_VEHICLES, DIESEL_PRICE_PER_L, GRID_RATE_PER_KWH, SOLAR_RATE_PER_KWH,
} from '@/lib/evfleet/estimate';

interface CostPerKmBarsProps {
  accent?: string;
}

export function CostPerKmBars({ accent = '#A9D6CB' }: CostPerKmBarsProps) {
  const v = FLEET_VEHICLES.van;
  const diesel = (v.dieselLPer100 * DIESEL_PRICE_PER_L) / 100;
  const grid = (v.evKwhPer100 * GRID_RATE_PER_KWH) / 100;
  const solar = (v.evKwhPer100 * SOLAR_RATE_PER_KWH) / 100;
  const max = diesel;

  const rows: { label: string; value: number; color: string }[] = [
    { label: 'Diesel', value: diesel, color: '#C2703D' },
    { label: 'Electric — grid charged', value: grid, color: accent },
    { label: 'Electric — solar charged', value: solar, color: '#39575C' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-body text-sm font-semibold text-[#1A1A1A]">{r.label}</span>
            <span className="font-display font-extrabold text-sm text-[#1A1A1A]">R{r.value.toFixed(2)} / km</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#EDEFEF' }}>
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
