import { describe, expect, it } from 'vitest';
import { parseAmount, readAmount } from './parseAmount';
import { sizeMessage } from './valuation/sizeFields';

describe('parseAmount', () => {
  it('keeps decimals with a point or a decimal comma', () => {
    expect(parseAmount('10.24')).toBe(10.24);
    expect(parseAmount('10,24')).toBe(10.24);
    expect(parseAmount('82.8')).toBe(82.8);
    expect(parseAmount('7,2')).toBe(7.2);
  });

  it('reads thousands separators', () => {
    expect(parseAmount('10 000')).toBe(10000);
    expect(parseAmount('10,000')).toBe(10000);
    expect(parseAmount('1,250.5')).toBe(1250.5);
    expect(parseAmount('1.250,5')).toBe(1250.5);
  });

  it('rejects anything that is not a number instead of guessing', () => {
    expect(parseAmount('')).toBeNaN();
    expect(parseAmount('abc')).toBeNaN();
    expect(parseAmount('12kw')).toBeNaN();
    expect(parseAmount('-5')).toBeNaN();
    expect(parseAmount('1.2.3')).toBeNaN();
  });

  it('limits decimal places', () => {
    expect(parseAmount('1.234', 2)).toBeNaN();
    expect(parseAmount('1.5', 0)).toBeNaN();
    expect(parseAmount('15', 0)).toBe(15);
  });
});

describe('readAmount: says why a value is refused', () => {
  it('accepts the same formats as parseAmount', () => {
    expect(readAmount('82,8', 1)).toEqual({ ok: true, value: 82.8 });
    expect(readAmount('10 000', 1)).toEqual({ ok: true, value: 10000 });
    expect(readAmount('1,250.5', 1)).toEqual({ ok: true, value: 1250.5 });
    expect(readAmount('  250  ', 1)).toEqual({ ok: true, value: 250 });
    expect(readAmount('0', 1)).toEqual({ ok: true, value: 0 });
  });

  it('too many decimal places', () => {
    expect(readAmount('10.24', 1)).toEqual({ ok: false, issue: 'decimals' });
    expect(readAmount('82,85', 1)).toEqual({ ok: false, issue: 'decimals' });
    expect(readAmount('12.345', 2)).toEqual({ ok: false, issue: 'decimals' });
    expect(readAmount('1,234.567', 2)).toEqual({ ok: false, issue: 'decimals' });
  });

  it('a unit typed after the number', () => {
    expect(readAmount('250 kWp', 1)).toEqual({ ok: false, issue: 'units' });
    expect(readAmount('12kw', 2)).toEqual({ ok: false, issue: 'units' });
    expect(readAmount('82,8 kWp', 1)).toEqual({ ok: false, issue: 'units' });
    expect(readAmount('10.5kWh', 2)).toEqual({ ok: false, issue: 'units' });
  });

  it('not a number', () => {
    expect(readAmount('abc', 1)).toEqual({ ok: false, issue: 'format' });
    expect(readAmount('1.2.3', 1)).toEqual({ ok: false, issue: 'format' });
    expect(readAmount('1e5', 1)).toEqual({ ok: false, issue: 'format' });
    expect(readAmount('kWp 250', 1)).toEqual({ ok: false, issue: 'format' });
  });

  it('empty and negative', () => {
    expect(readAmount('', 1)).toEqual({ ok: false, issue: 'empty' });
    expect(readAmount('   ', 1)).toEqual({ ok: false, issue: 'empty' });
    expect(readAmount('-5', 1)).toEqual({ ok: false, issue: 'negative' });
    expect(readAmount('-82,8', 1)).toEqual({ ok: false, issue: 'negative' });
  });
});

describe('sizeMessage: the valuation request names the actual problem', () => {
  const messageFor = (field: 'kw' | 'inverterKw' | 'kWh', text: string, decimals: number) => {
    const reading = readAmount(text, decimals);
    return sizeMessage(field, reading.ok ? reading.value : NaN, reading.ok ? null : reading.issue);
  };

  it('too many decimals: the rule, not "above 0"', () => {
    expect(messageFor('kw', '10.24', 1)).toBe('Use up to one decimal place, for example 82.8.');
    expect(messageFor('kWh', '12.345', 2)).toBe('Use up to two decimal places, for example 10.24.');
  });

  it('units typed: the number only', () => {
    expect(messageFor('kw', '250 kWp', 1)).toBe('Enter the number only, without the unit, for example 250.');
    expect(messageFor('inverterKw', '100kW', 1)).toBe('Enter the number only, without the unit, for example 100.');
  });

  it('not a number', () => {
    expect(messageFor('kw', 'abc', 1)).toBe('Enter a number, for example 250 or 82.8.');
  });

  it('zero, negative or empty: above 0', () => {
    for (const text of ['0', '-5', '']) {
      expect(messageFor('kw', text, 1), text).toBe('Enter a number above 0, for example 250 or 82.8.');
    }
    expect(messageFor('kWh', '0', 2)).toBe('Enter a number above 0, for example 120 or 10.24.');
  });

  it('above the limit', () => {
    expect(messageFor('kw', '10 001', 1)).toMatch(/^That's above 10.000 kWp\. For larger portfolios, contact us directly\.$/);
    expect(messageFor('kWh', '20000.5', 2)).toMatch(/^That's above 20.000 kWh\./);
  });

  it('a usable value has no message', () => {
    expect(messageFor('kw', '82,8', 1)).toBeUndefined();
    expect(messageFor('kWh', '10.24', 2)).toBeUndefined();
    expect(messageFor('inverterKw', '10 000', 1)).toBeUndefined();
  });
});
