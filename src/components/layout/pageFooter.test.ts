import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PageFooter, type PageFooterProps } from './PageFooter';

const html = (props: PageFooterProps) => renderToStaticMarkup(PageFooter(props));

describe('PageFooter phone line', () => {
  it('shows a call line under the button in the centered band', () => {
    const markup = html({ ctaVariant: 'centered', phone: { label: '+27 79 892 8197', href: 'tel:+27798928197' } });
    expect(markup).toContain('href="tel:+27798928197"');
    expect(markup).toContain('Or call');
    expect(markup).toContain('+27 79 892 8197');
  });

  it('is unchanged without a phone', () => {
    const base = html({ ctaVariant: 'centered' });
    expect(base).not.toContain('tel:');
    expect(base).not.toContain('Or call');
  });

  it('leaves the other variants alone', () => {
    const phone = { label: '+27 79 892 8197', href: 'tel:+27798928197' };
    expect(html({ ctaVariant: 'stats', phone })).toBe(html({ ctaVariant: 'stats' }));
    expect(html({ ctaVariant: 'deliverables', phone })).toBe(html({ ctaVariant: 'deliverables' }));
  });
});
