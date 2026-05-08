# Legal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create three static legal pages (Privacy Policy, Terms of Use, Disclaimer), update the Footer to link to all three correctly, and add the routes to the sitemap.

**Architecture:** Each legal page is a plain Next.js App Router server component — no CMS, no client state. Content lives directly in the TSX file. The Footer has two instances of the legal link row (desktop + mobile) that both need updating. All five tasks are independent except Task 5 (build check) which runs last.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS · `next/link` · `next/navigation` (Metadata)

---

## File Map

| Action | File |
|---|---|
| Create | `src/app/privacy-policy/page.tsx` |
| Create | `src/app/terms-of-use/page.tsx` |
| Create | `src/app/disclaimer/page.tsx` |
| Modify | `src/components/layout/Footer.tsx` |
| Modify | `src/app/sitemap.ts` |

---

## Task 1: Privacy Policy Page

**Files:**
- Create: `src/app/privacy-policy/page.tsx`

- [ ] **Step 1: Create the file with the full page content**

Create `src/app/privacy-policy/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Phoenix Energy',
  description:
    'How Phoenix Energy Solutions (Pty) Ltd collects, uses and protects your personal information in accordance with POPIA.',
  alternates: { canonical: 'https://phoenixenergy.solutions/privacy-policy' },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 first:mt-0">
      <h2
        className="font-display font-bold mb-3"
        style={{ fontSize: '15px', color: '#1A1A1A' }}
      >
        {title}
      </h2>
      <div
        className="font-body space-y-3"
        style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8' }}
      >
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#F5F5F5] min-h-screen">
      <div className="page-container pt-24 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 font-body text-sm text-[#6B7280] mb-6">
          <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#39575C]">Privacy Policy</span>
        </nav>

        {/* Page header */}
        <div className="max-w-[760px] mx-auto mb-8">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
            Legal
          </p>
          <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.2] mb-3">
            Privacy Policy
          </h1>
          <p className="font-body text-base text-[#6B7280] leading-[1.75]">
            How we collect, use and protect your personal information.
          </p>
        </div>

        {/* Content card */}
        <div
          className="max-w-[760px] mx-auto rounded-[18px] p-10"
          style={{ background: '#fff', border: '1px solid #E5E7EB' }}
        >
          <Section title="1. Who We Are">
            <p>
              This website is operated by <strong>Phoenix Energy Solutions (Pty) Ltd</strong>,
              registration number 2024/051881/07, VAT number 4690322500, with its registered
              office at 1st Floor, Foyer 3, The Colosseum, Century Way, Century City,
              Cape Town, 7441, South Africa. You can reach us at{' '}
              <a
                href="mailto:info@phoenixenergy.solutions"
                className="text-[#39575C] hover:underline"
              >
                info@phoenixenergy.solutions
              </a>
              .
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="2. What Personal Information We Collect">
            <p>We collect personal information in the following contexts:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Contact form:</strong> first name, last name, email address, phone
                number, company name, location, and an optional message
              </li>
              <li>
                <strong>Solar Asset Valuation Tool:</strong> first name, last name, email
                address, phone number, and system details (installed kWp, installation year,
                battery capacity, province)
              </li>
              <li>
                <strong>Website usage data:</strong> pages visited, session duration, device
                type, and browser — collected anonymously via Google Analytics
              </li>
            </ul>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="3. Why We Collect Your Information">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To respond to enquiries and connect you with the appropriate specialist</li>
              <li>
                To provide an indicative solar asset valuation and follow up with a formal offer
              </li>
              <li>To improve the performance and content of our website</li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or share your personal information with third parties for
              their own marketing purposes.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="4. POPIA Compliance">
            <p>
              We process personal information lawfully in accordance with the{' '}
              <strong>Protection of Personal Information Act 4 of 2013 (POPIA)</strong>. You
              have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>
                Request deletion of your information (subject to legal retention requirements)
              </li>
              <li>Object to the processing of your information</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{' '}
              <a
                href="mailto:info@phoenixenergy.solutions"
                className="text-[#39575C] hover:underline"
              >
                info@phoenixenergy.solutions
              </a>
              .
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="5. Third-Party Processors">
            <p>
              We use the following third-party services to operate this website. Each is bound
              by their own privacy policies:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li><strong>Resend</strong> — email delivery of form submissions</li>
              <li><strong>Sanity</strong> — headless CMS for website content</li>
              <li>
                <strong>Google Analytics / Google Tag Manager</strong> — anonymised website
                usage analytics
              </li>
              <li>
                <strong>Google reCAPTCHA</strong> — spam and bot prevention on forms
              </li>
            </ul>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="6. Cookies &amp; Analytics">
            <p>
              This website uses cookies placed by Google Analytics (via Google Tag Manager) to
              collect anonymised data including pages visited, session duration, and device
              type. No personally identifiable information is transmitted to Google.
            </p>
            <p className="mt-3">You can opt out by:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Adjusting your browser settings to block cookies</li>
              <li>
                Using the{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#39575C] hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
            </ul>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="7. Data Retention">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Enquiry and valuation data: retained for 3 years from the date of submission
              </li>
              <li>Anonymised analytics data: retained indefinitely in aggregated form</li>
            </ul>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The effective date at the
              bottom of this page reflects the most recent revision. Continued use of the
              website after changes are published constitutes acceptance of the updated policy.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="9. Contact">
            <p>
              For any privacy-related queries, contact us at{' '}
              <a
                href="mailto:info@phoenixenergy.solutions"
                className="text-[#39575C] hover:underline"
              >
                info@phoenixenergy.solutions
              </a>
              .
            </p>
          </Section>

          <p
            className="font-body mt-10 pt-6"
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            Last updated: 8 May 2026
          </p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify the file was created**

Check that `src/app/privacy-policy/page.tsx` exists and opens without TypeScript errors in your editor.

- [ ] **Step 3: Commit**

```bash
git add src/app/privacy-policy/page.tsx
git commit -m "feat(legal): add Privacy Policy page"
```

---

## Task 2: Terms of Use Page

**Files:**
- Create: `src/app/terms-of-use/page.tsx`

- [ ] **Step 1: Create the file with the full page content**

Create `src/app/terms-of-use/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use | Phoenix Energy',
  description: 'Terms and conditions governing your use of the Phoenix Energy website.',
  alternates: { canonical: 'https://phoenixenergy.solutions/terms-of-use' },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 first:mt-0">
      <h2
        className="font-display font-bold mb-3"
        style={{ fontSize: '15px', color: '#1A1A1A' }}
      >
        {title}
      </h2>
      <div
        className="font-body space-y-3"
        style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8' }}
      >
        {children}
      </div>
    </div>
  );
}

