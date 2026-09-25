// src/components/ui/buttonStyles.ts
// The one size scale for buttons and button-like controls, as class builders.
// No 'use client', on purpose: server components call these for the pills drawn
// inside card links, which can't be a <Button> (nothing interactive may sit
// inside a link). A function exported from a 'use client' module reaches a
// server component as a client reference and can't be called there.
//
//   Button, default   48px min (min-h-12), px-5    page, band and panel CTAs; form and tool actions
//   Button, compact   40px min (min-h-10), px-4    navbar CTA, card actions, inline actions
//   Chip              36px (h-9), px-4             filter pills, team filter, service and tag links
//   Tab               48px (h-12), px-4            solution tabs, partner tabs (underline)
//   Icon button       44 x 44px (size-11)          menu, close, photo viewer, arrows, back, share
//   Text button       44px min (min-h-11)          a quiet text action on the tool cards: "Start over"
//   Arrow link        no box                       a text link with an arrow; `lg` is 16px
//
// Buttons set a minimum height, so a label that has to wrap grows instead of
// overflowing: 20px a line, so 58px for two lines and 78px for three (54px and
// 74px compact). Every variant carries a 1px border, transparent on the fills,
// so the solid and outline versions of a size have identical boxes. Boxed
// controls take layout-only overrides through `className` (w-full, mt-*,
// self-*, shrink-0): a place that seems to need another size is a new
// decision, not an override. The arrow link has no box, so it also takes a
// colour for the surface it sits on.
import { cn } from '@/lib/utils';
import type { SolutionVertical } from '@/types/solutions';

// Colour changes ease; the focus ring doesn't. transition-all and transition-colors
// would also animate the ring's width, offset or colour, so it faded in late.
const EASE_COLOURS = 'transition-[color,background-color,border-color] duration-200';

// ─── Button ───────────────────────────────────────────────────────────────────

export type ButtonSize = 'default' | 'compact';

/**
 * The fill. `accent` is the vertical's accent with its "on" ink (the hero tools)
 * and needs `vertical`. `ghost` takes an optional `vertical`: an accent edge, a
 * faint accent fill and the accent as the label.
 */
export type ButtonTone =
  | { variant?: 'primary' | 'light' | 'outline'; vertical?: undefined }
  | { variant: 'ghost'; vertical?: SolutionVertical }
  | { variant: 'accent'; vertical: SolutionVertical };

export type ButtonVariant = NonNullable<ButtonTone['variant']>;

export type ButtonStyle = ButtonTone & {
  size?: ButtonSize;
  /** Layout only: w-full, mt-*, self-*, shrink-0. */
  className?: string;
};

/** buttonClasses() takes a Button's style, plus `inCard` for a pill drawn inside a card link. */
export type ButtonClassOptions = ButtonStyle & {
  /**
   * The pill is drawn inside a card link, so the card is the control: hover and
   * press follow the card (Card pattern 1 carries `group`), not the pointer on
   * the pill. The card keeps its own hover as well.
   */
  inCard?: boolean;
};

const BUTTON_BASE = [
  'relative inline-flex items-center justify-center gap-2 rounded-full border',
  'text-center font-body text-sm font-semibold leading-5',
  'select-none transition-[color,background-color,border-color,scale] duration-200',
  'disabled:pointer-events-none disabled:opacity-50',
  // Icons are 16px at both sizes; an svg with its own size-* class keeps it.
  '[&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
].join(' ');

const BUTTON_SIZES: Record<ButtonSize, string> = {
  default: 'min-h-12 px-5 py-2',
  // Under 44px, so a touch screen extends its target (hit-area, globals.css).
  compact: 'hit-area min-h-10 px-4 py-1.5',
};

// Hover and press come from the button itself, or, for a pill inside a card
// link, from the card. Both spellings are written out in full so that Tailwind
// finds every class in this file.
type StatesFrom = 'self' | 'card';
type Tone = { fill: string; hover: Record<StatesFrom, string> };

