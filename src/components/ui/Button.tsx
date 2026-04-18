'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

type BaseProps = {
  variant?: 'primary' | 'light' | 'ghost' | 'outline';
  className?: string;
  children: React.ReactNode;
};

type AsButton = BaseProps & ComponentPropsWithoutRef<'button'> & { href?: undefined };
type AsLink = BaseProps & { href: string; target?: string; rel?: string };
type ButtonProps = AsButton | AsLink;

const variants: Record<NonNullable<BaseProps['variant']>, string> = {
  // teal fill — for light-background sections
  primary:
    'bg-[#39575C] text-white hover:bg-[#2a4045] active:scale-[0.98]',
  // light fill — for dark-background sections (hero, CTA banner)
  light:
    'bg-[#F5F5F5] text-[#0d1f22] hover:bg-white active:scale-[0.98]',
  // translucent dark-bg ghost
  ghost:
    'bg-white/[0.08] border border-white/20 text-white hover:bg-white/[0.14] active:scale-[0.98]',
  // teal border outline — for light sections
  outline:
    'border border-[#39575C] text-[#39575C] hover:bg-[#39575C]/[0.06] active:scale-[0.98]',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-body text-[0.8125rem] font-semibold leading-none transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-50';

export function Button(props: ButtonProps) {
  const { variant = 'primary', className, children, ...rest } = props;
  const cls = cn(base, variants[variant], className);

  if ('href' in props && props.href !== undefined) {
    const { href, target, rel, ...linkRest } = rest as AsLink;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={cls}
        {...(linkRest as object)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {children}
    </button>
  );
}
