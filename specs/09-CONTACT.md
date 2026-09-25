# 09 — Contact Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/contact`
> **Approved April 2026**
> **Updated 2026-09-24:** corrected to match the build. Type sizes follow the scale in `specs/01-BRAND.md`, where nothing is smaller than 12px.

---

## Section Order

```
1. Navbar: solid white pill, "Contact" highlighted (see specs/03-NAVIGATION.md)
2. Breadcrumb: Home / Contact
3. Page header: eyebrow + H1 + subtitle
4. Two-column grid: form card (left) + right column (right), stacked below 1024px
5. Footer (this page has no CTA band)
```

---

## 1. Navbar

Navbar: see `specs/03-NAVIGATION.md`. On this page it is the same solid white pill as on every other page, with "Contact" highlighted (Deep Teal text on a 7% Deep Teal tint, `aria-current="page"`).

---

## 2. Page Header

- Inside `page-container` (up to 1280px wide; side padding 16px, 24px from 640px, 32px from 1024px), with `padding-top: 96px`.
- Eyebrow: `GET IN TOUCH`
- H1: `Let's build something together`, 36px, with "together" in Dusty Blue ink `#45727E` (`text-pe-secondary-ink`).
- Subtitle: Inter 400, 16px, muted, `max-width: 512px`.
  - *"Tell us how you'd like to work with Phoenix Energy and we'll connect you with the right person."*
- `margin-bottom: 40px`.

---

## 3. Two-Column Grid

```css
display: grid;
grid-template-columns: 1fr 380px; /* from 1024px; 1fr below */
gap: 24px;
align-items: start;
/* Sits in the header's page-container, which has padding-bottom: 64px */
```

### Mobile — stacked
- Form card full-width first, right column below
- `grid-template-columns: 1fr`

---

## 4. Form Card (left column)

