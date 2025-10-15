export default {
    name: 'contactPage',
    title: 'Contact Page Settings',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Page Title (Internal) *',
            type: 'string',
            description: 'Required — internal reference name for the page (not shown to visitors)',
            initialValue: 'Contact Me',
            validation: (Rule) => Rule.required().error('Page title is required'),
        },

        // Hero Section
        {
            name: 'heroImage',
            title: 'Hero Background Image *',
            type: 'image',
            description:
                'Required — large background image at the top of the contact page. Choose a high-quality, landscape-oriented photo that represents your photography style.',
            options: {
                hotspot: true,
            },
            validation: (Rule) =>
                Rule.required().error('A hero image is required for the contact page'),
        },
        {
            name: 'heroTitle',
            title: 'Hero Main Headline *',
            type: 'string',
            description:
                'Required — main headline text that overlays the hero image. Make it welcoming and encourage visitors to reach out.',
            placeholder: "Let's Connect",
            initialValue: "Let's Connect",
            validation: (Rule) =>
                Rule.required().min(2).max(60).error('Hero headline should be 2-60 characters'),
        },
        {
            name: 'heroSubtitle',
            title: 'Hero Subheading *',
            type: 'string',
            description:
                'Required — short sentence beneath the headline describing what visitors can expect.',
            placeholder: 'Ready to capture your next adventure?',
            initialValue: 'Ready to capture your next adventure?',
            validation: (Rule) =>
                Rule.required().min(5).max(120).error('Hero subheading should be 5-120 characters'),
        },

        // Contact Section
        {
            name: 'contactImage',
            title: 'Your Profile Photo *',
            type: 'image',
            description:
                'Required — professional photo that appears next to the contact form. Helps visitors connect with you personally (portrait orientation works best).',
            options: {
                hotspot: true,
            },
            validation: (Rule) =>
                Rule.required().error('A profile photo helps visitors connect with you'),
        },
        {
            name: 'contactCapsule',
            title: 'Contact Form Capsule *',
            type: 'string',
            description:
                'Required — Capsule text that appears above the contact form headline. Make it friendly and inviting.',
            placeholder: "Let's Connect",
            initialValue: "Let's Connect",
            validation: (Rule) =>
                Rule.required().min(2).max(60).error('Capsule text should be 2-60 characters'),
        },
        {
            name: 'contactFormTitle',
            title: 'Contract Form Tittle *',
            type: 'string',
            description:
                'Required — Title text for the contact form. Make it welcoming and encourage visitors to reach out.',
            placeholder: "Send me a message",
            initialValue: "Send me a message",
            validation: (Rule) =>
                Rule.required().min(5).max(80).error('Form Tittle should be 5-80 characters'),
        },
        {
            name: 'introText',
            title: 'Contact Form Introduction *',
            type: 'text',
            rows: 4,
            description:
                'Required — short paragraph above the form explaining the services you offer and encouraging visitors to reach out.',
            placeholder: "I'd love to hear about your photography needs...",
            initialValue:
                "I'd love to hear about your photography needs. Whether you're looking for wildlife prints, landscape photography, or want to discuss a commission, drop me a message below.",
            validation: (Rule) =>
                Rule.required().min(30).max(500).error('Introduction should be 30-500 characters'),
        },

        // Contact Information
        {
            name: 'email',
            title: 'Your Business Email Address *',
            type: 'string',
            description:
                '⚠️ IMPORTANT: This email appears publicly on your website and receives contact form messages. Use your professional photography email address.',
            validation: (Rule) =>
                Rule.required().email().error('Please enter a valid email address'),
            placeholder: 'yourname@yourphotography.com',
            initialValue: 'contact@samuelss.photography',
        },
        {
            name: 'instagramUsername',
            title: 'Instagram Handle *',
            type: 'string',
            description:
                'Required — Instagram username (without the @ symbol). Used to create a clickable link to your profile.',
            placeholder: 'yourphotography_insta',
            validation: (Rule) =>
                Rule.required()
                    .min(1)
                    .error('Instagram username is required')
                    .regex(/^[a-zA-Z0-9._]+$/, {
                        name: 'instagram username',
                        invert: false,
                    })
                    .error(
                        'Instagram username can only contain letters, numbers, dots, and underscores',
                    ),
            initialValue: 'samuelss_photography',
        },

        // Response Promise
        {
            name: 'responseTime',
            title: 'Response Time Promise',
            type: 'string',
            description:
                'Optional — let visitors know how quickly you typically respond to messages.',
            placeholder: 'I typically respond within 24-48 hours',
            initialValue: 'I typically respond within 24-48 hours',
        },
    ],
}
