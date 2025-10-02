import Image from 'next/image';
import { client } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText } from '@portabletext/react';

const builder = imageUrlBuilder(client);

function urlFor(source) {
    return builder.image(source);
}

// Portable Text components for rich text rendering
const portableTextComponents = {
    block: {
        h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight break-words">
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-lg font-medium text-foreground/90 mb-2 break-words">
                {children}
            </h4>
        ),
        normal: ({ children }) => (
            <p className="text-muted-foreground mb-4 break-words leading-relaxed">
                {children}
            </p>
        ),
    },
    marks: {
        strong: ({ children }) => (
            <strong className="font-semibold text-foreground break-words">
                {children}
            </strong>
        ),
        em: ({ children }) => (
            <em className="italic text-foreground/90 break-words">{children}</em>
        ),
    },
};

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
    );

    return aboutData;
}

export default async function About() {
    const aboutData = await getAboutData();

    // Fallback if no data exists yet
    if (!aboutData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="glass-panel px-10 py-12 text-center">
                    <h1 className="section-subtitle mb-4 text-foreground">
                        About Page
                    </h1>
                    <p className="text-muted-foreground">
                        Please set up your about page content in Sanity Studio.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <section className="relative flex items-center justify-center hero-height">
                {aboutData.heroImage && (
                    <Image
                        src={urlFor(aboutData.heroImage)
                            .width(1920)
                            .height(1080)
                            .quality(95)
                            .url()}
                        alt="Hero background"
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="gradient-overlay" />
                <div className="relative z-10 flex items-center justify-center px-6 w-full h-full">
                    <div className="max-w-4xl text-center">
                        <h1 className="hero-title mb-6 tracking-tight text-shadow-lg text-hero-text">
                            {aboutData.heroTitle || 'About Sam'}
                        </h1>
                        <p className="hero-subtitle mx-auto font-light text-shadow-md text-hero-text/80">
                            {aboutData.heroSubtitle ||
                                'Wildlife & Nature Photography'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content - Unified Dark */}
            <section className="section-padding">
                <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
                    {/* Profile Image */}
                    <div className="order-2 lg:order-1">
                        {aboutData.profileImage ? (
                            <div className="relative h-96 w-full overflow-hidden rounded-3xl border border-white/5 shadow-[var(--shadow-soft)]">
                                <Image
                                    src={urlFor(aboutData.profileImage)
                                        .width(500)
                                        .height(400)
                                        .url()}
                                    alt="Profile photo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="relative h-96 w-full overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-surface to-surface-alt">
                                <div className="flex h-full items-center justify-center">
                                    <span className="text-muted-foreground text-lg font-medium uppercase tracking-[0.3em]">
                                        Profile Photo
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* About Text */}
                    <div className="order-1 flex min-w-0 flex-col gap-8 overflow-hidden text-center lg:order-2 lg:text-left">
                        <h2 className="section-title text-foreground break-words">
                            My Journey with Nature
                        </h2>

                        {/* Introduction */}
                        {aboutData.introduction && (
                            <div className="body-large text-text break-words">
                                <p>
                                    {aboutData.introduction}
                                </p>
                            </div>
                        )}

                        {/* Main Story */}
                        {aboutData.story && (
                            <div className="space-y-6 text-base leading-relaxed text-text md:text-lg">
                                <PortableText value={aboutData.story} components={portableTextComponents} />
                            </div>
                        )}

                        {/* What Drives Me */}
                        {aboutData.passions &&
                            aboutData.passions.length > 0 && (
                                <div className="glass-panel mt-8 px-8 py-10">
                                    <h3 className="text-xl font-semibold uppercase tracking-[0.28em] text-muted-foreground mb-6">
                                        What Drives Me
                                    </h3>
                                    <ul className="space-y-4">
                                        {aboutData.passions.map(
                                            (item, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-4"
                                                >
                                                    <div className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0"></div>
                                                    <span className="text-muted-foreground">
                                                        {item.passion}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                    </div>
                </div>

                {/* Equipment Section */}
                {aboutData.equipment?.showEquipment && (
                    <div className="mt-24 space-y-10">
                        <h3 className="section-subtitle text-center text-foreground">
                            {aboutData.equipment.equipmentTitle ||
                                'Currently Using'}
                        </h3>
                        {aboutData.equipment.equipmentDescription && (
                            <p className="mx-auto max-w-3xl text-center text-muted-foreground">
                                {aboutData.equipment.equipmentDescription}
                            </p>
                        )}
                        <div className="grid gap-10 md:grid-cols-2">
                            {aboutData.equipment.camera &&
                                aboutData.equipment.camera.length > 0 && (
                                    <div className="glass-panel px-8 py-10 text-left">
                                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                            Camera Kit
                                        </h4>
                                        <ul className="space-y-3">
                                            {aboutData.equipment.camera.map(
                                                (item, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-4 text-xs uppercase tracking-[0.26em] text-muted-foreground"
                                                    >
                                                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></div>
                                                        <span className="text-foreground/80">
                                                            {item}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            {aboutData.equipment.locations &&
                                aboutData.equipment.locations.length > 0 && (
                                    <div className="glass-panel px-8 py-10 text-left">
                                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                            Favourite Locations
                                        </h4>
                                        <ul className="space-y-3">
                                            {aboutData.equipment.locations.map(
                                                (item, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-4 text-xs uppercase tracking-[0.26em] text-muted-foreground"
                                                    >
                                                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary"></div>
                                                        <span className="text-foreground/80">
                                                            {item}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                        </div>
                    </div>
                )}

                {/* Additional Sections */}
                {aboutData.additionalSections &&
                    aboutData.additionalSections.map((section, index) => (
                        <div key={index} className="mt-16 space-y-6">
                            <h3 className="text-xl font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                {section.sectionTitle}
                            </h3>
                            <div
                                className={`grid gap-8 ${section.sectionImage ? 'md:grid-cols-2' : 'grid-cols-1'}`}
                            >
                                {section.sectionImage && (
                                    <div className="relative h-64 overflow-hidden rounded-3xl border border-white/5 shadow-[var(--shadow-soft)]">
                                        <Image
                                            src={urlFor(section.sectionImage)
                                                .width(400)
                                                .height(256)
                                                .url()}
                                            alt={section.sectionTitle}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="space-y-5 text-muted-foreground">
                                    <PortableText
                                        value={section.sectionContent}
                                        components={portableTextComponents}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                {/* Call to Action - Clean Dark */}
                {aboutData.callToAction && (
                    <div className="glass-panel mt-24 px-10 py-14 text-center">
                        <h3 className="section-subtitle mb-6 text-foreground">
                            {aboutData.callToAction.ctaTitle || "Let's Connect"}
                        </h3>
                        {aboutData.callToAction.ctaText && (
                            <p className="body-large mx-auto mb-8 max-w-2xl break-words text-muted-foreground">
                                {aboutData.callToAction.ctaText}
                            </p>
                        )}
                        <a
                            href="/contact"
                            className="cta-button"
                        >
                            {aboutData.callToAction.ctaButtonText ||
                                'Get in Touch'}
                        </a>
                    </div>
                )}
            </section>
        </div>
    );
}
