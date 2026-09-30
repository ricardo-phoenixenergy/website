import { describe, expect, it } from 'vitest';
import { completeRows, discloseProject, isRandAmount, isRandRow, withoutRandAmounts } from './projectDisclosure';
import type { ProjectMetric } from '@/types/sanity';

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

  it('spots R written as a unit, in a label or after a number', () => {
    for (const text of [
      'Tariff (R/kWh)',
      'Savings (R/year)',
      "Annual savings (R'000)",
      'Annual savings (R\u2019000)',
      'Annual savings (R m)',
      'Annual savings (Rm)',
      'Capital cost (Rbn)',
      'Capital cost (R, excl. VAT)',
      'Tariff R / kWh',
      "Savings R'000",
      '2.10 R/kWh',
      '450 000 R',
      '450\u00a0000\u00a0R',
      '1.2m R',
      '1.5M R',
      '1.5 bn R',
      'R per kWh',
      'Rate: R per kWh',
    ]) {
      expect(isRandAmount(text), text).toBe(true);
    }
  });

  it('leaves percentages, times, sizes, model names and words containing "rand" alone', () => {
    for (const text of [
      '41.8%',
      '51 months',
      '>95%',
      '82.8 kWp',
      '80 kWh',
      '90 kW',
      'Outright Purchase',
      'RS485',
      'PR2',
      'R&D',
      '(R&D)',
      '12 R&D projects',
      '3 Rooftops',
      'Voltage (RMS)',
      'Brand new',
      'Brand new inverters',
      'Randburg',
      'Solar PV Capacity',
      '',
    ]) {
      expect(isRandAmount(text), text).toBe(false);
    }
    expect(isRandAmount(null)).toBe(false);
    expect(isRandAmount(undefined)).toBe(false);
  });

  it('spots a price in cents, however it is written: what the client pays, hidden the same as a rand amount', () => {
    for (const text of [
      '180c/kWh',
      '180 c/kWh',
      '95c per kWh',
      '1.5c/kWh',
      'Tariff (c/kWh)',
      'Energy charge (c/kWh)',
      '95 cents a unit',
      '12 cents',
      'Tariff c/kWh',
      'Rate c/kWh',
      'c/kWh',
      'c per kWh',
      'Energy charge c per kWh',
    ]) {
      expect(isRandAmount(text), text).toBe(true);
    }
  });

  it('leaves temperatures, ratings, classes and other things spelled with "c" alone', () => {
    for (const text of [
      '25°C',
      '5C rating',
      'Class 3c',
      'c-Si panels',
      'CO2 saved',
      '3 circuits',
      'IEC 61215',
      '80 kWh',
      'kWh/c',
      'Cost per kWh',
      'Yield per kWh',
      'Solar per kWh',
      'Savings per kWp',
    ]) {
      expect(isRandAmount(text), text).toBe(false);
    }
  });
});

