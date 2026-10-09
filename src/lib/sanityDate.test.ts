import { describe, it, expect } from 'vitest';
import * as sanityDate from './sanityDate';
import { formatAsOf, formatMonthYear } from './sanityDate';

describe('formatAsOf', () => {
  it('formats a Sanity date without locale data', () => {
    expect(formatAsOf('2026-01-05')).toBe('5 January 2026');
    expect(formatAsOf('2027-12-31')).toBe('31 December 2027');
  });

  it('returns null for anything that is not a YYYY-MM-DD date', () => {
    for (const bad of [undefined, null, '', 'June 2026', '2026-13-01', '2026-06-00', '2026-06-30T10:00:00Z']) {
      expect(formatAsOf(bad)).toBeNull();
    }
  });
});

describe('formatMonthYear', () => {
  it('gives the month and year of a Sanity date', () => {
    expect(formatMonthYear('2026-06-12')).toBe('June 2026');
    expect(formatMonthYear('2027-01-31')).toBe('January 2027');
  });

  it('returns null for anything that is not a YYYY-MM-DD date', () => {
    for (const bad of [undefined, null, '', '12 June 2026', '2026-06', '2026-00-10', '2026-06-12T08:00:00Z']) {
      expect(formatMonthYear(bad)).toBeNull();
    }
  });
});

describe('the results labelling', () => {
  it('is gone: the Impact card has no basis, as-of date or default note to work out', () => {
    for (const name of ['describeResults', 'isMeasured', 'PROJECTED_RESULTS_NOTE']) {
      expect(name in sanityDate, name).toBe(false);
    }
  });
});
