import Link from 'next/link';
import { IconArrowRight } from '@/components/ui/Icons';

const STATS = [
  { value: '120+', label: 'Projects completed' },
  { value: '48 MW', label: 'Deployed' },
  { value: '12k t', label: 'CO₂ saved / yr' },
  { value: 'R380M', label: 'Client savings' },
];

function StatGrid({ light = false }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl p-3.5 flex flex-col gap-1"
          style={{
            background: light ? 'rgba(57,87,92,0.06)' : 'rgba(255,255,255,0.05)',
            border: light ? '1px solid rgba(57,87,92,0.1)' : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span
            className="font-display font-extrabold text-2xl leading-none"
            style={{ color: light ? '#39575C' : '#ffffff' }}
          >
            {stat.value}
          </span>
          <span
            className="font-body text-xs font-normal uppercase tracking-[0.08em]"
            style={{ color: light ? 'rgba(57,87,92,0.55)' : 'rgba(255,255,255,0.35)' }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Label({ n, title }: { n: string; title: string }) {
  return (
    <div className="page-container py-4 flex items-center gap-3">
      <span className="font-display font-extrabold text-xs text-[#39575C] bg-[#39575C]/10 rounded-full px-3 py-1">
        Option {n}
      </span>
      <span className="font-body text-sm font-semibold text-[#1A1A1A]">{title}</span>
    </div>
  );
}

export default function CTAPreviewPage() {
  return (
    <div className="bg-[#F5F5F5]">

      {/* Header */}
      <div className="page-container py-8 border-b border-[#E5E7EB]">
        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280] mb-1">Preview</p>
        <h1 className="font-display font-extrabold text-2xl text-[#1A1A1A]">CTA Banner Options</h1>
        <Link href="/" className="inline-flex items-center gap-1 font-body text-sm text-[#709DA9] mt-2 hover:underline">
          ← Back to site
        </Link>
      </div>

      {/* ── Option 1: Static Radial Glows ─────────────────────────────── */}
      <Label n="1" title="Static Radial Glows" />
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{ background: '#0d1f22' }}
      >
        {/* Static glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: 480, height: 480, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(112,157,169,0.18) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-15%', right: '5%',
            width: 560, height: 560, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(57,87,92,0.35) 0%, transparent 65%)',
          }} />
          <div style={{
            position: 'absolute', top: '20%', right: '20%',
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(163,198,181,0.10) 0%, transparent 70%)',
          }} />
        </div>
        <div className="page-container grid gap-10 md:grid-cols-2 md:items-center relative z-10">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Start today
            </p>
            <h2 className="font-display font-extrabold text-3xl text-white leading-[1.2] mb-4">
              Ignite what&apos;s possible for your business
            </h2>
            <p className="font-body text-sm leading-[1.75] mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Get a free energy assessment from Phoenix Energy&apos;s certified engineers — no commitment, no cost, results delivered in 48 hours.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-body font-semibold text-sm rounded-full px-5 py-2.5 bg-white text-[#0d1f22] hover:bg-[#F5F5F5] transition-colors"
            >
              Get a Free Quote <IconArrowRight size={13} />
            </Link>
          </div>
          <StatGrid />
        </div>
      </section>

      {/* ── Option 2: Dot Grid Overlay ────────────────────────────────── */}
      <Label n="2" title="Dot Grid Overlay" />
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{ background: '#0d1f22' }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Fade edges */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, #0d1f22 100%)',
        }} />
        <div className="page-container grid gap-10 md:grid-cols-2 md:items-center relative z-10">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Start today
            </p>
            <h2 className="font-display font-extrabold text-3xl text-white leading-[1.2] mb-4">
              Ignite what&apos;s possible for your business
            </h2>
            <p className="font-body text-sm leading-[1.75] mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Get a free energy assessment from Phoenix Energy&apos;s certified engineers — no commitment, no cost, results delivered in 48 hours.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-body font-semibold text-sm rounded-full px-5 py-2.5 bg-white text-[#0d1f22] hover:bg-[#F5F5F5] transition-colors"
            >
              Get a Free Quote <IconArrowRight size={13} />
            </Link>
          </div>
          <StatGrid />
        </div>
      </section>

      {/* ── Option 3: Flat Dark + Accent Bar ─────────────────────────── */}
      <Label n="3" title="Flat Dark + Teal Accent Bar" />
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{ background: '#0d1f22', borderTop: '3px solid #709DA9' }}
      >
        {/* Logo watermark */}
        <img
          src="/inverted-logo.png"
          alt=""
          aria-hidden
          className="absolute pointer-events-none select-none"
          style={{
            width: 'clamp(280px, 35vw, 480px)',
            right: '-4%',
            bottom: '-35%',
            opacity: 0.07,
          }}
        />
        <div className="page-container grid gap-10 md:grid-cols-2 md:items-center relative z-10">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: '#709DA9' }}>
              Start today
            </p>
            <h2 className="font-display font-extrabold text-3xl text-white leading-[1.2] mb-4">
              Ignite what&apos;s possible for your business
            </h2>
            <p className="font-body text-sm leading-[1.75] mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Get a free energy assessment from Phoenix Energy&apos;s certified engineers — no commitment, no cost, results delivered in 48 hours.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-body font-semibold text-sm rounded-full px-5 py-2.5 bg-white text-[#0d1f22] hover:bg-[#F5F5F5] transition-colors"
            >
              Get a Free Quote <IconArrowRight size={13} />
            </Link>
          </div>
          <StatGrid />
        </div>
      </section>

      {/* Mock footer to show watermark bleed */}
      <div className="bg-[#0d1f22] h-24 flex items-center page-container">
        <span className="font-body text-xs text-white/20">↑ Footer bleed preview</span>
      </div>

      {/* ── Option 4: Inverted / Light ────────────────────────────────── */}
      <Label n="4" title="Inverted (Light)" />
      <section className="py-16 md:py-24 bg-white" style={{ borderTop: '1px solid #E5E7EB' }}>
        <div className="page-container grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3 text-[#6B7280]">
              Start today
            </p>
            <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A] leading-[1.2] mb-4">
              Ignite what&apos;s{' '}
              <em style={{ color: '#709DA9', fontStyle: 'normal' }}>possible</em>{' '}
              for your business
            </h2>
            <p className="font-body text-sm leading-[1.75] mb-6 text-[#6B7280]">
              Get a free energy assessment from Phoenix Energy&apos;s certified engineers — no commitment, no cost, results delivered in 48 hours.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-body font-semibold text-sm rounded-full px-5 py-2.5 text-white transition-colors"
              style={{ background: '#39575C' }}
            >
              Get a Free Quote <IconArrowRight size={13} />
            </Link>
          </div>
          <StatGrid light />
        </div>
      </section>

      {/* ── Option 5: Option 3 — Centered, No Stats ──────────────────── */}
      <Label n="5" title="Flat Dark + Accent Bar — Centered, No Stats" />
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{ background: '#0d1f22', borderTop: '3px solid #709DA9' }}
      >
        {/* Logo watermark */}
        <img
          src="/inverted-logo.png"
          alt=""
          aria-hidden
          className="absolute pointer-events-none select-none"
          style={{
            width: 'clamp(280px, 35vw, 480px)',
            right: '-4%',
            bottom: '-25%',
            opacity: 0.07,
          }}
        />
        <div className="page-container relative z-10 text-center max-w-2xl mx-auto">
          <p className="font-body text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: '#709DA9' }}>
            Start today
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-[1.2] mb-4">
            Ignite what&apos;s possible for your business
          </h2>
          <p className="font-body text-sm leading-[1.75] mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Get a free energy assessment from Phoenix Energy&apos;s certified engineers — no commitment, no cost, results delivered in 48 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-body font-semibold text-sm rounded-full px-6 py-3 bg-white text-[#0d1f22] hover:bg-[#F5F5F5] transition-colors"
          >
            Get a Free Quote <IconArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Mock footer to show watermark bleed */}
      <div className="bg-[#0d1f22] h-24 flex items-center page-container">
        <span className="font-body text-xs text-white/20">↑ Footer bleed preview</span>
      </div>

      <div className="h-16 bg-[#F5F5F5]" />
    </div>
  );
}
