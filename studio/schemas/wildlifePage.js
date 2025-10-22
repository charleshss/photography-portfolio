export default {
    name: 'wildlifePage',
    title: 'Wildlife Page Settings',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Page Title (Internal) *',
            type: 'string',
            description: 'Required — internal reference name (not visible to visitors)',
            initialValue: 'Wildlife Page',
            validation: (Rule) => Rule.required().error('Page title is required'),
        },
        {
            name: 'heroTitle',
            title: 'Hero Title *',
            type: 'string',
            description: 'Required — main heading shown at the top of the wildlife page',
            placeholder: 'Wildlife Photography',
            initialValue: 'Wildlife Photography',
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
                'Capturing the raw beauty, personality, and behaviour of wildlife in their natural habitats. Each image tells a story of survival, adaptation, and the delicate balance of nature.',
            initialValue:
                'Capturing the raw beauty, personality, and behaviour of wildlife in their natural habitats. Each image tells a story of survival, adaptation, and the delicate balance of nature.',
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
            description: 'Required — heading shown above the wildlife gallery',
            placeholder: 'Wildlife Collection',
            initialValue: 'Wildlife Collection',
            validation: (Rule) =>
                Rule.required().min(3).max(120).error('Gallery title must be 3-120 characters'),
        },
        {
            name: 'galleryDescription',
            title: 'Gallery Description *',
            type: 'text',
            rows: 3,
            description: 'Required — description shown above the wildlife gallery grid',
            placeholder:
                'Each photograph represents hours of fieldwork, research, and patient observation. These images showcase the incredible diversity of wildlife across different habitats and continents.',
            initialValue:
                'Each photograph represents hours of fieldwork, research, and patient observation. These images showcase the incredible diversity of wildlife across different habitats and continents.',
            validation: (Rule) =>
                Rule.required()
                    .min(20)
                    .max(400)
                    .error('Gallery description should be 20-400 characters'),
        },
        {
            name: 'speciesSectionTitle',
            title: 'Species Section Title *',
            type: 'string',
            description: 'Required — heading for the species documented section',
            placeholder: 'Species Documented',
            initialValue: 'Species Documented',
            validation: (Rule) =>
                Rule.required()
                    .min(3)
                    .max(120)
                    .error('Species section title must be 3-120 characters'),
        },
        {
            name: 'speciesSectionDescription',
            title: 'Species Section Description *',
            type: 'text',
            rows: 3,
            description: 'Required — description shown above the species showcase grid',
            placeholder:
                'From apex predators to gentle giants, each species represents a unique photography challenge and conservation story',
            initialValue:
                'From apex predators to gentle giants, each species represents a unique photography challenge and conservation story',
            validation: (Rule) =>
                Rule.required()
                    .min(10)
                    .max(300)
                    .error('Species section description should be 10-300 characters'),
        },
        {
            name: 'ctaTitle',
            title: 'CTA Title *',
            type: 'string',
            description:
                'Required — headline for the call-to-action block at the bottom of the page',
            placeholder: 'Wildlife Photography Expeditions',
            initialValue: 'Wildlife Photography Expeditions',
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
                'Join me on wildlife photography expeditions or commission specialised wildlife documentation for research or conservation projects.',
            initialValue:
                'Join me on wildlife photography expeditions or commission specialised wildlife documentation for research or conservation projects.',
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
            placeholder: 'Plan an Expedition',
            initialValue: 'Plan an Expedition',
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
            placeholder: 'View Landscape Portfolio',
            initialValue: 'View Landscape Portfolio',
            validation: (Rule) =>
                Rule.required()
                    .min(2)
                    .max(60)
                    .error('Secondary button text must be 2-60 characters'),
        },
        {
            name: 'ctaSecondaryButtonLink',
            title: 'Secondary Button Link',
            type: 'string',
            description: 'Fixed link (read-only) — always points to /portfolio/landscapes',
            initialValue: '/portfolio/landscapes',
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
                subtitle: heroTitle ? `Hero: "${heroTitle}"` : 'Wildlife page settings',
            }
        },
    },
}
