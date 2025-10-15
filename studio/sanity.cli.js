import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: process.env.SANITY_STUDIO_PROJECT_ID || '0crusld5',
        dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    },
    deployment: {
        /**
         * Enable auto-updates for studios.
         * Learn more at https://www.sanity.io/docs/cli#auto-updates
         */
        autoUpdates: true,
        /**
         * Add appId to enable fine-grained version selection
         */
        appId: 'efczewr1ejjd6juxx3a3p7ny',
    },
})
