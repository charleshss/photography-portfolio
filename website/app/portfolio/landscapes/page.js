// app/portfolio/landscapes/page.js
import Link from 'next/link';
import Gallery from '@/components/Gallery';
import { getImagesByCategory, serverClient } from '@/lib/sanity';

export const metadata = {
    title: "Landscape Photography - Sam's Photography",
    description:
        'Landscape photography portfolio showcasing natural beauty and dramatic scenery',
};

async function getLandscapePageData() {
    try {
        return await serverClient.fetch(
            `*[_type == "landscapePage"][0]{
                heroTitle,
                heroDescription,
                galleryTitle,
                galleryDescription,
                locationsTitle,
                locationsDescription,
                equipmentTitle,
                equipmentDescription,
                equipmentHighlights[]{title, description},
                ctaTitle,
                ctaDescription,
                ctaPrimaryButtonText,
                ctaPrimaryButtonLink,
                ctaSecondaryButtonText,
                ctaSecondaryButtonLink
            }`,
            {},
            { next: { revalidate: 60 } }
        );
    } catch (error) {
        console.log(
            'Sanity CMS not available, using fallback landscape content'
        );
        return null;
    }
}

export default async function Landscapes() {
    const [pageContentRaw, landscapeImagesRaw] = await Promise.all([
        getLandscapePageData(),
        getImagesByCategory('landscape'),
    ]);

    const fallbackContent = {
        heroTitle: 'Landscape Photography',
        heroDescription:
            'From rugged coastlines to majestic mountain peaks, these landscapes showcase the diverse beauty of our natural world captured during the most dramatic lighting conditions.',
        galleryTitle: 'Landscape Collection',
        galleryDescription:
            'Each landscape tells a unique story of time, weather, and natural forces. These images were captured during golden hour and blue hour to showcase the most dramatic lighting conditions.',
        locationsTitle: 'Captured Locations',
        locationsDescription:
            'Each location offers unique challenges and rewards for landscape photography',
        equipmentTitle: 'Behind the Lens',
        equipmentDescription:
            'These landscapes were captured using professional camera equipment, often requiring early morning hikes and patient waiting for the perfect light.',
        equipmentHighlights: [
            {
                title: 'Camera Systems',
                description:
                    'Full-frame mirrorless cameras for maximum detail and dynamic range',
            },
            {
                title: 'Specialised Lenses',
                description:
                    'Wide-angle lenses to capture expansive vistas and intimate details',
            },
            {
                title: 'Filters & Accessories',
                description:
                    'Polarising and ND filters for enhanced colours and long exposures',
            },
        ],
        ctaTitle: 'Commission a Landscape Session',
        ctaDescription:
            'Have a special location in mind? I offer commissioned landscape photography sessions for personal or commercial use.',
        ctaPrimaryButtonText: 'Discuss Your Project',
        ctaPrimaryButtonLink: '/contact',
        ctaSecondaryButtonText: 'View Wildlife Portfolio',
        ctaSecondaryButtonLink: '/portfolio/wildlife',
    };

    const pageContent = {
        ...fallbackContent,
        ...pageContentRaw,
    };

    const equipmentHighlights = Array.isArray(pageContent.equipmentHighlights)
        ? pageContent.equipmentHighlights
        : [];

    const landscapeImages = landscapeImagesRaw || [];

    // Get unique locations for landscape photos
    const landscapeLocations = [
        ...new Set(
            landscapeImages
                .filter((img) => img.locationData?.locationName)
                .map((img) => img.locationData.locationName)
        ),
    ];

    // Helper function to group locations by coordinates for accurate counting
    const getUniqueCoordinateLocations = (images) => {
        const coordinateLocations = images
            .filter(
                (img) =>
                    img.locationData?.coordinates?.lat &&
                    img.locationData?.coordinates?.lng
            )
            .map((img) => {
                // Round coordinates to ~100m precision for grouping nearby locations
                const lat =
                    Math.round(img.locationData.coordinates.lat * 1000) / 1000;
                const lng =
                    Math.round(img.locationData.coordinates.lng * 1000) / 1000;
                return `${lat},${lng}`;
            });

        return [...new Set(coordinateLocations)];
    };

    const uniqueCoordinateLocations =
        getUniqueCoordinateLocations(landscapeImages);

    // Calculate landscape-specific statistics with coordinate-based counting
    const landscapeStats = {
        totalImages: landscapeImages.length,
        locations:
            uniqueCoordinateLocations.length > 0
                ? uniqueCoordinateLocations.length
                : landscapeLocations.length,
        countries: [
            ...new Set(landscapeLocations.map((loc) => loc.split(', ').pop())),
        ].length,
        featuredCount: landscapeImages.filter((img) => img.featured).length,
    };

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gray-900 text-white">
                <div className="mx-auto max-w-7xl px-6 py-24">
                    <div className="mb-8">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center text-gray-400 hover:text-white transition"
                        >
                            ← Back to Portfolio
                        </Link>
                    </div>
                    <div className="text-center">
                        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                            {pageContent.heroTitle}
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                            {pageContent.heroDescription}
                        </p>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="border-b bg-gray-50 px-6 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {landscapeStats.totalImages}
                            </h3>
                            <p className="text-gray-600">Landscape Images</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {landscapeStats.locations}
                            </h3>
                            <p className="text-gray-600">Unique Locations</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {landscapeStats.countries}
                            </h3>
                            <p className="text-gray-600">Countries Visited</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {landscapeStats.featuredCount}
                            </h3>
                            <p className="text-gray-600">Featured Images</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <Gallery
                title={pageContent.galleryTitle}
                description={pageContent.galleryDescription}
                images={landscapeImages}
                totalCount={landscapeStats.totalImages}
                showLocation={true}
                masonry={true}
                context="landscapes"
            />

            {/* Featured Locations Section */}
            {landscapeLocations.length > 0 && (
                <section className="bg-gray-50 px-6 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                                {pageContent.locationsTitle}
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600">
                                {pageContent.locationsDescription}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {landscapeLocations
                                .slice(0, 6)
                                .map((location, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="rounded-lg bg-white p-6 shadow-sm"
                                        >
                                            <h3 className="mb-2 font-semibold text-lg">
                                                {location}
                                            </h3>
                                            <p className="text-gray-600">
                                                Location captured
                                            </p>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </section>
            )}

            {/* Equipment Section */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        {pageContent.equipmentTitle}
                    </h2>
                    <p className="mb-8 text-lg text-gray-600">
                        {pageContent.equipmentDescription}
                    </p>
                    {equipmentHighlights.length > 0 && (
                        <div className="flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center">
                            {equipmentHighlights.map((highlight, index) => (
                                <div
                                    key={`${highlight.title}-${index}`}
                                    className="w-full max-w-sm rounded-lg bg-gray-50 p-6 text-center"
                                >
                                    <h3 className="mb-2 font-semibold">
                                        {highlight.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {highlight.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gray-900 px-6 py-20 text-white">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        {pageContent.ctaTitle}
                    </h2>
                    <p className="mb-8 text-lg text-gray-300">
                        {pageContent.ctaDescription}
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href={pageContent.ctaPrimaryButtonLink}
                            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition hover:bg-gray-100"
                        >
                            {pageContent.ctaPrimaryButtonText}
                        </Link>
                        <Link
                            href={pageContent.ctaSecondaryButtonLink}
                            className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-gray-900"
                        >
                            {pageContent.ctaSecondaryButtonText}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
