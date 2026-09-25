// src/components/blog/BlogPagination.tsx
// The blog index's page links: Prev, the page numbers and Next, all Chip links,
// so the row is one height (36px), with the current page filled. The row sits in
// the page container, centred, and wraps on a narrow screen instead of running
// off it; wrapped rows are 10px apart, so the chips' 44px touch targets stay
// clear of each other. Up to 7 pages every number shows. Past that it shows the
// first and last pages, the current page and one either side, with an ellipsis
// for each run of hidden pages (a run of one page shows that page instead).
// No 'use client': the blog index, a server component, renders it.
import { Chip } from '@/components/ui/Chip';
import { IconArrowLeft, IconArrowRight } from '@/components/ui/Icons';

/** A page number, or a gap standing in for a run of hidden pages. */
export type PageSlot = number | 'gap';

/** Up to this many pages, every page number shows. */
const SHOW_ALL_UP_TO = 7;

/** The page numbers to show, in order, for page `current` of `total`. */
export function pageSlots(current: number, total: number): PageSlot[] {
  if (total <= SHOW_ALL_UP_TO) return Array.from({ length: total }, (_, i) => i + 1);
  const shown = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const slots: PageSlot[] = [];
  let previous = 0;
  for (const p of shown) {
    if (p - previous === 2) slots.push(p - 1);
    else if (p - previous > 2) slots.push('gap');
    slots.push(p);
    previous = p;
  }
  return slots;
}

interface BlogPaginationProps {
  page: number;
  totalPages: number;
  /** The link to a page, keeping the category and tag. */
  hrefFor: (page: number) => string;
}

export function BlogPagination({ page, totalPages, hrefFor }: BlogPaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="page-container flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5 py-10">
      {page > 1 && (
        <Chip href={hrefFor(page - 1)}>
          <IconArrowLeft size={14} /> Prev
        </Chip>
      )}
      {pageSlots(page, totalPages).map((slot, i) =>
        slot === 'gap' ? (
          <span key={`gap-${i}`} aria-hidden="true" className="px-1 font-body text-sm text-pe-muted">
            …
          </span>
        ) : (
          <Chip key={slot} href={hrefFor(slot)} current={slot === page}>
            {slot}
          </Chip>
        ),
      )}
      {page < totalPages && (
        <Chip href={hrefFor(page + 1)}>
          Next <IconArrowRight size={14} />
        </Chip>
      )}
    </div>
  );
}
