# 09 — Contact Page
> Spoke | Hub: [`/CLAUDE.md`](/CLAUDE.md) | Version 3.1
> Route: `/contact`
> **Approved April 2026**

---

## Section Order

```
1. Navbar          — light glass pill, "Contact" active
2. Breadcrumb      — Home / Contact
3. Page header     — eyebrow + H1 + subtitle
4. Two-column grid — Form card (left) + Right column (right)
5. Footer
```

---

## 1. Navbar

- Light glass pill: `background: rgba(255,255,255,0.92)`, `backdrop-filter: blur(12px)`
- Active link: "Contact" — Deep Teal, `font-weight: 600`
- CTA: Deep Teal fill + white text

---

## 2. Page Header

- `padding: 36px 24px 0`, `max-width: 960px`, `margin: 0 auto`
- Eyebrow: `GET IN TOUCH`
- H1: `Let's build something together` — "together" in Dusty Blue `#709DA9`
- Subtitle: Inter 400, 13px, muted, `max-width: 480px`
  - *"Tell us how you'd like to work with Phoenix Energy and we'll connect you with the right person."*
- `margin-bottom: 36px`

---

## 3. Two-Column Grid

```css
display: grid;
grid-template-columns: 1fr 380px;
gap: 24px;
align-items: start;
max-width: 960px;
margin: 0 auto;
padding: 0 24px 48px;
```

### Mobile — stacked
- Form card full-width first, right column below
- `grid-template-columns: 1fr`

---

## 4. Form Card (left column)

- `background: #ffffff`
- `border-radius: 18px`
- `border: 1px solid #E5E7EB`
- `padding: 32px`
- `box-shadow: 0 4px 24px rgba(57,87,92,0.06)`

### Two-step flow

The form is split into **Step 1** (intent selection) and **Step 2** (fields). Step 2 is hidden until intent is chosen. URL does not change between steps — all client-side state.

---

### Step 1 — Intent Selector

**Step label:** `STEP 1 OF 2` — Inter 700, 10px, muted, uppercase, `letter-spacing: 0.1em`
**Step title:** `How would you like to work with us?` — Plus Jakarta Sans 700, 16px

**Three intent buttons** stacked vertically, `gap: 10px`:

```css
/* Each button */
display: flex;
align-items: center;
gap: 14px;
padding: 16px 18px;
border-radius: 12px;
border: 2px solid #E5E7EB;
background: #fff;
cursor: pointer;
transition: all 0.2s;
```

**Button anatomy:**
- Icon box: `44×44px`, `border-radius: 10px`, emoji icon
- Text block: label (Plus Jakarta Sans 700, 14px) + description (Inter 400, 11px, muted)
- Check circle: `20px`, `border-radius: 50%`, right-aligned — fills on selection

**Per-intent colours and content:**

| Intent | Accent | Icon bg (default) | Icon bg (selected) | Border (selected) |
|---|---|---|---|---|
| Client | `#709DA9` Dusty Blue | `rgba(112,157,169,0.1)` | `#709DA9` | `#709DA9` |
| Partner | `#E3C58D` Soft Amber | `rgba(227,197,141,0.1)` | `#E3C58D` | `#E3C58D` |
| Investor | `#9CAF88` Sage Green | `rgba(156,175,136,0.1)` | `#9CAF88` | `#9CAF88` |

**Intent button content:**

| Intent | Icon | Label | Description |
|---|---|---|---|
| Client | ⚡ | I'm a potential client | I want clean energy solutions for my business — solar, storage, wheeling, EV fleets or more. |
| Partner | 🤝 | I want to partner up | I represent a company that wants to collaborate, integrate, or distribute with Phoenix Energy. |
| Investor | 📈 | I'm an investor | I'm interested in Phoenix Energy's growth story and want to explore investment opportunities. |

**Selected state:**
- `border-color` → intent accent colour
- `background` → accent at 4–6% opacity
- Icon box background → full accent colour
- Check circle → filled with accent colour + white tick
- Label colour → dark shade of accent

**Continue button:**
- Full-width, `border-radius: 12px`, Plus Jakarta Sans 700, 14px
- **Disabled (no intent selected):** `background: #cccccc`, `cursor: not-allowed`
- **Enabled:** `background: #39575C`, `color: #fff`, hover `#2a4045`, `translateY(-1px)`
- Right: small arrow circle `rgba(255,255,255,0.2)`, 22px

---

### Step 2 — Contact Form

