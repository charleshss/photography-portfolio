// website/app/page.js
import HeroCarousel from '@/components/HeroCarousel';
import ImageCard from '@/components/ImageCard';
import Link from 'next/link';
import { getFeaturedImages, serverClient } from '@/lib/sanity';

async function getHomePageData() {
    try {
        const homeData = await serverClient.fetch(
            `*[_type == "homePage"][0]{
        heroTagline,
        businessName,
        heroTitle,
        heroDescription,
        primaryButton,
        secondaryButton,
        featuredSection,
        collaborationSection
      }`,
            {},
            { next: { revalidate: 60 } }
        );
        return homeData;
    } catch (error) {
        console.log('Sanity CMS not available, using static content');
        return null;
    }
}

export default async function Home() {
    // Fetch both home page data and featured images from Sanity
    let featuredImages = [];
    let homeData = null;

    try {
        [homeData, featuredImages] = await Promise.all([
            getHomePageData(),
            getFeaturedImages(),
        ]);
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    // Fallback data when Sanity is unavailable
    const fallbackData = {
        heroTagline: 'Wild Landscapes • Intimate Wildlife',
        businessName: 'SamuelSS. Photography',
        heroDescription:
            'Professional photographer based in Essex, England. Specialising in dramatic landscapes and compelling wildlife portraits.',
        primaryButton: {
            text: 'View Portfolio',
            link: '/portfolio',
        },
        secondaryButton: {
            text: 'Work Together',
            link: '/contact',
        },
        featuredSection: {
            sectionTitle: 'My Best Work',
            sectionDescription:
                'A carefully curated selection of my favourite captures from years of exploring the natural world',
            viewAllButtonText: 'View Full Portfolio',
        },
        collaborationSection: {
            ctaTitle: "Let's plan your next visual story",
            ctaDescription:
                "Whether you want to explore nature and search for wildlife together. I'd love to collaborate.",
            ctaButtonText: 'Start a conversation',
            ctaButtonLink: '/contact',
        },
    };

    const pageData = {
        ...fallbackData,
        ...homeData,
        businessName:
            homeData?.businessName ||
            homeData?.heroTitle ||
            fallbackData.businessName,
    };

    return (
        <main className="min-h-screen bg-white text-gray-900">
            {/* Hero Section with Carousel - Full viewport height */}
            <section className="relative h-screen">
                <HeroCarousel />
            </section>

            {/* Modern Section Divider */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <section
                className="bg-white"
                style={{
                    padding: `var(--spacing-4xl) var(--spacing-lg)`,
                }}
            >
                <div className="mx-auto max-w-4xl text-center">
                    <span
                        className="block uppercase tracking-[0.3em] mb-3"
                        style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--color-warm-grey)',
                            letterSpacing: '0.15em',
                        }}
                    >
                        {pageData.heroTagline}
                    </span>
                    <h1
                        className="font-bold mb-6"
                        style={{
                            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                            lineHeight: 'var(--leading-tight)',
                            color: 'var(--color-rich-black)',
                        }}
                    >
                        {pageData.businessName}
                    </h1>
                    <p
                        className="mx-auto max-w-2xl"
                        style={{
                            fontSize: 'var(--text-lg)',
                            lineHeight: 'var(--leading-relaxed)',
                            color: 'var(--color-mid-grey)',
                        }}
                    >
                        {pageData.heroDescription}
                    </p>
                    <div
                        className="flex flex-col items-center sm:flex-row sm:justify-center"
                        style={{
                            marginTop: 'var(--spacing-xl)',
                            gap: 'var(--spacing-md)',
                        }}
                    >
                        <Link
                            href={pageData.primaryButton.link}
                            className="inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                            style={{
                                backgroundColor: 'var(--color-rich-black)',
                                color: 'var(--color-pure-white)',
                                padding: 'var(--spacing-md) var(--spacing-xl)',
                                fontSize: 'var(--text-base)',
                            }}
                        >
                            {pageData.primaryButton.text}
                        </Link>
                        <Link
                            href={pageData.secondaryButton.link}
                            className="inline-flex items-center justify-center rounded-full font-semibold border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                            style={{
                                borderColor: 'var(--color-rich-black)',
                                color: 'var(--color-rich-black)',
                                padding: 'var(--spacing-md) var(--spacing-xl)',
                                fontSize: 'var(--text-base)',
                            }}
                        >
                            {pageData.secondaryButton.text}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Modern Section Divider with Accent */}
            <div className="relative py-12">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                    <div className="bg-white px-6">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-600" />
                    </div>
                </div>
            </div>

            {/* My Best Work Section - Now uses Sanity data */}
            <section
                className="bg-white"
                style={{
                    padding: `var(--spacing-4xl) var(--spacing-lg)`,
                }}
            >
                <div className="mx-auto max-w-7xl">
                    <div className="text-center" style={{ marginBottom: 'var(--spacing-3xl)' }}>
                        <h2
                            className="font-bold mb-4"
                            style={{
                                fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
                                lineHeight: 'var(--leading-tight)',
                                color: 'var(--color-rich-black)',
                            }}
                        >
                            {pageData.featuredSection.sectionTitle}
                        </h2>
                        <p
                            className="mx-auto max-w-2xl"
                            style={{
                                fontSize: 'var(--text-lg)',
                                lineHeight: 'var(--leading-relaxed)',
                                color: 'var(--color-mid-grey)',
                            }}
                        >
                            {pageData.featuredSection.sectionDescription}
                        </p>
                    </div>

                    {/* Featured Images Grid - Updated to use Sanity */}
                    {featuredImages.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {featuredImages.map((image) => (
                                <ImageCard
                                    key={image._id}
                                    image={{
                                        ...image,
                                        href: image.slug?.current
                                            ? `/photo/${image.slug.current}`
                                            : `/portfolio/${image.category}`,
                                    }}
                                    aspectRatio="aspect-[4/3]"
                                    showLocation={true}
                                />
                            ))}
                        </div>
                    ) : (
                        // Fallback when no featured images exist
                        <div className="text-center py-12">
                            <div className="text-gray-500 mb-4">
                                No featured images yet
                            </div>
                            <p className="text-sm text-gray-400">
                                Upload some photos in Sanity Studio and mark
                                them as &#34;Featured&#34; to see them here
                            </p>
                        </div>
                    )}

                    {/* View All Button */}
                    <div className="text-center" style={{ marginTop: 'var(--spacing-3xl)' }}>
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                            style={{
                                backgroundColor: 'var(--color-rich-black)',
                                color: 'var(--color-pure-white)',
                                padding: 'var(--spacing-md) var(--spacing-xl)',
                                fontSize: 'var(--text-base)',
                            }}
                        >
                            {pageData.featuredSection.viewAllButtonText}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Modern Section Divider - Subtle Line */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8" />

            <section
                style={{
                    backgroundColor: 'var(--color-warm-white)',
                    padding: `var(--spacing-4xl) var(--spacing-lg)`,
                }}
            >
                <div className="mx-auto flex max-w-4xl flex-col text-center" style={{ gap: 'var(--spacing-lg)' }}>
                    <h2
                        className="font-semibold"
                        style={{
                            fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
                            lineHeight: 'var(--leading-tight)',
                            color: 'var(--color-rich-black)',
                        }}
                    >
                        {pageData.collaborationSection.ctaTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: 'var(--text-lg)',
                            lineHeight: 'var(--leading-relaxed)',
                            color: 'var(--color-mid-grey)',
                        }}
                    >
                        {pageData.collaborationSection.ctaDescription}
                    </p>
                    <a
                        href={pageData.collaborationSection.ctaButtonLink}
                        className="mx-auto inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                        style={{
                            backgroundColor: 'var(--color-rich-black)',
                            color: 'var(--color-pure-white)',
                            padding: 'var(--spacing-md) var(--spacing-xl)',
                            fontSize: 'var(--text-base)',
                        }}
                    >
                        {pageData.collaborationSection.ctaButtonText}
                    </a>
                </div>
            </section>
        </main>
    );
}
