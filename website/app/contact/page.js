import Image from 'next/image'
import { client } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import ContactForm from '../../components/ContactForm'

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return builder.image(source)
}

// Portable Text components for rich text rendering
const portableTextComponents = {
  block: {
    h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mb-3 break-words">{children}</h3>,
    h4: ({children}) => <h4 className="text-lg font-medium text-gray-900 mb-2 break-words">{children}</h4>,
    normal: ({children}) => <p className="text-gray-700 mb-4 break-words leading-relaxed">{children}</p>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold break-words">{children}</strong>,
    em: ({children}) => <em className="italic break-words">{children}</em>,
  },
}

async function getContactData() {
  const contactData = await client.fetch(
    `*[_type == "contactPage" && _id == "contactPage"][0]{
      heroImage,
      heroTitle,
      heroSubtitle,
      introText,
      contactImage,
      contactMethods,
      responseTime,
      additionalInfo
    }`,
    {},
    { next: { revalidate: 60 } }
  )

  return contactData
}

// Social media icon components
const SocialIcon = ({ platform }) => {
  const iconClass = "w-6 h-6"

  switch(platform) {
    case 'instagram':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987s11.987-5.366 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 20.31c-3.016 0-5.462-2.446-5.462-5.462s2.446-5.462 5.462-5.462 5.462 2.446 5.462 5.462-2.446 5.462-5.462 5.462zm7.12 0c-3.016 0-5.462-2.446-5.462-5.462s2.446-5.462 5.462-5.462 5.462 2.446 5.462 5.462-2.446 5.462-5.462 5.462z"/>
          <circle cx="12" cy="12" r="3.5"/>
          <circle cx="17.5" cy="6.5" r="1.5"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    default:
      return null
  }
}

export default async function Contact() {
  const contactData = await getContactData()

  // Fallback if no data exists yet
  if (!contactData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact</h1>
          <p className="text-gray-600">Please set up your contact page content in Sanity Studio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen">
        {contactData.heroImage && (
          <Image
            src={urlFor(contactData.heroImage).width(1920).height(1080).url()}
            alt="Contact hero background"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center text-white px-6">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              {contactData.heroTitle || "Let's Connect"}
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto">
              {contactData.heroSubtitle || 'Ready to capture your next adventure?'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form Side */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Send a Message
              </h2>

              {contactData.introText && (
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  {contactData.introText}
                </p>
              )}

              <ContactForm />

              {contactData.responseTime && (
                <p className="text-sm text-gray-500 mt-6">
                  {contactData.responseTime}
                </p>
              )}
            </div>

            {/* Contact Methods */}
            {contactData.contactMethods && (
              <div className="mt-8 bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Other Ways to Reach Me</h3>

                <div className="space-y-4">
                  {contactData.contactMethods.showEmail && contactData.contactMethods.email && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a href={`mailto:${contactData.contactMethods.email}`} className="text-green-600 hover:text-green-700 transition">
                          {contactData.contactMethods.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactData.contactMethods.showPhone && contactData.contactMethods.phone && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <a href={`tel:${contactData.contactMethods.phone}`} className="text-blue-600 hover:text-blue-700 transition">
                          {contactData.contactMethods.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactData.contactMethods.showSocial && contactData.contactMethods.socialLinks && contactData.contactMethods.socialLinks.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-900 mb-3">Follow Me</p>
                      <div className="flex space-x-4">
                        {contactData.contactMethods.socialLinks.map((social, index) => (
                          <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
                          >
                            <SocialIcon platform={social.platform} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Image Side */}
          <div className="order-1 lg:order-2">
            {contactData.contactImage ? (
              <div className="relative h-96 lg:h-full lg:min-h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(contactData.contactImage).width(600).height(800).url()}
                  alt="Contact image"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative h-96 lg:h-full lg:min-h-[600px] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 shadow-2xl">
                <div className="flex items-center justify-center h-full">
                  <span className="text-green-600 text-lg font-medium">Contact Image</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information Sections */}
        {contactData.additionalInfo && contactData.additionalInfo.map((section, index) => (
          <div key={index} className="mt-24">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {section.title}
              </h3>
              <div className="prose prose-lg md:prose-xl text-gray-700 max-w-4xl mx-auto">
                <PortableText
                  value={section.content}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}