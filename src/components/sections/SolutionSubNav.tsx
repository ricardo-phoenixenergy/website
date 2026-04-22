// src/components/sections/SolutionSubNav.tsx
'use client';

import { useState, useEffect } from 'react';

interface NavLink {
  label: string;
  href: string;  // anchor, e.g. '#pain'
}

export interface SolutionSubNavProps {
  links: NavLink[];
}

export function SolutionSubNav({ links }: SolutionSubNavProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 220);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
        className="max-w-[960px] mx-auto px-5 flex gap-6 overflow-x-auto py-3"
        style={{ scrollbarWidth: 'none', whiteSpace: 'nowrap' }}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="font-body text-sm font-medium text-[#39575C] hover:text-[#2a4045] transition-colors flex-shrink-0"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
