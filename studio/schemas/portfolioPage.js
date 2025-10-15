export default {
    name: 'portfolioPage',
    title: 'Portfolio Page Settings',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Page Title (Internal) *',
            type: 'string',
            description: 'Required — internal reference name (not visible to visitors)',
            initialValue: 'Portfolio Page',
            validation: (Rule) => Rule.required().error('Page title is required'),
        },
        {
            name: 'heroTitle',
            title: 'Hero Title *',
            type: 'string',
            description: 'Required — main heading shown at the top of the portfolio page',
            placeholder: 'Photography Portfolio',
            initialValue: 'Photography Portfolio',
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
                'Exploring the beauty of nature through wildlife and landscape photography. Each image tells a story of the wild places and creatures that inspire me.',
            initialValue:
                'Exploring the beauty of nature through wildlife and landscape photography. Each image tells a story of the wild places and creatures that inspire me.',
            validation: (Rule) =>
                Rule.required()
                    .min(20)
                    .max(400)
                    .error('Hero description should be 20-400 characters'),
        },
        {
            name: 'landscapeDescription',
            title: 'Landscape Section Description *',
            type: 'text',
            rows: 3,
            description: 'Required — description shown above the landscape gallery',
            placeholder:
                'Capturing the raw beauty and drama of natural landscapes, from towering mountains to serene lakes and everything in between.',
            initialValue:
                'Capturing the raw beauty and drama of natural landscapes, from towering mountains to serene lakes and everything in between.',
            validation: (Rule) =>
                Rule.required()
                    .min(10)
                    .max(400)
                    .error('Landscape description should be 10-400 characters'),
        },
        {
            name: 'wildlifeDescription',
            title: 'Wildlife Section Description *',
            type: 'text',
            rows: 3,
            description: 'Required — description shown above the wildlife gallery',
            placeholder:
                "Intimate portraits of wildlife in their natural habitats, showcasing the personality and behaviour of nature's most fascinating creatures.",
            initialValue:
                "Intimate portraits of wildlife in their natural habitats, showcasing the personality and behaviour of nature's most fascinating creatures.",
            validation: (Rule) =>
                Rule.required()
                    .min(10)
                    .max(400)
                    .error('Wildlife description should be 10-400 characters'),
        },
        {
            name: 'ctaTitle',
            title: 'CTA Title *',
            type: 'string',
            description: 'Required — headline for the call-to-action block at the bottom',
            placeholder: "Let's Capture Something Amazing Together",
            initialValue: "Let's Capture Something Amazing Together",
            validation: (Rule) =>
                Rule.required().min(5).max(160).error('CTA title should be 5-160 characters'),
        },
        {
            name: 'ctaDescription',
            title: 'CTA Description *',
            type: 'text',
            rows: 3,
            description: 'Required — supporting text encouraging visitors to get in touch',
            placeholder:
                "Interested in commissioning a photography session or purchasing prints? I'd love to discuss your vision and bring it to life.",
            initialValue:
                "Interested in commissioning a photography session or purchasing prints? I'd love to discuss your vision and bring it to life.",
            validation: (Rule) =>
                Rule.required()
                    .min(20)
                    .max(400)
                    .error('CTA description should be 20-400 characters'),
        },
        {
            name: 'ctaButtonText',
            title: 'CTA Button Text *',
            type: 'string',
            description: 'Required — text displayed on the CTA button',
            placeholder: 'Get In Touch',
            initialValue: 'Get In Touch',
            validation: (Rule) =>
                Rule.required().min(2).max(60).error('CTA button text should be 2-60 characters'),
        },
        {
            name: 'ctaButtonLink',
            title: 'CTA Button Link',
            type: 'string',
            description: 'Fixed link (read-only) — always points to /contact',
            initialValue: '/contact',
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
                subtitle: heroTitle ? `Hero: "${heroTitle}"` : 'Portfolio page settings',
            }
        },
    },
}
