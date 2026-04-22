import Link from 'next/link';

interface InlineCtaProps {
  title: string;
  subtitle?: string;
  btnText: string;
  btnHref: string;
}

export function InlineCta({ title, subtitle, btnText, btnHref }: InlineCtaProps) {
  const isExternal = btnHref.startsWith('http');
  return (
    <div
      className="my-6 rounded-[14px] p-5 text-center"
      style={{ background: '#39575C' }}
    >
      <p className="font-display font-extrabold text-[15px] text-white leading-tight mb-1.5">
        {title}
      </p>
      {subtitle && (
        <p className="font-body text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {subtitle}
        </p>
      )}
      {isExternal ? (
        <a
          href={btnHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-body font-semibold text-xs text-[#39575C] bg-white rounded-full px-5 py-2.5 transition-opacity hover:opacity-90"
        >
          {btnText}
        </a>
      ) : (
        <Link
          href={btnHref}
          className="inline-block font-body font-semibold text-xs text-[#39575C] bg-white rounded-full px-5 py-2.5 transition-opacity hover:opacity-90"
        >
          {btnText}
        </Link>
      )}
    </div>
  );
}