// A pressed button scales to 98%.
const PRESS: Record<StatesFrom, string> = { self: 'active:scale-[0.98]', card: 'group-active:scale-[0.98]' };

const BUTTON_VARIANTS: Record<ButtonVariant, Tone> = {
  // Deep Teal fill, for light sections (the default)
  primary: {
    fill: 'border-transparent bg-pe-primary text-white',
    hover: { self: 'hover:bg-pe-primary-hover', card: 'group-hover:bg-pe-primary-hover' },
  },
  // Light fill, for dark sections: heroes, bands, dark cards, the mobile menu
  light: {
    fill: 'border-transparent bg-pe-bg text-pe-nav-dark',
    hover: { self: 'hover:bg-white', card: 'group-hover:bg-white' },
  },
  // Translucent, for dark sections
  ghost: {
    fill: 'border-white/20 bg-white/[0.08] text-white',
    hover: { self: 'hover:bg-white/[0.14]', card: 'group-hover:bg-white/[0.14]' },
  },
  // Deep Teal edge, for light sections
  outline: {
    fill: 'border-pe-primary bg-transparent text-pe-primary',
    hover: { self: 'hover:bg-pe-primary/[0.06]', card: 'group-hover:bg-pe-primary/[0.06]' },
  },
  // The vertical's accent fill with its "on" ink (4.6 to 5.1:1), a little lighter on hover
  accent: {
    fill: 'border-transparent bg-(--btn-accent) text-(--btn-on-accent)',
    hover: {
      self: 'hover:bg-[color-mix(in_srgb,var(--btn-accent)_85%,white)]',
      card: 'group-hover:bg-[color-mix(in_srgb,var(--btn-accent)_85%,white)]',
    },
  },
};

// Ghost with a vertical. Accent text fails on some translucent tool cards (the
// Wheeling card measured 2.3 to 3.9:1), so check the label where it sits.
const GHOST_ACCENT: Tone = {
  fill: 'border-(--btn-accent)/40 bg-(--btn-accent)/[0.08] text-(--btn-accent)',
  hover: { self: 'hover:bg-(--btn-accent)/[0.14]', card: 'group-hover:bg-(--btn-accent)/[0.14]' },
};

// Each vertical's accent and "on" ink, from the tokens in globals.css.
const ACCENT_VARS: Record<SolutionVertical, string> = {
  'ci-solar-storage': '[--btn-accent:var(--color-accent-solar)] [--btn-on-accent:var(--color-accent-solar-on)]',
  wheeling: '[--btn-accent:var(--color-accent-wheeling)] [--btn-on-accent:var(--color-accent-wheeling-on)]',
  'energy-optimisation': '[--btn-accent:var(--color-accent-optim)] [--btn-on-accent:var(--color-accent-optim-on)]',
  'carbon-credits': '[--btn-accent:var(--color-accent-carbon)] [--btn-on-accent:var(--color-accent-carbon-on)]',
  webuysolar: '[--btn-accent:var(--color-accent-wbs)] [--btn-on-accent:var(--color-accent-wbs-on)]',
  'ev-fleets': '[--btn-accent:var(--color-accent-ev)] [--btn-on-accent:var(--color-accent-ev-on)]',
};

/** Classes for anything drawn as a button: <Button> itself, and a pill inside a card link (`inCard`). */
export function buttonClasses(style: ButtonClassOptions = {}): string {
  const { variant = 'primary', vertical, size = 'default', inCard = false, className } = style;
  const tone = variant === 'ghost' && vertical ? GHOST_ACCENT : BUTTON_VARIANTS[variant];
  const from: StatesFrom = inCard ? 'card' : 'self';
  return cn(BUTTON_BASE, BUTTON_SIZES[size], tone.fill, tone.hover[from], PRESS[from], vertical && ACCENT_VARS[vertical], className);
}

