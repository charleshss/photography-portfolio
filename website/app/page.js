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
            <div className="section-divider" />

            <section className="bg-white section-padding">
                <div className="mx-auto max-w-4xl text-center">
                    <span className="block uppercase tracking-[0.15em] text-sm text-muted-foreground mb-3">
                        {pageData.heroTagline}
                    </span>
                    <h1 className="section-title text-foreground mb-6">
                        {pageData.businessName}
                    </h1>
                    <p className="body-large text-muted-foreground mx-auto max-w-2xl">
                        {pageData.heroDescription}
                    </p>
                    <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-4 mt-8">
                        <Link
                            href={pageData.primaryButton.link}
                            className="cta-button"
                        >
                            {pageData.primaryButton.text}
                        </Link>
                        <Link
                            href={pageData.secondaryButton.link}
                            className="cta-button-outline"
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
            <section className="bg-white section-padding">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="section-subtitle text-foreground mb-4">
                            {pageData.featuredSection.sectionTitle}
                        </h2>
                        <p className="body-large text-muted-foreground mx-auto max-w-2xl">
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
                    <div className="text-center mt-16">
                        <Link href="/portfolio" className="cta-button">
                            {pageData.featuredSection.viewAllButtonText}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Modern Section Divider - Subtle Line */}
            <div className="section-divider my-8" />

            <section className="bg-background section-padding">
                <div className="mx-auto flex max-w-4xl flex-col text-center gap-6">
                    <h2 className="section-subtitle text-foreground">
                        {pageData.collaborationSection.ctaTitle}
                    </h2>
                    <p className="body-large text-muted-foreground">
                        {pageData.collaborationSection.ctaDescription}
                    </p>
                    <a
                        href={pageData.collaborationSection.ctaButtonLink}
                        className="cta-button mx-auto"
                    >
                        {pageData.collaborationSection.ctaButtonText}
                    </a>
                </div>
            </section>
        </main>
    );
}
