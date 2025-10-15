export default {
    name: 'landscapePage',
    title: 'Landscape Page Settings',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Page Title (Internal) *',
            type: 'string',
            description: 'Required — internal reference name (not visible to visitors)',
            initialValue: 'Landscape Page',
            validation: (Rule) => Rule.required().error('Page title is required'),
        },
        {
            name: 'heroTitle',
            title: 'Hero Title *',
            type: 'string',
            description: 'Required — main heading shown at the top of the landscape page',
            placeholder: 'Landscape Photography',
            initialValue: 'Landscape Photography',
            validation: (Rule) =>
                Rule.required().min(3).max(120).error('Hero title must be 3-120 characters'),
        },
        {
            name: 'heroDescription',
            title: 'Hero Description *',
            type: 'text',
            rows: 3,
            description: 'Required — introductory paragraph beneath the hero title',
            placeholder:
                'From rugged coastlines to majestic mountain peaks, these landscapes showcase the diverse beauty of our natural world captured during the most dramatic lighting conditions.',
            initialValue:
                'From rugged coastlines to majestic mountain peaks, these landscapes showcase the diverse beauty of our natural world captured during the most dramatic lighting conditions.',
            validation: (Rule) =>
                Rule.required()
                    .min(20)
                    .max(400)
                    .error('Hero description should be 20-400 characters'),
        },
        {
            name: 'galleryTitle',
            title: 'Gallery Title *',
            type: 'string',
            description: 'Required — heading shown above the landscape gallery',
            placeholder: 'Landscape Collection',
            initialValue: 'Landscape Collection',
            validation: (Rule) =>
                Rule.required().min(3).max(120).error('Gallery title must be 3-120 characters'),
        },
        {
            name: 'galleryDescription',
            title: 'Gallery Description *',
            type: 'text',
            rows: 3,
            description: 'Required — description shown above the landscape gallery grid',
            placeholder:
                'Each landscape tells a unique story of time, weather, and natural forces. These images were captured during golden hour and blue hour to showcase the most dramatic lighting conditions.',
            initialValue:
                'Each landscape tells a unique story of time, weather, and natural forces. These images were captured during golden hour and blue hour to showcase the most dramatic lighting conditions.',
            validation: (Rule) =>
                Rule.required()
                    .min(20)
                    .max(400)
                    .error('Gallery description should be 20-400 characters'),
        },
        {
            name: 'locationsTitle',
            title: 'Locations Section Title *',
            type: 'string',
            description: 'Required — heading for the captured locations section',
            placeholder: 'Captured Locations',
            initialValue: 'Captured Locations',
            validation: (Rule) =>
                Rule.required().min(3).max(120).error('Locations title must be 3-120 characters'),
        },
        {
            name: 'locationsDescription',
            title: 'Locations Description *',
            type: 'text',
            rows: 3,
            description: 'Required — description shown above the captured locations list',
            placeholder:
                'Each location offers unique challenges and rewards for landscape photography',
            initialValue:
                'Each location offers unique challenges and rewards for landscape photography',
            validation: (Rule) =>
                Rule.required()
                    .min(10)
                    .max(300)
                    .error('Locations description should be 10-300 characters'),
        },
        {
            name: 'equipmentTitle',
            title: 'Equipment Section Title *',
            type: 'string',
            description: 'Required — heading for the equipment highlight section',
            placeholder: 'Behind the Lens',
            initialValue: 'Behind the Lens',
            validation: (Rule) =>
                Rule.required().min(3).max(120).error('Equipment title must be 3-120 characters'),
        },
        {
            name: 'equipmentDescription',
            title: 'Equipment Intro *',
            type: 'text',
            rows: 3,
            description: 'Required — introduction paragraph for the equipment section',
            placeholder:
                'These landscapes were captured using professional camera equipment, often requiring early morning hikes and patient waiting for the perfect light.',
            initialValue:
                'These landscapes were captured using professional camera equipment, often requiring early morning hikes and patient waiting for the perfect light.',
            validation: (Rule) =>
                Rule.required()
                    .min(20)
                    .max(400)
                    .error('Equipment description should be 20-400 characters'),
        },
        {
            name: 'equipmentHighlights',
            title: 'Equipment Highlights',
            type: 'array',
            description:
                'Optional — up to three highlight cards displayed beneath the equipment section',
            validation: (Rule) => Rule.max(3).error('You can add up to three equipment highlights'),
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Highlight Title',
                            type: 'string',
                            validation: (Rule) =>
                                Rule.required()
                                    .min(2)
                                    .max(80)
                                    .error('Highlight title must be 2-80 characters'),
                        },
                        {
                            name: 'description',
                            title: 'Highlight Description',
                            type: 'text',
                            rows: 3,
                            validation: (Rule) =>
                                Rule.required()
                                    .min(10)
                                    .max(300)
                                    .error('Highlight description should be 10-300 characters'),
                        },
                    ],
                },
            ],
            initialValue: [
                {
                    title: 'Camera Systems',
                    description:
                        'Full-frame mirrorless cameras for maximum detail and dynamic range',
                },
                {
                    title: 'Specialised Lenses',
                    description:
                        'Wide-angle lenses to capture expansive vistas and intimate details',
                },
                {
                    title: 'Filters & Accessories',
                    description:
                        'Polarising and ND filters for enhanced colours and long exposures',
                },
            ],
        },
        {
            name: 'ctaTitle',
            title: 'CTA Title *',
            type: 'string',
            description:
                'Required — headline for the call-to-action block at the bottom of the page',
            placeholder: 'Commission a Landscape Session',
            initialValue: 'Commission a Landscape Session',
            validation: (Rule) =>
                Rule.required().min(5).max(160).error('CTA title should be 5-160 characters'),
        },
        {
            name: 'ctaDescription',
            title: 'CTA Description *',
            type: 'text',
            rows: 3,
            description: 'Required — supporting text encouraging visitors to take action',
            placeholder:
                'Have a special location in mind? I offer commissioned landscape photography sessions for personal or commercial use.',
            initialValue:
                'Have a special location in mind? I offer commissioned landscape photography sessions for personal or commercial use.',
            validation: (Rule) =>
                Rule.required()
                    .min(20)
                    .max(400)
                    .error('CTA description should be 20-400 characters'),
        },
        {
            name: 'ctaPrimaryButtonText',
            title: 'Primary Button Text *',
            type: 'string',
            description: 'Required — text for the main CTA button',
            placeholder: 'Discuss Your Project',
            initialValue: 'Discuss Your Project',
            validation: (Rule) =>
                Rule.required().min(2).max(60).error('Primary button text must be 2-60 characters'),
        },
        {
            name: 'ctaPrimaryButtonLink',
            title: 'Primary Button Link',
            type: 'string',
            description: 'Fixed link (read-only) — always points to /contact',
            initialValue: '/contact',
            readOnly: true,
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'ctaSecondaryButtonText',
            title: 'Secondary Button Text *',
            type: 'string',
            description: 'Required — text for the secondary CTA button',
            placeholder: 'View Wildlife Portfolio',
            initialValue: 'View Wildlife Portfolio',
            validation: (Rule) =>
                Rule.required()
                    .min(2)
                    .max(60)
                    .error('Secondary button text must be 2-60 characters'),
        },
        {
            name: 'ctaSecondaryButtonLink',
            title: '🔗 Secondary Button Link',
            type: 'string',
            description: 'Fixed link (read-only) — always points to /portfolio/wildlife',
            initialValue: '/portfolio/wildlife',
            readOnly: true,
            validation: (Rule) => Rule.required(),
        },
    ],
    preview: {
        select: {
            title: 'title',
            heroTitle: 'heroTitle',
        },
        prepare(selection) {
            const { title, heroTitle } = selection
            return {
                title,
                subtitle: heroTitle ? `Hero: "${heroTitle}"` : 'Landscape page settings',
            }
        },
    },
}
