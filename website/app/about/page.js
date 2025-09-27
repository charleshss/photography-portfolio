import Image from 'next/image'
import { client } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'

const builder = imageUrlBuilder(client)

function urlFor(source) {
  return builder.image(source)
}

// Portable Text components for rich text rendering
const portableTextComponents = {
  block: {
    h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mb-3">{children}</h3>,
    h4: ({children}) => <h4 className="text-lg font-medium text-gray-900 mb-2">{children}</h4>,
    normal: ({children}) => <p className="text-gray-700 mb-4">{children}</p>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
  },
}

async function getAboutData() {
  const aboutData = await client.fetch(
    `*[_type == "aboutPage" && _id == "aboutPage"][0]{
      title,
      heroImage,
      heroTitle,
      heroSubtitle,
      profileImage,
      introduction,
      story,
      passions,
      equipment,
      additionalSections,
      callToAction
    }`,
    {},
    { next: { revalidate: 60 } }
  )

  return aboutData
}

export default async function About() {
  const aboutData = await getAboutData()

  // Fallback if no data exists yet
  if (!aboutData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About Page</h1>
          <p className="text-gray-600">Please set up your about page content in Sanity Studio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen">
        {aboutData.heroImage && (
          <Image
            src={urlFor(aboutData.heroImage).width(1920).height(1080).url()}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative flex items-center justify-center h-full">
          <div className="text-center text-white px-6">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              {aboutData.heroTitle || 'About Sam'}
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90">
              {aboutData.heroSubtitle || 'Wildlife & Nature Photography'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Profile Image */}
          <div className="order-2 lg:order-1">
            {aboutData.profileImage ? (
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(aboutData.profileImage).width(500).height(400).url()}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 shadow-2xl">
                <div className="flex items-center justify-center h-full">
                  <span className="text-green-600 text-lg font-medium">Profile Photo</span>
                </div>
              </div>
            )}
          </div>

          {/* About Text */}
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">My Journey with Nature</h2>

            {/* Introduction */}
            {aboutData.introduction && (
              <div className="text-lg md:text-xl text-gray-600 leading-relaxed">
                <p>{aboutData.introduction}</p>
              </div>
            )}

            {/* Main Story */}
            {aboutData.story && (
              <div className="prose prose-lg md:prose-xl text-gray-600 leading-relaxed max-w-none">
                <PortableText
                  value={aboutData.story}
                  components={portableTextComponents}
                />
              </div>
            )}

            {/* What Drives Me */}
            {aboutData.passions && aboutData.passions.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-8 mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What Drives Me</h3>
                <ul className="space-y-4">
                  {aboutData.passions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span className="text-gray-700 text-lg">{item.passion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Equipment Section */}
        {aboutData.equipment?.showEquipment && (
          <div className="mt-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              {aboutData.equipment.equipmentTitle || 'Currently Using'}
            </h3>
            <div className="grid md:grid-cols-2 gap-12">
              {aboutData.equipment.camera && aboutData.equipment.camera.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Camera Kit</h4>
                  <ul className="space-y-3">
                    {aboutData.equipment.camera.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aboutData.equipment.locations && aboutData.equipment.locations.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Favourite Locations</h4>
                  <ul className="space-y-3">
                    {aboutData.equipment.locations.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Sections */}
        {aboutData.additionalSections && aboutData.additionalSections.map((section, index) => (
          <div key={index} className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{section.sectionTitle}</h3>
            <div className={`grid ${section.sectionImage ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
              {section.sectionImage && (
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={urlFor(section.sectionImage).width(400).height(256).url()}
                    alt={section.sectionTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="prose prose-lg text-gray-700">
                <PortableText
                  value={section.sectionContent}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Call to Action */}
        {aboutData.callToAction && (
          <div className="mt-24 text-center bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-16 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              {aboutData.callToAction.ctaTitle || "Let's Connect"}
            </h3>
            {aboutData.callToAction.ctaText && (
              <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                {aboutData.callToAction.ctaText}
              </p>
            )}
            <a
              href="/contact"
              className="inline-block bg-white text-green-700 px-10 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {aboutData.callToAction.ctaButtonText || 'Get in Touch'}
            </a>
          </div>
        )}
      </section>
    </div>
  )
}