- `background: #ffffff`.
- `border-radius: 16px`.
- `border: 1px solid #E5E7EB`.
- `padding: 24px`, and 32px from 640px.
- `shadow-sm` (Tailwind's small shadow).

### Two-step flow

The form is split into **Step 1** (intent selection) and **Step 2** (fields). The steps are client-side state, and the URL doesn't change between them.

A link with `?intent=client`, `partner` or `investor` opens step 2 directly. `?message=` prefills Tell us more; without it, `?strategy=<key>` (plus `&source=finder` from the Strategy Finder) writes that strategy's sentence into it (`contactMessageForStrategy` in `src/config/strategies.ts`). Page CTAs build these links with `contactHref()` (`src/lib/contactLink.ts`), which opens step 2 as a client. The navbar's "Get in touch" links to plain `/contact`, which opens step 1. The prefill runs once after hydration and doesn't move focus; moving between steps focuses the new step's heading.

---

### Step 1 — Intent Selector

**Step label:** `STEP 1 OF 2` in Inter 700, 12px, muted, uppercase, `letter-spacing: 0.14em`
**Step title:** `How would you like to work with us?` in Plus Jakarta Sans 700, 20px (an h2)

**Three intent options** stacked vertically, `gap: 12px`. Each is a `<label class="choice-card">` around a visually hidden radio input, inside a `role="radiogroup"` labelled by the step title. Keyboard focus draws the ring on the card.

```css
/* Each option (label.choice-card) */
display: flex;
align-items: center;
gap: 16px;
padding: 16px;
border-radius: 12px;
border: 2px solid #E5E7EB;
background: #fff;
cursor: pointer;
transition: all 0.2s;
```

**Option anatomy:**
- Icon box: `44×44px`, `border-radius: 12px`, an 18px SVG icon from `src/components/ui/Icons.tsx`.
- Text block: label (Plus Jakarta Sans 700, 16px) + description (Inter 400, 14px, muted).
- Radio dot: `20px` circle with a 2px border, right-aligned; when selected it fills and shows a 6px white dot.

**Colours:** all three intents use Dusty Blue ink `#45727E` (`--color-pe-secondary-ink`) with Dusty Blue tints. There are no per-intent accents.

| Intent | Accent | Icon bg (default) | Icon bg (selected) | Border (selected) |
|---|---|---|---|---|
| Client | `#45727E` Dusty Blue ink | `rgba(112,157,169,0.12)` | `#45727E` | `#45727E` |
| Partner | `#45727E` Dusty Blue ink | `rgba(112,157,169,0.12)` | `#45727E` | `#45727E` |
| Investor | `#45727E` Dusty Blue ink | `rgba(112,157,169,0.12)` | `#45727E` | `#45727E` |

**Intent option content:**

| Intent | Icon | Label | Description |
|---|---|---|---|
| Client | `IconZap` | I'm a potential client | I want clean energy solutions for my business: solar, storage, wheeling, EV fleets or more. |
| Partner | `IconUsers` | I want to partner up | I represent a company that wants to collaborate, integrate, or distribute with Phoenix Energy. |
| Investor | `IconTrendingUp` | I'm an investor | I'm interested in Phoenix Energy's growth story and want to explore investment opportunities. |

**Selected state:**
- `border-color` → `#45727E`.
- `background` → `rgba(112,157,169,0.05)`.
- Icon box background → `#45727E` with a white icon (default: the 12% tint with a `#45727E` icon).
- Radio dot → filled `#45727E` with a white centre dot (default: transparent with a `#E5E7EB` border).
- Label colour → `#45727E` (default: `#1A1A1A`).

**Continue button:**
- Full-width, `border-radius: 12px`, Plus Jakarta Sans 700, 16px.
- **Always enabled.** With no intent chosen, it stays on step 1 and shows *"Choose how you'd like to work with us to continue."* below the options (Inter 14px, `--color-pe-error`, `role="alert"`).
- `background: #39575C`, `color: #fff`. Hover lifts it 1px (`translateY(-1px)`) with no colour change.
- Right: a 16px arrow icon, with no circle.

---

### Step 2 — Contact Form

**Back button:** 40px circle, `border: 1px solid #E5E7EB`, a 14px left-arrow icon, `aria-label="Back to step 1"`, top-left of step header. Returns to Step 1 and keeps the intent and anything typed; it clears any errors.

**Step label:** `STEP 2 OF 2`

**Step title** — changes based on intent:
| Intent | Title |
|---|---|
| Client | Tell us about your business |
| Partner | Tell us about your company |
| Investor | Tell us about yourself |

**Context hint block:**
- `background: rgba(57,87,92,0.05)`
- `border: 1px solid rgba(57,87,92,0.1)`
- `border-radius: 12px`, `padding: 12px 16px`, `margin-bottom: 20px`.
- Text only (no icon), Inter 14px, muted. The copy changes per intent:
  - **Client:** *"For potential clients: Tell us about your business so we can recommend the most relevant solutions and connect you with the right specialist."*
  - **Partner:** *"For partners: Tell us about your company and the type of collaboration you have in mind. Our partnerships team will be in touch."*
  - **Investor:** *"For investors: Share your details and we'll connect you with our leadership team to discuss Phoenix Energy's growth trajectory."*

**Form fields:**

```css
display: grid;
grid-template-columns: 1fr 1fr; /* from 640px; 1fr below */
gap: 16px;
```

| Field | Type | Span | Required | Placeholder |
|---|---|---|---|---|
| First name | text | half | ✓ | e.g. Sarah |
| Last name | text | half | ✓ | e.g. Johnson |
| Email address | email | half | ✓ | sarah@company.co.za |
| Phone number | tel | half | ✓ | +27 __ ___ ____ |
| Company name | text | half | ✓ | e.g. Acme Holdings |
| Location | text | half | ✓ | e.g. Johannesburg, GP |
| Tell us more | textarea | full | ✗ (optional) | A brief description of what you're looking for... |

**Field styling:**
- Label: Inter 600, 14px, `#1A1A1A`. Optional label: `(optional)` in Inter 400, `text-pe-muted` (`#646B78`).
- Input: `padding: 10px 14px`, `border-radius: 12px`, `border: 1px solid #848B96` (`pe-control-border`, 3.4:1 on white, so the field’s edge meets WCAG 1.4.11; the intent radios’ rings use it too), Inter 400, 16px.
- Focus: `border-color: #39575C`, plus the site-wide focus ring (2px Deep Teal outline, 2px offset, white halo; `src/app/globals.css`).
- Textarea: 4 rows, `resize: none`, `line-height: 1.625`.
- Invalid fields: see Engineering Review Fixes below.

**Submit button** — label changes per intent:
| Intent | Button label |
|---|---|
| Client | Send enquiry → |
| Partner | Send partnership enquiry → |
| Investor | Send investor enquiry → |

Same size and fill as Continue (full-width, Deep Teal), with a 16px arrow icon after the label. On hover it darkens (`brightness(0.9)`) instead of lifting. While sending, the label reads "Sending…" and the button is disabled at 60% opacity.

**Privacy notice** (below button), updated September 2026:
- The shared `FormPrivacyNotice` component, also used by the solar valuation request. Inter 400, 12px, muted, centred.
- Draft wording pending legal review, kept in one constant (`src/config/privacyNotice.ts`): *"Phoenix Energy Solutions (Pty) Ltd uses these details only to reply to your enquiry. Our Privacy Policy explains how we handle personal information and your rights."* "Privacy Policy" links to `/privacy-policy`.
- Google's reCAPTCHA disclosure follows it, because the badge is hidden.
- The old *"By submitting this form you agree to our Privacy Policy"* is retired: it bundled a notice with an agreement. The open questions are in `docs/legal/privacy-review-draft.md`.

---

### reCAPTCHA v3

- **Version:** Google reCAPTCHA v3 (invisible: no checkbox, no challenge).
- The script loads only with the two forms that use it. `RecaptchaScript` (`src/components/ui/RecaptchaScript.tsx`) renders inside `ContactForm` and `SolarValuationTool`, and renders nothing when `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is empty.
- On submit, `getRecaptchaToken('contact_submit')` (`src/lib/recaptcha.ts`) waits up to 4 seconds for the script and returns a token. It returns an empty string when there is no site key, the script never loads or `execute` throws. The valuation tool uses the action `valuation_submit`.
- reCAPTCHA grades an enquiry, and a low score doesn't block it. The route (`src/app/api/contact/route.ts`) checks the token with Google's siteverify:
  - Score of 0.5 or more: sent as normal.
  - Score under 0.5: still sent, with `[Check: low reCAPTCHA score] ` at the start of the subject.
  - No token: refused with 400 `recaptcha-missing`.
  - Google rejects the token: refused with 400 `recaptcha-failed`.
  - No `RECAPTCHA_SECRET_KEY` on the server, or Google can't be reached: sent unchecked, with no flag. The contact schema still needs a non-empty token, so if the browser also sent none (no site key, or the script didn't load), the route returns 422 and the form shows `send-failed`.
- The form turns either refusal into a `SendFailureNotice` that offers email and phone (see Engineering Review Fixes).
- The badge is hidden site-wide (`.grecaptcha-badge` in `src/app/globals.css`). Google's disclosure sits under the form instead, in `FormPrivacyNotice`.

**Implementation:**

```typescript
// src/components/ui/RecaptchaScript.tsx, rendered by ContactForm and SolarValuationTool only
<Script id="recaptcha-v3" src={RECAPTCHA_SRC} strategy="afterInteractive" />

// On submit: src/components/sections/ContactForm.tsx
const recaptchaToken = await getRecaptchaToken('contact_submit'); // '' when there is no key or script
// The token goes in the POST body to /api/contact

// Server: src/app/api/contact/route.ts
async function checkRecaptcha(token: string | undefined): Promise<SpamCheck> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return 'unchecked';                    // sent, no flag
  if (!token || token === 'no-key') return 'missing'; // 400 recaptcha-missing
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as { success: boolean; score?: number };
    if (!data.success) return 'failed';               // 400 recaptcha-failed
    return (data.score ?? 0) >= 0.5 ? 'verified' : 'low-score'; // low-score: sent, subject flagged
  } catch {
    return 'unchecked';                               // Google unreachable: sent, no flag
  }
}
```

**Environment variables required:**
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=   # Public site key (safe to expose)
RECAPTCHA_SECRET_KEY=              # Secret key (server-side only, never expose)
```

