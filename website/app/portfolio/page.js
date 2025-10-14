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
        console.warn(
            'Sanity CMS not available, using fallback portfolio content',
            error
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

    // Calculate years of photography across ALL photos
    const allImages = [...(landscapeRaw || []), ...(wildlifeRaw || [])];
    const photoYears = allImages
        .filter((img) => {
            return img.cameraData?.captureDate ||
                   img.image?.asset?.metadata?.exif?.DateTimeOriginal ||
                   img.image?.asset?.metadata?.exif?.DateTimeDigitized;
        })
        .map((img) => {
            const date = img.cameraData?.captureDate ||
                        img.image?.asset?.metadata?.exif?.DateTimeOriginal ||
                        img.image?.asset?.metadata?.exif?.DateTimeDigitized;
            return new Date(date).getFullYear();
        })
        .filter((year) => !isNaN(year));

    const currentYear = new Date().getFullYear();
    const yearsSpan = photoYears.length > 0
        ? currentYear - Math.min(...photoYears) + 1
        : 0;

    const safeStats = {
        totalImages:
            stats?.totalImages ??
            (landscapeRaw?.length ?? 0) + (wildlifeRaw?.length ?? 0),
        locationCount: stats?.locationCount ?? 0,
        countryCount: stats?.countryCount ?? 0,
        speciesCount: stats?.speciesCount ?? 0,
        yearsActive: yearsSpan,
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
        <main className="min-h-screen">
            {/* Hero Section - Clean Dark */}
            <section className="section-padding">
                <div className="mx-auto max-w-7xl text-center">
                    <h1 className="hero-title mb-6 text-foreground">
                        {pageContent.heroTitle}
                    </h1>
                    <p className="body-large mx-auto max-w-2xl leading-relaxed text-text">
                        {pageContent.heroDescription}
                    </p>

                    {/* Unified Portfolio Stats */}
                    <div className="glass-panel mt-16 grid grid-cols-2 gap-8 px-10 py-12 md:grid-cols-5">
                        <div className="space-y-2">
                            <h3 className="text-5xl font-semibold text-foreground">
                                {safeStats.totalImages}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Total Images
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-5xl font-semibold text-foreground">
                                {safeStats.locationCount}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Locations Visited
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-5xl font-semibold text-foreground">
                                {safeStats.countryCount}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Countries Explored
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-5xl font-semibold text-foreground">
                                {safeStats.speciesCount}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Species Captured
                            </p>
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <h3 className="text-5xl font-semibold text-foreground">
                                {safeStats.yearsActive || '—'}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Years Capturing
                            </p>
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
                backgroundColor="bg-transparent"
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
                backgroundColor="bg-transparent"
                context="portfolio"
            />

            {/* Call to Action - Clean Dark */}
            <section className="section-padding">
                <div className="glass-panel mx-auto max-w-4xl px-10 py-14 text-center">
                    <h2 className="section-subtitle mb-6 text-foreground">
                        {pageContent.ctaTitle}
                    </h2>
                    <p className="body-large text-muted-foreground mb-8 leading-relaxed">
                        {pageContent.ctaDescription}
                    </p>
                    <Link
                        href={pageContent.ctaButtonLink}
                        className="cta-button"
                    >
                        {pageContent.ctaButtonText}
                    </Link>
                </div>
            </section>
        </main>
    );
}
