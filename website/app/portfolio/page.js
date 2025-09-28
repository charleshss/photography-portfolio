// app/portfolio/page.js
import Link from 'next/link';
import Gallery from '@/components/Gallery';
import {
    getImagesByCategory,
    getPortfolioStats,
    serverClient,
} from '@/lib/sanity';

async function getPortfolioPageData() {
    try {
        return await serverClient.fetch(
            `*[_type == "portfolioPage"][0]{
                heroTitle,
                heroDescription,
                landscapeDescription,
                wildlifeDescription,
                ctaTitle,
                ctaDescription,
                ctaButtonText,
                ctaButtonLink
            }`,
            {},
            { next: { revalidate: 60 } }
        );
    } catch (error) {
        console.log(
            'Sanity CMS not available, using fallback portfolio content'
        );
        return null;
    }
}

export const metadata = {
    title: "Portfolio - Sam's Photography",
    description: 'Wildlife and landscape photography portfolio by SamuelSS',
};

export default async function Portfolio() {
    const [portfolioContent, landscapeRaw, wildlifeRaw, stats] =
        await Promise.all([
            getPortfolioPageData(),
            getImagesByCategory('landscape'),
            getImagesByCategory('wildlife'),
            getPortfolioStats(),
        ]);

    const landscapeImages = (landscapeRaw || []).slice(0, 4);
    const wildlifeImages = (wildlifeRaw || []).slice(0, 4);

    const safeStats = {
        totalImages:
            stats?.totalImages ??
            (landscapeRaw?.length ?? 0) + (wildlifeRaw?.length ?? 0),
        locationCount: stats?.locationCount ?? 0,
        countryCount: stats?.countryCount ?? 0,
        speciesCount: stats?.speciesCount ?? 0,
        landscapeCount:
            stats?.landscapeCount ??
            landscapeRaw?.length ??
            landscapeImages.length,
        wildlifeCount:
            stats?.wildlifeCount ??
            wildlifeRaw?.length ??
            wildlifeImages.length,
    };

    const fallbackContent = {
        heroTitle: 'Photography Portfolio',
        heroDescription:
            'Exploring the beauty of nature through wildlife and landscape photography. Each image tells a story of the wild places and creatures that inspire me.',
        landscapeDescription:
            'Capturing the raw beauty and drama of natural landscapes, from towering mountains to serene lakes and everything in between.',
        wildlifeDescription:
            "Intimate portraits of wildlife in their natural habitats, showcasing the personality and behaviour of nature's most fascinating creatures.",
        ctaTitle: "Let's Capture Something Amazing Together",
        ctaDescription:
            "Interested in commissioning a photography session or purchasing prints? I'd love to discuss your vision and bring it to life.",
        ctaButtonText: 'Get In Touch',
        ctaButtonLink: '/contact',
    };

    const pageContent = {
        ...fallbackContent,
        ...portfolioContent,
    };

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gray-900 text-white">
                <div className="mx-auto max-w-7xl px-6 py-24 text-center">
                    <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                        {pageContent.heroTitle}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                        {pageContent.heroDescription}
                    </p>

                    {/* Unified Portfolio Stats */}
                    <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div>
                            <h3 className="text-3xl font-bold text-white">
                                {safeStats.totalImages}
                            </h3>
                            <p className="text-gray-300">Total Images</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white">
                                {safeStats.locationCount}
                            </h3>
                            <p className="text-gray-300">Unique Locations</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white">
                                {safeStats.countryCount}
                            </h3>
                            <p className="text-gray-300">Countries</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white">
                                {safeStats.speciesCount}
                            </h3>
                            <p className="text-gray-300">Species</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Landscape Photography Section */}
            <Gallery
                title="Landscape Photography"
                description={pageContent.landscapeDescription}
                images={landscapeImages}
                totalCount={safeStats.landscapeCount}
                viewAllLink="/portfolio/landscapes"
                viewAllText="View All Landscapes"
                showLocation={true}
                showCount={true}
                context="portfolio"
            />

            {/* Wildlife Photography Section */}
            <Gallery
                title="Wildlife Photography"
                description={pageContent.wildlifeDescription}
                images={wildlifeImages}
                totalCount={safeStats.wildlifeCount}
                viewAllLink="/portfolio/wildlife"
                viewAllText="View All Wildlife"
                showLocation={true}
                showSpecies={true}
                showCount={true}
                backgroundColor="bg-gray-50"
                context="portfolio"
            />

            {/* Call to Action */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        {pageContent.ctaTitle}
                    </h2>
                    <p className="mb-8 text-lg text-gray-600">
                        {pageContent.ctaDescription}
                    </p>
                    <Link
                        href={pageContent.ctaButtonLink}
                        className="inline-flex items-center rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-700"
                    >
                        {pageContent.ctaButtonText}
                    </Link>
                </div>
            </section>
        </main>
    );
}
