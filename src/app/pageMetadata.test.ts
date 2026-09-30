// Every page builds its search and sharing tags with pageMetadata()
// (src/lib/seo.ts), never with a hand-written openGraph or twitter block:
// Next.js puts a page's block in place of the layout's, so a page that wrote
// its own lost the site name, the locale and the type.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const APP = path.join(process.cwd(), 'src', 'app');

function pageFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return pageFiles(full);
    return entry.name === 'page.tsx' ? [full] : [];
  });
}

// The Studio sets its metadata in its layout (src/app/studio/layout.tsx): it is never indexed or shared.
const EXEMPT = ['studio/[[...tool]]/page.tsx'];
const pages = pageFiles(APP)
  .map((file) => path.relative(APP, file).split(path.sep).join('/'))
  .filter((file) => !EXEMPT.includes(file));

describe('every page', () => {
  it('is found', () => {
    expect(pages.length).toBeGreaterThanOrEqual(20);
  });

  it.each(pages)('%s builds its metadata with pageMetadata()', (file) => {
    const source = fs.readFileSync(path.join(APP, file), 'utf8');
    expect(source).toMatch(/pageMetadata\(/);
    expect(source).not.toMatch(/\bopenGraph\s*:/);
    expect(source).not.toMatch(/\btwitter\s*:/);
  });
});
