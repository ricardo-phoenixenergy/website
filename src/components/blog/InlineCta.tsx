// src/components/blog/InlineCta.tsx
// A call to action inside the article: a Night Teal block with an 18px title,
// a 14px line in on-dark-muted and the light compact button. The title is a
// paragraph, not a heading, so the outline stays the author's. The block is
// dark, so its focus ring turns white (focus-on-dark): a Deep Teal ring vanished on it.
import { Button } from '@/components/ui/Button';
import { IconArrowRight } from '@/components/ui/Icons';

interface InlineCtaProps {
  title: string;
  subtitle?: string;
  btnText: string;
  btnHref: string;
}

export function InlineCta({ title, subtitle, btnText, btnHref }: InlineCtaProps) {
  const isExternal = btnHref.startsWith('http');
  return (
    <div className="focus-on-dark my-8 rounded-card bg-pe-nav-dark px-6 py-7 text-center">
      <p className="font-display text-lg font-bold leading-[1.3] text-white">{title}</p>
      {subtitle && <p className="mx-auto mt-2 max-w-[48ch] font-body text-sm leading-[1.6] text-on-dark-muted">{subtitle}</p>}
      <Button
        variant="light"
        size="compact"
        href={btnHref}
        className="mt-5"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {btnText} <IconArrowRight />
      </Button>
    </div>
  );
}
