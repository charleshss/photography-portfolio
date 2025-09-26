import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { googleMapsInput } from '@sanity/google-maps-input'
import { schemaTypes } from './schemas'
import { generateLocationNameAction } from './actions/generateLocationName'

export default defineConfig({
  name: 'default',
  title: 'Sam\'s Photography Portfolio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '0crusld5',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

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
                  .apiVersion('2024-01-01')
              ),
            S.listItem()
              .title('🎠 Hero Carousel Photos')
              .child(
                S.documentList()
                  .title('Hero Carousel Photos')
                  .filter('_type == "photo" && heroCarousel == true')
                  .apiVersion('2024-01-01')
              ),
            S.divider(),
            S.listItem()
              .title('🦅 Wildlife Photos')
              .child(
                S.documentList()
                  .title('Wildlife Photography')
                  .filter('_type == "photo" && category == "wildlife"')
                  .apiVersion('2024-01-01')
              ),
            S.listItem()
              .title('🏔️ Landscape Photos')
              .child(
                S.documentList()
                  .title('Landscape Photography')
                  .filter('_type == "photo" && category == "landscape"')
                  .apiVersion('2024-01-01')
              )
          ])
    }),
    googleMapsInput({
      apiKey: process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY,
      defaultZoom: 11,
      defaultLocation: {
        lat: 40.7829,
        lng: -73.9654
      }
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },


  document: {
    actions: (prev, context) => {
      // Add the generate location name action to photo documents
      if (context.schemaType === 'photo') {
        return [...prev, generateLocationNameAction]
      }
      return prev
    }
  }
})
