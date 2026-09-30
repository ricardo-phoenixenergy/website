// Each solution page's share image and description, as search and link previews get them.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SITE_URL } from '@/lib/seo';
import { VERTICAL_CONFIG } from './verticals';

const verticals = Object.entries(VERTICAL_CONFIG);

describe('VERTICAL_CONFIG', () => {
  it.each(verticals)('%s shares a 1200 by 630 JPEG under 250KB, with alt text', (_vertical, cfg) => {
    const { url, width, height, alt } = cfg.shareImage;
    expect(url.startsWith(`${SITE_URL}/og-solutions-`)).toBe(true);
    expect(url.endsWith('.jpg')).toBe(true);
    const file = path.join(process.cwd(), 'public', url.slice(SITE_URL.length + 1));
    expect(fs.statSync(file).size).toBeLessThan(250 * 1024);
    expect([width, height]).toEqual([1200, 630]);
    expect(alt.trim().length).toBeGreaterThan(20);
  });

  it.each(verticals)('%s has a description that fits a search result', (_vertical, cfg) => {
    expect(cfg.seoDescription.length).toBeLessThanOrEqual(160);
  });
});
