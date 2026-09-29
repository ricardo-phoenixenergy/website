import { describe, expect, it } from 'vitest';
import { discloseProject, isRandAmount, withoutRandAmounts } from './projectDisclosure';

describe('isRandAmount', () => {
  it('spots rand amounts however they are written', () => {
    for (const text of [
      'R1.5M',
      'R 450 000',
      'R7/kWh',
      'R 1 500 000',
      'R1,5 m',
      '(R2.1m)',
      '-R300k',
      'ZAR 2m',
      'ZAR1.5m',
      '1.5 million rand',
      '2 million Rands',
      'Annual savings (R)',
    ]) {
      expect(isRandAmount(text), text).toBe(true);
    }
  });

  it('leaves percentages, times, sizes, model names and words containing "rand" alone', () => {
    for (const text of ['41.8%', '51 months', '>95%', '82.8 kWp', '80 kWh', '90 kW', 'Outright Purchase', 'RS485', 'PR2', 'R&D', 'Brand new inverters', 'Solar PV Capacity', '']) {
      expect(isRandAmount(text), text).toBe(false);
    }
    expect(isRandAmount(null)).toBe(false);
    expect(isRandAmount(undefined)).toBe(false);
  });
});

describe('withoutRandAmounts', () => {
  it('drops a row whose value or label looks like a rand amount, label and value together', () => {
    const rows = [
      { label: 'Payback period', value: '51 months' },
      { label: 'Capital cost', value: 'R1.5M' },
      { label: 'Annual savings (R)', value: '1.2 million' },
      { label: 'Energy bill reduction', value: '41.8%' },
    ];
    expect(withoutRandAmounts(rows)).toEqual([rows[0], rows[3]]);
  });

  it('drops empty rows and treats a missing list as empty', () => {
    expect(withoutRandAmounts([{ label: 'Solar PV', value: '  ' }, { label: '', value: '80 kWh' }])).toEqual([]);
    expect(withoutRandAmounts(null)).toEqual([]);
    expect(withoutRandAmounts(undefined)).toEqual([]);
  });
});

describe('discloseProject', () => {
  it('clears rand amounts from results and System rows, and keeps everything else', () => {
    const project = {
      title: 'A project',
      results: [{ label: 'Savings', value: 'R 450 000 a year' }, { label: 'Payback period', value: '51 months' }],
      metrics: [{ label: 'Deal Structure', value: 'Outright Purchase' }, { label: 'Project value', value: 'R42M' }],
    };
    expect(discloseProject(project)).toEqual({
      title: 'A project',
      results: [{ label: 'Payback period', value: '51 months' }],
      metrics: [{ label: 'Deal Structure', value: 'Outright Purchase' }],
    });
  });

  it('gives empty lists for missing figures', () => {
    expect(discloseProject({ title: 'Bare', results: null, metrics: undefined })).toEqual({ title: 'Bare', results: [], metrics: [] });
  });
});
