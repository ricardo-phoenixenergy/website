// src/lib/contactLink.ts

type Intent = 'client' | 'partner' | 'investor';

/**
 * A link to the contact form that opens at step 2 with the visitor's own
 * answers already in the message, so a tool result never has to be retyped.
 */
export function contactHref(message: string, intent: Intent = 'client'): string {
  const params = new URLSearchParams({ intent, message });
  return `/contact?${params.toString()}`;
}
