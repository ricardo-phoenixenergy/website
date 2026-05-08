# Legal Pages Design Spec
> Phoenix Energy Website v3.0 | 2026-05-08

---

## Overview

Three static legal pages plus a footer update. All pages are server-rendered, fully static (no CMS), and follow the existing site layout pattern (Navbar + breadcrumb + page header + content card + Footer).

---

## Company Details (used across all pages)

| Field | Value |
|---|---|
| Legal name | Phoenix Energy Solutions (Pty) Ltd |
| Registration number | 2024/051881/07 |
| VAT number | 4690322500 |
| Registered address | 1st Floor, Foyer 3, The Colosseum, Century Way, Century City, Cape Town, 7441 |
| Email | info@phoenixenergy.solutions |
| Phone | +27 79 892 8197 |
| Effective date | 8 May 2026 |

---

## Routes & Files

| Route | File | Title |
|---|---|---|
| `/privacy-policy` | `src/app/privacy-policy/page.tsx` | Privacy Policy |
| `/terms-of-use` | `src/app/terms-of-use/page.tsx` | Terms of Use |
| `/disclaimer` | `src/app/disclaimer/page.tsx` | Disclaimer |

---

## Page Layout (all three pages identical structure)

```
[Navbar — light glass pill]
[Breadcrumb — Home / {Page Title}]
[Page header — eyebrow "LEGAL" + H1 + subtitle]
[Content card — white bg, border-radius: 18px, border: 1px solid #E5E7EB, padding: 40px, max-width: 760px, margin: 0 auto]
  ↳ Sections with H2 headings + paragraph body text
  ↳ Last updated line at bottom
[Footer]
```

**Styling:**
- Page background: `#F5F5F5`
- Content card: `background: #fff`, `border: 1px solid #E5E7EB`, `border-radius: 18px`, `padding: 40px`, `max-width: 760px`, centred
- H2 sections: Plus Jakarta Sans 700, 15px, `#1A1A1A`, `margin-top: 32px`
- Body paragraphs: Inter 400, 14px, `#6B7280`, `line-height: 1.8`
- Eyebrow: `LEGAL` — standard SectionLabel component
- Section dividers: `1px solid #E5E7EB` between major sections

---

## Page 1 — Privacy Policy (`/privacy-policy`)

**Metadata:**
```typescript
title: 'Privacy Policy | Phoenix Energy'
description: 'How Phoenix Energy Solutions (Pty) Ltd collects, uses and protects your personal information in accordance with POPIA.'
canonical: 'https://phoenixenergy.solutions/privacy-policy'
```

**Sections:**

### 1. Who We Are
Phoenix Energy Solutions (Pty) Ltd (reg. 2024/051881/07, VAT 4690322500), a company incorporated in South Africa, operating at 1st Floor, Foyer 3, The Colosseum, Century Way, Century City, Cape Town, 7441. Contact: info@phoenixenergy.solutions.

### 2. What Personal Information We Collect
- **Contact form:** first name, last name, email address, phone number, company name, location, and optional message
- **Solar Asset Valuation Tool:** first name, last name, email address, phone number, and system details (kWp, installation year, battery capacity, province)
- **Website usage data:** pages visited, session duration, device type, and browser — collected anonymously via Google Analytics

### 3. Why We Collect Your Information
- To respond to enquiries and connect you with the appropriate specialist
- To provide an indicative solar asset valuation and follow up with a formal offer
- To improve the performance and content of our website
- We do not sell, rent, or share your personal information with third parties for their own marketing purposes

### 4. POPIA Compliance
We process personal information lawfully in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA). You have the right to:
- Access the personal information we hold about you
- Request correction of inaccurate information
- Request deletion of your information (subject to legal retention requirements)
- Object to the processing of your information

To exercise any of these rights, email info@phoenixenergy.solutions.

### 5. Third-Party Processors
We use the following third-party services to operate this website, each bound by their own privacy policies:
- **Resend** — email delivery of form submissions
- **Sanity** — headless CMS for website content
- **Google Analytics / Google Tag Manager** — anonymised website usage analytics
- **Google reCAPTCHA** — spam and bot prevention on forms

