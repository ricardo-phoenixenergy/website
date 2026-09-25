'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { IconArrowRight, IconRefresh } from '@/components/ui/Icons';

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
      {/* A light page, so the second action is the outline button, not ghost. */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button onClick={reset}>
          <IconRefresh /> Try again
        </Button>
        <Button variant="outline" href="/">
          Go to home <IconArrowRight />
        </Button>
      </div>
    </div>
  );
}
