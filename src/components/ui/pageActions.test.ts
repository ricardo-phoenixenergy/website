import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// The click's dataLayer push, recorded instead of sent.
vi.mock('@/lib/analytics', () => ({ dlPush: vi.fn() }));

import { dlPush } from '@/lib/analytics';
import { TrackedButton } from './TrackedButton';
import { CopyLinkButton } from './CopyLinkButton';
import { IconChevronDown } from './Icons';

const html = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

describe('TrackedButton', () => {
  it('draws the site button as a link, at the default 48px size, with its label', () => {
    // eslint-disable-next-line react/no-children-prop
    const markup = html(createElement(TrackedButton, { href: '/contact?x=1', ctaLabel: 'Book a discovery meeting', ctaLocation: 'project_facts:a', className: 'w-full', children: 'Book a discovery meeting' }));
    expect(markup).toMatch(/^<a /);
    expect(markup).toContain('href="/contact?x=1"');
    expect(markup).toContain('min-h-12');
    expect(markup).toContain('w-full');
    expect(markup).toContain('>Book a discovery meeting</a>');
  });

  it('sends cta_click with its label and location when clicked', () => {
    vi.mocked(dlPush).mockClear();
    // TrackedButton holds no state, so calling it gives the Button element it draws.
    const element = TrackedButton({
      href: '/contact?x=1',
      ctaLabel: 'Book a discovery meeting',
      ctaLocation: 'project_facts:31-sacks-circle',
      children: 'Book a discovery meeting',
    });
    const { onClick } = element.props as { onClick: () => void };
    onClick();
    expect(dlPush).toHaveBeenCalledTimes(1);
    expect(dlPush).toHaveBeenCalledWith({ event: 'cta_click', cta_label: 'Book a discovery meeting', cta_location: 'project_facts:31-sacks-circle' });
  });
});

describe('CopyLinkButton', () => {
  const markup = html(createElement(CopyLinkButton, { url: 'https://phoenixenergy.solutions/projects/a' }));

  it('is a plain button reading "Copy link" after the link icon, on a 44px target', () => {
    expect(markup).toMatch(/<button type="button" class="[^"]*min-h-11/);
    expect(markup).toMatch(/<svg[\s\S]*<\/svg>Copy link<\/button>/);
  });

  it('has a live region ready for "Link copied", and no fallback field until a copy fails', () => {
    expect(markup).toContain('role="status"');
    expect(markup).not.toContain('<input');
  });
});

describe('IconChevronDown', () => {
  it('draws a 16px chevron by default', () => {
    expect(html(createElement(IconChevronDown))).toMatch(/^<svg width="16" height="16"[\s\S]*d="m6 9 6 6 6-6"/);
  });
});
