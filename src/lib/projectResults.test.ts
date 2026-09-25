import { describe, it, expect } from 'vitest';
import { describeResults, formatAsOf, isMeasured, PROJECTED_RESULTS_NOTE } from './projectResults';

describe('describeResults', () => {
  it('treats results with no basis as projected, with the default note', () => {
    expect(describeResults({})).toEqual({ heading: 'Projected results', asOf: null, note: PROJECTED_RESULTS_NOTE });
    expect(describeResults({ resultsBasis: null, resultsAsOf: null, resultsAssumptions: null }).heading).toBe('Projected results');
  });

  it('says "Measured results" only when the basis is measured', () => {
    expect(describeResults({ resultsBasis: 'measured' }).heading).toBe('Measured results');
    expect(describeResults({ resultsBasis: 'projected' }).heading).toBe('Projected results');
  });

  it("shows the editor's note instead of the default", () => {
    const note = 'An editor-written assumptions note.';
    expect(describeResults({ resultsAssumptions: `  ${note} ` }).note).toBe(note);
    expect(describeResults({ resultsBasis: 'measured', resultsAssumptions: note }).note).toBe(note);
  });

  it('gives measured results no default note, and ignores a blank one', () => {
    expect(describeResults({ resultsBasis: 'measured' }).note).toBeNull();
    expect(describeResults({ resultsBasis: 'measured', resultsAssumptions: '   ' }).note).toBeNull();
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
  it('is true only for "measured"', () => {
    expect(isMeasured('measured')).toBe(true);
    expect(isMeasured('projected')).toBe(false);
    expect(isMeasured(undefined)).toBe(false);
    expect(isMeasured(null)).toBe(false);
  });
});