// ─── Icon button ──────────────────────────────────────────────────────────────

export type IconButtonVariant = 'ghost' | 'outline' | 'plain';

const ICON_BUTTON_BASE = [
  'relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border',
  `${EASE_COLOURS} disabled:cursor-not-allowed disabled:opacity-30`,
  '[&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-5',
].join(' ');

const ICON_BUTTON_VARIANTS: Record<IconButtonVariant, string> = {
  // Dark surfaces and photos: a translucent disc, as Button ghost
  ghost: 'border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.14]',
  // Light surfaces: a white disc whose hairline edge turns Deep Teal on hover
  outline: 'border-pe-border bg-white text-pe-primary hover:border-pe-primary hover:bg-pe-bg',
  // Inside another control's light surface (the navbar pill): no disc until hover
  plain: 'border-transparent bg-transparent text-pe-primary hover:bg-pe-primary/[0.07]',
};

export function iconButtonClasses({ variant, className }: { variant: IconButtonVariant; className?: string }): string {
  return cn(ICON_BUTTON_BASE, ICON_BUTTON_VARIANTS[variant], className);
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

const CHIP_BASE = [
  // Under 44px, so a touch screen extends its target (hit-area, globals.css).
  'hit-area relative inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-4',
  // One weight in both states, so selecting a chip doesn't change its width.
  `font-body text-sm font-medium leading-5 ${EASE_COLOURS}`,
].join(' ');

const CHIP_IDLE = 'border-pe-border bg-white text-pe-muted hover:text-pe-primary';
const CHIP_SELECTED = 'border-pe-primary bg-pe-primary text-white';

export function chipClasses({ selected = false, className }: { selected?: boolean; className?: string } = {}): string {
  return cn(CHIP_BASE, selected ? CHIP_SELECTED : CHIP_IDLE, className);
}

// ─── Tab ──────────────────────────────────────────────────────────────────────

// An underline tab (role="tab"). Its tab list sets the selected colour and rule;
// the focus ring is drawn inset (globals.css), so a scrolling strip can't clip it.
const TAB = `inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-t-lg border-b-2 border-transparent px-4 font-body text-sm font-medium leading-5 ${EASE_COLOURS}`;

export function tabClasses(className?: string): string {
  return cn(TAB, className);
}

// ─── Text button ──────────────────────────────────────────────────────────────

// A low-emphasis action that reads as text: 12px on-dark-subtle, white on hover,
// with no fill or edge, in a box at least 44px tall so the quiet look keeps a
// full-size target. Its colour is for the dark tool cards, the only place it sits.
const TEXT_BUTTON = [
  'inline-flex min-h-11 items-center justify-center gap-1 rounded-full px-3',
  `font-body text-xs font-normal leading-4 text-on-dark-subtle ${EASE_COLOURS} hover:text-white`,
  '[&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-3.5',
].join(' ');

export function textButtonClasses({ className }: { className?: string } = {}): string {
  return cn(TEXT_BUTTON, className);
}

// ─── Arrow link ───────────────────────────────────────────────────────────────

export type ArrowLinkSize = 'default' | 'lg';

const ARROW_LINK_BASE = `group inline-flex items-center rounded font-body font-semibold text-pe-primary ${EASE_COLOURS} hover:text-pe-primary-hover [&_svg]:shrink-0`;

const ARROW_LINK_SIZES: Record<ArrowLinkSize, string> = {
  default: 'gap-1.5 text-sm leading-5 [&_svg:not([class*=size-])]:size-3.5',
  lg: 'gap-2 text-base leading-6 [&_svg:not([class*=size-])]:size-4',
};

/** A text link with an arrow, for ArrowLink and for an arrow line inside a card link. */
export function arrowLinkClasses({ size = 'default', className }: { size?: ArrowLinkSize; className?: string } = {}): string {
  return cn(ARROW_LINK_BASE, ARROW_LINK_SIZES[size], className);
}
