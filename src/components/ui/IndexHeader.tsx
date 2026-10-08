// src/components/ui/IndexHeader.tsx
// The top of an index page (/projects, /blog): the breadcrumb, the eyebrow,
// the H1 and a line of intro, inside the caller's container. One eyebrow
// colour (pe-muted, as the section eyebrows) and one emphasis colour: callers
// pass the emphasis as <em className="not-italic text-pe-primary">.
import type { ReactNode } from 'react';
import { BreadcrumbTrail } from './PageBreadcrumb';

interface IndexHeaderProps {
  /** The current page's crumb, after Home. */
  crumb: string;
  eyebrow: string;
  title: ReactNode;
  intro: string;
}

export function IndexHeader({ crumb, eyebrow, title, intro }: IndexHeaderProps) {
  return (
    <>
      <BreadcrumbTrail trail={[{ label: 'Home', href: '/' }, { label: crumb }]} className="mb-5" />
      <div className="mb-8">
        <p className="font-body font-bold text-xs uppercase tracking-[0.14em] text-pe-muted mb-2">{eyebrow}</p>
        <h1 className="font-display font-extrabold text-4xl text-pe-text leading-[1.2] mb-2">{title}</h1>
        <p className="font-body text-base text-pe-muted leading-[1.7] max-w-[60ch]">{intro}</p>
      </div>
    </>
  );
}
