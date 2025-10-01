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
            <section className="relative hero-height">
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
                <div className="gradient-overlay" />
                <div className="relative flex items-center justify-center h-full px-6">
                    <div className="text-center text-white max-w-4xl">
                        <h1 className="hero-title tracking-tight mb-6 text-shadow-lg">
                            {contactData.heroTitle}
                        </h1>
                        <p className="hero-subtitle font-light opacity-90 mx-auto max-w-2xl text-shadow-md">
                            {contactData.heroSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="max-w-7xl mx-auto section-padding">
                <div className="grid lg:grid-cols-2 items-center gap-16">
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
                        <div className="bg-white rounded-3xl shadow-xl h-full px-12 py-8">
                            <h2 className="section-subtitle text-foreground mb-6">
                                Send a Message
                            </h2>

                            {contactData.introText && (
                                <p className="body-large text-muted-foreground max-w-2xl mb-8">
                                    {contactData.introText}
                                </p>
                            )}

                            <ContactForm />
                        </div>
                    </div>
                </div>

                {/* Response Time Card - Full Width Below */}
                {contactData.responseTime && (
                    <div className="mt-24 order-3">
                        <div className="bg-blue-50 rounded-xl border border-blue-200 max-w-3xl mx-auto p-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
                                    <Info className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-lg font-semibold text-blue-800 mb-2">
                                    Quick Response Promise
                                </p>
                                <p className="text-base text-blue-700">
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
