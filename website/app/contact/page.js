import Image from 'next/image';
import { client } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import ContactForm from '../../components/ContactForm';
import { Instagram, User, Mail, Clock } from 'lucide-react';

const builder = imageUrlBuilder(client);

function urlFor(source) {
    return builder.image(source);
}

async function getContactData() {
    try {
        const contactData = await client.fetch(
            `*[_type == "contactPage" && _id == "contactPage"][0]{
        title,
        heroImage,
        heroTitle,
        heroSubtitle,
        contactImage,
        contactCapsule,
        contactFormTitle,
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
        console.warn('Sanity CMS not available, using static contact content', error);
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

            {/* Main Contact Section - Unified Experience */}
            <section className="section-padding">
                <div className="mx-auto max-w-6xl">
                    <div className="glass-panel px-4 py-10 sm:px-6 md:px-10 lg:px-16">
                        <div className="grid gap-10 md:gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:items-start">
                            {/* Portrait & Contact Details */}
                            <div className="relative grid gap-8 order-1 lg:order-2 lg:h-full">
                                <div className="flex w-full items-center justify-center">
                                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none rounded-[28px] border border-border/60 bg-surface/35 p-3 shadow-[var(--shadow-soft)]">
                                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[24px]">
                                            {contactData.contactImage ? (
                                                <Image
                                                    src={urlFor(contactData.contactImage)
                                                        .width(900)
                                                        .height(1200)
                                                        .quality(90)
                                                        .url()}
                                                    alt="Samuel SS Photography - Contact"
                                                    fill
                                                    className="object-cover object-center"
                                                    priority
                                                />
                                            ) : (
                                                <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-surface to-surface-alt text-center">
                                                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                                                        <User className="h-10 w-10 text-primary" />
                                                    </div>
                                                    <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                                        Samuel SS
                                                    </h3>
                                                    <p className="text-muted-foreground/80">
                                                        Wildlife & Nature Photography
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full flex-col justify-center space-y-7 rounded-[32px] border border-border/40 bg-surface/55 p-6 backdrop-blur-xl shadow-[var(--shadow-soft)] sm:max-w-sm sm:mx-auto md:max-w-none md:p-8 lg:space-y-10">
                                    {contactData.email && (
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground/70">
                                                    Email
                                                </p>
                                                <a
                                                    href={`mailto:${contactData.email}`}
                                                    className="text-base text-muted-foreground transition-colors hover:text-foreground break-words"
                                                >
                                                    {contactData.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {contactData.instagramUsername && (
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                                                <Instagram className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground/70">
                                                    Instagram
                                                </p>
                                                <a
                                                    href={`https://instagram.com/${contactData.instagramUsername}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-base text-muted-foreground transition-colors hover:text-foreground break-words"
                                                >
                                                    @{contactData.instagramUsername}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {contactData.responseTime && (
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground/70">
                                                    Response Time
                                                </p>
                                                <p className="text-sm text-muted-foreground/65">
                                                    {contactData.responseTime}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form + Details */}
                            <div className="flex flex-col gap-10 order-2 lg:order-1">
                                <div className="space-y-4">
                                    <span className="tag-capsule about-tag inline-flex">
                                        {contactData.contactCapsule || 'Ready when you are!'}
                                    </span>
                                    <h2 className="section-subtitle text-foreground">
                                        {contactData.contactFormTitle || `Let’s plan something incredible`}
                                    </h2>
                                    {contactData.introText && (
                                        <p className="body-large text-muted-foreground leading-relaxed">
                                            {contactData.introText}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-10">
                                    <ContactForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
