// studio/schemas/photo.js
import { UnifiedLocationInput } from '../components/UnifiedLocationInput'
import { ExifDisplay } from '../components/ExifDisplay'

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
                    description: 'Describe what is in the image for screen readers',
                    validation: Rule => Rule.required()
                }
            ],
            validation: Rule => Rule.required()
        },

        // Unified Location Input
        {
            name: 'locationData',
            title: '📍 Location',
            type: 'object',
            description: 'Set location using map or search - automatically saves both coordinates and name',
            fields: [
                {
                    name: 'coordinates',
                    title: 'Coordinates',
                    type: 'geopoint',
                    description: 'Click to set location on map'
                },
                {
                    name: 'locationName',
                    title: 'Location Name',
                    type: 'string'
                }
            ],
            components: {
                input: UnifiedLocationInput
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'species',
            title: 'Species (Wildlife Only)',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'species' }],
                    options: {
                        disableNew: false
                    }
                }
            ],
            description: 'Select the species in this wildlife photo. You can select multiple if there are different animals.',
            hidden: ({ document }) => document?.category !== 'wildlife',
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

        // Camera Data Storage (used internally by the EXIF display component)
        {
            name: 'cameraData',
            title: 'Camera Data Overrides',
            type: 'object',
            description: 'Stores any manual corrections made to the automatically extracted EXIF data',
            hidden: true, // Hide from the UI since it's managed by the ExifDisplay component
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
                    type: 'string'
                },
                {
                    name: 'settings',
                    title: 'Camera Settings',
                    type: 'object',
                    fields: [
                        {
                            name: 'aperture',
                            title: 'Aperture',
                            type: 'string'
                        },
                        {
                            name: 'shutterSpeed',
                            title: 'Shutter Speed',
                            type: 'string'
                        },
                        {
                            name: 'iso',
                            title: 'ISO',
                            type: 'number'
                        },
                        {
                            name: 'focalLength',
                            title: 'Focal Length',
                            type: 'string'
                        }
                    ]
                }
            ]
        },

        // EXIF Information Display (Custom Component)
        {
            name: 'exifInfo',
            title: '📷 Camera Data from Image',
            type: 'object',
            description: 'Automatically extracted camera settings and metadata from your uploaded image',
            options: {
                collapsible: true,
                collapsed: false
            },
            readOnly: true,
            fields: [
                {
                    name: 'display',
                    title: 'EXIF Data Display',
                    type: 'string',
                    readOnly: true
                }
            ],
            components: {
                input: ExifDisplay
            }
        },

        // Organization
        {
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'tag' }],
                    options: {
                        disableNew: false
                    }
                }
            ],
            options: {
                layout: 'tags'
            },
            description: 'Add keywords like "golden-hour", "sunrise", "action-shot", etc.'
        },
        {
            name: 'slug',
            title: 'URL Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96
            },
            validation: Rule => Rule.required()
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