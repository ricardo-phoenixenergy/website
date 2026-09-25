'use client';

import { useEffect, useState, useRef, useCallback, useId } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SOLUTION_META, SOLUTION_VERTICALS } from '@/types/solutions';
import { IconArrowRight, IconX } from '../ui/Icons';
import { ArrowLink } from '../ui/ArrowLink';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { useModalDialog } from '@/hooks/useModalDialog';
import { CONTACT_CTA } from '@/config/ctas';
import { Zap, ZapIcon } from 'lucide-react';

const BASE_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Tools', href: '/tools' },
];
// Shown once the blog has enough posts (decided in the root layout).
const BLOG_LINK = { label: 'News & Insights', href: '/blog' };

const DROPDOWN_ITEMS = [
  {
    vertical: SOLUTION_VERTICALS[0],
    name: 'C&I Solar & Storage',
    blurb: 'Generate cheaper, cleaner electricity.',
    href: '/solutions/ci-solar-storage',
  },
  {
    vertical: SOLUTION_VERTICALS[1],
    name: 'Wheeling',
    blurb: 'Buy renewable energy through the grid.',
    href: '/solutions/wheeling',
  },
  {
    vertical: SOLUTION_VERTICALS[4],
    name: 'WeBuySolar',
    blurb: 'Cash in your solar investment.',
    href: '/solutions/webuysolar',
  },
  {
    vertical: SOLUTION_VERTICALS[2],
    name: 'Energy Optimisation',
    blurb: 'Reduce energy use before generation.',
    href: '/solutions/energy-optimisation',
  },
  {
    vertical: SOLUTION_VERTICALS[5],
    name: 'EV Fleets & Infrastructure',
    blurb: 'Electrify and optimise your fleet.',
    href: '/solutions/ev-fleets',
  },
  {
    vertical: SOLUTION_VERTICALS[3],
    name: 'Carbon Credits',
    blurb: 'Earn revenue from your solar system.',
    href: '/solutions/carbon-credits',
  },
] as const;

/**
 * `hover` opens on pointer hover and closes when the pointer leaves.
 * `pinned` comes from a click or the keyboard and stays open until the
 * toggle is pressed again, Escape is pressed, focus leaves or the user clicks away.
 */
type MenuState = 'closed' | 'hover' | 'pinned';

