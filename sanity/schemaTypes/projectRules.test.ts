import { describe, expect, it } from 'vitest';
import * as rules from './projectRules';
import {
  COMMISSIONED_FUTURE_WARNING,
  HERO_WIDTH_WARNING,
  RESULTS_COUNT_WARNING,
  SYSTEM_ROWS_WARNING,
  commissionedWarning,
  heroWidthWarning,
  resultsCountWarning,
  systemRowsWarning,
  widthFromAssetRef,
} from './projectRules';

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
});

describe('the completion date', () => {
  const today = new Date(2026, 9, 9);

  it('warns about a date after today on a completed project', () => {
    expect(commissionedWarning('2026-10-10', { status: 'completed' }, today)).toBe(COMMISSIONED_FUTURE_WARNING);
    expect(commissionedWarning('2027-09-01', { status: 'completed' }, today)).toBe(COMMISSIONED_FUTURE_WARNING);
  });

  it('passes today or an earlier date on a completed project, and no date at all', () => {
    expect(commissionedWarning('2026-10-09', { status: 'completed' }, today)).toBe(true);
    expect(commissionedWarning('2026-06-12', { status: 'completed' }, today)).toBe(true);
    expect(commissionedWarning(undefined, { status: 'completed' }, today)).toBe(true);
  });

  it('passes any date on a planned or in-progress project, the day it is due', () => {
    expect(commissionedWarning('2027-09-01', { status: 'planned' }, today)).toBe(true);
    expect(commissionedWarning('2027-09-01', { status: 'in-progress' }, today)).toBe(true);
    expect(commissionedWarning('2025-01-01', { status: 'planned' }, today)).toBe(true);
    expect(commissionedWarning(undefined, { status: 'planned' }, today)).toBe(true);
  });
});

describe('the rules that went with the switches', () => {
  it('are gone: no consent date, results basis, as-of date, inputs, rand amount or client name checks', () => {
    for (const name of [
      'consentDateError',
      'measuredWarning',
      'asOfWarning',
      'inputsWarning',
      'proseWarning',
      'slugWarning',
      'rowWarning',
      'nameMayShow',
      'RAND_WARNING',
      'CLIENT_NAME_WARNING',
      'ROW_DROPPED_WARNING',
    ]) {
      expect(name in rules, name).toBe(false);
    }
  });
});
