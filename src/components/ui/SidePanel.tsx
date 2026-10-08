// src/components/ui/SidePanel.tsx
// The white panel beside a page's main column: the project facts' frame, with
// an h2 that names it. The panel is labelled by that heading. A table of
// contents renders it as a nav.
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SidePanelProps {
  title: string;
  /** The h2's id, unique on the page. */
  titleId: string;
  children?: ReactNode;
  className?: string;
  as?: 'section' | 'nav';
}

export function SidePanel({ title, titleId, children, className, as: Tag = 'section' }: SidePanelProps) {
  return (
    <Tag aria-labelledby={titleId} className={cn('rounded-card border border-pe-border bg-white p-6', className)}>
      <h2 id={titleId} className="font-display text-lg font-extrabold text-pe-text">
        {title}
      </h2>
      {children}
    </Tag>
  );
}
