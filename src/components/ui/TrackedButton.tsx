'use client';

// A link drawn as the site's Button that sends cta_click (src/lib/analytics.ts)
// when clicked. Server-rendered pages can't pass an onClick to Button
// themselves, so booking buttons on those pages use this.
import type { ReactNode } from 'react';
import { Button } from './Button';
import type { ButtonSize } from './buttonStyles';
import { dlPush } from '@/lib/analytics';

interface TrackedButtonProps {
  href: string;
  /** cta_label: the button's words, without its icon. */
  ctaLabel: string;
  /** cta_location, for example "project_facts:31-sacks-circle". */
  ctaLocation: string;
  variant?: 'primary' | 'light';
  size?: ButtonSize;
  /** Layout only: w-full, mt-*, self-*, shrink-0. */
  className?: string;
  children: ReactNode;
}

export function TrackedButton({ href, ctaLabel, ctaLocation, variant = 'primary', size, className, children }: TrackedButtonProps) {
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={className}
      onClick={() => dlPush({ event: 'cta_click', cta_label: ctaLabel, cta_location: ctaLocation })}
    >
      {children}
    </Button>
  );
}
