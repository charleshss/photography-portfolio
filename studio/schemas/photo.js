// studio/schemas/photo.js
import {UnifiedLocationInput} from '../components/UnifiedLocationInput'
import {ExifDisplay} from '../components/ExifDisplay'

export default {
    name: 'photo',
    title: 'Portfolio Photos',
    type: 'document',
    fields: [
        // Basic Information (Required Fields)
        {
            name: 'title',
            title: '📝 Photo Title *',
            type: 'string',
            description: 'Give your photo a compelling title that captures its essence',
            placeholder: 'e.g., "Golden Hour at Jasper Lake" or "Mountain Goat in Morning Light"',
            validation: (Rule) =>
                Rule.required()
                    .min(3)
                    .error('Title must be at least 3 characters')
                    .max(100)
                    .error('Title must be under 100 characters'),
        },
        {
            name: 'description',
            title: '📖 Photo Description *',
            type: 'text',
            rows: 4,
            description: 'Tell the story behind this photo - where, when, what makes it special',
            placeholder:
                'Describe the moment, the location, the wildlife behaviour, or the conditions that made this shot unique...',
            validation: (Rule) =>
                Rule.required()
                    .min(10)
                    .error('Please provide at least 10 characters describing your photo')
                    .max(500)
                    .error('Description should be under 500 characters'),
        },

        // Main Image with EXIF extraction (Required)
        {
            name: 'image',
            title: '📸 Upload Photo *',
            type: 'image',
            description:
                'Upload your high-quality photo. Camera settings will be automatically extracted.',
            options: {
                hotspot: true,
                metadata: ['exif', 'location', 'lqip', 'palette'],
            },
            fields: [
                {
                    name: 'alt',
                    title: '♿ Alt Text (Accessibility) *',
                    type: 'string',
                    description: 'Describe what is visible in the image for screen readers and SEO',
                    placeholder: 'e.g., "A brown bear catching salmon in a rushing river"',
                    validation: (Rule) =>
                        Rule.required()
                            .min(5)
                            .error('Alt text should be at least 5 characters')
                            .max(125)
                            .error('Alt text should be under 125 characters for best SEO'),
                },
            ],
            validation: (Rule) => Rule.required().error('Please upload a photo'),
        },

        // Unified Location Input (Required)
        {
            name: 'locationData',
            title: '📍 Photo Location *',
            type: 'object',
            description: 'Where was this photo taken? Use the search or click on the map below.',
            fields: [
                {
                    name: 'coordinates',
                    title: 'Coordinates',
                    type: 'geopoint',
                    description: 'Click to set location on map',
                },
                {
                    name: 'locationName',
                    title: 'Location Name',
                    type: 'string',
                },
            ],
            components: {
                input: UnifiedLocationInput,
            },
            validation: (Rule) =>
                Rule.required().error(
                    'Please set the photo location using the map or search above',
                ),
        },

        // Categorisation (Required) - Must come first so species field can conditionally show
        {
            name: 'category',
            title: '🏷️ Photo Category *',
            type: 'string',
            description:
                'What type of photography is this? This determines where it appears on your website.',
            options: {
                list: [
                    {title: '🦅 Wildlife Photography', value: 'wildlife'},
                    {title: '🏔️ Landscape Photography', value: 'landscape'},
                ],
                layout: 'radio',
            },
            validation: (Rule) =>
                Rule.required().error(
                    'Please select whether this is wildlife or landscape photography',
                ),
        },

        // Species field - appears right after category selection for wildlife photos
        {
            name: 'species',
            title: '🦅 Species (Required for Wildlife Photos)',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'species'}],
                    options: {
                        disableNew: false,
                    },
                },
            ],
            description:
                'What wildlife species are featured in this photo? You can select multiple animals.',
            placeholder: 'Select or create species...',
            hidden: ({document}) => document?.category !== 'wildlife',
            validation: (Rule) =>
                Rule.custom((species, context) => {
                    // Only require species if category is wildlife
                    if (context.document?.category === 'wildlife') {
                        if (!species || species.length === 0) {
                            return 'Please specify what wildlife species are in this photo'
                        }
                    }
                    return true
                }),
        },

        // Portfolio Placement Controls (Optional but Important)
        {
            name: 'heroCarousel',
            title: '🎠 Homepage Hero Carousel',
            type: 'boolean',
            description:
                'Show this photo in the rotating slideshow on your homepage? (Select your very best shots)',
            initialValue: false,
        },
        {
            name: 'featured',
            title: '⭐ Featured in "Best Work"',
            type: 'boolean',
            description:
                'Highlight this photo in your featured portfolio section? (Maximum 3 photos allowed)',
            initialValue: false,
            validation: (Rule) =>
                Rule.custom(async (featured, context) => {
                    if (!featured) return true // If not featured, no validation needed

                    const {getClient} = context
                    const client = getClient({apiVersion: '2024-01-01'})

                    // Count current featured photos (excluding this document)
                    const query = `count(*[_type == "photo" && featured == true && _id != $currentId])`
                    const currentFeaturedCount = await client.fetch(query, {
                        currentId: context.document._id || 'new',
                    })

                    if (currentFeaturedCount >= 3) {
                        return 'Maximum 3 photos can be featured in "Best Work". Please unfeature another photo first.'
                    }

                    return true
                }),
        },

        // Camera Data Storage (used internally by the EXIF display component)
        {
            name: 'cameraData',
            title: 'Camera Data Overrides',
            type: 'object',
            description:
                'Stores any manual corrections made to the automatically extracted EXIF data',
            hidden: true, // Hide from the UI since it's managed by the ExifDisplay component
            fields: [
                {
                    name: 'camera',
                    title: 'Camera Model',
                    type: 'string',
                },
                {
                    name: 'lens',
                    title: 'Lens',
                    type: 'string',
                },
                {
                    name: 'captureDate',
                    title: 'Date Taken',
                    type: 'datetime',
                },
                {
                    name: 'settings',
                    title: 'Camera Settings',
                    type: 'object',
                    fields: [
                        {
                            name: 'aperture',
                            title: 'Aperture',
                            type: 'string',
                        },
                        {
                            name: 'shutterSpeed',
                            title: 'Shutter Speed',
                            type: 'string',
                        },
                        {
                            name: 'iso',
                            title: 'ISO',
                            type: 'number',
                        },
                        {
                            name: 'focalLength',
                            title: 'Focal Length',
                            type: 'string',
                        },
                    ],
                },
            ],
        },

        // EXIF Information Display (Custom Component)
        {
            name: 'exifInfo',
            title: '📷 Camera Data from Image',
            type: 'object',
            description:
                'Automatically extracted camera settings and metadata from your uploaded image',
            options: {
                collapsible: true,
                collapsed: false,
            },
            readOnly: true,
            fields: [
                {
                    name: 'display',
                    title: 'EXIF Data Display',
                    type: 'string',
                    readOnly: true,
                },
            ],
            components: {
                input: ExifDisplay,
            },
        },

        // Organisation (Optional but Helpful)
        {
            name: 'tags',
            title: '🏷️ Tags (Optional)',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'tag'}],
                    options: {
                        disableNew: false,
                    },
                },
            ],
            options: {
                layout: 'tags',
            },
            description:
                'Add descriptive keywords to help organise and find your photos. Examples: "golden-hour", "sunrise", "action-shot", "macro", "telephoto". Use British spelling where applicable.',
            placeholder: 'Add tags to categorise this photo...',
        },
        {
            name: 'slug',
            title: '🔗 URL Slug *',
            type: 'slug',
            description:
                'This creates the web address for your photo. Click "Generate" to create it from your title.',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) =>
                Rule.required().error(
                    'Please generate a URL slug by clicking the "Generate" button',
                ),
        },
    ],

    // How photos appear in Sanity Studio list
    preview: {
        select: {
            title: 'title',
            media: 'image',
            category: 'category',
            featured: 'featured',
            heroCarousel: 'heroCarousel',
        },
        prepare(selection) {
            const {title, media, category, featured, heroCarousel} = selection
            const badges = []
            if (featured) badges.push('Featured')
            if (heroCarousel) badges.push('Hero')

            return {
                title,
                subtitle: `${category}${badges.length ? ` • ${badges.join(' • ')}` : ''}`,
                media,
            }
        },
    },
}
