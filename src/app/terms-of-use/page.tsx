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
