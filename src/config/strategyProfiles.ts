// src/config/strategyProfiles.ts
// Illustrative 24-hour daily energy profiles for each Solar/BESS strategy.
// These are conceptual diagrams (relative kW), NOT real telemetry — they exist
// to show how load, solar generation and battery charge/discharge interact for
// each strategy. Index = hour of day (0 = 00:00 … 23 = 23:00).
//
// Energy accounting (verified): grid = max(0, load − solar − battery), so
// load = solar + battery + grid every hour; the battery only discharges energy
// it previously stored (state-of-charge never goes negative) and each day is
// cyclic (total charge ≈ total discharge).

import type { StrategyKey } from '@/lib/strategy/types';

export interface ProfileBand {
  from: number;            // start hour (inclusive)
  to: number;              // end hour (inclusive)
  label: string;
  tone: 'peak' | 'outage';
}

export interface StrategyProfile {
  load: number[];          // facility consumption
  solar: number[];         // PV generation
  battery: number[];       // signed: + = discharge (supplying), − = charge (storing)
  grid: boolean;           // false = off-grid (no grid line drawn)
  bands?: ProfileBand[];   // shaded vertical windows (peak price / loadshedding)
  ceiling?: number;        // demand-shaving target (dashed horizontal line)
}

// Shared PV bell curve (sunrise ~6, peak ~12, sunset ~18).
const SOLAR = [0, 0, 0, 0, 0, 0, 4, 14, 34, 54, 74, 90, 100, 98, 86, 68, 46, 24, 8, 0, 0, 0, 0, 0];

export const STRATEGY_PROFILES: Record<StrategyKey, StrategyProfile> = {
  'self-consumption': {
    load:    [18, 16, 16, 16, 18, 24, 40, 60, 80, 90, 92, 90, 86, 88, 90, 86, 70, 54, 42, 32, 26, 22, 20, 18],
    // Solar peaks just above the load so the midday surplus is what charges the battery for the evening.
    solar:   [0, 0, 0, 0, 0, 0, 4, 14, 38, 58, 82, 102, 108, 102, 90, 70, 46, 24, 8, 0, 0, 0, 0, 0],
    battery: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -12, -22, -14, 0, 0, 8, 16, 14, 8, 2, 0, 0, 0],
    grid: true,
  },

  'battery-arbitrage': {
    load:    [22, 20, 18, 18, 22, 30, 55, 78, 70, 60, 58, 60, 64, 66, 70, 74, 80, 90, 92, 78, 58, 42, 30, 24],
    solar:   SOLAR,
    // Charge off-peak overnight (grid) + midday surplus solar; discharge to zero the grid through both peaks.
    battery: [-34, -34, -34, -34, -34, -34, 0, 64, 36, 6, -16, -30, -36, -32, -16, 0, 0, 66, 84, 78, 0, 0, 0, 0],
    grid: true,
    bands: [
      { from: 7, to: 9, label: 'Morning peak', tone: 'peak' },
      { from: 17, to: 19, label: 'Evening peak', tone: 'peak' },
    ],
  },

  'demand-shaving': {
    load:    [25, 22, 20, 20, 24, 32, 48, 62, 72, 80, 84, 82, 80, 82, 90, 100, 118, 135, 128, 98, 70, 48, 34, 28],
    solar:   SOLAR,
    battery: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -8, -20, -16, 0, 0, 0, 16, 25, 3, 0, 0, 0, 0],
    grid: true,
    ceiling: 95,
  },

  'backup-resilience': {
    load:    [20, 18, 18, 18, 20, 26, 40, 58, 70, 74, 76, 74, 70, 72, 74, 76, 80, 84, 86, 72, 52, 38, 28, 22],
    // Solar sized so its midday surplus is exactly what charges the battery to ride out the evening outage.
    solar:   [0, 0, 0, 0, 0, 0, 6, 20, 48, 76, 102, 118, 124, 118, 102, 78, 48, 22, 8, 0, 0, 0, 0, 0],
    battery: [0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -26, -44, -54, -46, -28, -2, 0, 0, 78, 72, 52, 0, 0, 0],
    grid: true,
    bands: [{ from: 18, to: 20, label: 'Grid Outage', tone: 'outage' }],
  },

  'off-grid': {
    // Oversized PV (≈1.7×) runs the day and charges the battery; battery = load − solar so supply meets load 24/7.
    solar:   [0, 0, 0, 0, 0, 0, 7, 24, 58, 92, 126, 160, 178, 178, 146, 116, 78, 41, 14, 0, 0, 0, 0, 0],
    load:    [22, 20, 18, 18, 20, 26, 38, 52, 64, 70, 72, 70, 66, 68, 70, 72, 76, 80, 82, 68, 52, 40, 30, 24],
    battery: [22, 20, 18, 18, 20, 26, 31, 28, 6, -22, -54, -90, -112, -110, -76, -44, -2, 39, 68, 68, 52, 40, 30, 24],
    grid: false,
  },
};
