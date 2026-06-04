import { defineType, defineField } from 'sanity';

/**
 * Singleton holding the per-vertical hero images, used in the home-page
 * HeroAccordion and on each solution page hero. Edited via the "Hero Images"
 * panel in sanity.config.ts. A missing image falls back to the page's gradient.
 */
const verticalField = (name: string, title: string) =>
  defineField({ name, title, type: 'image', options: { hotspot: true } });

export const heroImages = defineType({
  name: 'heroImages',
  title: 'Hero Images',
  type: 'document',
  fields: [
    verticalField('ciSolarStorage', 'C&I Solar & Storage'),
    verticalField('wheeling', 'Wheeling'),
    verticalField('energyOptimisation', 'Energy Optimisation'),
    verticalField('carbonCredits', 'Carbon Credits'),
    verticalField('webuysolar', 'WeBuySolar'),
    verticalField('evFleets', 'EV Fleets'),
  ],
  preview: { prepare: () => ({ title: 'Hero Images' }) },
});
