// White text over the drawing that stands in for a missing photo: the meta line
// (14px) needs 4.5:1 and the title (24px bold) 3:1 at the lightest point, the
// gradient's first stop. Night Teal is read from globals.css, so the check
// follows the token.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SOLUTION_META } from '@/types/solutions';
import { noPhotoBackground } from './noPhotoBackground';

const css = fs.readFileSync(path.join(__dirname, '../app/globals.css'), 'utf8');
const NIGHT_TEAL = css.match(/--color-pe-nav-dark:\s*(#[0-9a-fA-F]{6})/)?.[1] ?? '';

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const linear = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: number[]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const whiteOn = (rgb: number[]) => 1.05 / (luminance(rgb) + 0.05);

describe('noPhotoBackground', () => {
  it('reads Night Teal from the tokens', () => {
    expect(NIGHT_TEAL).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('draws the service accent fading into Night Teal, on Night Teal', () => {
    expect(noPhotoBackground('#E3C58D')).toBe('linear-gradient(135deg, #E3C58D44 0%, var(--color-pe-nav-dark) 100%), var(--color-pe-nav-dark)');
    expect(noPhotoBackground()).toBe('var(--color-pe-nav-dark)');
  });

  it.each(Object.values(SOLUTION_META).map((m) => [m.label, m.accent]))(
    'keeps white text at 4.5:1 or more everywhere on the %s gradient',
    (_label, accent) => {
      const stop = noPhotoBackground(accent).match(/#([0-9a-fA-F]{6})([0-9a-fA-F]{2}) 0%/);
      expect(stop).not.toBeNull();
      const alpha = parseInt(stop![2], 16) / 255;
      const first = channels(`#${stop![1]}`).map((c, i) => c * alpha + channels(NIGHT_TEAL)[i] * (1 - alpha));
      // Along the gradient from the first stop to Night Teal.
      for (let t = 0; t <= 1; t += 0.1) {
        const point = first.map((c, i) => c * (1 - t) + channels(NIGHT_TEAL)[i] * t);
        expect(whiteOn(point)).toBeGreaterThanOrEqual(4.5);
      }
    },
  );
});
