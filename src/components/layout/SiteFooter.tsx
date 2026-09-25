import Link from 'next/link';

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Disclaimer', href: '/disclaimer' },
] as const;

/** Site-wide footer strip, rendered once by SiteShell outside <main>. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="focus-on-dark" style={{ background: 'var(--color-pe-nav-dark)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="page-container flex flex-col items-center gap-2 py-3.5 text-center md:flex-row md:justify-between md:py-4 md:text-left">
        <Link
          href="/"
          className="font-display font-[800] text-xl flex-shrink-0 flex items-center gap-1.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 28px logo, text sits beside it */}
          <img src="/inverted-logo.png" alt="" className="flex-shrink-0 size-7" />
          <span style={{ color: 'var(--color-pe-bg)' }}>Phoenix</span>
          <span style={{ color: 'var(--color-pe-bg)' }}>Energy</span>
        </Link>
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
    </footer>
  );
}
