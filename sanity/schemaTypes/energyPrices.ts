import { defineType, defineField } from 'sanity';

/**
 * Singleton document — the energy & fuel prices that drive the EV Fleets
 * cost-per-km comparator. Edit these monthly (SA fuel prices change on the
 * first Wednesday). Surfaced as a single editable panel via the structure tool.
 */
export const energyPrices = defineType({
  name: 'energyPrices',
  title: 'Energy & Fuel Prices',
  type: 'document',
  fields: [
    defineField({
      name: 'dieselPricePerL',
      title: 'Diesel price (R / litre)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'petrol93PricePerL',
      title: 'Unleaded 93 petrol price (R / litre)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'gridPricePerKwh',
      title: 'Average grid electricity price (R / kWh)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'solarPricePerKwh',
      title: 'Average solar electricity price (R / kWh)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective from',
      type: 'date',
      description: 'The date these prices took effect (SA fuel prices change the 1st Wednesday monthly).',
    }),
    defineField({
      name: 'sourceLabel',
      title: 'Source label',
      type: 'string',
      description: 'Attribution shown under the widget, e.g. "Official DMRE price, inland (50 ppm)".',
    }),
  ],
  preview: {
    select: { diesel: 'dieselPricePerL', grid: 'gridPricePerKwh' },
    prepare: ({ diesel, grid }) => ({
      title: 'Energy & Fuel Prices',
      subtitle:
        [diesel != null ? `Diesel R${diesel}/L` : null, grid != null ? `Grid R${grid}/kWh` : null]
          .filter(Boolean)
          .join(' · ') || 'Not set',
    }),
  },
});
