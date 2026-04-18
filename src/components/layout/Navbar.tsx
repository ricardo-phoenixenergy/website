'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SOLUTION_META, SOLUTION_VERTICALS } from '@/types/solutions';
import { IconArrowRight } from '../ui/Icons';

const NAV_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Tools', href: '/tools' },
];

const DROPDOWN_ITEMS = [
  {
    vertical: SOLUTION_VERTICALS[0],
    name: 'C&I Solar & Storage',
    blurb: 'Commercial solar + battery systems',
    href: '/solutions/ci-solar-storage',
  },
  {
    vertical: SOLUTION_VERTICALS[1],
    name: 'Wheeling',
    blurb: 'Buy cheaper renewable energy via the grid',
    href: '/solutions/wheeling',
  },
  {
    vertical: SOLUTION_VERTICALS[3],
    name: 'Carbon Credits',
    blurb: 'Monetise your clean energy projects',
    href: '/solutions/carbon-credits',
  },
  {
    vertical: SOLUTION_VERTICALS[2],
    name: 'Energy Optimisation',
    blurb: 'Maximise every kilowatt intelligently',
    href: '/solutions/energy-optimisation',
  },
  {
    vertical: SOLUTION_VERTICALS[5],
    name: 'EV Fleets & Infrastructure',
    blurb: 'End-to-end fleet electrification',
    href: '/solutions/ev-fleets',
  },
  {
    vertical: SOLUTION_VERTICALS[4],
    name: 'WeBuySolar',
    blurb: 'Sell your solar system fast and fair',
    href: '/solutions/webuysolar',
  },
] as const;

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const pathname = usePathname();
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
    setMobileSolutionsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile nav open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNavOpen]);

  const navStyle: React.CSSProperties = {
    background: '#ffffff',
    boxShadow: '0 4px 20px rgba(57,87,92,0.10), 0 1px 4px rgba(57,87,92,0.06)',
  };

  const linkCls = 'px-3 py-1.5 rounded-full font-body text-sm font-medium text-[#6B7280] hover:bg-[#39575C]/[0.07] hover:text-[#39575C] transition-all duration-150';
  const activeLinkCls = 'px-3 py-1.5 rounded-full font-body text-sm font-semibold bg-[#39575C]/[0.07] text-[#39575C]';
  const logoWordColor = '#39575C';
  const logoAccentColor = '#709DA9';

  const openDropdown = useCallback(() => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setDropdownOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    dropdownTimer.current = setTimeout(() => setDropdownOpen(false), 100);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isSolutionsActive = pathname.startsWith('/solutions');

  return (
    <>
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full px-4 xl:px-5 py-2 xl:py-2.5 flex items-center justify-between gap-3 xl:gap-4 transition-all duration-300"
        style={{ width: 'calc(100vw - 2rem)', maxWidth: '920px', ...navStyle }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-[800] text-xl flex-shrink-0 flex items-center gap-1.5"
        >
          <img src="/logo.svg" alt="Phoenix Energy" className="flex-shrink-0 size-7" />
          <span style={{ color: logoWordColor, transition: 'color 500ms' }}>Phoenix</span>
          <span style={{ color: logoAccentColor, transition: 'color 500ms'}}>Energy</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden xl:flex items-center gap-1">
          {/* Solutions dropdown trigger */}
          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <button
              className={`flex items-center gap-1 ${isSolutionsActive ? activeLinkCls : linkCls}`}
            >
              Solutions
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[440px] rounded-2xl border border-white/10 overflow-hidden"
                  style={{ background: 'rgba(13,31,34,0.97)', backdropFilter: 'blur(16px)' }}
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  <div className="grid grid-cols-2 p-3 gap-1">
                    {DROPDOWN_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors duration-150 group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: SOLUTION_META[item.vertical].accent }}
                        />
                        <span className="flex flex-col">
                          <span className="font-body font-medium text-base text-white leading-none mb-0.5">
                            {item.name}
                          </span>
                          <span className="font-body font-normal text-sm text-white/40 leading-none">
                            {item.blurb}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-white/[0.07] py-2.5 text-center">
                    <Link
                      href="/solutions"
                      className="font-body text-sm font-medium text-white/50 hover:text-white/80 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      View all solutions →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? activeLinkCls : linkCls}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className={isActive('/contact') ? activeLinkCls : linkCls}
          >
            Contact
          </Link>
        </div>

        {/* CTA Button */}
        <Link
          href="/contact"
          className="hidden xl:inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-sm font-semibold transition-all duration-200 flex-shrink-0 bg-[#39575C] text-white hover:bg-[#2a4045]"
        >
          Get in touch
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-white/15">
            <IconArrowRight />
          </span>
        </Link>

        {/* Mobile hamburger */}
        <button
          className="xl:hidden ml-auto flex flex-col gap-1.5 p-1"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-5 h-px bg-[#39575C]" />
          <span className="block w-5 h-px bg-[#39575C]" />
          <span className="block w-3.5 h-px bg-[#39575C]" />
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
              exit={{ y: '-100%', transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
              className="fixed inset-x-0 top-0 z-[70] bg-[#0d1f22] min-h-screen flex flex-col px-6 py-6"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-8">
                <Link
                  href="/"
                  className="font-display font-[800] text-xl flex-shrink-0 flex items-center gap-1.5"
                >
                  <img src="/inverted-logo.svg" alt="Phoenix Energy" className="flex-shrink-0 size-7" />
                  <span style={{ color: '#F5F5F5', transition: 'color 500ms' }}>Phoenix</span>
                  <span style={{ color: '#F5F5F5', transition: 'color 500ms'}}>Energy</span>
                </Link>
                <button
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white text-xl"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-1 flex-1">
                {/* Solutions accordion */}
                <div>
                  <button
                    className="w-full flex items-center justify-between py-3 font-display font-bold text-2xl text-white"
                    onClick={() => setMobileSolutionsOpen((v) => !v)}
                  >
                    Solutions
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={`transition-transform duration-200 ${mobileSolutionsOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>

                  <AnimatePresence initial={false}>
                    {mobileSolutionsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1, transition: { duration: 0.25 } }}
                        exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1 pb-3 pl-2">
                          {DROPDOWN_ITEMS.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-3 py-2.5 text-white/70 hover:text-white transition-colors"
                              onClick={() => setMobileNavOpen(false)}
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: SOLUTION_META[item.vertical].accent }}
                              />
                              <span className="font-body font-medium text-base">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {[...NAV_LINKS, { label: 'Contact', href: '/contact' }].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-3 font-display font-bold text-2xl text-white hover:text-white/70 transition-colors"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile CTA */}
              <Link
                href="/contact"
                className="mt-8 w-full flex items-center justify-center gap-2 bg-[#F5F5F5] text-[#0d1f22] rounded-full py-3.5 font-body font-semibold text-base"
                onClick={() => setMobileNavOpen(false)}
              >
                Get in touch
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-[#0d1f22] text-white">
                  <IconArrowRight />
                </span>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