### 6. Cookies & Analytics
This website uses cookies placed by Google Analytics (via Google Tag Manager) to collect anonymised data including pages visited, session duration, and device type. No personally identifiable information is transmitted to Google. You can opt out by:
- Adjusting your browser settings to block cookies
- Using the [Google Analytics Opt-out Browser Add-on](https://tools.google.com/dlpage/gaoptout)

### 7. Data Retention
- Enquiry and valuation data: retained for 3 years from the date of submission
- Anonymised analytics data: retained indefinitely in aggregated form

### 8. Changes to This Policy
We may update this Privacy Policy from time to time. The effective date at the bottom of this page reflects the most recent revision.

### 9. Contact
For any privacy-related queries: info@phoenixenergy.solutions

**Last updated: 8 May 2026**

---

## Page 2 — Terms of Use (`/terms-of-use`)

**Metadata:**
```typescript
title: 'Terms of Use | Phoenix Energy'
description: 'Terms and conditions governing your use of the Phoenix Energy website.'
canonical: 'https://phoenixenergy.solutions/terms-of-use'
```

**Sections:**

### 1. Acceptance of Terms
By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree, please discontinue use of the website immediately.

### 2. About Us
This website is operated by Phoenix Energy Solutions (Pty) Ltd (reg. 2024/051881/07), a company incorporated under the laws of the Republic of South Africa.

### 3. Intellectual Property
All content on this website — including text, graphics, logos, icons, images, and software — is the property of Phoenix Energy Solutions (Pty) Ltd and is protected by South African copyright law. No content may be reproduced, distributed, or transmitted in any form without prior written consent.

### 4. Permitted Use
You may use this website for lawful personal or business purposes only. You may not:
- Scrape, crawl, or harvest data from the website using automated tools
- Attempt to gain unauthorised access to any part of the website or its infrastructure
- Use the website in any way that could damage, disable, or impair its operation
- Reproduce or redistribute content for commercial purposes without written permission

### 5. Third-Party Links
This website may contain links to third-party websites. These links are provided for convenience only. Phoenix Energy Solutions (Pty) Ltd has no control over, and accepts no responsibility for, the content or practices of any linked third-party site.

### 6. Limitation of Liability
To the fullest extent permitted by law, Phoenix Energy Solutions (Pty) Ltd shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, this website or any content contained herein. This includes but is not limited to loss of data, loss of profits, or business interruption.

### 7. Changes to These Terms
We reserve the right to amend these Terms of Use at any time without prior notice. Your continued use of the website following any changes constitutes acceptance of the updated terms.

### 8. Governing Law
These Terms of Use are governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the South African courts.

### 9. Contact
For any queries regarding these terms: info@phoenixenergy.solutions

**Last updated: 8 May 2026**

---

## Page 3 — Disclaimer (`/disclaimer`)

**Metadata:**
```typescript
title: 'Disclaimer | Phoenix Energy'
description: 'Important disclaimers regarding the accuracy of calculators, financial estimates, and information published on the Phoenix Energy website.'
canonical: 'https://phoenixenergy.solutions/disclaimer'
```

**Sections:**

### 1. General Information Only
The information published on this website is provided for general informational purposes only. It does not constitute professional financial, legal, engineering, or investment advice. Phoenix Energy Solutions (Pty) Ltd makes no representation that the information on this site is appropriate, accurate, or applicable to your specific circumstances.

### 2. Calculator & Tool Accuracy
**The Solar Asset Valuation Tool and all other calculators, savings estimates, financial projections, yield models, and metrics presented on this website are indicative only.**

These tools are based on publicly available market data, industry averages, regional solar yield benchmarks, and modelling assumptions current at the time of publication. They are intended to provide a general directional estimate and should not be relied upon as an accurate reflection of any specific system, project, or transaction.

Phoenix Energy Solutions (Pty) Ltd, its directors, employees, and agents accept **no liability whatsoever** for any loss, damage, or adverse outcome arising from decisions made in reliance on any figure, estimate, or valuation produced by tools or calculators on this website. A formal on-site assessment by a qualified professional is required before any financial, investment, or commercial decision is made.

### 3. Energy Savings & Yield Projections
Electricity tariff escalation rates, solar irradiance yields, system performance ratios, and installed cost benchmarks used in calculations are based on data and sources current at the time of publication. These figures are subject to regulatory change, market fluctuations, and site-specific variation. Actual results may differ materially from any estimate provided.

### 4. Project Results & Case Studies
Portfolio projects, case studies, and statistics published on this website reflect actual past outcomes for specific projects under specific conditions. They are presented for illustrative purposes only and do not guarantee similar results for future projects or clients.

### 5. No Professional Relationship
Use of this website, including submission of the contact form or completion of the Solar Asset Valuation Tool, does not establish a professional advisory, contractual, or fiduciary relationship between you and Phoenix Energy Solutions (Pty) Ltd. Any formal engagement is subject to a separate written agreement.

### 6. Seek Professional Advice
Before making any financial, investment, tax, or energy infrastructure decision, you should consult a qualified professional — including a registered financial advisor, professional engineer, or legal practitioner — as appropriate to your circumstances.

### 7. Contact
For any queries regarding this disclaimer: info@phoenixenergy.solutions

**Last updated: 8 May 2026**

---

## Footer Update

### Current state
Single "Legal" link in footer — points to a non-existent page.

### New state
Replace the single "Legal" link with three separate inline links:

```
Privacy Policy  ·  Terms of Use  ·  Disclaimer
```

**Implementation:** Read `src/components/layout/Footer.tsx`, find the "Legal" link, and replace with three `<Link>` elements pointing to `/privacy-policy`, `/terms-of-use`, and `/disclaimer`. Match existing footer link styling exactly.

---

## Sitemap Update

Add the three new routes to `src/app/sitemap.ts` STATIC array:

```typescript
{ url: `${SITE}/privacy-policy`, priority: 0.3, changeFrequency: 'yearly' },
{ url: `${SITE}/terms-of-use`,   priority: 0.3, changeFrequency: 'yearly' },
{ url: `${SITE}/disclaimer`,     priority: 0.3, changeFrequency: 'yearly' },
```

---

## No Tests Required
These are static content pages with no logic. TypeScript type safety and a build check are sufficient verification.

---

*Phoenix Energy Website v3.0 — Legal Pages Design Spec | 2026-05-08*
