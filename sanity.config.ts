import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'phoenix-energy',
  title: 'Phoenix Energy',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.documentTypeListItem('blogPost').title('Blog Posts'),
                    S.documentTypeListItem('author').title('Authors'),
                  ]),
              ),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.divider(),
            S.documentTypeListItem('teamMember').title('Team Members'),
            S.divider(),
            S.documentTypeListItem('milestoneTimeline').title('Timeline Milestones'),
            S.divider(),
            S.documentTypeListItem('partner').title('Partners & Investors'),
            S.divider(),
            S.listItem()
              .title('Company Stats')
              .id('companyStats')
              .child(
                S.document().schemaType('companyStats').documentId('companyStats'),
              ),
            S.divider(),
            S.listItem()
              .title('How It Works')
              .child(
                S.list()
                  .title('How It Works')
                  .items([
                    S.listItem().title('Home').child(S.document().schemaType('howItWorks').documentId('howItWorks.home')),
                    S.listItem().title('C&I Solar & Storage').child(S.document().schemaType('howItWorks').documentId('howItWorks.ci-solar-storage')),
                    S.listItem().title('Wheeling').child(S.document().schemaType('howItWorks').documentId('howItWorks.wheeling')),
                    S.listItem().title('Energy Optimisation').child(S.document().schemaType('howItWorks').documentId('howItWorks.energy-optimisation')),
                    S.listItem().title('Carbon Credits').child(S.document().schemaType('howItWorks').documentId('howItWorks.carbon-credits')),
                    S.listItem().title('WeBuySolar').child(S.document().schemaType('howItWorks').documentId('howItWorks.webuysolar')),
                    S.listItem().title('EV Fleets').child(S.document().schemaType('howItWorks').documentId('howItWorks.ev-fleets')),
                  ]),
              ),
            S.divider(),
            S.listItem()
              .title('Hero Images')
              .id('heroImages')
              .child(S.document().schemaType('heroImages').documentId('heroImages')),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
