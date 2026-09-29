import { describe, expect, it } from 'vitest';
import { cardPlace, metaLine, statusLine } from './projectMeta';
import type { ProjectStatus } from '@/types/sanity';

describe('statusLine', () => {
  it('words a completed project from its commissioning date, as the month and year', () => {
    expect(statusLine({ status: 'completed', commissionedOn: '2026-06-12', completionDate: 'Q2 2026' })).toBe('Completed June 2026');
  });

  it('falls back to the free-text date, then to the status alone', () => {
    expect(statusLine({ status: 'completed', commissionedOn: null, completionDate: 'Q2 2026' })).toBe('Completed Q2 2026');
    expect(statusLine({ status: 'completed', commissionedOn: '12 June 2026', completionDate: ' Q2 2026 ' })).toBe('Completed Q2 2026');
    expect(statusLine({ status: 'completed' })).toBe('Completed');
  });

  it('words a project still to finish from its target, never from a commissioning date', () => {
    expect(statusLine({ status: 'in-progress', completionDate: 'Q3 2027', commissionedOn: '2026-06-12' })).toBe('In progress, due Q3 2027');
    expect(statusLine({ status: 'planned', completionDate: 'Q3 2027' })).toBe('Planned for Q3 2027');
    expect(statusLine({ status: 'in-progress', completionDate: '  ' })).toBe('In progress');
    expect(statusLine({ status: 'planned', commissionedOn: '2026-06-12' })).toBe('Planned');
  });

  it('says nothing without a known status', () => {
    expect(statusLine({ status: null, completionDate: 'Q2 2026' })).toBeNull();
    expect(statusLine({})).toBeNull();
    expect(statusLine({ status: 'operational' as ProjectStatus, completionDate: 'Q2 2026' })).toBeNull();
  });
});

describe('metaLine', () => {
  it('starts with the site type, then the city, then the status and date', () => {
    expect(metaLine({ siteType: ' Logistics warehouse ', location: 'Cape Town', status: 'completed', commissionedOn: '2026-06-12' })).toEqual({
      place: ['Logistics warehouse', 'Cape Town'],
      when: 'Completed June 2026',
    });
  });

  it("names the client in the site type's place when the data carries the name", () => {
    expect(metaLine({ clientName: 'Example Client', siteType: 'Logistics warehouse', location: 'Cape Town' }).place).toEqual(['Example Client', 'Cape Town']);
  });

  it('starts with the city without a site type, and leaves out what is not set', () => {
    expect(metaLine({ siteType: '  ', location: 'Cape Town', status: 'planned', completionDate: 'Q3 2027' })).toEqual({ place: ['Cape Town'], when: 'Planned for Q3 2027' });
    expect(metaLine({ clientName: null, siteType: null, location: null, status: null })).toEqual({ place: [], when: null });
  });
});

describe('cardPlace', () => {
  it('gives the city, then the client when the data carries the name', () => {
    expect(cardPlace({ location: 'Cape Town', clientName: 'Example Client' })).toBe('Cape Town · Example Client');
    expect(cardPlace({ location: ' Cape Town ' })).toBe('Cape Town');
    expect(cardPlace({ location: null, clientName: 'Example Client' })).toBe('Example Client');
    expect(cardPlace({ location: '  ', clientName: null })).toBeNull();
  });
});