export default function TermsOfUsePage() {
  return (
    <main className="bg-[#F5F5F5] min-h-screen">
      <div className="page-container pt-24 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 font-body text-sm text-[#6B7280] mb-6">
          <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#39575C]">Terms of Use</span>
        </nav>

        {/* Page header */}
        <div className="max-w-[760px] mx-auto mb-8">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
            Legal
          </p>
          <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.2] mb-3">
            Terms of Use
          </h1>
          <p className="font-body text-base text-[#6B7280] leading-[1.75]">
            Please read these terms carefully before using our website.
          </p>
        </div>

        {/* Content card */}
        <div
          className="max-w-[760px] mx-auto rounded-[18px] p-10"
          style={{ background: '#fff', border: '1px solid #E5E7EB' }}
        >
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using this website, you agree to be bound by these Terms of Use
              and our{' '}
              <Link href="/privacy-policy" className="text-[#39575C] hover:underline">
                Privacy Policy
              </Link>
              . If you do not agree with any part of these terms, please discontinue use of
              the website immediately.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="2. About Us">
            <p>
              This website is operated by <strong>Phoenix Energy Solutions (Pty) Ltd</strong>,
              registration number 2024/051881/07, VAT number 4690322500, incorporated under
              the laws of the Republic of South Africa, with its registered office at 1st
              Floor, Foyer 3, The Colosseum, Century Way, Century City, Cape Town, 7441.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="3. Intellectual Property">
            <p>
              All content on this website — including text, graphics, logos, icons, images,
              data, and software — is the property of Phoenix Energy Solutions (Pty) Ltd and
              is protected by South African copyright law and applicable international treaties.
            </p>
            <p>
              No content may be reproduced, distributed, transmitted, displayed, published, or
              broadcast in any form without the prior written consent of Phoenix Energy
              Solutions (Pty) Ltd.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="4. Permitted Use">
            <p>
              You may use this website for lawful personal or business purposes only. You may
              not:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>
                Scrape, crawl, or harvest data from the website using automated tools
              </li>
              <li>
                Attempt to gain unauthorised access to any part of the website or its
                underlying infrastructure
              </li>
              <li>
                Use the website in any way that could damage, disable, overburden, or impair
                its operation
              </li>
              <li>
                Reproduce or redistribute any content for commercial purposes without prior
                written permission
              </li>
            </ul>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="5. Third-Party Links">
            <p>
              This website may contain links to third-party websites. These links are provided
              for your convenience only. Phoenix Energy Solutions (Pty) Ltd has no control
              over, and accepts no responsibility for, the content, privacy practices, or
              availability of any linked third-party site.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="6. Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, Phoenix Energy Solutions
              (Pty) Ltd, its directors, employees, and agents shall not be liable for any
              direct, indirect, incidental, consequential, special, or punitive damages arising
              from your use of, or inability to use, this website or any content contained
              herein.
            </p>
            <p>
              This includes, without limitation, any loss of data, loss of revenue or profits,
              or business interruption, even if Phoenix Energy Solutions (Pty) Ltd has been
              advised of the possibility of such damages.
            </p>
            <p>
              Please also review our{' '}
              <Link href="/disclaimer" className="text-[#39575C] hover:underline">
                Disclaimer
              </Link>{' '}
              regarding the accuracy of calculators and financial estimates.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="7. Changes to These Terms">
            <p>
              We reserve the right to amend these Terms of Use at any time without prior
              notice. The effective date shown at the bottom of this page reflects the date of
              the most recent revision. Your continued use of the website following any changes
              constitutes your acceptance of the updated terms.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="8. Governing Law">
            <p>
              These Terms of Use are governed by and construed in accordance with the laws of
              the Republic of South Africa. Any disputes arising out of or in connection with
              these terms shall be subject to the exclusive jurisdiction of the competent
              courts of South Africa.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="9. Contact">
            <p>
              For any queries regarding these terms, contact us at{' '}
              <a
                href="mailto:info@phoenixenergy.solutions"
                className="text-[#39575C] hover:underline"
              >
                info@phoenixenergy.solutions
              </a>
              .
            </p>
          </Section>

          <p
            className="font-body mt-10 pt-6"
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            Last updated: 8 May 2026
          </p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/terms-of-use/page.tsx
git commit -m "feat(legal): add Terms of Use page"
```

---

## Task 3: Disclaimer Page

**Files:**
- Create: `src/app/disclaimer/page.tsx`

- [ ] **Step 1: Create the file with the full page content**

Create `src/app/disclaimer/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer | Phoenix Energy',
  description:
    'Important disclaimers regarding the accuracy of calculators, financial estimates, and information published on the Phoenix Energy website.',
  alternates: { canonical: 'https://phoenixenergy.solutions/disclaimer' },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 first:mt-0">
      <h2
        className="font-display font-bold mb-3"
        style={{ fontSize: '15px', color: '#1A1A1A' }}
      >
        {title}
      </h2>
      <div
        className="font-body space-y-3"
        style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.8' }}
      >
        {children}
      </div>
    </div>
  );
}

