'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: '#F5F5F5' }}
    >
      <p
        className="font-body text-xs uppercase tracking-widest mb-4"
        style={{ color: 'var(--color-pe-muted)', letterSpacing: '0.14em' }}
      >
        Something went wrong
      </p>
      <h1
        className="font-display font-extrabold mb-4"
        style={{ fontSize: 'clamp(1.75rem,4vw,3rem)', color: '#1A1A1A', lineHeight: 1.12 }}
      >
        An error occurred
      </h1>
      <p
        className="font-body mb-8 max-w-sm"
        style={{ fontSize: '0.875rem', color: 'var(--color-pe-muted)', lineHeight: 1.75 }}
      >
        We couldn&apos;t load this page. Try again or head back to the homepage.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="font-body font-medium text-sm px-5 py-2.5 rounded-full transition-colors cursor-pointer"
          style={{ background: '#39575C', color: '#ffffff', border: 'none' }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="font-body font-medium text-sm px-5 py-2.5 rounded-full transition-colors"
          style={{
            background: '#ffffff',
            border: '1px solid #E5E7EB',
            color: '#39575C',
          }}
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}
