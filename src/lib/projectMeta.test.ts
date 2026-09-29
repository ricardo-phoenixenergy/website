import { describe, expect, it } from 'vitest';
import { metaLine, statusLine } from './projectMeta';
import type { ProjectStatus } from '@/types/sanity';

describe('statusLine', () => {
  it('words each status with its date', () => {
    expect(statusLine('completed', 'Q2 2026')).toBe('Completed Q2 2026');
    expect(statusLine('in-progress', 'Q3 2027')).toBe('In progress, due Q3 2027');
    expect(statusLine('planned', 'Q3 2027')).toBe('Planned for Q3 2027');
  });

  it('shows the status alone without a date, and nothing without a known status', () => {
    expect(statusLine('completed', null)).toBe('Completed');
    expect(statusLine('in-progress', '  ')).toBe('In progress');
    expect(statusLine('planned', undefined)).toBe('Planned');
    expect(statusLine(null, 'Q2 2026')).toBeNull();
    expect(statusLine(undefined, undefined)).toBeNull();
    expect(statusLine('operational' as ProjectStatus, 'Q2 2026')).toBeNull();
  });
});

describe('metaLine', () => {
  it('gives the city, then the status and date', () => {
    expect(metaLine({ location: ' Cape Town ', status: 'completed', completionDate: 'Q2 2026' })).toEqual({ place: ['Cape Town'], when: 'Completed Q2 2026' });
  });

  it('leaves out what is not set', () => {
    expect(metaLine({ location: null, status: null, completionDate: null })).toEqual({ place: [], when: null });
  });
});