> Add both to `specs/14-OPEN-ITEMS.md` — reCAPTCHA site registration required before build.

---

### Form Submission Flow

```
User fills form → clicks Submit
  ↓
Zod checks the fields in the browser (contactSchema); errors stop here
  ↓
reCAPTCHA v3 runs → token ('' when there is no key or script)
  ↓
POST /api/contact { intent, firstName, lastName, email,
                    phone, company, location, message, recaptchaToken }
  ↓
Server checks the token: missing or failed → 400; score under 0.5 → sent, flagged
  ↓
Server validates with Zod (422 on failure), renders ContactEmail and sends it
with Resend to info@phoenixenergy.solutions (500 if Resend fails)
  ↓
Success → success state in the form card; dataLayer event form_submit (form_name contact)
Error   → SendFailureNotice above the submit button; the fields keep their values
```

**Email to info@phoenixenergy.solutions:**
- Subject: `[{Intent}] {firstName} {lastName}, {company}, {location}`, with the intent capitalised (Client, Partner or Investor) and `[Check: low reCAPTCHA score] ` in front when the score is under 0.5.
- Reply-to: submitter's email address
- Body: all fields formatted clearly with intent type highlighted

**Validation (Zod):**
```typescript
// src/lib/validators/contact.ts
import { z } from 'zod';

export const contactSchema = z.object({
  intent:    z.enum(['client', 'partner', 'investor']),
  firstName: z.string().min(2),
  lastName:  z.string().min(2),
  email:     z.string().email(),
  phone:     z.string().min(8),
  company:   z.string().min(1),
  location:  z.string().min(2),
  message:   z.string().optional(),
  recaptchaToken: z.string().min(1),
});
```

