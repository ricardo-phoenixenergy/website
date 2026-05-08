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
