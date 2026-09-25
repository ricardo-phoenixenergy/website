import { describe, expect, it } from 'vitest';
import {
  arrowLinkClasses, buttonClasses, chipClasses, iconButtonClasses, tabClasses, textButtonClasses,
  type ButtonSize, type ButtonStyle, type IconButtonVariant,
} from './buttonStyles';
import { SOLUTION_VERTICALS } from '@/types/solutions';

const classes = (cls: string) => cls.split(/\s+/);
// The classes that set a control's outer box.
const BOX = /^(min-h-|h-|size-|px-|py-|pr-|pl-|border$|border-b-2$|rounded-)/;
const box = (cls: string) => classes(cls).filter((c) => BOX.test(c)).sort();

const TONES: ButtonStyle[] = [
  { variant: 'primary' },
  { variant: 'light' },
  { variant: 'ghost' },
  { variant: 'outline' },
  ...SOLUTION_VERTICALS.map((vertical) => ({ variant: 'accent' as const, vertical })),
  ...SOLUTION_VERTICALS.map((vertical) => ({ variant: 'ghost' as const, vertical })),
];

describe('buttonClasses', () => {
  it.each<[ButtonSize, string[]]>([
    ['default', ['border', 'min-h-12', 'px-5', 'py-2', 'rounded-full']],
    ['compact', ['border', 'min-h-10', 'px-4', 'py-1.5', 'rounded-full']],
  ])('gives every variant the same %s box, border included', (size, expected) => {
    for (const tone of TONES) {
      expect(box(buttonClasses({ ...tone, size }))).toEqual(expected);
    }
  });

  it('defaults to the primary variant at the default size', () => {
    expect(buttonClasses()).toBe(buttonClasses({ variant: 'primary', size: 'default' }));
  });

  it('keeps the border transparent on the fills', () => {
    for (const variant of ['primary', 'light'] as const) {
      expect(classes(buttonClasses({ variant }))).toContain('border-transparent');
    }
    expect(classes(buttonClasses({ variant: 'accent', vertical: 'wheeling' }))).toContain('border-transparent');
  });

  it('extends only the compact size to 44px on touch', () => {
    expect(classes(buttonClasses({ size: 'compact' }))).toContain('hit-area');
    expect(classes(buttonClasses({ size: 'default' }))).not.toContain('hit-area');
  });

  it('sets one type style: Inter 14px semibold on a 20px line', () => {
    for (const tone of TONES) {
      expect(classes(buttonClasses(tone))).toEqual(
        expect.arrayContaining(['font-body', 'text-sm', 'font-semibold', 'leading-5']),
      );
    }
  });

  it('takes a vertical only where it means something (tsc checks the two errors below)', () => {
    // @ts-expect-error the accent variant needs a vertical
    buttonClasses({ variant: 'accent' });
    // @ts-expect-error primary has no accent version
    buttonClasses({ variant: 'primary', vertical: 'wheeling' });
    expect(buttonClasses({ variant: 'ghost', vertical: 'wheeling' })).toContain('[--btn-accent:var(--color-accent-wheeling)]');
  });

  it('points the accent at the vertical’s tokens', () => {
    const cls = buttonClasses({ variant: 'accent', vertical: 'ev-fleets' });
    expect(cls).toContain('[--btn-accent:var(--color-accent-ev)]');
    expect(cls).toContain('[--btn-on-accent:var(--color-accent-ev-on)]');
  });

  it('keeps layout overrides from className', () => {
    expect(classes(buttonClasses({ className: 'mt-6 w-full' }))).toEqual(expect.arrayContaining(['mt-6', 'w-full']));
  });

  it('moves hover and press onto the card for a pill inside a card link (inCard)', () => {
    const states = (cls: string) => classes(cls).filter((c) => /^(hover|active):/.test(c));
    for (const tone of TONES) {
      for (const size of ['default', 'compact'] as ButtonSize[]) {
        const own = buttonClasses({ ...tone, size });
        const pill = buttonClasses({ ...tone, size, inCard: true });
        expect(box(pill)).toEqual(box(own));
        expect(states(own)).toHaveLength(2);
        expect(states(pill)).toEqual([]);
        expect(classes(pill)).toEqual(expect.arrayContaining(states(own).map((c) => `group-${c}`)));
      }
    }
  });
});

describe('the other controls', () => {
  it('draws every icon button at 44 x 44px', () => {
    for (const variant of ['ghost', 'outline', 'plain'] as IconButtonVariant[]) {
      expect(box(iconButtonClasses({ variant }))).toEqual(['border', 'rounded-full', 'size-11']);
    }
  });

  it('keeps a chip 36px with one weight, selected or not', () => {
    for (const selected of [false, true]) {
      const cls = chipClasses({ selected });
      expect(box(cls)).toEqual(['border', 'h-9', 'px-4', 'rounded-full']);
      expect(classes(cls)).toEqual(expect.arrayContaining(['font-medium', 'hit-area', 'whitespace-nowrap']));
    }
  });

  it('draws a tab 48px tall with a 2px rule', () => {
    expect(box(tabClasses())).toEqual(['border-b-2', 'h-12', 'px-4', 'rounded-t-lg']);
  });

  it('sizes the arrow link at 14px, or 16px for lg', () => {
    expect(classes(arrowLinkClasses())).toEqual(expect.arrayContaining(['text-sm', 'gap-1.5']));
    expect(classes(arrowLinkClasses({ size: 'lg' }))).toEqual(expect.arrayContaining(['text-base', 'gap-2']));
  });
});

describe('textButtonClasses', () => {
  it('gives the quiet text a target at least 44px tall, with no edge', () => {
    expect(box(textButtonClasses())).toEqual(['min-h-11', 'px-3', 'rounded-full']);
  });

  it('keeps today’s quiet look: 12px regular text in on-dark-subtle, no fill', () => {
    const cls = classes(textButtonClasses());
    expect(cls).toEqual(
      expect.arrayContaining(['font-body', 'text-xs', 'font-normal', 'leading-4', 'text-on-dark-subtle', 'hover:text-white']),
    );
    expect(cls.filter((c) => c.startsWith('bg-'))).toEqual([]);
  });

  it('keeps layout overrides from className', () => {
    expect(classes(textButtonClasses({ className: '-mt-3.5 w-full' }))).toEqual(
      expect.arrayContaining(['-mt-3.5', 'w-full', 'min-h-11']),
    );
  });
});
