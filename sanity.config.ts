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
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
