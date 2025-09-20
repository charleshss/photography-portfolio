import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Sam\'s Photography Portfolio',

  projectId: '0crusld5',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Portfolio Management')
          .items([
            // Quick access sections for your client
            S.listItem()
              .title('📸 Upload New Photos')
              .child(
                S.documentTypeList('photo')
                  .title('All Photos')
                  .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
              ),
            S.divider(),
            S.listItem()
              .title('⭐ Featured Photos (Best Work)')
              .child(
                S.documentList()
                  .title('Featured Photos')
                  .filter('_type == "photo" && featured == true')
              ),
            S.listItem()
              .title('🎠 Hero Carousel Photos')
              .child(
                S.documentList()
                  .title('Hero Carousel Photos')
                  .filter('_type == "photo" && heroCarousel == true')
              ),
            S.divider(),
            S.listItem()
              .title('🦅 Wildlife Photos')
              .child(
                S.documentList()
                  .title('Wildlife Photography')
                  .filter('_type == "photo" && category == "wildlife"')
              ),
            S.listItem()
              .title('🏔️ Landscape Photos')
              .child(
                S.documentList()
                  .title('Landscape Photography')
                  .filter('_type == "photo" && category == "landscape"')
              )
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
