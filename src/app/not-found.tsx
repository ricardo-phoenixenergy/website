import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div
      className="focus-on-dark min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: '#0d1f22' }}
    >
      <p
        className="font-body text-xs uppercase tracking-widest mb-4"
        style={{ color: 'var(--color-on-dark-subtle)', letterSpacing: '0.14em' }}
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
        style={{ fontSize: '0.875rem', color: 'var(--color-on-dark-subtle)', lineHeight: 1.75 }}
      >
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Button variant="light" href="/">
          Back to home
        </Button>
        <Button variant="ghost" href="/solutions">
          Explore solutions
        </Button>
      </div>
    </div>
  );
}
