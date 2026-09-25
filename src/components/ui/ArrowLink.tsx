// src/components/ui/ArrowLink.tsx
// A text link with an arrow and no box: "View published projects", the About
// audience links, "View all solutions" and the desktop hero's "Explore …" (lg).
// Deep Teal by default; pass a colour class or style for another surface.
// On hover the arrow nudges 4px right, the same on every arrow link.
// For an arrow line inside a card link, put arrowLinkClasses() on a span.
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { arrowLinkClasses, type ArrowLinkSize } from './buttonStyles';
import { IconArrowRight } from './Icons';

export type ArrowLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'className'> & {
  /** default: 14px text and arrow; lg: 16px. */
  size?: ArrowLinkSize;
  /** Colour and layout only. */
  className?: string;
};

export function ArrowLink({ size = 'default', className, children, ...linkProps }: ArrowLinkProps) {
  return (
    <Link className={arrowLinkClasses({ size, className })} {...linkProps}>
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
        <IconArrowRight />
      </span>
    </Link>
  );
}
