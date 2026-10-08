// src/components/blog/TableOfContents.tsx
'use client';

// "In this article": the post's h2 and h3 headings as a numbered list of links.
// - panel: in the sidebar from 1024px, in the shared SidePanel frame.
// - disclosure: below 1024px, a closed <details> between the hero and the
//   article, so the list is there before the reading starts.
// The current heading (the last one whose top has passed the line under the
// navbar, activeHeadingId) is marked in Deep Teal with a 3px rule. A link
// scrolls to its heading, smoothly unless the visitor asks for less motion,
// puts the heading's address in the bar and moves focus there.
import { useEffect, useState, type MouseEvent } from 'react';
import { SidePanel } from '@/components/ui/SidePanel';
import { IconChevronDown } from '@/components/ui/Icons';
import { activeHeadingId, type PostHeading } from '@/lib/blogUtils';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  items: PostHeading[];
  variant: 'panel' | 'disclosure';
  className?: string;
}

function useActiveHeading(items: PostHeading[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const tops = items.flatMap((item) => {
        const el = document.getElementById(item.id);
        return el ? [{ id: item.id, top: el.getBoundingClientRect().top }] : [];
      });
      setActiveId(activeHeadingId(tops));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  return activeId;
}

function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

function Items({ items, activeId, roomy }: { items: PostHeading[]; activeId: string | null; roomy: boolean }) {
  return (
    <ol>
      {items.map((item, i) => {
        const active = item.id === activeId;
        return (
          <li key={item.key} className="border-b border-pe-border last:border-b-0">
            <a
              href={`#${item.id}`}
              onClick={(e) => jumpTo(e, item.id)}
              aria-current={active ? 'location' : undefined}
              className={cn(
                'flex gap-2.5 border-l-[3px] pl-2.5 transition-colors duration-200 hover:text-pe-primary',
                roomy ? 'py-3' : 'py-2.5',
                active ? 'border-pe-primary text-pe-primary' : 'border-transparent text-pe-muted',
              )}
            >
              <span className="shrink-0 font-body text-xs font-bold leading-5 text-pe-secondary-ink">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={cn('font-body text-sm leading-5', item.level === 'h2' ? 'font-medium' : 'pl-2')}>{item.text}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function TableOfContents({ items, variant, className }: TableOfContentsProps) {
  const activeId = useActiveHeading(items);
  if (items.length === 0) return null;

  if (variant === 'panel') {
    return (
      <SidePanel as="nav" title="In this article" titleId="toc-title" className={className}>
        <div className="mt-3">
          <Items items={items} activeId={activeId} roomy={false} />
        </div>
      </SidePanel>
    );
  }

  // Each link is 44px tall here: this version is the one phones and tablets get.
  return (
    <nav aria-label="In this article" className={className}>
      <details className="group rounded-card border border-pe-border bg-white">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-5 py-2 font-display text-base font-bold text-pe-text [&::-webkit-details-marker]:hidden">
          In this article
          <IconChevronDown className="size-4 shrink-0 text-pe-primary transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
        </summary>
        <div className="border-t border-pe-border px-5 pb-1">
          <Items items={items} activeId={activeId} roomy />
        </div>
      </details>
    </nav>
  );
}
