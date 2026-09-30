import { describe, expect, it } from 'vitest';
import {
  AS_OF_WARNING,
  CLIENT_NAME_WARNING,
  COMMISSIONED_EARLY_WARNING,
  COMMISSIONED_WARNING,
  CONSENT_DATE_ERROR,
  HERO_WIDTH_WARNING,
  INPUTS_WARNING,
  MEASURED_WARNING,
  RAND_WARNING,
  RESULTS_COUNT_WARNING,
  ROW_DROPPED_WARNING,
  SYSTEM_ROWS_WARNING,
  asOfWarning,
  commissionedWarning,
  consentDateError,
  heroWidthWarning,
  inputsWarning,
  measuredWarning,
  nameMayShow,
  proseText,
  proseWarning,
  resultsCountWarning,
  rowWarning,
  slugWarning,
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

describe('the name may show: one test, the one the query applies', () => {
  const named = { clientName: 'Hidden Client Ltd', showClientName: true };

  it('counts only a consent date in the form the Studio writes and the query reads (2026-06-12)', () => {
    // An import or an API write can leave "", "TBC" or a date in words: the query reads none of
    // them as consent, so the name stays hidden, the warnings keep warning and publishing stops.
    for (const clientConsentOn of ['', 'TBC', '12 June 2026']) {
      expect(nameMayShow({ ...named, clientConsentOn }), clientConsentOn).toBe(false);
      expect(proseWarning('Built for Hidden Client Ltd', { ...named, clientConsentOn }), clientConsentOn).toBe(CLIENT_NAME_WARNING);
      expect(consentDateError(clientConsentOn, { ...named, clientConsentOn }), clientConsentOn).toBe(CONSENT_DATE_ERROR);
    }
    expect(nameMayShow({ ...named, clientConsentOn: '2026-06-12' })).toBe(true);
    expect(proseWarning('Built for Hidden Client Ltd', { ...named, clientConsentOn: '2026-06-12' })).toBe(true);
    expect(consentDateError('2026-06-12', { ...named, clientConsentOn: '2026-06-12' })).toBe(true);
  });

  it('never counts a date while "Show client name" is off, and asks for none then', () => {
    expect(nameMayShow({ clientName: 'Hidden Client Ltd', showClientName: false, clientConsentOn: '2026-06-12' })).toBe(false);
    expect(nameMayShow(undefined)).toBe(false);
    expect(consentDateError('TBC', { showClientName: false })).toBe(true);
  });
});

describe('slugWarning', () => {
  const client = { clientName: 'Example Client' };
  const slug = (current: string) => ({ _type: 'slug', current });

  it('warns when the slug names the client, its hyphens read as spaces, until the name may show', () => {
    expect(slugWarning(slug('example-client-warehouse'), client)).toBe(CLIENT_NAME_WARNING);
    expect(slugWarning(slug('example-client-warehouse'), { ...client, showClientName: true, clientConsentOn: '2026-06-12' })).toBe(true);
  });

  it('passes a slug that does not name the client, or no slug, and checks the name only', () => {
    expect(slugWarning(slug('harbour-road-warehouse'), client)).toBe(true);
    expect(slugWarning(slug(''), client)).toBe(true);
    expect(slugWarning(undefined, client)).toBe(true);
    // A slug can't hold a rand amount ("R1.5M" slugs to "r1-5m"), so there is no rand check.
    expect(slugWarning(slug('r1-5m-rooftop'), client)).toBe(true);
  });
});

describe('rowWarning', () => {
  const on = { ...off, showRandAmounts: true };

  it("warns that a row whose label, value or note looks like a rand amount won't show while the switch is off", () => {
    for (const row of [
      { label: 'Annual savings (R)', value: '1.2 million' },
      { label: 'Capital cost', value: 'R1.5M' },
      { label: 'Energy bill reduction', value: '41.8%', note: 'Year 1, against R2.1m of 2025 bills' },
      { label: 'Tariff', value: '180c/kWh' },
    ]) {
      expect(rowWarning(row, off), JSON.stringify(row)).toBe(ROW_DROPPED_WARNING);
      expect(rowWarning(row, on), JSON.stringify(row)).toBe(true);
    }
  });

  it('warns when the label, value or note names the client, until the name may show', () => {
    const named = { ...off, showClientName: true, clientConsentOn: '2026-06-12' };
    for (const row of [
      { label: 'Hidden Client Ltd site', value: '82.8 kWp' },
      { label: 'Tenant', value: 'Hidden Client Ltd' },
      { label: 'Energy bill reduction', value: '41.8%', note: 'Against hidden client ltd bills' },
    ]) {
      expect(rowWarning(row, off), JSON.stringify(row)).toBe(CLIENT_NAME_WARNING);
      expect(rowWarning(row, named), JSON.stringify(row)).toBe(true);
    }
  });

  it('puts the rand warning first, since a dropped row shows no name', () => {
    const both = { label: 'Hidden Client Ltd savings', value: 'R1.5M' };
    expect(rowWarning(both, off)).toBe(ROW_DROPPED_WARNING);
    expect(rowWarning(both, on)).toBe(CLIENT_NAME_WARNING);
  });

  it('passes a clean row, and an incomplete or missing one, which the page leaves out for being incomplete', () => {
    expect(rowWarning({ label: 'Payback period', value: '51 months', note: 'Year 1, against 2025 municipal bills' }, off)).toBe(true);
    expect(rowWarning({ label: 'Payback period' }, off)).toBe(true);
    expect(rowWarning({ label: 'Payback period', value: 51 }, off)).toBe(true);
    expect(rowWarning(undefined, off)).toBe(true);
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

  it('warns about a commissioning date on a project that is not completed, since the lists are ordered by it', () => {
    expect(commissionedWarning('2027-09-01', { status: 'planned' })).toBe(COMMISSIONED_EARLY_WARNING);
    expect(commissionedWarning('2027-09-01', { status: 'in-progress' })).toBe(COMMISSIONED_EARLY_WARNING);
    expect(commissionedWarning('2027-09-01', {})).toBe(COMMISSIONED_EARLY_WARNING);
    expect(commissionedWarning('2026-06-12', { status: 'completed' })).toBe(true);
    expect(commissionedWarning(undefined, { status: 'completed' })).toBe(COMMISSIONED_WARNING);
    expect(commissionedWarning(undefined, { status: 'in-progress' })).toBe(true);
  });

  it('requires the consent date once "Show client name" is on', () => {
    expect(consentDateError(undefined, { showClientName: true })).toBe(CONSENT_DATE_ERROR);
    expect(consentDateError('2026-09-01', { showClientName: true })).toBe(true);
    expect(consentDateError(undefined, { showClientName: false })).toBe(true);
  });
});
