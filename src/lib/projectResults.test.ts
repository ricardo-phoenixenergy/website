import { describe, it, expect } from 'vitest';
import { describeResults, formatAsOf, formatMonthYear, isMeasured, PROJECTED_RESULTS_NOTE } from './projectResults';

describe('describeResults', () => {
  it('treats results with no basis as projected, with the default note', () => {
    expect(describeResults({})).toEqual({ heading: 'Projected results', asOf: null, note: PROJECTED_RESULTS_NOTE });
    expect(describeResults({ resultsBasis: null, resultsAsOf: null, resultsAssumptions: null, status: null }).heading).toBe('Projected results');
  });

  it('says "Measured results" only when the basis is measured and the project is completed', () => {
    expect(describeResults({ resultsBasis: 'measured', status: 'completed' }).heading).toBe('Measured results');
    expect(describeResults({ resultsBasis: 'projected', status: 'completed' }).heading).toBe('Projected results');
  });

  it('labels measured figures on a project still being built, planned or without a status as projected', () => {
    for (const status of ['in-progress', 'planned', null, undefined] as const) {
      expect(describeResults({ resultsBasis: 'measured', status }).heading).toBe('Projected results');
    }
  });

  it("shows the editor's note instead of the default", () => {
    const note = 'An editor-written assumptions note.';
    expect(describeResults({ resultsAssumptions: `  ${note} ` }).note).toBe(note);
    expect(describeResults({ resultsBasis: 'measured', status: 'completed', resultsAssumptions: note }).note).toBe(note);
  });

  it('gives measured results no default note, and ignores a blank one', () => {
    expect(describeResults({ resultsBasis: 'measured', status: 'completed' }).note).toBeNull();
    expect(describeResults({ resultsBasis: 'measured', status: 'completed', resultsAssumptions: '   ' }).note).toBeNull();
    expect(describeResults({ resultsAssumptions: '   ' }).note).toBe(PROJECTED_RESULTS_NOTE);
  });

  it('passes the as-of date through, formatted', () => {
    expect(describeResults({ resultsAsOf: '2026-06-30' }).asOf).toBe('30 June 2026');
  });
});

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

describe('isMeasured', () => {
  it('is true only for "measured" on a completed project', () => {
    expect(isMeasured('measured', 'completed')).toBe(true);
    expect(isMeasured('measured', 'in-progress')).toBe(false);
    expect(isMeasured('measured', undefined)).toBe(false);
    expect(isMeasured('projected', 'completed')).toBe(false);
    expect(isMeasured(null, 'completed')).toBe(false);
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
