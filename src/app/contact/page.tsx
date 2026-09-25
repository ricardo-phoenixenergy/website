import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/sections/ContactForm';
import { NextSteps } from '@/components/ui/NextSteps';
import { IconMail, IconPhone, IconMapPin, IconLinkedIn } from '@/components/ui/Icons';
import { CONTACT, CONTACT_NEXT_STEPS, REPLY_PROMISE } from '@/config/contact';

export const metadata: Metadata = {
  // The root template adds "| Phoenix Energy", so the brand appears once.
  title: 'Contact Us',
  description:
    'Reach out to Phoenix Energy to discuss C&I solar, wheeling, carbon credits, EV fleets and more. Free energy assessments for Southern African businesses.',
  alternates: { canonical: 'https://phoenixenergy.solutions/contact' },
  openGraph: {
    title: 'Contact Phoenix Energy',
    description: 'Reach out to Phoenix Energy to discuss C&I solar, wheeling, carbon credits, EV fleets and more.',
    url: 'https://phoenixenergy.solutions/contact',
    images: [{ url: 'https://phoenixenergy.solutions/og-default.png', width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return (
    <>
    <div className="bg-pe-bg min-h-screen">
      <div className="page-container pt-24 pb-16">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-body text-sm text-pe-muted mb-6">
          <Link href="/" className="hover:text-pe-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="font-semibold text-pe-primary">Contact</span>
        </nav>

        {/* Page header */}
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-2">
          Get in touch
        </p>
        <h1 className="font-display font-extrabold text-4xl text-pe-text leading-[1.2] mb-3">
          Let&apos;s build something{' '}
          <em className="not-italic text-pe-secondary-ink">together</em>
        </h1>
        <p className="font-body text-base text-pe-muted leading-[1.7] mb-10 max-w-lg">
          Tell us how you&apos;d like to work with Phoenix Energy and we&apos;ll connect you with the right person.
        </p>

        {/* Two-column grid — stacks on mobile, side-by-side on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* Left — form */}
          <ContactForm />

          {/* Right — info cards */}
          <div className="flex flex-col gap-4">

            {/* Contact info card */}
            <div className="focus-on-dark rounded-2xl p-6" style={{ background: '#0d1f22' }}>
              <p
                className="font-body text-lg font-bold uppercase tracking-[0.14em] mb-4"
                style={{ color: 'var(--color-on-dark-subtle)' }}
                
              >
                Contact details
              </p>
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: <IconMail size={17} />,
                    label: 'Email',
                    value: CONTACT.email,
                    href: `mailto:${CONTACT.email}`,
                    sub: REPLY_PROMISE.sentence,
                  },
                  {
                    icon: <IconPhone size={17} />,
                    label: 'Phone',
                    value: CONTACT.phone,
                    href: CONTACT.phoneHref,
                    sub: CONTACT.phoneHours,
                  },
                  {
                    icon: <IconMapPin size={17} />,
                    label: 'Head Office',
                    value: 'The Colosseum, Century City',
                    sub: '1st Floor, Foyer 3, Cape Town, 7441',
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.07)', color: '#F5F5F5' }}
                    >
                      {row.icon}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-body text-xs uppercase tracking-[0.07em] mb-0.5"
                        style={{ color: 'var(--color-on-dark-subtle)' }}
                      >
                        {row.label}
                      </p>
                      <p className="font-display font-semibold text-base text-white [overflow-wrap:anywhere]">
                        {/* Email and phone open the mail app or the dialler with one tap. */}
                        {row.href ? (
                          <a
                            href={row.href}
                            className="underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                          >
                            {row.value}
                          </a>
                        ) : (
                          row.value
                        )}
                      </p>
                      <p
                        className="font-body text-xs mt-0.5"
                        style={{ color: 'var(--color-on-dark-subtle)' }}
                      >
                        {row.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What happens next: the reply promise and the steps after sending */}
            <NextSteps steps={CONTACT_NEXT_STEPS} headingAs="h2" variant="card" />

            {/* Connect With Us card */}
            <div className="rounded-2xl p-6 bg-white" style={{ border: '1px solid #E5E7EB' }}>
              <p
                className="font-body text-xs font-bold uppercase tracking-[0.14em] text-pe-muted mb-4"
              >
                Connect with us
              </p>
              <Link
                href="https://www.linkedin.com/company/phoenix-energy-solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                  style={{ background: '#EBF4F6', color: '#39575C' }}
                >
                  <IconLinkedIn size={18} />
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-pe-text group-hover:text-pe-primary transition-colors duration-200">
                    Phoenix Energy Solutions
                  </p>
                  <p className="font-body text-xs text-pe-muted">Follow us on LinkedIn</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  );
}
