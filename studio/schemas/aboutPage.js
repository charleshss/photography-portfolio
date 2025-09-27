export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'About Me',
    },
    {
      name: 'heroImage',
      title: 'Hero Banner Image',
      type: 'image',
      description: 'Large background image for the hero section',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      initialValue: 'About Sam',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      initialValue: 'Wildlife & Nature Photography',
    },
    {
      name: 'profileImage',
      title: 'Profile Photo',
      type: 'image',
      description: 'Personal photo to display alongside the story',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'introduction',
      title: 'Main Introduction',
      type: 'text',
      rows: 4,
      description: 'Opening paragraph about yourself',
    },
    {
      name: 'story',
      title: 'Your Story',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
          },
        },
      ],
      description: 'Your photography journey and story in detail',
    },
    {
      name: 'passions',
      title: 'What Drives You',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'passion',
              title: 'Passion/Interest',
              type: 'string',
            },
          ],
        },
      ],
      description: 'List of things that motivate your photography',
    },
    {
      name: 'equipment',
      title: 'Equipment Section',
      type: 'object',
      fields: [
        {
          name: 'showEquipment',
          title: 'Show Equipment Section',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'equipmentTitle',
          title: 'Equipment Section Title',
          type: 'string',
          initialValue: 'Currently Using',
        },
        {
          name: 'camera',
          title: 'Camera Gear',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'locations',
          title: 'Favourite Locations',
          type: 'array',
          of: [{type: 'string'}],
        },
      ],
    },
    {
      name: 'additionalSections',
      title: 'Additional Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
            },
            {
              name: 'sectionImage',
              title: 'Section Image (Optional)',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'sectionContent',
              title: 'Section Content',
              type: 'array',
              of: [{type: 'block'}],
            },
          ],
        },
      ],
      description: 'Add custom sections as your story grows',
    },
    {
      name: 'callToAction',
      title: 'Call to Action',
      type: 'object',
      fields: [
        {
          name: 'ctaTitle',
          title: 'CTA Title',
          type: 'string',
          initialValue: "Let's Connect",
        },
        {
          name: 'ctaText',
          title: 'CTA Text',
          type: 'text',
          rows: 3,
        },
        {
          name: 'ctaButtonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Get in Touch',
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