import { describe, expect, it } from 'vitest';
import { fitsInWindow, revealScrollTop } from './stickyFit';

describe('fitsInWindow', () => {
  it('fits when the panel, the navbar clearance and the margin below it fit in the window', () => {
    expect(fitsInWindow(780, 900)).toBe(true);
    expect(fitsInWindow(781, 900)).toBe(false);
  });

  it('never sticks a panel with no height', () => {
    expect(fitsInWindow(0, 900)).toBe(false);
  });
});

describe('revealScrollTop', () => {
  // A 400px list scrolled 100px down shows its content from 100 to 500.
  const view = { scrollTop: 100, height: 400 };

  it('leaves the list where it is while the item and its margin are in view', () => {
    expect(revealScrollTop({ top: 200, height: 40 }, view)).toBeNull();
  });

  it('scrolls up to an item above the view, keeping the margin over it', () => {
    expect(revealScrollTop({ top: 110, height: 40 }, view)).toBe(70);
    expect(revealScrollTop({ top: 20, height: 40 }, view)).toBe(0);
  });

  it('scrolls down to an item below the view, keeping the margin under it', () => {
    expect(revealScrollTop({ top: 600, height: 40 }, view)).toBe(280);
  });

  it('shrinks the margin when the view is too short for it', () => {
    expect(revealScrollTop({ top: 300, height: 40 }, { scrollTop: 0, height: 60 }, 40)).toBe(290);
  });
});
