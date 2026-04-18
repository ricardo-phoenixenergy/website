import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: '#0d1f22' }}
    >
      <p
        className="font-body text-xs uppercase tracking-widest mb-4"
        style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}
      >
        404
      </p>
      <h1
        className="font-display font-extrabold mb-4"
        style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#ffffff', lineHeight: 1.12 }}
      >
        Page not found
      </h1>
      <p
        className="font-body mb-8 max-w-sm"
        style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}
      >
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/"
          className="font-body font-medium px-5 py-2.5 rounded-full transition-colors"
          style={{ background: '#F5F5F5', color: '#0d1f22', fontSize: '0.8125rem' }}
        >
          Back to home
        </Link>
        <Link
          href="/solutions"
          className="font-body font-medium px-5 py-2.5 rounded-full transition-colors"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#ffffff',
            fontSize: '0.8125rem',
          }}
        >
          Explore solutions
        </Link>
      </div>
    </div>
  );
}
