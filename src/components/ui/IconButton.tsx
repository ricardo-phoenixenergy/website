// src/components/ui/IconButton.tsx
// A 44px round control whose only content is a glyph (20px): menu, close, the
// photo viewer, previous and next arrows, back and share. A Next Link when
// `href` is set, otherwise a <button type="button">. `label` is its accessible
// name, so it says what happens or where it goes ("Back to the previous question").
//   ghost    dark surfaces and photos (a translucent disc)
//   outline  light surfaces (a white disc with a hairline edge)
//   plain    inside another control's light surface, such as the navbar pill
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { iconButtonClasses, type IconButtonVariant } from './buttonStyles';

type OwnProps = {
  label: string;
  variant: IconButtonVariant;
  /** Layout only: position, margins, and flex-col for the menu bars. */
  className?: string;
  children: ReactNode;
};
type OwnKeys = keyof OwnProps | 'aria-label';
type AsButton = OwnProps & Omit<ComponentPropsWithoutRef<'button'>, OwnKeys> & { href?: undefined };
type AsLink = OwnProps & Omit<ComponentPropsWithoutRef<typeof Link>, OwnKeys>;
export type IconButtonProps = AsButton | AsLink;

export function IconButton(props: IconButtonProps) {
  if (props.href !== undefined) {
    const { label, variant, className, children, ...linkProps } = props;
    return (
      <Link aria-label={label} className={iconButtonClasses({ variant, className })} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { label, variant, className, children, type = 'button', ...buttonProps } = props;
  return (
    <button type={type} aria-label={label} className={iconButtonClasses({ variant, className })} {...buttonProps}>
      {children}
    </button>
  );
}
