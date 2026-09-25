# 03 · Navigation
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> **Updated 2026-09-24:** aligned with the build (`src/components/layout/Navbar.tsx`, `src/components/layout/SiteShell.tsx`). The pill is solid white on every page, Solutions is a link plus a disclosure button, the mobile menu is a modal dialog, and a skip link comes first.

---

## Design Reference
Greenlyte navbar: a pill-shaped container with the logo left, links in the middle and a call to action on the right. The April glass and dark-hero states were not kept: the pill is the same on every page and doesn't change on scroll.

---

## Layout

```
[logo Phoenix Energy]  [Solutions][▾] [Projects] [About] [Tools] ([News & Insights]) [Contact]  [Get in touch ⚡]
```

- `position: fixed`, 16px from the top and sides (`top-4 inset-x-4`), centred, `max-width: 920px`, `z-index: 50`.
- Pill shape (`rounded-full`), white, with a soft teal-tinted shadow.
- Padding 8px 16px (10px 20px from 1280px).
- The links and the button show from **1280px** (`xl`). Below that the pill holds the logo and the menu button.

---

## States

One state. The pill is `#ffffff` on every page and doesn't react to scroll:
```css
background: #ffffff;
box-shadow: 0 4px 20px rgba(57,87,92,0.10), 0 1px 4px rgba(57,87,92,0.06);
```

The current page is marked on its link (see Nav links).

---

## Elements

### Logo
- 28px logo image, then "Phoenix" in Deep Teal (`pe-primary`) and "Energy" in Dusty Blue `#709DA9`: Plus Jakarta Sans 800, 20px.
- Links to `/`. The image is decorative (`alt=""`); the words name the link.

### Nav links
- In order: **Solutions** (see below), **Projects**, **About**, **Tools**, then **News & Insights** once the blog has 3 posts, then **Contact**.
- The blog link is added by the root layout: `BLOG_NAV_MIN_POSTS = 3` in `src/app/layout.tsx` counts the blog posts that have a slug and passes `showBlog` to the navbar. Until then the navbar has no blog link. The "Latest insights" and "Industry insights" sections link to `/blog`, but they only render once there are posts to show.
- Inter 500, 14px, muted (`pe-muted`), `padding: 6px 12px`, pill-shaped hover with a 7% Deep Teal tint and Deep Teal text.
- Current page: `aria-current="page"`, Inter 600, Deep Teal text on the 7% tint. A link counts as current on its own path and every path under it (Projects stays current on a case study).

### Contact link
- A plain nav link to `/contact`, styled like the others.
- It goes to the same page as the Get in touch button. The duplication is logged for review (polish backlog, step 8b item 1).

### CTA button (Get in touch)
- Label and link from `CONTACT_CTA` in `src/config/ctas.ts`: "Get in touch", `/contact` (step 1 of the form, where the visitor says who they are).
- `Button`, primary, compact (40px; see `specs/01-BRAND.md`, Buttons and controls): a Deep Teal pill, white text, Inter 600, 14px, with a lightning icon in a 26px Secondary Ink disc at the right end, 6px from the edge (`pr-1.5`), so the disc sits concentric with the pill's round end. From 1280px the navbar pill is 60px tall (10px padding around the 40px button).
- Hover: the disc grows to fill the button (0.55s), and the icon turns (Framer Motion variants). A layer inside the button clips the growing circle, so the link itself doesn't clip and its touch hit area stays whole.

---

## Solutions Menu

**Solutions is two controls:**
- The word **Solutions** is a link to `/solutions`, the overview. It is marked current on `/solutions` itself, and the Solutions group takes the active style on any `/solutions/...` page.
- The chevron beside it is a **disclosure button** (`aria-label="Solutions menu"`, `aria-expanded`, `aria-controls` while open). The chevron turns 180° when the menu is open.

**Opening and closing:**
- Pointer hover opens the menu; it closes 120ms after the pointer leaves.
- A click on the chevron, or ArrowDown when it has focus, pins the menu open. ArrowDown also moves focus to the first solution.
- A pinned menu closes on a second click, on Escape (focus returns to the chevron), when focus leaves the menu, or on a click or tap outside it.

