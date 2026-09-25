import { describe, it, expect } from 'vitest';
import { selectRelated } from './relatedProjects';

const same = ['a', 'b', 'c', 'd'];
const other = ['x', 'y', 'z'];

describe('selectRelated', () => {
  it('shows three cards when the service has three or more other projects', () => {
    expect(selectRelated(same, other)).toEqual({ heading: 'Similar projects', layout: 'three', projects: ['a', 'b', 'c'] });
    expect(selectRelated(same.slice(0, 3))?.projects).toEqual(['a', 'b', 'c']);
  });

  it('shows two large cards for two', () => {
    expect(selectRelated(same.slice(0, 2), other)).toEqual({ heading: 'Similar projects', layout: 'two', projects: ['a', 'b'] });
  });

  it('shows one wide "Next project" card for one, and never mixes in other services', () => {
    expect(selectRelated(['a'], other)).toEqual({ heading: 'Next project', layout: 'wide', projects: ['a'] });
  });

  it('falls back to other services only when the service has none: up to two, or one wide card', () => {
    expect(selectRelated([], other)).toEqual({ heading: 'More projects', layout: 'two', projects: ['x', 'y'] });
    expect(selectRelated([], ['x'])).toEqual({ heading: 'More projects', layout: 'wide', projects: ['x'] });
  });

  it('leaves the section out when there is no other project anywhere', () => {
    expect(selectRelated([], [])).toBeNull();
    expect(selectRelated([])).toBeNull();
  });
});
