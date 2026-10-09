// src/components/blog/Callout.tsx
// A note inside the article, in the site's white panel (the frame of the
// project facts and the Impact card), at 16px so it reads at the prose's pace.
// The variants differ only by a drawn icon and its colour:
//   info     Dusty Blue ink, the info circle
//   warning  Soft Amber ink, the warning triangle
//   stat     Deep Teal, the rising line
// The editor's emoji (the `icon` field) is no longer shown: emoji don't belong
// to the site's icon set.
import type { ComponentType } from 'react';
import { IconAlertTriangle, IconInfo, IconTrendingUp } from '@/components/ui/Icons';

type CalloutType = 'info' | 'warning' | 'stat';

interface CalloutProps {
  type: CalloutType;
  /** Kept for old content; not shown. */
  icon?: string;
  title: string;
  text: string;
}

const CALLOUT_ICONS: Record<CalloutType, { Icon: ComponentType<{ size?: number; className?: string }>; ink: string }> = {
  info: { Icon: IconInfo, ink: 'text-pe-secondary-ink' },
  warning: { Icon: IconAlertTriangle, ink: 'text-accent-solar-ink' },
  stat: { Icon: IconTrendingUp, ink: 'text-pe-primary' },
};

export function Callout({ type, title, text }: CalloutProps) {
  const { Icon, ink } = CALLOUT_ICONS[type] ?? CALLOUT_ICONS.info;
  return (
    <aside className="my-8 flex gap-3.5 rounded-card border border-pe-border bg-white px-5 py-5 md:px-6">
      {/* The icon sits on the title's first line: 18px in a 24px line box. */}
      <span aria-hidden="true" className="flex h-6 shrink-0 items-center">
        <Icon size={18} className={`size-[18px] ${ink}`} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-base font-bold leading-6 text-pe-text">{title}</p>
        <p className="mt-1.5 font-body text-base leading-[1.65] text-pe-text-soft">{text}</p>
      </div>
    </aside>
  );
}
