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

            <section className="bg-white px-6 py-16">
                <div className="mx-auto max-w-4xl text-center">
                    <span className="mb-4 block text-sm uppercase tracking-[0.3em] text-gray-400">
                        {pageData.heroTagline}
                    </span>
                    <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                        {pageData.businessName}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
                        {pageData.heroDescription}
                    </p>
                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href={pageData.primaryButton.link}
                            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                        >
                            {pageData.primaryButton.text}
                        </Link>
                        <Link
                            href={pageData.secondaryButton.link}
                            className="inline-flex items-center justify-center rounded-full border-2 border-gray-900 px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
                        >
                            {pageData.secondaryButton.text}
                        </Link>
                    </div>
                </div>
            </section>

            {/* My Best Work Section - Now uses Sanity data */}
            <section className="bg-white px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold md:text-4xl">
                            {pageData.featuredSection.sectionTitle}
                        </h2>
                        <p className="mx-auto max-w-2xl text-gray-600">
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
                    <div className="mt-10 text-center">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                        >
                            {pageData.featuredSection.viewAllButtonText}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50">
                <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-20 text-center">
                    <h2 className="text-3xl font-semibold sm:text-4xl">
                        {pageData.collaborationSection.ctaTitle}
                    </h2>
                    <p className="text-base text-gray-600 sm:text-lg">
                        {pageData.collaborationSection.ctaDescription}
                    </p>
                    <a
                        href={pageData.collaborationSection.ctaButtonLink}
                        className="mx-auto inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                    >
                        {pageData.collaborationSection.ctaButtonText}
                    </a>
                </div>
            </section>
        </main>
    );
}
