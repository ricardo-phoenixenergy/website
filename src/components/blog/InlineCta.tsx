import { Button } from '@/components/ui/Button';

interface InlineCtaProps {
  title: string;
  subtitle?: string;
  btnText: string;
  btnHref: string;
}

export function InlineCta({ title, subtitle, btnText, btnHref }: InlineCtaProps) {
  const isExternal = btnHref.startsWith('http');
  return (
    // A dark block, so its focus ring turns white (focus-on-dark): the Deep Teal ring vanished on it.
    <div
      className="focus-on-dark my-6 rounded-[14px] p-5 text-center"
      style={{ background: '#39575C' }}
    >
      <p className="font-display font-extrabold text-base text-white leading-tight mb-1.5">
        {title}
      </p>
      {subtitle && (
        <p className="font-body text-xs mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {subtitle}
        </p>
      )}
      <Button
        variant="light"
        size="compact"
        href={btnHref}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {btnText}
      </Button>
    </div>
  );
}