**Back button:** 28px circle, `border: 1px solid #E5E7EB`, `←` arrow, top-left of step header. Returns to Step 1, preserves intent selection.

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
- `border-radius: 10px`, `padding: 12px 14px`, `margin-bottom: 20px`
- Icon + text. Text copy changes per intent:
  - **Client:** *"For potential clients: Tell us about your business so we can recommend the most relevant solutions and connect you with the right specialist."*
  - **Partner:** *"For partners: Tell us about your company and the type of collaboration you have in mind. Our partnerships team will be in touch."*
  - **Investor:** *"For investors: Share your details and we'll connect you with our leadership team to discuss Phoenix Energy's growth trajectory."*

**Form fields:**

```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 14px;
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
- Label: Inter 600, 11px, `#1A1A1A`. Optional label: `(optional)` in Inter 400, `#6B7280`
- Input: `padding: 11px 14px`, `border-radius: 10px`, `border: 1.5px solid #E5E7EB`, Inter 400, 13px
- Focus: `border-color: #39575C`, `box-shadow: 0 0 0 3px rgba(57,87,92,0.08)`
- Textarea: `min-height: 88px`, `resize: none`, `line-height: 1.6`

**Submit button** — label changes per intent:
| Intent | Button label |
|---|---|
| Client | Send enquiry → |
| Partner | Send partnership enquiry → |
| Investor | Send investor enquiry → |

Same button style as Continue. Full-width, Deep Teal fill.

**Privacy note** (below button):
- Inter 400, 10px, muted, centred
- *"By submitting this form you agree to our Privacy Policy. Your information will only be used to respond to your enquiry."*
- "Privacy Policy" links to `/privacy-policy`

---

### reCAPTCHA v3

- **Version:** Google reCAPTCHA v3 (invisible — no checkbox, no challenge)
- Executes silently on form submit
- Score threshold: `0.5` — below threshold, submission is rejected with an inline error
- Token sent to `/api/contact` route handler for server-side verification
- Never shown to the user — fully invisible

**Implementation:**

