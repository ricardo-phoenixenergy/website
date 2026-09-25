// src/components/ui/Chip.tsx
// A 36px pill for filters and short link lists: a toggle <button> with
// `selected` (it sets aria-pressed), or a Next Link with `href`, where
// `current` marks the page the visitor is on (aria-current="page"), as in
// pagination. One look for both: white with a hairline edge; a selected toggle
// or the current link fills with Deep Teal, and a toggle can fill with `accent`
// and letter in `accentText` instead. `dot` draws the 8px dot before the label.
import Link from 'next/link';
import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from 'react';
import { chipClasses } from './buttonStyles';

type OwnProps = {
  /** The 8px dot's colour, for example a vertical's accent. */
  dot?: string;
  /** Layout only. */
  className?: string;
  children: ReactNode;
};
type AsToggle = OwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof OwnProps | 'aria-pressed'> & {
    href?: undefined;
    /** Whether this filter is on. */
    selected: boolean;
    /** Fill and edge when selected (a CSS colour). Default Deep Teal. */
    accent?: string;
    /** Label colour when selected. Default white. */
    accentText?: string;
    current?: undefined;
  };
type AsLink = OwnProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof OwnProps | 'aria-current'> & {
    /** The link to the page the visitor is on: aria-current="page" and the filled look. */
    current?: boolean;
    selected?: undefined;
    accent?: undefined;
    accentText?: undefined;
  };
export type ChipProps = AsToggle | AsLink;

function Dot({ colour }: { colour?: string }) {
  if (!colour) return null;
  return <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: colour }} />;
}

export function Chip(props: ChipProps) {
  if (props.href !== undefined) {
    // `selected`, `accent` and `accentText` are always undefined here (the link type forbids them).
    const { dot, className, children, current = false, ...linkProps } = props;
    return (
      <Link
        aria-current={current ? 'page' : undefined}
        className={chipClasses({ selected: current, className })}
        {...linkProps}
      >
        <Dot colour={dot} />
        {children}
      </Link>
    );
  }

  const { dot, className, children, selected, accent, accentText, style, type = 'button', ...buttonProps } = props;
  const selectedStyle: CSSProperties | undefined =
    selected && accent ? { background: accent, borderColor: accent, color: accentText ?? '#FFFFFF' } : undefined;
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={chipClasses({ selected, className })}
      style={{ ...selectedStyle, ...style }}
      {...buttonProps}
    >
      <Dot colour={dot} />
      {children}
    </button>
  );
}
