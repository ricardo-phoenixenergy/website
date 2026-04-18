# 03 — Navigation
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.0

---

## Design Reference
Greenlyte navbar — pill-shaped container, centred links, glass morphism activates on scroll. See uploaded reference screenshot.

---

## Layout

```
[PHOENIX.ENERGY]  [Solutions ▾] [Projects] [About] [Blog] [Tools]  [Contact]  [Get a Quote →]
     logo left           centre nav links                         ghost right    CTA right
```

- `position: fixed`, `top: 24px`, `left: 50%`, `transform: translateX(-50%)`
- `width: fit-content`, `max-width: 860px`, `z-index: 50`
- Pill shape: `border-radius: 9999px`
- Padding: `10px 20px`

---

## States

### Over dark hero (default)
```css
background: rgba(13,31,34,0.6);
border: 1px solid rgba(255,255,255,0.08);
/* No blur on load */
```

### Scrolled — activates after 60px
```css
background: rgba(13,31,34,0.75);
backdrop-filter: blur(16px) saturate(180%);
border-color: rgba(255,255,255,0.13);
box-shadow: 0 4px 24px rgba(0,0,0,0.18);
transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
```

### Over light pages (About, Blog, Contact, Projects, etc.)
```css
background: rgba(255,255,255,0.85);
backdrop-filter: blur(12px);
border: 1px solid rgba(57,87,92,0.15);
box-shadow: 0 2px 16px rgba(57,87,92,0.08);
/* Logo: Deep Teal. Nav links: muted dark. CTA: Deep Teal fill */
```

---

## Elements

### Logo
- `PHOENIX.ENERGY` — Plus Jakarta Sans 800, 14px, `letter-spacing: 0.04em`
- On dark: white with Dusty Blue `#709DA9` dot
- On light: Deep Teal `#39575C` with Dusty Blue dot

### Nav links (centre)
- Font: Inter 500, 12px
- On dark: `rgba(255,255,255,0.6)` → hover `#fff`
- On light: `#6B7280` → hover `#39575C`
- Active page: full Deep Teal + `font-weight: 600`
- Solutions has a dropdown chevron `▾`

### Ghost link (Contact)
- Same style as nav links, no hover underline

### CTA Button (Get a Quote)
- **On dark pages:** `background: #F5F5F5`, `color: #0d1f22`, pill shape
- **On light pages:** `background: #39575C`, `color: #fff`, pill shape
- Right side: small circular dot/arrow icon (mirrors Greenlyte)
- Hover: `background: #fff` (dark) / `background: #2a4045` (light), `scale(1.02)`

---

## Solutions Mega-Menu Dropdown

- Trigger: hover on "Solutions" link with `200ms` delay
- Position: below nav pill, centred under Solutions link
- Style: `background: rgba(13,31,34,0.97)`, `backdrop-filter: blur(16px)`, `border-radius: 16px`, `border: 1px solid rgba(255,255,255,0.1)`
- Layout: 2-column grid, 3 solutions per column
- Each row: `[8px accent dot]  [Solution name — Inter 500 13px white]  [one-liner — Inter 400 11px muted]`
- Footer: "View all solutions →" centred link
- Entrance: `opacity 0→1` + `translateY(-8px → 0)` over `220ms ease-out`
- Exit: `opacity 1→0` + `translateY(0 → -4px)` over `150ms`

### Dropdown items

| Dot colour | Name | One-liner |
|---|---|---|
| `#E3C58D` | C&I Solar & Storage | Commercial solar + battery systems |
| `#D97C76` | Wheeling | Buy cheaper renewable energy via the grid |
| `#9CAF88` | Carbon Credits | Monetise your clean energy projects |
| `#709DA9` | Energy Optimisation | Maximise every kilowatt intelligently |
| `#A9D6CB` | EV Fleets & Infrastructure | End-to-end fleet electrification |
| `#C97A40` | WeBuySolar | Sell your solar system fast and fair |

---

## Mobile Nav (< 768px)

- Pill collapses to: `[PHOENIX.ENERGY logo]` + `[☰ hamburger]`
- Hamburger tap: full-screen overlay slides down from top
- Overlay: `background: #0d1f22`, `padding: 24px`
- Links stacked vertically, Plus Jakarta Sans 700, 20px, white
- Solutions expands inline (no sub-menu) — shows all 6 with accent dots
- Close button `✕` top-right
- "Get a Quote" CTA at bottom of overlay, full-width pill button

---

## Implementation

```typescript
// src/components/layout/Navbar.tsx
'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hero pages use dark pill; all others use light pill
  const DARK_HERO_PAGES = ['/', '/about', '/projects'];
  const isHeroPage = DARK_HERO_PAGES.includes(pathname) || pathname.startsWith('/solutions/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = isHeroPage && !scrolled;

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300
      rounded-full border px-5 py-2.5 flex items-center gap-7 max-w-[860px]
      ${isDark
        ? 'bg-[#0d1f22]/60 border-white/[0.08]'
        : scrolled && isHeroPage
          ? 'bg-[#0d1f22]/75 backdrop-blur-xl border-white/[0.13] shadow-lg'
          : 'bg-white/85 backdrop-blur-xl border-[#39575C]/15 shadow-sm'
      }`}>
      {/* Logo, links, CTA */}
    </nav>
  );
};
```

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md)*

---

## Mobile Overlay Animation (Engineering Review April 2026)

**Open:** `translateY(-100%) → translateY(0)` over `350ms cubic-bezier(0.4,0,0.2,1)`
**Close:** `translateY(0) → translateY(-100%)` over `280ms cubic-bezier(0.4,0,0.2,1)`
**Backdrop:** `opacity: 0 → 1` over `300ms`

Implemented via Framer Motion `AnimatePresence` + `motion.div` on the overlay `<div>`.

## Dark Hero Pages — Authoritative List

```typescript
const DARK_HERO_PAGES = [
  '/',
  '/about',
  '/projects',
];
const isHeroPage =
  DARK_HERO_PAGES.includes(pathname) ||
  pathname.startsWith('/solutions/');
// Note: /blog, /contact, /tools use light nav (no dark hero)
```

