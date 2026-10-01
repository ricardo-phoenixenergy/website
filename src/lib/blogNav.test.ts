import { describe, expect, it } from 'vitest';
import { showsBlogLink } from './blogNav';

describe('showsBlogLink', () => {
  it('leaves the blog out of the navbar while no post is live', () => {
    expect(showsBlogLink(0)).toBe(false);
  });

  it('adds it from the first live post', () => {
    expect(showsBlogLink(1)).toBe(true);
    expect(showsBlogLink(2)).toBe(true);
  });
});
