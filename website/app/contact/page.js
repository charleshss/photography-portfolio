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
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative flex items-center justify-center hero-height">
                {contactData.heroImage ? (
                    <Image
                        src={urlFor(contactData.heroImage)
                            .width(1920)
                            .height(1080)
                            .quality(95)
                            .url()}
                        alt="Contact hero background"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-surface-alt" />
                )}
                <div className="gradient-overlay" />
                <div className="relative z-10 flex items-center justify-center px-6 w-full h-full">
                    <div className="max-w-4xl text-center">
                        <h1 className="hero-title mb-6 tracking-tight text-shadow-lg text-hero-text">
                            {contactData.heroTitle}
                        </h1>
                        <p className="hero-subtitle mx-auto font-light text-shadow-md text-hero-text/80">
                            {contactData.heroSubtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="section-padding">
                <div className="mx-auto max-w-7xl space-y-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 lg:space-y-0">
                    {/* Profile Image */}
                    <div className="order-1 lg:order-1 lg:row-span-3">
                        <div className="relative h-96 w-full overflow-hidden rounded-3xl border border-white/5 shadow-[var(--shadow-soft)] lg:h-[400px]">
                            {contactData.contactImage ? (
                                <>
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
                                    {/* Subtle overlay to reduce brightness and improve surrounding content readability */}
                                    <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                                </>
                            ) : (
                                <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface to-surface-alt">
                                    <div className="text-center">
                                        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
                                            <User className="h-12 w-12 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                            Samuel SS
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Professional wildlife & nature
                                            photography
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="order-2 lg:order-2">
                        <div className="glass-panel h-full px-12 py-12">
                            <h2 className="section-subtitle mb-6 text-foreground">
                                Send a Message
                            </h2>

                            {contactData.introText && (
                                <p className="body-large mb-8 max-w-2xl text-text">
                                    {contactData.introText}
                                </p>
                            )}

                            <ContactForm />
                        </div>
                    </div>

                    {/* Instagram Section */}
                    {contactData.instagramUsername && (
                        <div className="order-3 lg:order-1 lg:col-start-1">
                            <div className="glass-panel px-8 py-10 text-center transition-all duration-300 hover:border-primary/50">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                                        <Instagram className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                        Follow on Instagram
                                    </h3>
                                    <a
                                        href={`https://instagram.com/${contactData.instagramUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mb-2 inline-block text-xl font-semibold text-foreground transition-colors duration-300 hover:text-primary"
                                    >
                                        @{contactData.instagramUsername}
                                    </a>
                                    <p className="text-muted-foreground">
                                        See my latest work and send me a DM
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email Section */}
                    {contactData.email && (
                        <div className="order-4 lg:order-1 lg:col-start-1">
                            <div className="glass-panel px-8 py-10 text-center transition-all duration-300 hover:border-primary/50">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                                        <Mail className="h-7 w-7 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                        Prefer Email?
                                    </h3>
                                    <a
                                        href={`mailto:${contactData.email}`}
                                        className="mb-2 inline-block text-lg sm:text-xl font-semibold text-foreground transition-colors duration-300 hover:text-primary break-all"
                                    >
                                        {contactData.email}
                                    </a>
                                    <p className="text-muted-foreground">
                                        Click to open your email client directly
                                        with my address.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Response Time Card */}
                    {contactData.responseTime && (
                        <div className="order-5 lg:order-3 lg:col-span-2">
                            <div className="glass-panel mx-auto max-w-3xl px-8 py-10 text-center transition-all duration-300 hover:border-primary/50">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                                        <Info className="h-6 w-6 text-primary" />
                                    </div>
                                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                        Quick Response Promise
                                    </p>
                                    <p className="text-base text-muted-foreground">
                                        {contactData.responseTime}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
