import { describe, expect, it } from 'vitest';
import { serializeJsonLd } from './jsonLd';

describe('serializeJsonLd', () => {
  it('escapes "<" so text from the CMS cannot close the script tag, and stays valid JSON', () => {
    const data = { name: '</script><script>alert(1)</script>' };
    const out = serializeJsonLd(data);
    expect(out).not.toContain('</script>');
    expect(JSON.parse(out)).toEqual(data);
  });
});
