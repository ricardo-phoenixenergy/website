// src/lib/jsonLd.ts
// Escaping for every structured-data script on the site, so CMS text
// containing "</script>" can't close the tag early. Rendered through the
// JsonLd component (src/components/layout/JsonLd.tsx).

/** JSON for a structured-data script, with "<" escaped so text from the CMS can't close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
