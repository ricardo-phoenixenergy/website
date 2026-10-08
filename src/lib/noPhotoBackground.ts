// src/lib/noPhotoBackground.ts
// What stands in for a missing photo under white text (the post hero, the wide
// article card): the service accent at 27% fading into Night Teal, laid over
// Night Teal so the light accents (Soft Amber, Light Aqua, Sage) stay dark
// enough for white text. Without a service, plain Night Teal.
// src/lib/noPhotoBackground.test.ts checks white text at 4.5:1 on every accent.

/** A CSS `background` value. */
export function noPhotoBackground(accent?: string | null): string {
  return accent
    ? `linear-gradient(135deg, ${accent}44 0%, var(--color-pe-nav-dark) 100%), var(--color-pe-nav-dark)`
    : 'var(--color-pe-nav-dark)';
}
