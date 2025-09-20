// studio/schemas/photo.js
export default {
    name: 'photo',
    title: 'Portfolio Photos',
    type: 'document',
    fields: [
        // Basic Information
        {
            name: 'title',
            title: 'Photo Title',
            type: 'string',
            validation: Rule => Rule.required().min(3).max(100)
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            description: 'Tell the story behind this photo'
        },

        // Main Image with EXIF extraction
        {
            name: 'image',
            title: 'Photo',
            type: 'image',
            options: {
                hotspot: true,
                metadata: ['exif', 'location', 'lqip', 'palette']
            },
            fields: [
                {
                    name: 'alt',
                    title: 'Alt Text (for accessibility)',
                    type: 'string',
                    description: 'Describe what is in the image for screen readers'
                }
            ],
            validation: Rule => Rule.required()
        },

        // Location & Wildlife Info
        {
            name: 'location',
            title: 'Location',
            type: 'string',
            description: 'Where was this photo taken? (e.g., "Yellowstone National Park, USA")'
        },
        {
            name: 'species',
            title: 'Species (Wildlife Only)',
            type: 'string',
            description: 'Scientific name if this is a wildlife photo (e.g., "Brown Bear (Ursus arctos)")',
            hidden: ({ document }) => document?.category !== 'wildlife'
        },

        // Categorization
        {
            name: 'category',
            title: 'Photo Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Wildlife Photography', value: 'wildlife' },
                    { title: 'Landscape Photography', value: 'landscape' }
                ],
                layout: 'radio'
            },
            validation: Rule => Rule.required()
        },

        // Portfolio Placement Controls
        {
            name: 'heroCarousel',
            title: 'Include in Hero Carousel',
            type: 'boolean',
            description: 'Show this photo in the homepage hero slideshow',
            initialValue: false
        },
        {
            name: 'featured',
            title: 'Featured in "Best Work"',
            type: 'boolean',
            description: 'Include in the featured "Best Work" section (recommend max 3 total)',
            initialValue: false
        },

        // Auto-populated Camera Data (from EXIF)
        {
            name: 'cameraData',
            title: 'Camera Information',
            type: 'object',
            description: 'Auto-populated from photo metadata, but can be edited',
            fields: [
                {
                    name: 'camera',
                    title: 'Camera Model',
                    type: 'string'
                },
                {
                    name: 'lens',
                    title: 'Lens',
                    type: 'string'
                },
                {
                    name: 'captureDate',
                    title: 'Date Taken',
                    type: 'datetime'
                },
                {
                    name: 'settings',
                    title: 'Camera Settings',
                    type: 'object',
                    fields: [
                        { name: 'aperture', title: 'Aperture', type: 'string' },
                        { name: 'shutterSpeed', title: 'Shutter Speed', type: 'string' },
                        { name: 'iso', title: 'ISO', type: 'number' },
                        { name: 'focalLength', title: 'Focal Length', type: 'string' }
                    ]
                }
            ]
        },

        // Organization
        {
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            },
            description: 'Add keywords like "golden-hour", "bear", "mountain", etc.'
        },
        {
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96
            }
        }
    ],

    // How photos appear in Sanity Studio list
    preview: {
        select: {
            title: 'title',
            media: 'image',
            category: 'category',
            featured: 'featured',
            heroCarousel: 'heroCarousel'
        },
        prepare(selection) {
            const { title, media, category, featured, heroCarousel } = selection
            const badges = []
            if (featured) badges.push('Featured')
            if (heroCarousel) badges.push('Hero')

            return {
                title,
                subtitle: `${category}${badges.length ? ` • ${badges.join(' • ')}` : ''}`,
                media
            }
        }
    }
}