describe('isRandRow', () => {
  it("spots a rand amount in a row's label, value or note: the test the page drops rows by and the Studio warns by", () => {
    expect(isRandRow({ label: 'Annual savings (R)', value: '1.2 million' })).toBe(true);
    expect(isRandRow({ label: 'Capital cost', value: 'R1.5M' })).toBe(true);
    expect(isRandRow({ label: 'Tariff saving', value: '38%', note: 'Against 180c/kWh at peak' })).toBe(true);
    expect(isRandRow({ label: 'Payback period', value: '51 months', note: 'Year 1, against 2025 municipal bills' })).toBe(false);
  });

  it('reads an incomplete row as no rand amount, where withoutRandAmounts drops it for being incomplete', () => {
    expect(isRandRow({ label: 'Payback period', value: null })).toBe(false);
    expect(isRandRow({})).toBe(false);
    expect(withoutRandAmounts([{ label: 'Payback period', value: '' }])).toEqual([]);
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

  it('drops a row whose label or value is null, without throwing', () => {
    // GROQ gives null for a field that isn't set, whatever the type says.
    const rows = [
      { label: null, value: '82.8 kWp' },
      { label: 'Payback period', value: null },
      { label: 'Energy bill reduction', value: '41.8%' },
    ] as unknown as ProjectMetric[];
    expect(withoutRandAmounts(rows)).toEqual([{ label: 'Energy bill reduction', value: '41.8%' }]);
  });
});

describe('withoutRandAmounts on results figures', () => {
  it('drops a figure whose note looks like a rand amount, with its label and value', () => {
    const rows = [
      { label: 'Energy bill reduction', value: '41.8%', note: 'Year 1, against R2.1m of 2025 bills' },
      { label: 'Payback period', value: '51 months', note: 'Year 1, against 2025 municipal bills' },
      { label: 'Tariff saving', value: '38%', note: 'Against 180c/kWh at peak' },
    ];
    expect(withoutRandAmounts(rows)).toEqual([rows[1]]);
  });
});

describe('completeRows', () => {
  it('keeps every row with a label and a value, whatever it says', () => {
    expect(completeRows([{ label: 'Capital cost', value: 'R1.5M' }, { label: 'Tariff', value: ' ' }, { label: ' ', value: '8%' }])).toEqual([
      { label: 'Capital cost', value: 'R1.5M' },
    ]);
    expect(completeRows(null)).toEqual([]);
  });
});

describe('discloseProject', () => {
  const figures = {
    results: [{ label: 'Savings', value: 'R 450 000 a year' }, { label: 'Payback period', value: '51 months' }],
    metrics: [{ label: 'Deal Structure', value: 'Outright Purchase' }, { label: 'Project value', value: 'R42M' }],
  };

  it('clears rand amounts from results and System rows, and keeps everything else', () => {
    expect(discloseProject({ title: 'A project', ...figures })).toEqual({
      title: 'A project',
      results: [{ label: 'Payback period', value: '51 months' }],
      metrics: [{ label: 'Deal Structure', value: 'Outright Purchase' }],
    });
  });

  it('gives empty lists for missing figures', () => {
    expect(discloseProject({ title: 'Bare', results: null, metrics: undefined })).toEqual({ title: 'Bare', results: [], metrics: [] });
  });

  it('shows rand amounts as written once "Show rand amounts" is on, and still drops empty rows', () => {
    const project = { title: 'Agreed', showRandAmounts: true, results: [...figures.results, { label: 'Blank', value: ' ' }], metrics: figures.metrics };
    expect(discloseProject(project)).toEqual({ title: 'Agreed', showRandAmounts: true, results: figures.results, metrics: figures.metrics });
  });

  it('treats a switch that is null or false as off', () => {
    for (const showRandAmounts of [null, false]) {
      expect(discloseProject({ title: 'Off', showRandAmounts, ...figures }).results).toEqual([{ label: 'Payback period', value: '51 months' }]);
    }
  });

  it('drops rand amounts from the calculation inputs while the switch is off, and keeps them when it is on', () => {
    const resultsInputs = [
      { label: 'Tariff', value: '180c/kWh' },
      { label: 'Tariff escalation', value: '8% a year' },
      { label: 'Capital cost', value: 'R1.2m' },
    ];
    expect(discloseProject({ title: 'Off', resultsInputs }).resultsInputs).toEqual([{ label: 'Tariff escalation', value: '8% a year' }]);
    expect(discloseProject({ title: 'On', showRandAmounts: true, resultsInputs }).resultsInputs).toEqual(resultsInputs);
  });

  it('gives a page whose inputs are null an empty list, and leaves a card without the field as it is', () => {
    expect(discloseProject({ title: 'Page', resultsInputs: null }).resultsInputs).toEqual([]);
    expect(discloseProject({ title: 'Card', results: [] })).not.toHaveProperty('resultsInputs');
  });
});