export default function DisclaimerPage() {
  return (
    <main className="bg-[#F5F5F5] min-h-screen">
      <div className="page-container pt-24 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 font-body text-sm text-[#6B7280] mb-6">
          <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#39575C]">Disclaimer</span>
        </nav>

        {/* Page header */}
        <div className="max-w-[760px] mx-auto mb-8">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
            Legal
          </p>
          <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.2] mb-3">
            Disclaimer
          </h1>
          <p className="font-body text-base text-[#6B7280] leading-[1.75]">
            Important information about the accuracy of content, calculators, and estimates
            on this website.
          </p>
        </div>

        {/* Callout banner */}
        <div
          className="max-w-[760px] mx-auto rounded-[14px] p-5 mb-6 flex gap-3"
          style={{
            background: 'rgba(227,197,141,0.10)',
            border: '1px solid rgba(227,197,141,0.35)',
          }}
        >
          <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
          <p
            className="font-body"
            style={{ fontSize: '13px', color: '#6b4e10', lineHeight: '1.7' }}
          >
            All calculators, financial estimates, and projections on this website are
            indicative only. They do not constitute professional financial or engineering
            advice. Please read the full disclaimer below before relying on any figure
            presented on this site.
          </p>
        </div>

        {/* Content card */}
        <div
          className="max-w-[760px] mx-auto rounded-[18px] p-10"
          style={{ background: '#fff', border: '1px solid #E5E7EB' }}
        >
          <Section title="1. General Information Only">
            <p>
              The information published on this website is provided for general informational
              purposes only. It does not constitute professional financial, legal, engineering,
              or investment advice. Phoenix Energy Solutions (Pty) Ltd makes no representation
              that the information on this site is appropriate, accurate, or applicable to your
              specific circumstances.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="2. Calculator &amp; Tool Accuracy">
            <p>
              <strong>
                The Solar Asset Valuation Tool and all other calculators, savings estimates,
                financial projections, yield models, and metrics presented on this website are
                indicative only.
              </strong>
            </p>
            <p>
              These tools are based on publicly available market data, industry averages,
              regional solar yield benchmarks, and modelling assumptions current at the time of
              publication. They are intended to provide a general directional estimate and
              should not be relied upon as an accurate reflection of any specific system,
              project, or transaction.
            </p>
            <p>
              <strong>
                Phoenix Energy Solutions (Pty) Ltd, its directors, employees, and agents
                accept no liability whatsoever for any loss, damage, or adverse outcome arising
                from decisions made in reliance on any figure, estimate, or valuation produced
                by tools or calculators on this website.
              </strong>{' '}
              A formal on-site assessment by a qualified professional is required before any
              financial, investment, or commercial decision is made.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="3. Energy Savings &amp; Yield Projections">
            <p>
              Electricity tariff escalation rates, solar irradiance yields, system performance
              ratios, and installed cost benchmarks used in calculations are based on data and
              sources current at the time of publication. These figures are subject to
              regulatory change, market fluctuations, and site-specific variation.
            </p>
            <p>
              Actual energy savings, yields, and financial returns may differ materially from
              any estimate provided on this website.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="4. Project Results &amp; Case Studies">
            <p>
              Portfolio projects, case studies, and statistics published on this website reflect
              actual past outcomes for specific projects under specific conditions. They are
              presented for illustrative purposes only and do not guarantee similar results for
              future projects or clients. Past performance is not indicative of future outcomes.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="5. No Professional Relationship">
            <p>
              Use of this website — including submission of the contact form or completion of
              the Solar Asset Valuation Tool — does not establish a professional advisory,
              contractual, or fiduciary relationship between you and Phoenix Energy Solutions
              (Pty) Ltd. Any formal engagement is subject to a separate written agreement
              signed by both parties.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="6. Seek Professional Advice">
            <p>
              Before making any financial, investment, tax, or energy infrastructure decision,
              you should consult a qualified professional — including a registered financial
              advisor, professional engineer, or legal practitioner — as appropriate to your
              specific circumstances.
            </p>
          </Section>

          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '32px' }} />

          <Section title="7. Contact">
            <p>
              For any queries regarding this disclaimer, contact us at{' '}
              <a
                href="mailto:info@phoenixenergy.solutions"
                className="text-[#39575C] hover:underline"
              >
                info@phoenixenergy.solutions
              </a>
              .
            </p>
          </Section>

          <p
            className="font-body mt-10 pt-6"
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            Last updated: 8 May 2026
          </p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/disclaimer/page.tsx
