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

/**
 * Where a list that scrolls inside a sticky panel should scroll to so one of its
 * items shows with a margin above and below it, or null when it already does.
 * Positions are in the list's own content: the item's top from the list's top,
 * the view's scrollTop and visible height.
 */
export function revealScrollTop(
  item: { top: number; height: number },
  view: { scrollTop: number; height: number },
  margin = 40,
): number | null {
  const room = Math.min(margin, Math.max(0, (view.height - item.height) / 2));
  if (item.top - room < view.scrollTop) return Math.max(0, item.top - room);
  if (item.top + item.height + room > view.scrollTop + view.height) return item.top + item.height + room - view.height;
  return null;
}