**Panel:**
- Below the pill, centred under Solutions: `width: 500px`, white, `border-radius: 16px`, `border: 1px solid var(--color-pe-border)`, a deep soft shadow.
- Header: the eyebrow "Our Solutions".
- A 2-column list of the six solutions: `[8px accent dot] [name, Plus Jakarta Sans 600, 14px] [one-liner, Inter 400, 12px, muted]`. Each is a link, marked current on its own page.
- Footer: "View all solutions →" (`ArrowLink`), in Secondary Ink at rest and on hover (it doesn't darken), to `/solutions`. On hover its arrow nudges 4px right, like every arrow link.
- Entrance: `opacity 0 → 1` and `translateY(-6px → 0)` over 200ms ease-out. Exit: `opacity 1 → 0` and `translateY(0 → -4px)` over 140ms.

### Menu items

In this order:

| Dot colour | Name | One-liner |
|---|---|---|
| `#E3C58D` | C&I Solar & Storage | Generate cheaper, cleaner electricity. |
| `#D97C76` | Wheeling | Buy renewable energy through the grid. |
| `#C97A40` | WeBuySolar | Cash in your solar investment. |
| `#709DA9` | Energy Optimisation | Reduce energy use before generation. |
| `#A9D6CB` | EV Fleets & Infrastructure | Electrify and optimise your fleet. |
| `#9CAF88` | Carbon Credits | Earn revenue from your solar system. |

---

## Mobile Nav (below 1280px)

- The pill holds the logo and a **menu button**: three lines in a 44px `IconButton` (the `plain` variant: no disc until hover), `aria-label="Menu"`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` while open. Negative margins keep the pill 44px tall.
- The menu is a **modal dialog** (`role="dialog"`, `aria-modal="true"`, `aria-label="Menu"`) run by `useModalDialog` (`src/hooks/useModalDialog.ts`). While it is open:
  - focus moves to the close button, and Tab stays inside the dialog;
  - Escape closes it;
  - the page behind can't scroll and is inert, so screen readers and the keyboard can't reach it;
  - on close, focus returns to the menu button.
- Layout: a full-screen Deep Nav (`pe-nav-dark`) panel over a 40% black backdrop. The header row has the inverted logo and a close button (`aria-label="Close menu"`): a 44px ghost `IconButton` with a 20px cross.
- Links: a **Solutions** accordion button (`aria-expanded`), then Projects, About, Tools, News & Insights (once the blog has 3 posts) and Contact, in Plus Jakarta Sans 700, 24px, white.
- The Solutions accordion lists the six solutions with their accent dots, then "All solutions →" (`/solutions`).
- At the bottom: the full-width "Get in touch" button (`CONTACT_CTA`): `Button`, light, default size (48px), with an arrow in a 20px Night Teal disc.
- Choosing any link, the backdrop or the close button closes the menu and collapses the accordion.

---

## Skip Link

`SiteShell` renders **"Skip to main content"** as the first focusable element on every page except the Studio. It links to `#main-content`, the page's single `<main id="main-content" tabIndex={-1}>`, so the keyboard jumps past the navbar.

- `.skip-link` in `src/app/globals.css`: fixed, 12px from the top left, `z-index: 100`, a Deep Teal pill with white Inter 600, 14px text.
- It sits above the viewport (`translateY(-200%)`) until it receives focus, then slides into view in 150ms.

---

## Implementation

```tsx
// src/components/layout/SiteShell.tsx (client)
<MotionConfig reducedMotion="user">
  <a href="#main-content" className="skip-link">Skip to main content</a>
  <Navbar showBlog={showBlog} />
  <main id="main-content" tabIndex={-1}>{children}</main>
  <SiteFooter />
</MotionConfig>

// src/components/layout/Navbar.tsx (client)
// BASE_LINKS = Projects, About, Tools; BLOG_LINK (News & Insights) is appended when showBlog.
// DROPDOWN_ITEMS = the six solutions, in the order above.
// MenuState = 'closed' | 'hover' | 'pinned'
//   hover:  opened by pointer, closes 120ms after the pointer leaves
//   pinned: opened by click or ArrowDown, closes on toggle, Escape, focus out or an outside click
// isActive(href) = pathname === href || pathname.startsWith(`${href}/`)
// The mobile dialog uses useModalDialog(mobileNavOpen, closeMobileNav).
```

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Updated 2026-09-24*

---

## Mobile Overlay Animation

**Open:** `translateY(-100%) → translateY(0)` over `350ms cubic-bezier(0.4,0,0.2,1)`
**Close:** `translateY(0) → translateY(-100%)` over `280ms cubic-bezier(0.4,0,0.2,1)`
**Backdrop:** `opacity: 0 → 1` over `300ms` (closing: 250ms)

Implemented with Framer Motion `AnimatePresence` and `motion.div`. `MotionConfig reducedMotion="user"` drops the slide for visitors who ask for reduced motion.

## Dark Hero Pages

None. The April list (`/`, `/about`, `/projects` and the solution pages with a dark pill) was not built: the pill is white everywhere.
