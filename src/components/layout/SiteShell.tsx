'use client';

import { usePathname } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import { Navbar } from './Navbar';
import { SiteFooter } from './SiteFooter';

export function SiteShell({ children, showBlog }: { children: React.ReactNode; showBlog: boolean }) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith('/studio');

  if (isStudio) return <>{children}</>;

  // reducedMotion="user": Framer drops transform and layout animation for
  // visitors who ask for reduced motion, keeping opacity and colour changes.
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar showBlog={showBlog} />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </MotionConfig>
  );
}
