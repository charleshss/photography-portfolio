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
            <p className="text-muted-foreground mb-4 leading-relaxed break-words">
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
      heroBadge,
      profileImage,
      introduction,
      storyKicker,
      storyTitle,
      story,
      passionCapsule,
      passionTitle,
      passions,
      equipment,
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

    const introductionBlock = aboutData.introduction
        ? [
            {
                _type: 'block',
                style: 'normal',
                markDefs: [],
                children: [
                    {
                        _type: 'span',
                        text: aboutData.introduction,
                    },
                ],
            },
        ]
        : [];

    const storyContent = aboutData.story?.length
        ? [...aboutData.story]
        : !aboutData.introduction
            ? [...introductionBlock]
            : [];

    const highlightStats = [
        aboutData.passions?.length === 1
            ? {
                label: 'Passion',
                value: '1',
            }
            : aboutData.passions?.length > 1
                ? {
                    label: 'Passions',
                    value: aboutData.passions.length.toString(),
                }
                : null,
        aboutData.equipment?.camera?.length
            ? {
                label: 'Camera Kit Pieces',
                value: aboutData.equipment.camera.length.toString(),
            }
            : null,
        aboutData.equipment?.locations?.length
            ? {
                label: 'Favourite Locations',
                value: aboutData.equipment.locations.length.toString(),
            }
            : null,
    ].filter(Boolean);

    const heroTitle =
        aboutData.heroTitle?.trim() || 'My Journey with Nature';

    const heroBadge =
        aboutData.heroBadge?.trim() ||
        'Behind the Lens';

    const storyTagline =
        aboutData.storyKicker?.trim() || 'Field Notes';

    const storyHeading =
        aboutData.storyTitle?.trim() ||
        aboutData.heroTitle?.trim() ||
        'Story Behind the Lens';

    const passionCapsule =
        aboutData.passionCapsule?.trim() || 'What Drives Me';

    const passionTitle =
        aboutData.passionTitle?.trim() || 'The heartbeat behind the work';

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="about-hero lg:overflow-hidden lg:hero-height py-16 sm:py-20 lg:py-0">
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
                <div className="gradient-overlay about-hero-overlay" />
                <div className="about-hero-inner">
                    <div className="about-hero-panel">
                        <div className="about-portrait">
                            {aboutData.profileImage ? (
                                <Image
                                    src={urlFor(aboutData.profileImage)
                                        .width(720)
                                        .height(960)
                                        .quality(90)
                                        .url()}
                                    alt="Profile photo"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="about-portrait-fallback">
                                    <span>Profile Photo</span>
                                </div>
                            )}
                        </div>
                        <div className="about-copy">
                            <span className="tag-capsule about-tag">
                                {heroBadge}
                            </span>
                            <h1 className="hero-title text-left text-hero-text">
                                {heroTitle}
                            </h1>
                            <p className="hero-subtitle about-subtitle text-left text-hero-text/80">
                                {aboutData.heroSubtitle ||
                                    'Wildlife & Nature Photography'}
                            </p>
                            {aboutData.introduction && (
                                <p className="about-lede text-hero-text/85">
                                    {aboutData.introduction}
                                </p>
                            )}
                            {highlightStats.length > 0 && (
                                <div className="about-stats">
                                    {highlightStats.map((stat, index) => (
                                        <div
                                            key={index}
                                            className="about-stats-item"
                                        >
                                            <span className="about-stats-value">
                                                {stat.value}
                                            </span>
                                            <span className="about-stats-label">
                                                {stat.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="section-padding-lg">
                <div className="mx-auto max-w-6xl space-y-20 px-6 md:px-10 lg:px-0">
                    {storyContent.length > 0 && (
                        <div className="about-panel about-story">
                            <div className="space-y-4">
                                <span className="tag-capsule about-tag">
                                    {storyTagline}
                                </span>
                                {storyHeading && (
                                    <h2 className="section-subtitle text-foreground">
                                        {storyHeading}
                                    </h2>
                                )}
                            </div>
                            <div className="prose prose-lg prose-invert max-w-none text-muted-foreground/85">
                                <PortableText
                                    value={storyContent}
                                    components={portableTextComponents}
                                />
                            </div>
                        </div>
                    )}

                    {/* {aboutData.additionalSections &&
                        aboutData.additionalSections.length > 0 && (
                            <div className="mx-auto mt-24 max-w-6xl space-y-24 px-6 md:px-10 lg:px-0">
                                {aboutData.additionalSections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="grid gap-16 lg:grid-cols-2 lg:items-center"
                                    >
                                        {index % 2 === 0 ? (
                                            <>
                                                {section.sectionImage && (
                                                    <div className="about-panel about-section-image">
                                                        <Image
                                                            src={urlFor(section.sectionImage)
                                                                .width(800)
                                                                .height(600)
                                                                .url()}
                                                            alt={section.sectionTitle}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="space-y-6">
                                                    <h3 className="text-3xl font-semibold text-foreground">
                                                        {section.sectionTitle}
                                                    </h3>
                                                    <div className="prose prose-lg prose-invert max-w-none text-muted-foreground/85">
                                                        <PortableText
                                                            value={section.sectionContent}
                                                            components={portableTextComponents}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-6">
                                                    <h3 className="text-3xl font-semibold text-foreground">
                                                        {section.sectionTitle}
                                                    </h3>
                                                    <div className="prose prose-lg prose-invert max-w-none text-muted-foreground/85">
                                                        <PortableText
                                                            value={section.sectionContent}
                                                            components={portableTextComponents}
                                                        />
                                                    </div>
                                                </div>
                                                {section.sectionImage && (
                                                    <div className="about-panel about-section-image">
                                                        <Image
                                                            src={urlFor(section.sectionImage)
                                                                .width(800)
                                                                .height(600)
                                                                .url()}
                                                            alt={section.sectionTitle}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )} */}

                    {aboutData.passions && aboutData.passions.length > 0 && (
                        <div className="space-y-10">
                            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                                <div className="space-y-3">
                                    <span className="tag-capsule about-tag">
                                        {passionCapsule}
                                    </span>
                                    <h3 className="text-3xl font-semibold text-foreground">
                                        {passionTitle}
                                    </h3>
                                </div>
                                {aboutData.heroSubtitle && (
                                    <p className="max-w-xl text-muted-foreground">
                                        {aboutData.heroSubtitle}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {aboutData.passions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="about-pill-card"
                                    >
                                        <div className="about-pill-dot" />
                                        <span className="about-pill-text">
                                            {item.passion}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {aboutData.equipment?.showEquipment && (
                        <div className="space-y-12">
                            <div className="space-y-3 text-center">
                                <span className="tag-capsule about-tag mx-auto">
                                    {aboutData.equipment.equipmentCapsule || 'Gear I Use'}
                                </span>
                                <h3 className="section-subtitle text-foreground">
                                    {aboutData.equipment.equipmentTitle || 'My Gear & Favourite Spots'}
                                </h3>
                                {/* {aboutData.equipment.equipmentDescription && (
                                    <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
                                        {aboutData.equipment.equipmentDescription}
                                    </p>
                                )} */}
                            </div>

                            <div className="grid w-full gap-8 md:grid-cols-2">
                                {aboutData.equipment.camera &&
                                    aboutData.equipment.camera.length > 0 && (
                                        <div className="glass-panel px-10 py-12">
                                            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                                                {aboutData.equipment.cameraTitle || 'Camera Gear'}
                                            </h4>
                                            <ul className="space-y-4">
                                                {aboutData.equipment.camera.map(
                                                    (item, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start gap-4 text-base text-muted-foreground"
                                                        >
                                                            <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></div>
                                                            <span className="text-foreground/90 leading-relaxed">
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
                                        <div className="glass-panel px-10 py-12">
                                            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
                                                {aboutData.equipment.locationsTitle || 'Favourite Locations'}
                                            </h4>
                                            <ul className="space-y-4">
                                                {aboutData.equipment.locations.map(
                                                    (item, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start gap-4 text-base text-muted-foreground"
                                                        >
                                                            <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary"></div>
                                                            <span className="text-foreground/90 leading-relaxed">
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
                </div>

                {aboutData.callToAction && (
                    <div className="mx-auto mt-24 max-w-6xl px-6 md:px-10 lg:px-0">
                        <div className="glass-panel px-12 py-16 text-center">
                            <h3 className="section-subtitle mb-6 text-foreground">
                                {aboutData.callToAction.ctaTitle || "Let's Connect"}
                            </h3>
                            {aboutData.callToAction.ctaText && (
                                <p className="text-xl mx-auto mb-10 max-w-2xl text-muted-foreground leading-relaxed">
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
                    </div>
                )}
            </section>
        </div>
    );
}
