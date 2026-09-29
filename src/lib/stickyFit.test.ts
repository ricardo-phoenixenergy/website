import { describe, expect, it } from 'vitest';
import { fitsInWindow } from './stickyFit';

describe('fitsInWindow', () => {
  it('fits when the panel, the navbar clearance and the margin below it fit in the window', () => {
    expect(fitsInWindow(780, 900)).toBe(true);
    expect(fitsInWindow(781, 900)).toBe(false);
  });

  it('never sticks a panel with no height', () => {
    expect(fitsInWindow(0, 900)).toBe(false);
  });
});
