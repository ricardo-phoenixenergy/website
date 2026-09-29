import { describe, expect, it } from 'vitest';
import {
  AS_OF_WARNING,
  CLIENT_NAME_WARNING,
  COMMISSIONED_WARNING,
  CONSENT_DATE_ERROR,
  HERO_WIDTH_WARNING,
  INPUTS_WARNING,
  MEASURED_WARNING,
  RAND_WARNING,
  RESULTS_COUNT_WARNING,
  SYSTEM_ROWS_WARNING,
  asOfWarning,
  commissionedWarning,
  consentDateError,
  heroWidthWarning,
  inputsWarning,
  measuredWarning,
  proseText,
  proseWarning,
  resultsCountWarning,
  systemRowsWarning,
  widthFromAssetRef,
} from './projectRules';

const block = (text: string) => ({ _type: 'block', _key: 'b', children: [{ _type: 'span', _key: 's', text }] });
const off = { clientName: 'Hidden Client Ltd' };

describe('proseText', () => {
  it('reads a string, or the words of Portable Text, and nothing else', () => {
    expect(proseText('A summary.')).toBe('A summary.');
    expect(proseText([block('First.'), { _type: 'image', _key: 'i' }, block('Second.')])).toBe('First.\nSecond.');
    expect(proseText(undefined)).toBe('');
    expect(proseText({ asset: {} })).toBe('');
  });
});

describe('proseWarning', () => {
  it('warns about a rand amount or a price in cents while "Show rand amounts" is off', () => {
    expect(proseWarning('We saved the tenant R450 000 a year.', off)).toBe(RAND_WARNING);
    expect(proseWarning([block('Peak power cost 180c/kWh.')], off)).toBe(RAND_WARNING);
    expect(proseWarning('We saved the tenant R450 000 a year.', { ...off, showRandAmounts: true })).toBe(true);
  });

  it("warns when the text names the client, whatever its case, until the name may show", () => {
    expect(proseWarning('A rooftop array for hidden client ltd.', off)).toBe(CLIENT_NAME_WARNING);
    expect(proseWarning('Hidden Client Ltd in Cape Town', { ...off, showClientName: true })).toBe(CLIENT_NAME_WARNING);
    expect(proseWarning('Hidden Client Ltd in Cape Town', { ...off, showClientName: true, clientConsentOn: '2026-09-01' })).toBe(true);
  });

  it('passes other text, empty text, and a client name too short to match safely', () => {
    expect(proseWarning('A battery covers the evening peak, saving 41.8%.', off)).toBe(true);
    expect(proseWarning('   ', off)).toBe(true);
    expect(proseWarning(undefined, undefined)).toBe(true);
    expect(proseWarning('AB Logistics', { clientName: 'AB' })).toBe(true);
  });
});

describe('the hero width warning', () => {
  it('reads the width from the asset reference', () => {
    expect(widthFromAssetRef('image-abc123-4000x2250-jpg')).toBe(4000);
    expect(widthFromAssetRef('image-abc123-1200x900-png')).toBe(1200);
    expect(widthFromAssetRef('not-an-image')).toBeNull();
    expect(widthFromAssetRef(undefined)).toBeNull();
  });

  it('warns for a photo under 2400px wide, and passes a wide photo or none', () => {
    expect(heroWidthWarning({ asset: { _ref: 'image-abc123-1200x900-png' } })).toBe(HERO_WIDTH_WARNING);
    expect(heroWidthWarning({ asset: { _ref: 'image-abc123-2400x1350-jpg' } })).toBe(true);
    expect(heroWidthWarning(undefined)).toBe(true);
  });
});

describe('the results and System warnings', () => {
  const rows = (n: number) => Array.from({ length: n }, (_, i) => ({ _key: `r${i}` }));

  it('warns above four results', () => {
    expect(resultsCountWarning(rows(5))).toBe(RESULTS_COUNT_WARNING);
    expect(resultsCountWarning(rows(4))).toBe(true);
    expect(resultsCountWarning(undefined)).toBe(true);
  });

  it('warns outside two to four System rows', () => {
    expect(systemRowsWarning(rows(1))).toBe(SYSTEM_ROWS_WARNING);
    expect(systemRowsWarning(rows(5))).toBe(SYSTEM_ROWS_WARNING);
    expect(systemRowsWarning(undefined)).toBe(SYSTEM_ROWS_WARNING);
    expect(systemRowsWarning(rows(2))).toBe(true);
    expect(systemRowsWarning(rows(4))).toBe(true);
  });

  it('warns when Measured is picked on a project that is not completed', () => {
    expect(measuredWarning('measured', { status: 'in-progress' })).toBe(MEASURED_WARNING);
    expect(measuredWarning('measured', {})).toBe(MEASURED_WARNING);
    expect(measuredWarning('measured', { status: 'completed' })).toBe(true);
    expect(measuredWarning('projected', { status: 'planned' })).toBe(true);
  });

  it('asks for the as-of date and the calculation inputs once there are results', () => {
    expect(asOfWarning(undefined, { results: rows(2) })).toBe(AS_OF_WARNING);
    expect(asOfWarning('2026-06-30', { results: rows(2) })).toBe(true);
    expect(asOfWarning(undefined, { results: [] })).toBe(true);
    expect(inputsWarning(undefined, { results: rows(1) })).toBe(INPUTS_WARNING);
    expect(inputsWarning([], { results: rows(1) })).toBe(INPUTS_WARNING);
    expect(inputsWarning(rows(1), { results: rows(1) })).toBe(true);
    expect(inputsWarning(undefined, {})).toBe(true);
  });
});

describe('the dates', () => {
  it('asks for the commissioning date on a completed project only', () => {
    expect(commissionedWarning(undefined, { status: 'completed' })).toBe(COMMISSIONED_WARNING);
    expect(commissionedWarning('2026-06-12', { status: 'completed' })).toBe(true);
    expect(commissionedWarning(undefined, { status: 'planned' })).toBe(true);
  });

  it('requires the consent date once "Show client name" is on', () => {
    expect(consentDateError(undefined, { showClientName: true })).toBe(CONSENT_DATE_ERROR);
    expect(consentDateError('2026-09-01', { showClientName: true })).toBe(true);
    expect(consentDateError(undefined, { showClientName: false })).toBe(true);
  });
});
