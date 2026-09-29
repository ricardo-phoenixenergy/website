import { describe, expect, it } from 'vitest';
import { orderForProjectsPage } from './projectOrder';

describe('orderForProjectsPage', () => {
  it('puts featured projects first in their featured order, then the rest in the order given (newest first)', () => {
    const list = [
      { id: 'newest', featured: false },
      { id: 'f2', featured: true, featuredOrder: 2 },
      { id: 'f-no-order', featured: true, featuredOrder: null },
      { id: 'middle', featured: null },
      { id: 'f1', featured: true, featuredOrder: 1 },
      { id: 'oldest', featured: false, featuredOrder: 1 },
    ];
    expect(orderForProjectsPage(list).map((p) => p.id)).toEqual(['f1', 'f2', 'f-no-order', 'newest', 'middle', 'oldest']);
  });

  it('leaves the list it is given unchanged', () => {
    const list = [{ id: 'a', featured: false }, { id: 'b', featured: true, featuredOrder: 1 }];
    orderForProjectsPage(list);
    expect(list.map((p) => p.id)).toEqual(['a', 'b']);
  });
});
