// src/config/strategyProfiles.ts
// Illustrative 24-hour daily energy profiles for each Solar/BESS strategy.
// These are conceptual diagrams (relative kW), NOT real telemetry — they exist
// to show how load, solar generation and battery charge/discharge interact for
// each strategy. Index = hour of day (0 = 00:00 … 23 = 23:00).

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
  caption: string;
}

// Shared PV bell curve (sunrise ~6, peak ~12, sunset ~18).
const SOLAR = [0, 0, 0, 0, 0, 0, 4, 14, 34, 54, 74, 90, 100, 98, 86, 68, 46, 24, 8, 0, 0, 0, 0, 0];

export const STRATEGY_PROFILES: Record<StrategyKey, StrategyProfile> = {
  'self-consumption': {
    load:    [18, 16, 16, 16, 18, 24, 40, 60, 80, 90, 92, 90, 86, 88, 90, 86, 70, 54, 42, 32, 26, 22, 20, 18],
    solar:   SOLAR,
    battery: [0, 0, 0, 0, 0, 0, 0, 0, -4, -8, -12, -14, -12, -8, -4, 0, 8, 16, 14, 8, 2, 0, 0, 0],
    grid: true,
    caption: 'Solar covers the daytime load directly; a small battery carries the midday surplus into the early evening.',
  },

  'battery-arbitrage': {
    load:    [22, 20, 18, 18, 22, 30, 55, 78, 70, 60, 58, 60, 64, 66, 70, 74, 80, 90, 92, 78, 58, 42, 30, 24],
    solar:   SOLAR,
    battery: [-8, -8, -8, -6, -4, 0, 10, 28, 12, -20, -34, -34, -28, -18, -8, 0, 8, 26, 34, 20, 4, -4, -8, -8],
    grid: true,
    bands: [
      { from: 7, to: 9, label: 'Morning peak', tone: 'peak' },
      { from: 17, to: 19, label: 'Evening peak', tone: 'peak' },
    ],
    caption: 'Store cheap midday solar and off-peak power, then discharge through the expensive morning and evening peaks.',
  },

  'demand-shaving': {
    load:    [25, 22, 20, 20, 24, 32, 48, 62, 72, 80, 84, 82, 80, 82, 90, 100, 118, 135, 128, 98, 70, 48, 34, 28],
    solar:   SOLAR,
    battery: [0, 0, 0, 0, 0, 0, 0, 0, 0, -6, -12, -8, -18, -14, -4, 0, 0, 38, 30, 8, 0, 0, 0, 0],
    grid: true,
    ceiling: 95,
    caption: 'The battery discharges to shave every spike above your notified maximum demand — directly cutting the kVA charge.',
  },

  'backup-resilience': {
    load:    [20, 18, 18, 18, 20, 26, 40, 58, 70, 74, 76, 74, 70, 72, 74, 76, 80, 84, 86, 72, 52, 38, 28, 22],
    solar:   SOLAR,
    battery: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 72, 52, 0, 0, 0],
    grid: true,
    bands: [{ from: 18, to: 20, label: 'Loadshedding', tone: 'outage' }],
    caption: 'When loadshedding cuts the grid, the battery instantly carries the full load; solar recharges it through the day.',
  },

  'off-grid': {
    // Oversized PV (≈1.7×) runs the day and charges the battery; battery = load − solar so supply meets load 24/7.
    solar:   [0, 0, 0, 0, 0, 0, 7, 24, 58, 92, 126, 153, 170, 167, 146, 116, 78, 41, 14, 0, 0, 0, 0, 0],
    load:    [22, 20, 18, 18, 20, 26, 38, 52, 64, 70, 72, 70, 66, 68, 70, 72, 76, 80, 82, 68, 52, 40, 30, 24],
    battery: [22, 20, 18, 18, 20, 26, 31, 28, 6, -22, -54, -83, -104, -99, -76, -44, -2, 39, 68, 68, 52, 40, 30, 24],
    grid: false,
    caption: 'No grid connection: oversized solar runs the day and charges the battery, which then powers the entire night.',
  },
};
