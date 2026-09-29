import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  it('escapes "<" so CMS text holding "</script>" cannot close the tag early', () => {
    const data = { name: '</script><script>alert(1)</script>' };
    const markup = renderToStaticMarkup(createElement(JsonLd, { data }));
    expect(markup).toContain('\\u003c/script>');
    expect(markup).not.toContain('</script><script>');
  });

  it('holds JSON that parses back to the given data', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Phoenix Energy' };
    const markup = renderToStaticMarkup(createElement(JsonLd, { data }));
    expect(markup.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(markup.endsWith('</script>')).toBe(true);
    const inner = markup.slice(markup.indexOf('>') + 1, markup.lastIndexOf('<'));
    expect(JSON.parse(inner)).toEqual(data);
  });
});
