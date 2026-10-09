// The comparison table's checks in the Studio: each row needs a label and one
// value per column, or the table on the site shows a gap the editor didn't mean.
import { describe, expect, it } from 'vitest';
import { tableRowWarning } from './blogPostRules';

describe('tableRowWarning', () => {
  const columns = ['Tariff C', 'Tariff E'];

  it('passes a row with a label and one value per column', () => {
    expect(tableRowWarning({ label: 'Demand charge', values: ['R321 per kVA', 'R172 per kVA'] }, columns)).toBe(true);
  });

  it('warns when the label is missing', () => {
    expect(tableRowWarning({ label: ' ', values: ['a', 'b'] }, columns)).toBe('Give the row a label: it heads the row.');
  });

  it('warns when the row has fewer or more values than there are columns', () => {
    expect(tableRowWarning({ label: 'Energy', values: ['a'] }, columns)).toBe('This row has 1 value for 2 columns. Add one value per column, in the same order.');
    expect(tableRowWarning({ label: 'Energy', values: ['a', 'b', 'c'] }, columns)).toBe('This row has 3 values for 2 columns. Add one value per column, in the same order.');
  });

  it('says nothing until the columns are set', () => {
    expect(tableRowWarning({ label: 'Energy', values: ['a'] }, undefined)).toBe(true);
  });
});
