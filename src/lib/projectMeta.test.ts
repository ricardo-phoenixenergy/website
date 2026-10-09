import { describe, expect, it } from 'vitest';
import { cardPlace, metaLine, statusLine, type StatusSource } from './projectMeta';
import type { ProjectStatus } from '@/types/sanity';

describe('statusLine', () => {
  it('words each status with its completion date, as the month and year', () => {
    expect(statusLine({ status: 'completed', commissionedOn: '2026-06-12' })).toBe('Completed June 2026');
    expect(statusLine({ status: 'in-progress', commissionedOn: '2027-09-01' })).toBe('In progress, due September 2027');
    expect(statusLine({ status: 'planned', commissionedOn: '2027-09-01' })).toBe('Planned for September 2027');
  });

  it('gives the status alone without a date, or with one that cannot be read', () => {
    expect(statusLine({ status: 'completed' })).toBe('Completed');
    expect(statusLine({ status: 'in-progress', commissionedOn: null })).toBe('In progress');
    expect(statusLine({ status: 'planned', commissionedOn: '12 June 2026' })).toBe('Planned');
  });

  it("ignores an old document's free-text date", () => {
    const old = { status: 'planned', completionDate: 'Q3 2027' } as StatusSource;
    expect(statusLine(old)).toBe('Planned');
    expect(statusLine({ ...old, status: 'completed' })).toBe('Completed');
  });

  it('says nothing without a known status', () => {
    expect(statusLine({ status: null, commissionedOn: '2026-06-12' })).toBeNull();
    expect(statusLine({})).toBeNull();
    expect(statusLine({ status: 'operational' as ProjectStatus, commissionedOn: '2026-06-12' })).toBeNull();
  });
});

describe('metaLine', () => {
  it('starts with the site type, then the city, then the status and date', () => {
    expect(metaLine({ siteType: ' Logistics warehouse ', location: 'Cape Town', status: 'completed', commissionedOn: '2026-06-12' })).toEqual({
      place: ['Logistics warehouse', 'Cape Town'],
      when: 'Completed June 2026',
    });
  });

  it("names the client in the site type's place whenever the name is set", () => {
    expect(metaLine({ clientName: 'Example Client', siteType: 'Logistics warehouse', location: 'Cape Town' }).place).toEqual(['Example Client', 'Cape Town']);
  });

  it('starts with the city without a site type, and leaves out what is not set', () => {
    expect(metaLine({ siteType: '  ', location: 'Cape Town', status: 'planned', commissionedOn: '2027-09-01' })).toEqual({ place: ['Cape Town'], when: 'Planned for September 2027' });
    expect(metaLine({ clientName: null, siteType: null, location: null, status: null })).toEqual({ place: [], when: null });
  });
});

describe('cardPlace', () => {
  it('gives the city, then the client whenever the name is set', () => {
    expect(cardPlace({ location: 'Cape Town', clientName: 'Example Client' })).toBe('Cape Town · Example Client');
    expect(cardPlace({ location: ' Cape Town ' })).toBe('Cape Town');
    expect(cardPlace({ location: null, clientName: 'Example Client' })).toBe('Example Client');
    expect(cardPlace({ location: '  ', clientName: null })).toBeNull();
  });
});
