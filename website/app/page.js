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
        console.warn('Sanity CMS not available, using static home content', error);
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
        <main className="min-h-screen">
            {/* Hero Section with Carousel - Full viewport height */}
            <section className="relative h-screen">
                <HeroCarousel />
            </section>

            {/* Hero Content Section - Unified Dark */}
            <section className="section-padding pt-0">
                <div className="glass-panel mx-auto max-w-5xl px-8 py-14 text-center">
                    <span className="tag-capsule mx-auto mb-8">
                        {pageData.heroTagline}
                    </span>
                    <h1 className="section-title mb-6 text-foreground">
                        {pageData.businessName}
                    </h1>
                    <p className="body-large mx-auto max-w-3xl text-text">
                        {pageData.heroDescription}
                    </p>
                    <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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

            <div className="py-12">
                <span className="divider-gradient" />
            </div>

            {/* My Best Work Section - Unified Dark */}
            <section className="section-padding">
                <div className="mx-auto max-w-7xl space-y-14">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="section-subtitle mb-4 text-foreground">
                            {pageData.featuredSection.sectionTitle}
                        </h2>
                        <p className="body-large text-text">
                            {pageData.featuredSection.sectionDescription}
                        </p>
                    </div>

                    {/* Featured Images Grid - Updated to use Sanity */}
                    {featuredImages.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
                            <div className="text-muted-foreground mb-4">
                                No featured images yet
                            </div>
                            <p className="text-sm text-grey-pale">
                                Upload some photos in Sanity Studio and mark
                                them as &#34;Featured&#34; to see them here
                            </p>
                        </div>
                    )}

                    {/* View All Button */}
                    <div className="flex justify-center pt-6">
                        <Link href="/portfolio" className="cta-button-outline">
                            {pageData.featuredSection.viewAllButtonText}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Sleek Section Divider */}
            <div className="section-padding py-10">
                <span className="divider-gradient" />
            </div>

            {/* CTA Section - Sleek with Gradient */}
            <section className="section-padding">
                <div className="glass-panel mx-auto flex max-w-5xl flex-col gap-6 px-8 py-14 text-center">
                    <h2 className="section-subtitle text-foreground">
                        {pageData.collaborationSection.ctaTitle}
                    </h2>
                    <p className="body-large text-muted-foreground">
                        {pageData.collaborationSection.ctaDescription}
                    </p>
                    <a
                        href={pageData.collaborationSection.ctaButtonLink}
                        className="cta-button mx-auto mt-6"
                    >
                        {pageData.collaborationSection.ctaButtonText}
                    </a>
                </div>
            </section>
        </main>
    );
}
