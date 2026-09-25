import { describe, expect, it } from 'vitest';
import { resolveCompanyStats, statAsOfCaption, DEFAULT_COMPANY_STATS } from '@/lib/companyStats';

describe('company stats', () => {
  it('captions a stat only when an editor has dated it', () => {
    expect(statAsOfCaption({ value: '40+', label: 'Projects completed' })).toBeNull();
    expect(statAsOfCaption({ value: '40+', label: 'Projects completed', asOf: null })).toBeNull();
    expect(statAsOfCaption({ value: '40+', label: 'Projects completed', asOf: '2026-06-30' })).toBe('As at 30 June 2026');
    expect(statAsOfCaption({ value: '40+', label: 'Projects completed', asOf: 'June 2026' })).toBeNull();
  });

  it('keeps the register fields when resolving Sanity stats', () => {
    const stats = [{ value: '10 MWp', label: 'Solar PV installed', source: 'Commissioning list', asOf: '2026-06-30' }];
    expect(resolveCompanyStats(stats)).toEqual(stats);
    expect(resolveCompanyStats(null)).toBe(DEFAULT_COMPANY_STATS);
  });
});