---

### Success State

Replaces form content (no page navigation):
- Tick circle: `64×64px`, `background: rgba(57,87,92,0.08)`, `border-radius: 50%`, with a Deep Teal tick.
- Title *"Message sent!"*: Plus Jakarta Sans 800, 24px, an h2 that takes focus.
- Sub: Inter 400, 16px, muted: *"Thank you for reaching out. We'll reply within 1 business day."* (`REPLY_PROMISE.afterSend`).
- `text-align: center`, `padding: 64px 24px`, and `80px 40px` from 640px.

---

## 5. Right Column

Three stacked cards, `gap: 16px`.

### Contact Info Card (dark)
- `background: #0d1f22`, `border-radius: 16px`, `padding: 24px`
- Eyebrow: `CONTACT DETAILS` in Inter 700, 18px (`text-lg`), uppercase, `letter-spacing: 0.14em`, `var(--color-on-dark-subtle)` (`#9BA7A9`), `margin-bottom: 16px`.

Three rows (icon box + label + value + sub):
| Icon | Label | Value | Sub |
|---|---|---|---|
| `IconMail` | Email | info@phoenixenergy.solutions | We reply within 1 business day. (`REPLY_PROMISE.sentence`) |
| `IconPhone` | Phone | +27 79 892 8197 | Mon to Fri, 08:00 to 17:00 SAST (`CONTACT.phoneHours`) |
| `IconMapPin` | Head Office | The Colosseum, Century City | 1st Floor, Foyer 3, Cape Town, 7441 |

Email and phone come from `CONTACT` in `src/config/contact.ts`; the address is written in `src/app/contact/page.tsx`. Since September 2026 (audit CON-05) the email and phone values are links, so one tap opens the mail app or the dialler: `mailto:{CONTACT.email}` and `CONTACT.phoneHref` (`tel:+27798928197`). They are white with a 40% white underline, `underline-offset: 4px`, which turns solid white on hover; the site-wide focus ring shows on keyboard focus. The address is plain text.

