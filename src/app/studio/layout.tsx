// src/app/studio/layout.tsx
// The Studio is for the team: never in search results, and its address never
// passed to other sites. Its page is a client component, so the metadata lives here.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio',
  robots: { index: false, follow: false },
  referrer: 'same-origin',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
