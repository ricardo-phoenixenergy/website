import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to "Month D, YYYY" */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Format a number as South African Rand (compact) */
export function formatRand(value: number): string {
  if (value >= 1_000_000) {
    return `R${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `R${(value / 1_000).toFixed(0)}k`;
  }
  return `R${value.toLocaleString('en-ZA')}`;
}

/** Estimate blog post read time from portable-text body */
export function estimateReadTime(body: unknown[]): number {
  const wordCount = JSON.stringify(body).split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