export function Navbar({ showBlog }: { showBlog: boolean }) {
  const NAV_LINKS = showBlog ? [...BASE_LINKS, BLOG_LINK] : BASE_LINKS;
  const [menu, setMenu] = useState<MenuState>('closed');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const pathname = usePathname();
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();
  const mobileMenuId = useId();
  const mobileSolutionsId = useId();

  const menuOpen = menu !== 'closed';

  const clearHoverTimer = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const openOnHover = () => {
    clearHoverTimer();
    setMenu((m) => (m === 'closed' ? 'hover' : m));
  };

  const closeOnHoverLeave = () => {
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => setMenu((m) => (m === 'hover' ? 'closed' : m)), 120);
  };

  const closeMenu = useCallback(() => setMenu('closed'), []);

  // A pinned menu closes when the user clicks or taps anywhere outside it.
  useEffect(() => {
    if (menu !== 'pinned') return;
    const onPointerDown = (e: PointerEvent) => {
      if (!solutionsRef.current?.contains(e.target as Node)) setMenu('closed');
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [menu]);

  const focusFirstMenuItem = () => {
    // The panel mounts on the next frame when opening from closed.
    requestAnimationFrame(() => {
      solutionsRef.current?.querySelector<HTMLElement>('[data-menu-item]')?.focus();
    });
  };

  const onToggleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setMenu('pinned');
      focusFirstMenuItem();
    }
  };

  const onSolutionsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && menuOpen) {
      e.stopPropagation();
      closeMenu();
      toggleRef.current?.focus();
    }
  };

  const onSolutionsBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMenu();
  };

  // Close the mobile nav (and collapse the Solutions accordion). Called from
  // every dismissal point so navigation closes the menu without a route effect.
  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
    setMobileSolutionsOpen(false);
  }, []);

  const mobileDialogRef = useModalDialog<HTMLDivElement>(mobileNavOpen, closeMobileNav);

  const navStyle: React.CSSProperties = {
    background: '#ffffff',
    boxShadow: '0 4px 20px rgba(57,87,92,0.10), 0 1px 4px rgba(57,87,92,0.06)',
  };

  const linkCls = 'px-3 py-1.5 rounded-full font-body text-sm font-medium text-pe-muted hover:bg-pe-primary/[0.07] hover:text-pe-primary transition-all duration-150';
  const activeLinkCls = 'px-3 py-1.5 rounded-full font-body text-sm font-semibold bg-pe-primary/[0.07] text-pe-primary';
  const logoWordColor = 'var(--color-pe-primary)';
  const logoAccentColor = '#709DA9';

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isSolutionsActive = pathname.startsWith('/solutions');

  return (
    <>
      <nav
        aria-label="Main"
        className="fixed top-4 inset-x-4 mx-auto max-w-[920px] z-50 rounded-full px-4 xl:px-5 py-2 xl:py-2.5 flex items-center justify-between gap-3 xl:gap-4 transition-all duration-300"
        style={navStyle}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-[800] text-xl flex-shrink-0 flex items-center gap-1.5 rounded-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 28px logo, the wordmark text names the link */}
          <img src="/logo.png" alt="" className="flex-shrink-0 size-7" />
          <span style={{ color: logoWordColor, transition: 'color 500ms' }}>Phoenix</span>
          <span style={{ color: logoAccentColor, transition: 'color 500ms'}}>Energy</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden xl:flex items-center gap-1">
          {/* Solutions: a link to the overview plus a disclosure button for the menu */}
          <div
            ref={solutionsRef}
            className="relative"
            onMouseEnter={openOnHover}
            onMouseLeave={closeOnHoverLeave}
            onKeyDown={onSolutionsKeyDown}
            onBlur={onSolutionsBlur}
          >
            <div
              className={`flex items-center rounded-full transition-all duration-150 ${
                isSolutionsActive ? 'bg-pe-primary/[0.07]' : 'hover:bg-pe-primary/[0.07]'
              }`}
            >
              <Link
                href="/solutions"
                aria-current={pathname === '/solutions' ? 'page' : undefined}
                className={`pl-3 pr-0.5 py-1.5 rounded-full font-body text-sm transition-colors duration-150 ${
                  isSolutionsActive ? 'font-semibold text-pe-primary' : 'font-medium text-pe-muted hover:text-pe-primary'
                }`}
                onClick={closeMenu}
              >
                Solutions
              </Link>
              <button
                ref={toggleRef}
                type="button"
                aria-expanded={menuOpen}
                aria-controls={menuOpen ? menuId : undefined}
                aria-label="Solutions menu"
                onClick={() => setMenu((m) => (m === 'pinned' ? 'closed' : 'pinned'))}
                onKeyDown={onToggleKeyDown}
                className={`mr-1 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-150 ${
                  isSolutionsActive ? 'text-pe-primary' : 'text-pe-muted hover:text-pe-primary'
                }`}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  id={menuId}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.14 } }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[500px] rounded-2xl overflow-hidden"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--color-pe-border)',
                    boxShadow: '0 24px 64px rgba(13,31,34,0.18), 0 4px 16px rgba(13,31,34,0.08)',
                  }}
                >
                  {/* Panel header */}
                  <div className="px-5 pt-4 pb-3" style={{ borderBottom: '1px solid var(--color-pe-border)' }}>
                    <p className="font-body text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--color-pe-muted)' }}>
                      Our Solutions
                    </p>
                  </div>

                  {/* Solution items */}
                  <ul className="grid grid-cols-2 gap-px p-3">
                    {DROPDOWN_ITEMS.map((item) => {
                      const meta = SOLUTION_META[item.vertical];
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            data-menu-item
                            aria-current={pathname === item.href ? 'page' : undefined}
                            className="group flex items-start gap-3 px-3 py-3 rounded-xl transition-colors duration-150 hover:bg-pe-bg"
                            onClick={closeMenu}
                          >
                            {/* Accent dot */}
                            <span
                              aria-hidden="true"
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-[5px]"
                              style={{ background: meta.accent }}
                            />
                            <span className="flex flex-col gap-0.5 min-w-0">
                              <span className="font-display font-semibold text-sm text-pe-text leading-snug transition-colors">
                                {item.name}
                              </span>
                              <span className="font-body text-xs leading-snug" style={{ color: 'var(--color-pe-muted)' }}>
                                {item.blurb}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Footer CTA */}
                  <div
                    className="px-5 py-3 flex items-center justify-between"
                    style={{ borderTop: '1px solid var(--color-pe-border)' }}
                  >
                    {/* Secondary Ink on hover too: this link has never darkened; its arrow still nudges */}
                    <ArrowLink href="/solutions" className="text-pe-secondary-ink hover:text-pe-secondary-ink" onClick={closeMenu}>
                      View all solutions
                    </ArrowLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={isActive(link.href) ? activeLinkCls : linkCls}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            aria-current={isActive('/contact') ? 'page' : undefined}
            className={isActive('/contact') ? activeLinkCls : linkCls}
          >
            Contact
          </Link>
        </div>

        {/* CTA Button */}
        <motion.div
          className="hidden xl:block flex-shrink-0"
          initial="rest"
          animate="rest"
          whileHover="hover"
        >
          {/* The compact button (40px). Its 26px icon disc fills the content box
              and, 6px from the end (pr-1.5), sits concentric with the pill's round end. */}
          <Button href={CONTACT_CTA.href} size="compact" className="isolate pr-1.5">
            {/* Expanding circle: it is the icon disc at rest and grows to fill the
                button on hover. This layer clips it to the pill, border included;
                the link itself doesn't clip, so its touch hit area stays whole. */}
            <span aria-hidden="true" className="pointer-events-none absolute -inset-px overflow-hidden rounded-full">
              <span className="absolute right-1.75 top-1/2 -translate-y-1/2">
                <motion.span
                  className="block size-6.5 rounded-full bg-pe-secondary-ink"
                  variants={{ rest: { scale: 1 }, hover: { scale: 18 } }}
                  transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                />
              </span>
            </span>

            {/* Label */}
            <span className="relative z-10">{CONTACT_CTA.label}</span>

            {/* Icon container */}
            <span
              aria-hidden="true"
              className="relative z-10 size-6.5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
            >
              {/* Power / standby: visible at rest, spins out on hover */}
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: 'var(--color-pe-bg)' }}
                variants={{
                  rest:  { opacity: 1, scale: 1,   rotate: 0 },
                  hover: { opacity: 0, scale: 0.3, rotate: -120 },
                }}
                transition={{ duration: 0.55 }}
              >
                <ZapIcon size={16} />
              </motion.span>

              {/* Zap / charging: hidden at rest, spins in on hover */}
              <motion.span
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: 'var(--color-pe-bg)' }}
                variants={{
                  rest:  { opacity: 0, scale: 0.3, rotate: 120 },
                  hover: { opacity: 1, scale: 1,   rotate: 0 },
                }}
                transition={{ duration: 0.25, delay: 0.14 }}
              >
                <Zap size={16} />
              </motion.span>
            </span>
          </Button>
        </motion.div>

        {/* Mobile menu button: a 44px target whose negative margins keep the pill 44px tall */}
        <IconButton
          variant="plain"
          label="Menu"
          className="xl:hidden ml-auto -my-2 -mr-2.5 flex-col gap-1.5"
          onClick={() => setMobileNavOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={mobileNavOpen}
          aria-controls={mobileNavOpen ? mobileMenuId : undefined}
        >
          <span aria-hidden="true" className="block w-5 h-px bg-pe-primary" />
          <span aria-hidden="true" className="block w-5 h-px bg-pe-primary" />
          <span aria-hidden="true" className="block w-5 h-px bg-pe-primary origin-left scale-x-[0.7]" />
        </IconButton>
      </nav>

      {/* Mobile menu: a modal dialog */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div
            key="mobile-menu"
            ref={mobileDialogRef}
            id={mobileMenuId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60]"
          >
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="absolute inset-0 bg-black/40"
              onClick={closeMobileNav}
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
              exit={{ y: '-100%', transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
              className="focus-on-dark absolute inset-0 overflow-y-auto overscroll-contain bg-pe-nav-dark"
            >
              <div className="min-h-full flex flex-col px-6 py-6">
                {/* Header row */}
                <div className="flex items-center justify-between mb-8">
                  <Link
                    href="/"
                    className="font-display font-[800] text-xl flex-shrink-0 flex items-center gap-1.5 rounded-full"
                    onClick={closeMobileNav}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- 28px logo, the wordmark text names the link */}
                    <img src="/inverted-logo.png" alt="" className="flex-shrink-0 size-7" />
                    <span style={{ color: 'var(--color-pe-bg)', transition: 'color 500ms' }}>Phoenix</span>
                    <span style={{ color: 'var(--color-pe-bg)', transition: 'color 500ms'}}>Energy</span>
                  </Link>
                  <IconButton
                    variant="ghost"
                    label="Close menu"
                    data-autofocus
                    className="-mr-2.5"
                    onClick={closeMobileNav}
                  >
                    <IconX />
                  </IconButton>
                </div>

                {/* Links */}
                <nav aria-label="Main" className="flex flex-col gap-1 flex-1">
                  {/* Solutions accordion */}
                  <div>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between py-3 font-display font-bold text-2xl text-white rounded-lg"
                      onClick={() => setMobileSolutionsOpen((v) => !v)}
                      aria-expanded={mobileSolutionsOpen}
                      aria-controls={mobileSolutionsOpen ? mobileSolutionsId : undefined}
                    >
                      Solutions
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${mobileSolutionsOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>

                    <AnimatePresence initial={false}>
                      {mobileSolutionsOpen && (
                        <motion.div
                          id={mobileSolutionsId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1, transition: { duration: 0.25 } }}
                          exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                          className="overflow-hidden"
                        >
                          <ul className="flex flex-col gap-1 pb-3 pl-2">
                            {DROPDOWN_ITEMS.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  aria-current={pathname === item.href ? 'page' : undefined}
                                  className="flex items-center gap-3 py-2.5 text-white/70 hover:text-white transition-colors rounded-lg"
                                  onClick={closeMobileNav}
                                >
                                  <span
                                    aria-hidden="true"
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ background: SOLUTION_META[item.vertical].accent }}
                                  />
                                  <span className="font-body font-medium text-base">{item.name}</span>
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link
                                href="/solutions"
                                aria-current={pathname === '/solutions' ? 'page' : undefined}
                                className="inline-flex items-center gap-2 py-2.5 font-body font-semibold text-base text-white hover:text-white/80 transition-colors rounded-lg"
                                onClick={closeMobileNav}
                              >
                                All solutions <IconArrowRight size={14} />
                              </Link>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {[...NAV_LINKS, { label: 'Contact', href: '/contact' }].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      className="py-3 font-display font-bold text-2xl text-white hover:text-white/70 transition-colors rounded-lg"
                      onClick={closeMobileNav}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <Button
                  href={CONTACT_CTA.href}
                  variant="light"
                  className="mt-8 w-full"
                  onClick={closeMobileNav}
                >
                  {CONTACT_CTA.label}
                  <span aria-hidden="true" className="size-5 rounded-full flex items-center justify-center bg-pe-nav-dark text-white">
                    <IconArrowRight />
                  </span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
