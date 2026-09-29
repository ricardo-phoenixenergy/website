// src/lib/stickyFit.ts
// Whether a side panel can stay in view below the fixed navbar and still show
// its foot. A taller panel scrolls with the page instead, so its booking button
// is never out of reach.

/** The navbar pill's clearance: 6rem, as html's scroll-padding-top in globals.css. */
export const STICKY_TOP = 96;
/** The margin kept under a sticky panel. */
export const STICKY_BOTTOM_GAP = 24;

export function fitsInWindow(panelHeight: number, windowHeight: number, top = STICKY_TOP, bottomGap = STICKY_BOTTOM_GAP): boolean {
  return panelHeight > 0 && panelHeight + top + bottomGap <= windowHeight;
}
