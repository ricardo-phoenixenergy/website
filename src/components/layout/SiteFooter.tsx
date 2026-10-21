import Link from 'next/link';
import { SOLUTION_META, SOLUTION_VERTICALS } from '@/types/solutions';
import { LOCATION_AREAS, LOCATION_AREA_LABEL, locationPath } from '@/lib/locationAreas';

interface FooterLink {
  label: string;
  href: string;
}

// Every page carries these links in its server HTML, so search engines reach the
// solution and area pages from anywhere on the site. The navbar's Solutions menu
// only renders its links while it is open.
const SOLUTION_LINKS: FooterLink[] = [
  ...SOLUTION_VERTICALS.map((v) => ({ label: SOLUTION_META[v].label, href: SOLUTION_META[v].slug })),
  ...LOCATION_AREAS.map((a) => ({ label: `Solar installers in ${LOCATION_AREA_LABEL[a]}`, href: locationPath(a) })),
];

// Shown once a blog post is live, the same rule as the navbar (src/lib/blogNav.ts).
const BLOG_LINK: FooterLink = { label: 'News & Insights', href: '/blog' };

const companyLinks = (showBlog: boolean): FooterLink[] => [
  { label: 'Projects', href: '/projects' },
  ...(showBlog ? [BLOG_LINK] : []),
  { label: 'Tools', href: '/tools' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Disclaimer', href: '/disclaimer' },
] as const;

function FooterColumn({ heading, links }: { heading: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-on-dark-subtle">{heading}</h2>
      <ul className="mt-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-block py-1.5 font-body text-sm text-on-dark-muted transition-colors hover:text-on-dark"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Site-wide footer, rendered once by SiteShell outside <main>. */
export function SiteFooter({ showBlog }: { showBlog: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="focus-on-dark" style={{ background: 'var(--color-pe-nav-dark)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="page-container grid gap-8 py-10 md:grid-cols-[1fr_auto] md:py-12">
        <Link
          href="/"
          className="font-display font-[800] text-xl flex-shrink-0 flex items-center gap-1.5 self-start"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 28px logo, text sits beside it */}
          <img src="/inverted-logo.png" alt="" className="flex-shrink-0 size-7" />
          <span style={{ color: 'var(--color-pe-bg)' }}>Phoenix</span>
          <span style={{ color: 'var(--color-pe-bg)' }}>Energy</span>
        </Link>
        <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 md:gap-16">
          <FooterColumn heading="Solutions" links={SOLUTION_LINKS} />
          <FooterColumn heading="Company" links={companyLinks(showBlog)} />
        </nav>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="page-container flex flex-col items-center gap-2 py-3.5 text-center md:flex-row md:justify-between md:py-4 md:text-left">
          <p className="font-body text-xs font-normal" style={{ color: 'var(--color-on-dark-subtle)' }}>
            © {year} Phoenix Energy. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex items-center gap-3 md:gap-3.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-xs" style={{ color: 'var(--color-on-dark-subtle)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
