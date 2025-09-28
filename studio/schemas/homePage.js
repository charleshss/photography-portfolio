export default {
    name: 'homePage',
    title: '🏠 Home Page Settings',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: '📄 Page Title (Internal) *',
            type: 'string',
            description: 'Required — internal reference only (not shown on the website)',
            initialValue: 'Home Page',
            validation: (Rule) => Rule.required().error('Page title is required'),
        },

        // Hero Section Content
        {
            name: 'heroTagline',
            title: '🏷️ Hero Tagline *',
            type: 'string',
            description:
                'Required — short line that appears above the main headline (e.g., "Wild Landscapes • Intimate Wildlife")',
            placeholder: 'Wild Landscapes • Intimate Wildlife',
            initialValue: 'Wild Landscapes • Intimate Wildlife',
            validation: (Rule) =>
                Rule.required()
                    .min(3)
                    .max(100)
                    .error('Hero tagline must be between 3-100 characters'),
        },
        {
            name: 'businessName',
            title: '✨ Business Name *',
            type: 'string',
            description:
                'Required — your business name. Displayed prominently on the home page, footer, and other areas of the site.',
            placeholder: 'SamuelSS. Photography',
            initialValue: 'SamuelSS. Photography',
            validation: (Rule) =>
                Rule.required()
                    .min(2)
                    .max(80)
                    .error('Business name must be between 2-80 characters'),
        },
        {
            name: 'heroDescription',
            title: '📝 Hero Description *',
            type: 'text',
            rows: 3,
            description:
                'Required — short paragraph under the headline explaining who you are and what you specialise in',
            placeholder:
                'Professional photographer based in Essex, England. Specialising in dramatic landscapes and compelling wildlife portraits.',
            initialValue:
                'Professional photographer based in Essex, England. Specialising in dramatic landscapes and compelling wildlife portraits.',
            validation: (Rule) =>
                Rule.required()
                    .min(20)
                    .max(300)
                    .error('Hero description should be between 20-300 characters'),
        },

        // Call to Action Buttons
        {
            name: 'primaryButton',
            title: '🔘 Primary Button *',
            type: 'object',
            description: 'Required — controls the primary call-to-action button',
            validation: (Rule) => Rule.required().error('Primary button settings are required'),
            fields: [
                {
                    name: 'text',
                    title: 'Button Text *',
                    type: 'string',
                    placeholder: 'View Portfolio',
                    initialValue: 'View Portfolio',
                    validation: (Rule) =>
                        Rule.required().min(2).max(25).error('Button text must be 2-25 characters'),
                },
                {
                    name: 'link',
                    title: 'Button Link *',
                    type: 'string',
                    description: 'Fixed link (read-only) — always points to /portfolio',
                    initialValue: '/portfolio',
                    readOnly: true,
                    validation: (Rule) => Rule.required(),
                },
            ],
        },
        {
            name: 'secondaryButton',
            title: '🔗 Secondary Button *',
            type: 'object',
            description: 'Required — controls the secondary call-to-action button',
            validation: (Rule) => Rule.required().error('Secondary button settings are required'),
            fields: [
                {
                    name: 'text',
                    title: 'Button Text *',
                    type: 'string',
                    placeholder: 'Work Together',
                    initialValue: 'Work Together',
                    validation: (Rule) =>
                        Rule.required().min(2).max(25).error('Button text must be 2-25 characters'),
                },
                {
                    name: 'link',
                    title: 'Button Link *',
                    type: 'string',
                    description: 'Fixed link (read-only) — always points to /contact',
                    initialValue: '/contact',
                    readOnly: true,
                    validation: (Rule) => Rule.required(),
                },
            ],
        },

        // Featured Work Section
        {
            name: 'featuredSection',
            title: '⭐ Featured Work Section *',
            type: 'object',
            description: 'Required — controls the "My Best Work" featured section',
            validation: (Rule) =>
                Rule.required().error('Featured work section content is required'),
            fields: [
                {
                    name: 'sectionTitle',
                    title: '🏷️ Section Heading *',
                    type: 'string',
                    description: 'Title for your featured work section',
                    placeholder: 'My Best Work',
                    initialValue: 'My Best Work',
                    validation: (Rule) =>
                        Rule.required()
                            .min(3)
                            .max(50)
                            .error('Section title must be 3-50 characters'),
                },
                {
                    name: 'sectionDescription',
                    title: '📝 Section Description *',
                    type: 'text',
                    rows: 3,
                    description:
                        'Required — short description explaining the featured work selection',
                    placeholder:
                        'A carefully curated selection of my favourite captures from years of exploring the natural world',
                    initialValue:
                        'A carefully curated selection of my favourite captures from years of exploring the natural world',
                    validation: (Rule) =>
                        Rule.required()
                            .min(10)
                            .max(250)
                            .error('Section description should be 10-250 characters'),
                },
                {
                    name: 'viewAllButtonText',
                    title: '🔘 "View All" Button Text *',
                    type: 'string',
                    description: 'Required — text for the button linking to the full portfolio',
                    placeholder: 'View Full Portfolio',
                    initialValue: 'View Full Portfolio',
                    validation: (Rule) =>
                        Rule.required().min(3).max(30).error('Button text must be 3-30 characters'),
                },
            ],
        },

        // Collaboration Section (Bottom CTA)
        {
            name: 'collaborationSection',
            title: '🤝 Collaboration Call-to-Action *',
            type: 'object',
            description:
                'Required — controls the collaboration call-to-action at the bottom of the page',
            validation: (Rule) =>
                Rule.required().error('Collaboration call-to-action content is required'),
            fields: [
                {
                    name: 'ctaTitle',
                    title: '✨ CTA Headline *',
                    type: 'string',
                    description: 'Required — headline text that encourages collaboration',
                    placeholder: "Let's plan your next visual story",
                    initialValue: "Let's plan your next visual story",
                    validation: (Rule) =>
                        Rule.required()
                            .min(5)
                            .max(80)
                            .error('CTA headline must be 5-80 characters'),
                },
                {
                    name: 'ctaDescription',
                    title: '📝 CTA Description *',
                    type: 'text',
                    rows: 3,
                    description:
                        'Required — supporting text explaining the type of collaboration you offer',
                    placeholder:
                        "Whether you want to explore nature and search for wildlife together. I'd love to collaborate.",
                    initialValue:
                        "Whether you want to explore nature and search for wildlife together. I'd love to collaborate.",
                    validation: (Rule) =>
                        Rule.required()
                            .min(20)
                            .max(200)
                            .error('CTA description should be 20-200 characters'),
                },
                {
                    name: 'ctaButtonText',
                    title: '🔘 CTA Button Text *',
                    type: 'string',
                    description: 'Required — text displayed on the call-to-action button',
                    placeholder: 'Start a conversation',
                    initialValue: 'Start a conversation',
                    validation: (Rule) =>
                        Rule.required().min(3).max(30).error('Button text must be 3-30 characters'),
                },
                {
                    name: 'ctaButtonLink',
                    title: '🔗 CTA Button Link *',
                    type: 'string',
                    description: 'Fixed link (read-only) — always points to /contact',
                    initialValue: '/contact',
                    readOnly: true,
                    validation: (Rule) => Rule.required(),
                },
            ],
        },
    ],
    preview: {
        select: {
            title: 'title',
            businessName: 'businessName',
        },
        prepare(selection) {
            const {title, businessName} = selection
            return {
                title,
                subtitle: businessName ? `Business: "${businessName}"` : 'Home page settings',
            }
        },
    },
}
