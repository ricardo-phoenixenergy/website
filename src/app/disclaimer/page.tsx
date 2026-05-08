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

        {/* Amber callout banner */}
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
