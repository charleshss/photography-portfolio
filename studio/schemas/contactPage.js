// schemas/contactPage.js
export default {
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    {
      name: 'heroImage',
      title: 'Hero Banner Image',
      type: 'image',
      description: 'Large background image for the contact page hero section',
      validation: Rule => Rule.required(),
      options: {
        hotspot: true
      }
    },
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main heading for the contact page',
      validation: Rule => Rule.required().max(60),
      initialValue: "Let's Connect"
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Subtitle text under the main heading',
      validation: Rule => Rule.max(120),
      initialValue: 'Ready to capture your next adventure?'
    },
    {
      name: 'introText',
      title: 'Introduction Text',
      type: 'text',
      description: 'Brief introduction text above the contact form',
      rows: 3,
      validation: Rule => Rule.max(500),
      initialValue: "I'd love to hear about your photography needs. Whether you're looking for wildlife prints, landscape photography, or want to discuss a commission, drop me a message below."
    },
    {
      name: 'contactImage',
      title: 'Contact Section Image',
      type: 'image',
      description: 'Image to display alongside the contact form',
      options: {
        hotspot: true
      }
    },
    {
      name: 'contactMethods',
      title: 'Contact Methods',
      type: 'object',
      fields: [
        {
          name: 'showEmail',
          title: 'Show Email',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'email',
          title: 'Email Address',
          type: 'string',
          validation: Rule => Rule.email()
        },
        {
          name: 'showPhone',
          title: 'Show Phone',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'showSocial',
          title: 'Show Social Media',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'socialLinks',
          title: 'Social Media Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'platform',
                  title: 'Platform',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Instagram', value: 'instagram' },
                      { title: 'Facebook', value: 'facebook' },
                      { title: 'Twitter', value: 'twitter' },
                      { title: 'YouTube', value: 'youtube' },
                      { title: 'LinkedIn', value: 'linkedin' }
                    ]
                  }
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'url'
                }
              ],
              preview: {
                select: {
                  title: 'platform',
                  subtitle: 'url'
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'responseTime',
      title: 'Response Time',
      type: 'string',
      description: 'Expected response time for inquiries',
      initialValue: 'I typically respond within 24-48 hours'
    },
    {
      name: 'additionalInfo',
      title: 'Additional Information',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }]
            }
          ],
          preview: {
            select: {
              title: 'title'
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'heroTitle',
      subtitle: 'heroSubtitle',
      media: 'heroImage'
    }
  }
}