git commit -m "feat(legal): add Disclaimer page"
```

---

## Task 4: Footer Update

**Files:**
- Modify: `src/components/layout/Footer.tsx`

The footer currently has two link rows (desktop + mobile) each with:
- `href="/privacy"` labelled "Privacy Policy" — wrong path, needs `/privacy-policy`
- `href="/legal"` labelled "Legal" — replace with "Terms of Use" + "Disclaimer"

- [ ] **Step 1: Read the current Footer**

Open `src/components/layout/Footer.tsx` and locate both link row blocks. They look like:

```tsx
<div className="flex items-center gap-3.5">
  <Link href="/privacy" className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
    Privacy Policy
  </Link>
  <Link href="/legal" className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
    Legal
  </Link>
</div>
```

There are **two** of these blocks — one in the desktop row and one in the mobile row. Both must be updated.

- [ ] **Step 2: Replace both link blocks**

In both occurrences, replace the existing two-link block with these three links:

```tsx
<div className="flex items-center gap-3.5">
  <Link
    href="/privacy-policy"
    className="font-body text-xs"
    style={{ color: 'rgba(255,255,255,0.35)' }}
  >
    Privacy Policy
  </Link>
  <Link
    href="/terms-of-use"
    className="font-body text-xs"
    style={{ color: 'rgba(255,255,255,0.35)' }}
  >
    Terms of Use
  </Link>
  <Link
    href="/disclaimer"
    className="font-body text-xs"
    style={{ color: 'rgba(255,255,255,0.35)' }}
  >
    Disclaimer
  </Link>
