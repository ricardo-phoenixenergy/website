import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[#0d1f22]"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Desktop single row */}
      <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-5 py-4">
        <Link
          href="/"
          className="font-display font-[800] text-xl flex-shrink-0 flex items-center gap-1.5"
        >
          <img src="/inverted-logo.svg" alt="Phoenix Energy" className="flex-shrink-0 size-7" />
          <span style={{ color: '#F5F5F5'}}>Phoenix</span>
          <span style={{ color: '#F5F5F5'}}>Energy</span>
        </Link>

        <p
          className="font-body text-xs font-normal"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          © {year} Phoenix Energy. All rights reserved.
        </p>

        <div className="flex items-center gap-3.5">
          <Link
            href="/privacy"
            className="font-body text-xs"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal"
            className="font-body text-xs"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Legal
          </Link>
        </div>
      </div>

      {/* Mobile centred stack */}
      <div className="md:hidden flex flex-col items-center gap-2 py-3.5 px-4 text-center">
        <Link
          href="/"
          className="font-display font-extrabold text-sm tracking-[0.04em] text-white"
        >
          PHOENIX<span style={{ color: '#709DA9' }}>.</span>ENERGY
        </Link>
        <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          © {year} Phoenix Energy. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Privacy Policy
          </Link>
          <Link href="/legal" className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Legal
          </Link>
        </div>
      </div>
    </footer>
  );
}
