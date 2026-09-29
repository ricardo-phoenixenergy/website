// src/components/layout/JsonLd.tsx
// The one place every page renders structured data, so it always goes through
// serializeJsonLd (src/lib/jsonLd.ts): CMS text holding "</script>" can never
// close the tag early. It holds no state and no listener, so it renders the
// same way on the server or inside a 'use client' file, such as FaqAccordion.tsx.
import { serializeJsonLd } from '@/lib/jsonLd';

interface JsonLdProps {
  data: unknown;
}

export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
