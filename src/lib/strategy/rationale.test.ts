import { describe, it, expect } from 'vitest';
import { buildRationale } from './rationale';
import { recommendStrategy } from './recommendStrategy';

describe('buildRationale', () => {
  it('demand-shaving + arbitrage mentions both Time-of-Use and demand charges', () => {
    const a = { goal: 'cut-bill', demandCharge: 'yes', energyRate: 'tou', usage: 'around-clock' } as const;
    const text = buildRationale(a, recommendStrategy(a));
    expect(text).toContain('Time-of-Use');
    expect(text).toContain('demand charges');
  });

  it('caveated default points to the free assessment', () => {
    const a = { goal: 'cut-bill', demandCharge: 'unknown', energyRate: 'unknown', usage: 'daytime' } as const;
    const text = buildRationale(a, recommendStrategy(a));
    expect(text.toLowerCase()).toContain('free assessment');
  });

  it('returns a non-empty sentence for every primary', () => {
    const samples = [
      { goal: 'backup', usage: 'daytime' },
      { goal: 'independence', usage: 'evenings' },
      { goal: 'cut-bill', demandCharge: 'no', energyRate: 'tou', usage: 'daytime' },
      { goal: 'cut-bill', demandCharge: 'no', energyRate: 'block', usage: 'daytime' },
    ] as const;
    for (const a of samples) {
      expect(buildRationale(a, recommendStrategy(a)).length).toBeGreaterThan(10);
    }
  });

  it('backup/independence rationale works without a usage answer (no "undefined")', () => {
    const backup = { goal: 'backup' } as const;
    const indep = { goal: 'independence' } as const;
    const backupText = buildRationale(backup, recommendStrategy(backup));
    const indepText = buildRationale(indep, recommendStrategy(indep));
    expect(backupText).not.toContain('undefined');
    expect(indepText).not.toContain('undefined');
    expect(backupText.length).toBeGreaterThan(10);
    expect(indepText.length).toBeGreaterThan(10);
  });
});
