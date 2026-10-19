import { describe, expect, it } from 'vitest';
import { bodyImageAspectRatio } from './portableTextComponents';

const image = (aspectRatio?: number) => ({ asset: { metadata: { dimensions: { aspectRatio } } } });

describe('bodyImageAspectRatio', () => {
  it('keeps the image’s own proportions, so a 5:4 chart is not cropped', () => {
    expect(bodyImageAspectRatio(image(1.25))).toBe(1.25);
  });

  it('falls back to 16:9 when Sanity has no usable dimensions', () => {
    expect(bodyImageAspectRatio({})).toBe(16 / 9);
    expect(bodyImageAspectRatio(image(undefined))).toBe(16 / 9);
    expect(bodyImageAspectRatio(image(0))).toBe(16 / 9);
    expect(bodyImageAspectRatio(image(Number.NaN))).toBe(16 / 9);
  });
});
