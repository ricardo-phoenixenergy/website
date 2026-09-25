'use client';

import type { FocusEvent } from 'react';
import { Chip } from './Chip';

export interface FilterPill {
  key: string;
  label: string;
  accent?: string;
  accentText?: string;
}

interface FilterPillsProps {
  pills: FilterPill[];
  activeKey: string;
  onSelect: (key: string) => void;
}

/**
 * For a chip strip's onFocus. Tab doesn't scroll a chip that is partly out of
 * the strip: Chrome counts it as visible and leaves it cut off at the edge, its
 * ring too. So a chip that takes keyboard focus is scrolled fully into view,
 * and the strip's 6px of scroll padding leaves room for its ring. A tap or a
 * click (no :focus-visible) scrolls nothing.
 */
export function revealFocusedChip(e: FocusEvent<HTMLElement>) {
  const chip = e.target;
  if (chip instanceof HTMLElement && chip.matches(':focus-visible')) {
    chip.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}

// The strip scrolls sideways, which clips anything outside its padding box: the
// focus ring reaches 4px out and a chip's touch target 4px above and below, so
// 6px of padding (offset by negative margins, the 8px below kept) holds both.
export function FilterPills({ pills, activeKey, onSelect }: FilterPillsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-none -mx-1.5 -mt-1.5 px-1.5 pt-1.5 pb-2 scroll-px-1.5"
      style={{ WebkitOverflowScrolling: 'touch' }}
      onFocus={revealFocusedChip}
    >
      {pills.map((pill) => (
        <Chip
          key={pill.key}
          selected={pill.key === activeKey}
          accent={pill.accent}
          accentText={pill.accentText}
          onClick={() => onSelect(pill.key)}
        >
          {pill.label}
        </Chip>
      ))}
    </div>
  );
}
