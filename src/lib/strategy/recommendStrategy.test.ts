import { describe, it, expect } from 'vitest';
import { recommendStrategy } from './recommendStrategy';
import type { StrategyAnswers } from './types';

describe('recommendStrategy — goal gate', () => {
  it('backup goal → backup-resilience, hybrid, regardless of tariff', () => {
    const r = recommendStrategy({ goal: 'backup', usage: 'daytime' });
    expect(r.primary).toBe('backup-resilience');
    expect(r.topology).toBe('hybrid');
    expect(r.secondary).toEqual([]);
    expect(r.caveated).toBe(false);
    expect(r.tabAnchor).toBe('strategy-backup-resilience');
  });

  it('independence goal → off-grid, off-grid topology', () => {
    const r = recommendStrategy({ goal: 'independence', usage: 'evenings' });
    expect(r.primary).toBe('off-grid');
    expect(r.topology).toBe('off-grid');
  });

  it('backup goal works without a usage answer', () => {
    const r = recommendStrategy({ goal: 'backup' });
    expect(r.primary).toBe('backup-resilience');
    expect(r.topology).toBe('hybrid');
  });

  it('independence goal works without a usage answer', () => {
    const r = recommendStrategy({ goal: 'independence' });
    expect(r.primary).toBe('off-grid');
    expect(r.topology).toBe('off-grid');
  });
});

describe('recommendStrategy — cut-bill levers', () => {
  it('demand charge + ToU → demand-shaving with arbitrage secondary', () => {
    const a: StrategyAnswers = { goal: 'cut-bill', demandCharge: 'yes', energyRate: 'tou', usage: 'around-clock' };
    const r = recommendStrategy(a);
    expect(r.primary).toBe('demand-shaving');
    expect(r.secondary).toEqual(['battery-arbitrage']);
    expect(r.topology).toBe('hybrid');
  });

  it('demand charge without ToU → demand-shaving, no secondary', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'yes', energyRate: 'flat', usage: 'daytime' });
    expect(r.primary).toBe('demand-shaving');
    expect(r.secondary).toEqual([]);
  });

  it('ToU without demand charge → battery-arbitrage', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'tou', usage: 'daytime' });
    expect(r.primary).toBe('battery-arbitrage');
    expect(r.topology).toBe('hybrid');
  });

  it('block tariff → grid-tied-solar (not caveated)', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'block', usage: 'daytime' });
    expect(r.primary).toBe('grid-tied-solar');
    expect(r.caveated).toBe(false);
    expect(r.topology).toBe('solar-only');
  });

  it('flat tariff + evening usage → grid-tied-solar, hybrid topology', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'flat', usage: 'evenings' });
    expect(r.primary).toBe('grid-tied-solar');
    expect(r.topology).toBe('hybrid');
  });

  it('both unknown → grid-tied-solar, caveated hybrid default', () => {
    const r = recommendStrategy({ goal: 'cut-bill', demandCharge: 'unknown', energyRate: 'unknown', usage: 'daytime' });
    expect(r.primary).toBe('grid-tied-solar');
    expect(r.caveated).toBe(true);
  });
});

describe('recommendStrategy — topology from usage for grid-tied', () => {
  it('daytime → solar-only', () => {
    expect(recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'flat', usage: 'daytime' }).topology).toBe('solar-only');
  });
  it('around-clock → hybrid', () => {
    expect(recommendStrategy({ goal: 'cut-bill', demandCharge: 'no', energyRate: 'flat', usage: 'around-clock' }).topology).toBe('hybrid');
  });
});
