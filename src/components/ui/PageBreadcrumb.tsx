// src/components/ui/PageBreadcrumb.tsx
// The row above a page's hero (projects and posts): the breadcrumb, with an
// action at the right, such as Copy link or the share buttons. On a trail of
// three or more, phones drop the first crumb (Home), and a long current page
// ends in an ellipsis rather than widening the row. The row wraps, so an
// action too wide for the line falls under the trail.
import type { ReactNode } from 'react';
import Link from 'next/link';

/** One step of the trail. The last crumb is the current page and takes no link. */
export interface Crumb {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  trail: Crumb[];
  action?: ReactNode;
}

const CRUMB_LINK = 'hit-area relative transition-colors duration-150 hover:text-pe-primary';

export function PageBreadcrumb({ trail, action }: PageBreadcrumbProps) {
  const current = trail[trail.length - 1];
  const before = trail.slice(0, -1);

  return (
    <div className="page-container pt-24">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex min-w-0 items-center gap-1.5 font-body text-sm text-pe-muted">
            {before.map((crumb, i) => (
              <li
                key={`${i}-${crumb.label}`}
                className={i === 0 && trail.length >= 3 ? 'hidden shrink-0 items-center gap-1.5 sm:flex' : 'flex shrink-0 items-center gap-1.5'}
              >
                {crumb.href ? (
                  <Link href={crumb.href} className={CRUMB_LINK}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                <span aria-hidden="true">/</span>
              </li>
            ))}
            {current && (
              <li className="min-w-0">
                <span aria-current="page" className="block truncate font-semibold text-pe-primary">
                  {current.label}
                </span>
              </li>
            )}
          </ol>
        </nav>
        {action}
      </div>
    </div>
  );
}
