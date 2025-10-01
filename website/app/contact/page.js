import Image from 'next/image';
import { client } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import ContactForm from '../../components/ContactForm';
import { Instagram, User, Info, Mail } from 'lucide-react';

const builder = imageUrlBuilder(client);

function urlFor(source) {
    return builder.image(source);
}

async function getContactData() {
    try {
        const contactData = await client.fetch(
            `*[_type == "contactPageNew" && _id == "contactPageNew"][0]{
        title,
        heroImage,
        heroTitle,
        heroSubtitle,
        contactImage,
        introText,
        email,
        instagramUsername,
        responseTime
      }`,
            {},
            { next: { revalidate: 60 } }
        );
        return contactData;
    } catch (error) {
        console.log('Sanity CMS not available, using static content');
        return null;
    }
}

export default async function Contact() {
    // Try to get data from Sanity CMS, fallback to static data
    const sanityData = await getContactData();

    const contactData = sanityData || {
        heroTitle: "Let's Connect",
        heroSubtitle: 'Ready to capture your next adventure?',
        introText:
            "I'd love to hear about your photography needs. Whether you're looking for wildlife prints, landscape photography, or want to discuss a commission, drop me a message below.",
        email: 'contact@samuelss.photography',
        instagramUsername: 'samuelss_photography',
        responseTime: 'I typically respond within 24-48 hours',
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section
                className="relative"
                style={{ height: 'calc(100vh - var(--spacing-4xl))' }}
            >
                {contactData.heroImage ? (
                    <Image
                        src={urlFor(contactData.heroImage)
                            .width(1920)
                            .height(1080)
                            .url()}
                        alt="Contact hero background"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />
                <div className="relative flex items-center justify-center h-full px-6">
                    <div className="text-center text-white max-w-4xl">
                        <h1
                            className="font-bold tracking-tight"
                            style={{
                                fontSize: 'clamp(3rem, 6vw, 5rem)',
                                lineHeight: 'var(--leading-tight)',
                                marginBottom: 'var(--spacing-lg)',
                                textShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
                            }}
                        >
                            {contactData.heroTitle}
                        </h1>
                        <p
                            className="font-light opacity-90 mx-auto"
                            style={{
                                fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                                lineHeight: 'var(--leading-relaxed)',
                                maxWidth: '42rem',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
                            }}
                        >
                            {contactData.heroSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section
                className="max-w-7xl mx-auto"
                style={{
                    padding: `var(--spacing-4xl) var(--spacing-lg)`,
                }}
            >
                <div
                    className="grid lg:grid-cols-2 items-center"
                    style={{ gap: 'var(--spacing-3xl)' }}
                >
                    {/* Left Side: Profile Image and Instagram Cards */}
                    <div className="order-1 lg:order-1 space-y-8">
                        {/* Profile Image */}
                        <div className="relative h-96 lg:h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                            {contactData.contactImage ? (
                                <Image
                                    src={urlFor(contactData.contactImage)
                                        .width(600)
                                        .height(400)
                                        .url()}
                                    alt="Samuel SS Photography - Contact"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <User className="w-12 h-12 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-green-800 mb-2">
                                            Samuel SS
                                        </h3>
                                        <p className="text-green-600">
                                            Professional wildlife & nature
                                            photography
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Instagram Section */}
                        {contactData.instagramUsername && (
                            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 border border-pink-200 shadow-lg">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <Instagram className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Follow on Instagram
                                    </h3>
                                    <a
                                        href={`https://instagram.com/${contactData.instagramUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block text-pink-600 hover:text-pink-700 transition-colors text-xl font-semibold hover:underline mb-2"
                                    >
                                        @{contactData.instagramUsername}
                                    </a>
                                    <p className="text-gray-600">
                                        See my latest work and send me a DM
                                    </p>
                                </div>
                            </div>
                        )}
                        {contactData.email && (
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 shadow-lg">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Prefer Email?
                                    </h3>
                                    <a
                                        href={`mailto:${contactData.email}`}
                                        className="inline-block text-blue-600 hover:text-blue-700 transition-colors text-xl font-semibold hover:underline mb-2"
                                    >
                                        {contactData.email}
                                    </a>
                                    <p className="text-gray-600">
                                        Click to open your email client directly
                                        with my address.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="order-2 lg:order-2">
                        <div
                            className="bg-white rounded-3xl shadow-xl h-full"
                            style={{
                                padding: 'var(--spacing-xl) var(--spacing-2xl)',
                            }}
                        >
                            <h2
                                className="font-bold"
                                style={{
                                    fontSize: 'clamp(1.875rem, 4vw, 2.5rem)',
                                    lineHeight: 'var(--leading-tight)',
                                    color: 'var(--color-rich-black)',
                                    marginBottom: 'var(--spacing-lg)',
                                }}
                            >
                                Send a Message
                            </h2>

                            {contactData.introText && (
                                <p
                                    className="max-w-2xl"
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        lineHeight: 'var(--leading-relaxed)',
                                        color: 'var(--color-mid-grey)',
                                        marginBottom: 'var(--spacing-xl)',
                                    }}
                                >
                                    {contactData.introText}
                                </p>
                            )}

                            <ContactForm />
                        </div>
                    </div>
                </div>

                {/* Response Time Card - Full Width Below */}
                {contactData.responseTime && (
                    <div style={{ marginTop: 'var(--spacing-4xl)' }} className="order-3">
                        <div
                            className="bg-blue-50 rounded-xl border border-blue-200 max-w-3xl mx-auto"
                            style={{ padding: 'var(--spacing-xl)' }}
                        >
                            <div className="text-center">
                                <div
                                    className="bg-blue-500 rounded-full mx-auto flex items-center justify-center"
                                    style={{
                                        width: 'var(--spacing-3xl)',
                                        height: 'var(--spacing-3xl)',
                                        marginBottom: 'var(--spacing-md)',
                                    }}
                                >
                                    <Info
                                        style={{
                                            width: 'var(--spacing-lg)',
                                            height: 'var(--spacing-lg)',
                                        }}
                                        className="text-white"
                                    />
                                </div>
                                <p
                                    className="text-blue-800 font-semibold"
                                    style={{
                                        fontSize: 'var(--text-lg)',
                                        marginBottom: 'var(--spacing-xs)',
                                    }}
                                >
                                    Quick Response Promise
                                </p>
                                <p
                                    className="text-blue-700"
                                    style={{ fontSize: 'var(--text-base)' }}
                                >
                                    {contactData.responseTime}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
