'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;  // anchor e.g. '#pain', or page link e.g. '/contact'
}

export interface SolutionSubNavProps {
  links: NavLink[];
}

export function SolutionSubNav({ links }: SolutionSubNavProps) {
  const [visible, setVisible]     = useState(false);
  const [activeHref, setActiveHref] = useState('');

  // Show/hide nav based on scroll depth
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 220);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const anchors = links.filter((l) => l.href.startsWith('#'));
    if (anchors.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      // Fire when the section's top edge crosses into the top ~20% of the viewport
      { rootMargin: '-10% 0px -75% 0px', threshold: 0 }
    );

    anchors.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [links]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const anchorLinks = links.filter((l) => l.href.startsWith('#'));
  const ctaLink     = links.find((l) => !l.href.startsWith('#'));

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-0 right-0 z-30 bg-white border-b border-[#E5E7EB]"
      style={{
        top: 64,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'opacity 250ms ease-out, transform 250ms ease-out',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="page-container flex items-center gap-6 overflow-x-auto py-0"
        style={{ scrollbarWidth: 'none', whiteSpace: 'nowrap' }}
      >
        {/* Anchor links */}
        {anchorLinks.map((link) => {
          const isActive = activeHref === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="flex-shrink-0 font-body text-sm font-medium py-3 border-b-2 transition-colors duration-200"
              style={{
                borderBottomColor: isActive ? '#39575C' : 'transparent',
                color: isActive ? '#39575C' : '#6B7280',
              }}
            >
              {link.label}
            </a>
          );
        })}

        {/* CTA — pushed to the right */}
        {ctaLink && (
          <Link
            href={ctaLink.href}
            className="flex-shrink-0 ml-auto font-body text-xs font-bold uppercase tracking-[0.08em] px-4 py-1.5 rounded-full transition-colors duration-200 hover:opacity-90"
            style={{ background: '#39575C', color: '#fff' }}
          >
            {ctaLink.label}
          </Link>
        )}
      </div>
    </nav>
  );
}