- Icon box: `36×36px`, `border-radius: 8px`, `background: rgba(255,255,255,0.07)`, with a 17px icon in `#F5F5F5`.
- Label: Inter 400, 12px, `var(--color-on-dark-subtle)`, uppercase, `letter-spacing: 0.07em`.
- Value: Plus Jakarta Sans 600, 16px, white; long values wrap anywhere.
- Sub: Inter 400, 12px, `var(--color-on-dark-subtle)`, `margin-top: 2px`.

### What Happens Next Card (white)
- `background: #fff`, `border: 1px solid #E5E7EB`, `border-radius: 16px`, `padding: 24px`.
- Title: *"What happens next"*, an h2 in Plus Jakarta Sans 700, 16px. There is no header icon.
- Steps: an ordered list; each step has a 24px Deep Teal circle with a white number, then Inter 400, 14px, muted text.
- The April mockup had four bullet rows (6px Dusty Blue dot, 11px text):
  1. We review your message within 1 business day
  2. The right specialist is assigned to your enquiry
  3. We reach out to arrange a free consultation
  4. For clients: free site assessment within 5 days

> Placeholder from the April 2026 mockup, not confirmed and not on the site. Don't publish it without evidence (see `docs/content/claims-register.md`).

**As built (September 2026):** the shared `NextSteps` component (`variant="card"`, an h2), second in the right column, with three numbered steps from `CONTACT_NEXT_STEPS` in `src/config/contact.ts`. Text is 14px, above the 12px floor.
  1. We pass your enquiry to the right specialist.
  2. We reply within 1 business day. (`REPLY_PROMISE`, the site's one response time)
  3. For clients, the first meeting or assessment is free, with no obligation.

Row 4 was left out: nothing else on the site promises a site assessment within 5 days, and the site states one response time only. Add it back only once the business confirms the timing.

### Connect With Us Card (white)
The third card is *"Connect with us"*, in place of the April "Explore solutions" card (six solution links with accent dots):
- `background: #fff`, `border: 1px solid #E5E7EB`, `border-radius: 16px`, `padding: 24px`.
- Label: `CONNECT WITH US` in Inter 700, 12px, muted, uppercase, `letter-spacing: 0.14em`.
- One link, to `https://www.linkedin.com/company/phoenix-energy-solutions` in a new tab: a 40px icon box (`#EBF4F6`, Deep Teal LinkedIn icon), then *"Phoenix Energy Solutions"* (Plus Jakarta Sans 600, 14px, Deep Teal on hover) over *"Follow us on LinkedIn"* (Inter 12px, muted).

---

## TypeScript Component

```tsx
// src/components/sections/ContactForm.tsx
'use client';

type Intent = 'client' | 'partner' | 'investor';
type Status = 'idle' | 'submitting' | 'success' | 'error';
// SendFailure = 'recaptcha-missing' | 'recaptcha-failed' | 'send-failed' (src/components/ui/SendFailureNotice.tsx)

// Separate useState hooks rather than one state object:
// step (1 | 2), intent (Intent | null), intentError (boolean), status (Status),
// failure (SendFailure | null), fieldErrors, fields (the seven inputs)
// ?intent=, ?message= and ?strategy= prefill once on mount (see Two-step flow)
// Zod validation client-side (contactSchema) before the token is fetched
// reCAPTCHA token from getRecaptchaToken('contact_submit') (src/lib/recaptcha.ts)
// POST to /api/contact; on success dlPush({ event: 'form_submit', form_name: 'contact', service_interest: intent })
```

---

## Environment Variables (add to .env.local)

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=   # Register at console.cloud.google.com
RECAPTCHA_SECRET_KEY=              # Server-side only
```

---

## Open Items for This Page

| # | Item | Owner |
|---|---|---|
| 1 | Register Google reCAPTCHA v3 site — get site key + secret key | Dev |
| 2 | Add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` to Vercel env vars | Dev |
| 3 | Done: the head office address (The Colosseum, Century City, Cape Town) is live on the page | Client |
| 4 | Confirm phone number is correct: +27 79 892 8197 | Client |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

---

## Engineering Review Fixes (April 2026)

### Form error states
**Field-level validation errors:**
- Zod (`contactSchema`) checks the fields on submit, not on blur. Focus moves to the first invalid field, and a field's error clears as soon as the visitor edits it.
- Invalid field: `border: 2px solid #C0392B` (`--color-pe-error`), with `aria-invalid` and `aria-describedby` pointing at the message.
- Error message: `font-size: 14px; color: #C0392B; margin-top: 4px`, below the input.

**Send failures (`SendFailureNotice`, `src/components/ui/SendFailureNotice.tsx`):**
- Amber banner above the submit button, `role="alert"`: `background: rgba(227,197,141,0.12); border: 1px solid rgba(227,197,141,0.3); border-radius: 12px; padding: 12px 16px; color: #5E430C` (`--color-accent-solar-on`), 14px.
- `recaptcha-missing`: *"We couldn't run our spam check, which some browser extensions block. Nothing was sent."*
- `recaptcha-failed`: *"Our spam check didn't go through, so nothing was sent. Please try again."*
- `send-failed` (Resend failed, the request failed, or the server rejected the fields): *"Your message didn't send. Your details are still here, so you can try again."*
- Each message ends with *"You can also email info@phoenixenergy.solutions or call +27 79 892 8197."*, with the email and number as links.

### Mobile right column — stacking order
Below the form card on mobile, right column cards stack in this order:
1. Contact info card (dark).
2. What happens next card.
3. Connect with us card.

### Resend email template — per intent
All emails: `from: 'Phoenix Energy <noreply@phoenixenergy.solutions>'`, `replyTo: submitter's email`

**Client / Partner / Investor subject:** `[{Intent}] {firstName} {lastName}, {company}, {location}`
**WeBuySolar subject:** `[WeBuySolar] {kw} kWp system: {firstName} {lastName}` (the last name is optional)

Both subjects get `[Check: low reCAPTCHA score] ` in front when the score is under 0.5.

Email body structure (HTML, React Email components rendered with `@react-email/render`; `src/emails/ContactEmail.tsx` and `src/emails/WeBuySolarEmail.tsx`):
- Header: a "PHOENIX ENERGY" text wordmark on Deep Teal, with no logo image. The WeBuySolar email adds "WeBuySolar Platform".
- Badge and heading: "{Intent} Enquiry" and "New enquiry received", or "WeBuySolar Valuation Request" and "New valuation request", then a "Submitted via" line linking to the page it came from.
- Section: Contact details (name, email, phone, company, location). The WeBuySolar email has name, email and phone (when given).
- Section: Message (contact emails only, when provided).
- Section (WeBuySolar only): the tool's answers, with no valuation figure: system size, install year, panel brand, inverter type, size and brand, battery size (with brand, chemistry and health when there is a battery), condition, monitoring, documentation and province. Blank answers read "Not given".
- Closing line: "Reply directly to this email to respond to {firstName}.", then a footer with phoenixenergy.solutions and info@phoenixenergy.solutions.


### Solutions index page — /solutions
Route: `src/app/solutions/page.tsx`. The April layout described here (white cards with a 3px accent bar and "→ Learn more", then a CTABanner) is not the built page. As built:
- A Night Teal hero with floating orbs: breadcrumb Home / Solutions, eyebrow "Our Solutions", H1 "Every energy challenge, solved", and two buttons, "Book a discovery meeting" (opens the contact form at step 2) and "Explore solutions" (jumps to the cards).
- One dark card per vertical, in 1 column, 2 from 768px and 3 from 1024px. Each card shows the vertical's hero image from Sanity, its SEO description, two stats from `VERTICAL_CONFIG` (`src/config/verticals.ts`, figures from the claims register) and an "Explore {vertical}" pill in the accent colour. The whole card links to the solution page.
- No CTA band. An `ItemList` JSON-LD lists the six solution pages.