</div>
```

- [ ] **Step 3: Verify both occurrences were updated**

Search the file for `/privacy` and `/legal` — neither should appear anymore.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(legal): update footer with Privacy Policy, Terms of Use and Disclaimer links"
```

---

## Task 5: Sitemap Update

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Read the current sitemap**

Open `src/app/sitemap.ts` and find the `STATIC` array. It ends with:

```typescript
  { url: `${SITE}/tools/solar-valuation`, priority: 0.7, changeFrequency: 'monthly' },
];
```

- [ ] **Step 2: Add the three legal routes**

Append the three new routes before the closing `];`:

```typescript
  { url: `${SITE}/tools/solar-valuation`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${SITE}/privacy-policy`,        priority: 0.3, changeFrequency: 'yearly' as const },
  { url: `${SITE}/terms-of-use`,          priority: 0.3, changeFrequency: 'yearly' as const },
  { url: `${SITE}/disclaimer`,            priority: 0.3, changeFrequency: 'yearly' as const },
];
```

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): add legal pages to sitemap"
```

---

## Task 6: Build Verification + Push

**Files:** none (diagnostic + git)

- [ ] **Step 1: Run the production build**

```powershell
cd "C:\Users\ricar\OneDrive\Desktop\Phoenix Energy\Phoenix Website V3\website\phoenix-energy"
npm run build
```

Expected: `✓ Compiled successfully`. The three new routes (`/privacy-policy`, `/terms-of-use`, `/disclaimer`) should appear in the route table as Static pages.

If build fails: fix the TypeScript error reported, re-run until clean.

- [ ] **Step 2: Push all commits**

```bash
git push origin main
```

Expected: all 5 commits pushed. Vercel deploys automatically.

- [ ] **Step 3: Verify live**

After Vercel deploys (~1 min), check:
- `https://phoenixenergy.solutions/privacy-policy` — loads correctly
- `https://phoenixenergy.solutions/terms-of-use` — loads correctly
- `https://phoenixenergy.solutions/disclaimer` — loads correctly
- Footer on any page shows three links: Privacy Policy · Terms of Use · Disclaimer, all pointing to the correct routes

---

*Phoenix Energy Website v3.0 — Legal Pages Plan | 2026-05-08*
