// src/components/ui/TextButton.tsx
// A quiet action that reads as text, such as "Start over" on the tool cards:
// 12px on-dark-subtle, white on hover, in a box at least 44px tall, so it keeps
// its low emphasis and still has a full-size target. Always a <button>
// (type="button"). Its colour is for the dark tool cards; the classes are
// textButtonClasses() in buttonStyles.ts.
import type { ComponentPropsWithoutRef } from 'react';
import { textButtonClasses } from './buttonStyles';

export type TextButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'className'> & {
  /** Layout only: w-full, mt-*, self-*. */
  className?: string;
};

export function TextButton({ className, type = 'button', ...buttonProps }: TextButtonProps) {
  return <button type={type} className={textButtonClasses({ className })} {...buttonProps} />;
}
