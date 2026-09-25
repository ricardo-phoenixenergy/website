// src/components/ui/Button.tsx
// The site's button: a Next Link when `href` is set, otherwise a <button>
// (type="button" unless a form passes type="submit"). Variants, sizes and the
// class builder for pills inside card links are in buttonStyles.ts. It holds no
// state, so it has no 'use client' and server components render it directly.
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { buttonClasses, type ButtonStyle } from './buttonStyles';

type OwnProps = ButtonStyle & { children: ReactNode };
type AsButton = OwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonStyle | 'children'> & { href?: undefined };
type AsLink = OwnProps & Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonStyle | 'children'>;
export type ButtonProps = AsButton | AsLink;

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, vertical, size, className, children, ...linkProps } = props;
    return (
      <Link className={buttonClasses({ variant, vertical, size, className } as ButtonStyle)} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { variant, vertical, size, className, children, type = 'button', ...buttonProps } = props;
  return (
    <button
      type={type}
      className={buttonClasses({ variant, vertical, size, className } as ButtonStyle)}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
