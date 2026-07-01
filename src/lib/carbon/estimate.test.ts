import { describe, it, expect } from 'vitest';
import { estimateCarbon } from './estimate';

describe('estimateCarbon', () => {
  it('1 MWp (1000 kWp) → ~1,520 credits and R76k–R228k', () => {
    const e = estimateCarbon(1000);
    expect(e.tonnesPerYear).toBe(1520);
    expect(e.creditsPerYear).toBe(1520);
    expect(e.revenueLow).toBe(76000);
    expect(e.revenueHigh).toBe(228000);
  });

  it('100 kWp scales linearly', () => {
    const e = estimateCarbon(100);
    expect(e.creditsPerYear).toBe(152);
    expect(e.revenueLow).toBe(7600);
    expect(e.revenueHigh).toBe(22800);
  });

  it('10 MWp scales linearly', () => {
    const e = estimateCarbon(10000);
    expect(e.creditsPerYear).toBe(15200);
    expect(e.revenueLow).toBe(760000);
    expect(e.revenueHigh).toBe(2280000);
  });

  it('tonnes equals credits (1 credit = 1 tonne)', () => {
    const e = estimateCarbon(2500);
    expect(e.tonnesPerYear).toBe(e.creditsPerYear);
  });

  it('zero size → all zero', () => {
    const e = estimateCarbon(0);
    expect(e.creditsPerYear).toBe(0);
    expect(e.revenueLow).toBe(0);
    expect(e.revenueHigh).toBe(0);
  });
});
