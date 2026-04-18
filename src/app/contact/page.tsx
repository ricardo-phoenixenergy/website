import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/sections/ContactForm';
import { SOLUTION_META, SOLUTION_VERTICALS } from '@/types/solutions';
import { IconMail, IconPhone, IconMapPin, IconClipboardCheck } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Contact Phoenix Energy — Get a Free Energy Assessment',
  description:
    'Reach out to Phoenix Energy to discuss C&I solar, wheeling, carbon credits, EV fleets and more. Free energy assessments for Southern African businesses.',
  alternates: { canonical: 'https://phoenixenergy.solutions/contact' },
};

export default function ContactPage() {
  return (
    <main className="bg-[#F5F5F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 font-body text-sm text-[#6B7280] mb-6">
          <Link href="/" className="hover:text-[#39575C] transition-colors">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#39575C]">Contact</span>
        </nav>

        {/* Page header */}
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-2">
          Get in touch
        </p>
        <h1 className="font-display font-extrabold text-4xl text-[#1A1A1A] leading-[1.2] mb-3">
          Let&apos;s build something{' '}
          <em style={{ color: '#709DA9', fontStyle: 'normal' }}>together</em>
        </h1>
        <p className="font-body text-base text-[#6B7280] leading-[1.7] mb-10 max-w-lg">
          Tell us how you&apos;d like to work with Phoenix Energy and we&apos;ll connect you with the right person.
        </p>

        {/* Two-column grid — stacks on mobile, side-by-side on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* Left — form */}
          <ContactForm />

          {/* Right — info cards */}
          <div className="flex flex-col gap-4">

            {/* Contact info card */}
            <div className="rounded-2xl p-6 bg-[#39575C]">
              <p
                className="font-body text-lg font-bold uppercase tracking-[0.14em] mb-4"
                style={{ color: '#F5F5F5' }}
              >
                Contact details
              </p>
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: <IconMail size={17} />,
                    label: 'Email',
                    value: 'info@phoenixenergy.solutions',
                    sub: 'We respond within 1 business day',
                  },
                  {
                    icon: <IconPhone size={17} />,
                    label: 'Phone',
                    value: '+27 79 892 8197',
                    sub: 'Mon–Fri, 08:00–17:00 SAST',
                  },
                  {
                    icon: <IconMapPin size={17} />,
                    label: 'Location',
                    value: 'South Africa',
                    sub: 'Serving Southern Africa & beyond',
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.07)', color: '#F5F5F5' }}
                    >
                      {row.icon}
                    </div>
                    <div>
                      <p
                        className="font-body text-xs uppercase tracking-[0.07em] mb-0.5"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                      >
                        {row.label}
                      </p>
                      <p className="font-display font-semibold text-base text-white">{row.value}</p>
                      <p
                        className="font-body text-xs mt-0.5"
                        style={{ color: 'rgba(255,255,255,0.45)' }}
                      >
                        {row.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            

          </div>
        </div>
      </div>
    </main>
  );
}