```typescript
// Load reCAPTCHA script in src/app/layout.tsx
<Script
  src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
  strategy="afterInteractive"
/>

// On form submit — src/components/sections/ContactForm.tsx
const token = await grecaptcha.execute(
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  { action: 'contact_submit' }
);
// Include token in POST body to /api/contact

// Server-side verification — src/app/api/contact/route.ts
const verifyRes = await fetch(
  `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  { method: 'POST' }
);
const { success, score } = await verifyRes.json();
if (!success || score < 0.5) {
  return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
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
reCAPTCHA v3 executes silently → returns token
  ↓
POST /api/contact { intent, firstName, lastName, email,
                    phone, company, location, message, recaptchaToken }
  ↓
Server verifies reCAPTCHA token (score ≥ 0.5)
  ↓
Server calls Resend API → email to info@phoenixenergy.solutions
  ↓
Success → show success state in form card
Error   → show inline error message, form stays editable
```

**Email to info@phoenixenergy.solutions:**
- Subject: `[{intent}] New enquiry from {firstName} {lastName} — {company}`
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
- Green tick circle: `64×64px`, `background: rgba(57,87,92,0.08)`, `border-radius: 50%`
- Title: Plus Jakarta Sans 800, 20px — *"Message sent!"*
- Sub: Inter 400, 13px, muted — *"Thank you for reaching out. We'll be in touch within 1 business day."*
- `text-align: center`, `padding: 32px 0`

---

## 5. Right Column

Three stacked cards, `gap: 16px`.

### Contact Info Card (dark)
- `background: #0d1f22`, `border-radius: 16px`, `padding: 24px`
- Eyebrow: `CONTACT DETAILS` — Inter 700, 9px, `rgba(255,255,255,0.35)`, `margin-bottom: 16px`

Three rows (icon box + label + value + sub):
| Icon | Label | Value | Sub |
|---|---|---|---|
| ✉ | Email | info@phoenixenergy.solutions | We respond within 1 business day |
| 📞 | Phone | +27 79 892 8197 | Mon–Fri, 08:00–17:00 SAST |
| 📍 | Location | South Africa | Serving Southern Africa & beyond |

- Icon box: `36×36px`, `border-radius: 9px`, `background: rgba(255,255,255,0.07)`
- Label: Inter 400, 10px, `rgba(255,255,255,0.35)`, uppercase, `letter-spacing: 0.07em`
- Value: Plus Jakarta Sans 600, 13px, white
- Sub: Inter 400, 10px, `rgba(255,255,255,0.45)`, `margin-top: 2px`

### What Happens Next Card (white)
- `background: #fff`, `border: 1px solid #E5E7EB`, `border-radius: 16px`, `padding: 20px`
- Header: icon (`36×36px`, `background: rgba(57,87,92,0.08)`) + title (Plus Jakarta Sans 700, 13px)
  - Title: *"What happens next"*
- Four bullet rows: `6px` Dusty Blue dot + Inter 400, 11px, muted text
  1. We review your message within 1 business day
  2. The right specialist is assigned to your enquiry
  3. We reach out to arrange a free consultation
  4. For clients: free site assessment within 5 days

### Explore Solutions Card (white)
- `background: #fff`, `border: 1px solid #E5E7EB`, `border-radius: 16px`, `padding: 20px`
- Label: `EXPLORE SOLUTIONS` — Inter 700, 10px, muted, uppercase
- 6 solution links with accent dot + name + arrow:

| Dot | Solution |
|---|---|
| `#E3C58D` | C&I Solar & Storage |
| `#D97C76` | Wheeling |
| `#9CAF88` | Carbon Credits |
| `#709DA9` | Energy Optimisation |
| `#A9D6CB` | EV Fleets |
| `#C97A40` | WeBuySolar |

Each row: `border-bottom: 1px solid #E5E7EB`. Last: none. Hover: name → Deep Teal, arrow → Deep Teal.

---

## TypeScript Component

```tsx
// src/components/sections/ContactForm.tsx
'use client';

type Intent = 'client' | 'partner' | 'investor';

interface ContactFormState {
  step: 1 | 2;
  intent: Intent | null;
  status: 'idle' | 'submitting' | 'success' | 'error';
  errorMessage: string | null;
}

// Steps controlled via useState
// reCAPTCHA token fetched on submit via window.grecaptcha.execute()
// Zod validation client-side before POST
// POST to /api/contact
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
| 3 | Confirm office address for location field (if physical address needed) | Client |
| 4 | Confirm phone number is correct: +27 79 892 8197 | Client |

---

*Spoke of [`CLAUDE.md`](/CLAUDE.md) | Version 3.1 | Approved April 2026*

---

## Engineering Review Fixes (April 2026)

### Form error states
**Field-level validation errors:**
- Invalid field: `border: 1.5px solid #E05C5C`
- Error message: `font-size: 12px; color: #E05C5C; margin-top: 4px`
- Appears below the field label, above the hint text

**reCAPTCHA failure:**
- Amber banner above submit button: `background: rgba(227,197,141,0.12); border: 1px solid rgba(227,197,141,0.3); border-radius: 10px; padding: 10px 14px`
- Copy: *"We couldn't verify you're not a robot. Please try again."*

**Network error:**
- Same amber banner: *"Something went wrong sending your message. Please try again or email us directly at info@phoenixenergy.solutions."*

### Mobile right column — stacking order
Below the form card on mobile, right column cards stack in this order:
1. Contact info card (dark)
2. What happens next card
3. Explore solutions card

### Resend email template — per intent
All emails: `from: 'Phoenix Energy <noreply@phoenixenergy.solutions>'`, `replyTo: submitter's email`

**Client / Partner / Investor subject:** `[{intent}] {firstName} {lastName} — {company} — {location}`
**WeBuySolar subject:** `[WeBuySolar] {kWp}kWp system — {firstName} {lastName} — est. {fmtK(indicativeValue)}`

Email body structure (HTML, using React Email components):
- Header: Phoenix Energy logo + intent type badge
- Section: Contact details (name, email, phone, company, location)
- Section: Message / description (if provided)
- Section (WeBuySolar only): Full valuation summary table
- Footer: "Reply directly to this email to respond to {firstName}"


### Solutions index page — /solutions
Route: `src/app/solutions/page.tsx`
Layout: Navbar (light) + breadcrumb + page header + 3×2 vertical card grid + CTABanner + Footer.

Each vertical card:
- `background: #fff`, `border-radius: 16px`, `border: 1px solid #E5E7EB`, `padding: 24px`
- `3px top accent bar` in vertical accent colour
- Vertical name: Plus Jakarta Sans 700, 15px
- One-liner: Inter 400, 12px, muted
- `→ Learn more` link in accent colour
- Hover: `translateY(-4px)` + accent border colour over `0.2s`
- Grid: `repeat(3, 1fr)` desktop → `repeat(2, 1fr)` tablet → `1fr` mobile

