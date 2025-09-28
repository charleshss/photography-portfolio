export default {
    name: 'aboutPage',
    title: '👨‍💼 About Page Settings',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: '📄 Page Title (Internal) *',
            type: 'string',
            description: 'Required — internal reference name (not visible to visitors)',
            initialValue: 'About Me',
            validation: (Rule) => Rule.required().error('Page title is required'),
        },

        // Hero Section
        {
            name: 'heroImage',
            title: '🖼️ Hero Background Image *',
            type: 'image',
            description:
                'Required — large background image for the hero section. Choose a high-quality photo that represents you and your photography style (you in action or a favourite landscape).',
            options: {
                hotspot: true,
            },
            validation: (Rule) =>
                Rule.required().error('A hero image is required for the about page'),
        },
        {
            name: 'heroTitle',
            title: '✨ Hero Main Headline *',
            type: 'string',
            description:
                'Required — main headline text that sits over the hero image. Keep it personal and inviting.',
            placeholder: 'About Sam',
            initialValue: 'About Sam',
            validation: (Rule) =>
                Rule.required().min(2).max(50).error('Hero title must be between 2-50 characters'),
        },
        {
            name: 'heroSubtitle',
            title: '📸 Hero Subheading',
            type: 'string',
            description:
                'Supporting text under your main headline. Briefly describe your photography speciality or passion.',
            placeholder: 'Wildlife & Nature Photography',
            initialValue: 'Wildlife & Nature Photography',
            validation: (Rule) =>
                Rule.max(100).error('Hero subtitle should be under 100 characters'),
        },

        // Personal Story Section
        {
            name: 'profileImage',
            title: '👤 Your Profile Photo *',
            type: 'image',
            description:
                'Required — personal photo that appears beside your story. Choose an image that shows your personality (with your camera, in nature, or a professional headshot). Portrait orientation works best.',
            options: {
                hotspot: true,
            },
            validation: (Rule) =>
                Rule.required().error('A profile photo helps visitors connect with you personally'),
        },
        {
            name: 'introduction',
            title: '📝 Opening Introduction *',
            type: 'text',
            rows: 4,
            description:
                'Required — opening paragraph that hooks the reader. Share what drives your passion for photography and give a taste of your personality. Keep it engaging and authentic.',
            placeholder: 'Welcome to my world of wildlife photography...',
            validation: (Rule) =>
                Rule.required()
                    .min(50)
                    .max(500)
                    .error(
                        'Introduction should be between 50-500 characters to be engaging but concise',
                    ),
        },
        {
            name: 'story',
            title: '📖 Your Photography Journey *',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        {title: 'Normal', value: 'normal'},
                        {title: 'Heading 3', value: 'h3'},
                        {title: 'Heading 4', value: 'h4'},
                    ],
                    marks: {
                        decorators: [
                            {title: 'Bold', value: 'strong'},
                            {title: 'Italic', value: 'em'},
                        ],
                    },
                },
            ],
            description:
                "Required — detailed narrative about your photography journey. Share how you got started, memorable moments, challenges you've overcome, and what keeps you passionate. Use headings to break up longer sections.",
            validation: (Rule) =>
                Rule.required().error(
                    'Your story is what makes visitors connect with you as a photographer',
                ),
        },

        // What Drives You Section
        {
            name: 'passions',
            title: '💝 What Drives Your Photography',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'passion',
                            title: '🔥 Passion or Interest',
                            type: 'string',
                            description: 'Something that motivates your photography',
                            placeholder:
                                'e.g., "Conservation awareness", "Capturing animal behaviour", "Remote wilderness"',
                            validation: (Rule) =>
                                Rule.required()
                                    .min(3)
                                    .max(100)
                                    .error('Each passion should be 3-100 characters'),
                        },
                    ],
                    preview: {
                        select: {
                            title: 'passion',
                        },
                    },
                },
            ],
            description:
                'List the key things that motivate and inspire your photography. These help visitors understand what drives your artistic vision.',
        },

        // Equipment & Favourites Section
        {
            name: 'equipment',
            title: '📷 Equipment & Favourites Section',
            type: 'object',
            description:
                'Share details about your gear and favourite shooting locations. This builds credibility and helps other photographers.',
            fields: [
                {
                    name: 'showEquipment',
                    title: '👁️ Display Equipment Section',
                    type: 'boolean',
                    description: 'Show or hide the entire equipment section on your about page',
                    initialValue: true,
                },
                {
                    name: 'equipmentTitle',
                    title: '🏷️ Equipment Section Heading',
                    type: 'string',
                    description: 'Title for your equipment section',
                    placeholder: 'Currently Using',
                    initialValue: 'Currently Using',
                    validation: (Rule) =>
                        Rule.max(50).error('Section title should be under 50 characters'),
                },
                {
                    name: 'camera',
                    title: '📸 Camera Equipment',
                    type: 'array',
                    of: [{type: 'string'}],
                    description:
                        'List your cameras, lenses, and key accessories. Be specific with model names to help other photographers.',
                    placeholder: 'e.g., "Canon EOS R5", "Canon RF 100-500mm f/4.5-7.1L IS USM"',
                },
                {
                    name: 'locations',
                    title: '📍 Favourite Photography Locations',
                    type: 'array',
                    of: [{type: 'string'}],
                    description:
                        'Share your favourite places to photograph. This gives visitors insight into your style and might inspire their own adventures.',
                    placeholder:
                        'e.g., "Yellowstone National Park", "Scottish Highlands", "Local nature reserves"',
                },
            ],
        },

        // Flexible Additional Sections
        {
            name: 'additionalSections',
            title: '➕ Additional Custom Sections',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'sectionTitle',
                            title: '🏷️ Section Title *',
                            type: 'string',
                            description: 'Heading for this custom section',
                            placeholder:
                                'e.g., "Awards & Recognition", "Photography Philosophy", "Conservation Work"',
                            validation: (Rule) =>
                                Rule.required()
                                    .min(2)
                                    .max(100)
                                    .error('Section title must be 2-100 characters'),
                        },
                        {
                            name: 'sectionImage',
                            title: '🖼️ Section Image (Optional)',
                            type: 'image',
                            description: 'Optional image to accompany this section content',
                            options: {
                                hotspot: true,
                            },
                        },
                        {
                            name: 'sectionContent',
                            title: '📝 Section Content *',
                            type: 'array',
                            of: [{type: 'block'}],
                            description:
                                'The content for this custom section. Use rich text formatting as needed.',
                            validation: (Rule) =>
                                Rule.required().error('Each section needs content'),
                        },
                    ],
                    preview: {
                        select: {
                            title: 'sectionTitle',
                            media: 'sectionImage',
                        },
                    },
                },
            ],
            description:
                'Add custom sections as your story grows. Perfect for awards, philosophy, conservation work, or any other aspects of your photography journey.',
        },

        // Call to Action Section
        {
            name: 'callToAction',
            title: '📞 Page Call to Action',
            type: 'object',
            description: 'Encourage visitors to connect with you at the end of your story',
            fields: [
                {
                    name: 'ctaTitle',
                    title: '✨ CTA Headline',
                    type: 'string',
                    description: 'Inviting headline that encourages contact',
                    placeholder: "Let's Connect",
                    initialValue: "Let's Connect",
                    validation: (Rule) =>
                        Rule.required().min(2).max(50).error('CTA title must be 2-50 characters'),
                },
                {
                    name: 'ctaText',
                    title: '💬 CTA Description',
                    type: 'text',
                    rows: 3,
                    description:
                        'Brief text encouraging visitors to get in touch. Mention what they can contact you about.',
                    placeholder:
                        "Interested in prints, commissions, or just want to chat about photography? I'd love to hear from you.",
                    validation: (Rule) =>
                        Rule.required()
                            .min(20)
                            .max(200)
                            .error('CTA text should be 20-200 characters'),
                },
                {
                    name: 'ctaButtonText',
                    title: '🔘 Button Text',
                    type: 'string',
                    description: 'Text for the contact button',
                    placeholder: 'Get in Touch',
                    initialValue: 'Get in Touch',
                    validation: (Rule) =>
                        Rule.required().min(2).max(25).error('Button text must be 2-25 characters'),
                },
            ],
        },
    ],
    preview: {
        select: {
            title: 'title',
            media: 'heroImage',
        },
    },
}
