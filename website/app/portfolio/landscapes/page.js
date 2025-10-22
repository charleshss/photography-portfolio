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
        console.warn(
            'Sanity CMS not available, using fallback landscape content',
            error
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
                    'Polarizing and ND filters for enhanced colors and long exposures',
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

    // Get unique locations and countries for landscape photos
    const landscapeLocations = [
        ...new Set(
            landscapeImages
                .filter((img) => img.locationData?.locationName)
                .map((img) => img.locationData.locationName)
        ),
    ];

    const landscapeCountries = [
        ...new Set(
            landscapeImages
                .filter((img) => img.locationData?.country)
                .map((img) => img.locationData.country)
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

    // Calculate years of photography (from earliest to latest photo)
    const photoYears = landscapeImages
        .filter((img) => {
            // Check both cameraData and EXIF data
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

    // Calculate landscape-specific statistics with coordinate-based counting
    const landscapeStats = {
        totalImages: landscapeImages.length,
        locations:
            uniqueCoordinateLocations.length > 0
                ? uniqueCoordinateLocations.length
                : landscapeLocations.length,
        countries: landscapeCountries.length,
        yearsActive: yearsSpan,
    };

    // Group locations by country for the locations section (using stored country field)
    const locationsByCountry = landscapeImages
        .filter((img) => img.locationData?.country && img.locationData?.locationName)
        .reduce((acc, img) => {
            const country = img.locationData.country;
            const location = img.locationData.locationName;

            if (!acc[country]) {
                acc[country] = new Set();
            }
            acc[country].add(location);

            return acc;
        }, {});

    // Convert Sets to sorted arrays
    const countriesWithLocations = Object.entries(locationsByCountry)
        .map(([country, locationsSet]) => ({
            country,
            locations: Array.from(locationsSet).sort(),
        }))
        .sort((a, b) => a.country.localeCompare(b.country));

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="section-padding">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                        >
                            ← Back to Portfolio
                        </Link>
                    </div>
                    <div className="text-center">
                        <h1 className="hero-title mb-6 text-foreground">
                            {pageContent.heroTitle}
                        </h1>
                        <p className="body-large mx-auto max-w-4xl leading-relaxed text-text">
                            {pageContent.heroDescription}
                        </p>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="section-padding pt-0">
                <div className="mx-auto max-w-7xl">
                    <div className="glass-panel grid grid-cols-2 gap-8 px-8 py-12 text-center md:grid-cols-4">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-semibold text-foreground">
                                {landscapeStats.totalImages}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Landscape Images
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-semibold text-foreground">
                                {landscapeStats.locations}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Locations Visited
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-semibold text-foreground">
                                {landscapeStats.countries}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Countries Visited
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-semibold text-foreground">
                                {landscapeStats.yearsActive || '—'}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Years Capturing
                            </p>
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
                backgroundColor="bg-transparent"
            />

            {/* Locations Section - Grouped by Country */}
            {countriesWithLocations.length > 0 && (
                <section className="section-padding">
                    <div className="mx-auto max-w-7xl space-y-12">
                        <div className="text-center space-y-4">
                            {pageContent.locationsTitle && (
                                <h2 className="section-subtitle text-foreground">
                                    {pageContent.locationsTitle}
                                </h2>
                            )}
                            {pageContent.locationsDescription && (
                                <p className="body-large mx-auto max-w-3xl text-muted-foreground leading-relaxed">
                                    {pageContent.locationsDescription}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {countriesWithLocations.map(({ country, locations }) => (
                                <div
                                    key={country}
                                    className="group rounded-[32px] border border-border/40 bg-surface/55 p-8 backdrop-blur-xl shadow-[var(--shadow-soft)] transition-transform duration-300 ease-out hover:-translate-y-1"
                                    style={{
                                        background:
                                            'linear-gradient(185deg, color-mix(in srgb, var(--primary) 12%, transparent) 0%, color-mix(in srgb, var(--surface) 96%, transparent) 60%)',
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                                            {String(country[0] ?? '').toUpperCase()}
                                        </span>
                                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                                            {country}
                                        </h3>
                                    </div>
                                    <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground/85">
                                        {locations.slice(0, 4).map((locationName, index) => (
                                            <li
                                                key={`${country}-${locationName}-${index}`}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                                                <span>{locationName}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {locations.length > 4 && (
                                        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                                            +{locations.length - 4} more locations
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Equipment Highlights */}
            {equipmentHighlights.length > 0 && (
                <section className="section-padding pt-0">
                    <div className="mx-auto max-w-6xl space-y-12">
                        <div className="text-center space-y-4">
                            {pageContent.equipmentTitle && (
                                <h2 className="section-subtitle text-foreground">
                                    {pageContent.equipmentTitle}
                                </h2>
                            )}
                            {pageContent.equipmentDescription && (
                                <p className="body-large mx-auto max-w-3xl text-muted-foreground leading-relaxed">
                                    {pageContent.equipmentDescription}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            {equipmentHighlights.map((highlight, index) => (
                                <div
                                    key={highlight.title || index}
                                    className="group rounded-[32px] border border-border/35 bg-surface/65 p-8 backdrop-blur-xl shadow-[var(--shadow-soft)] transition-transform duration-300 ease-out hover:-translate-y-1"
                                    style={{
                                        background:
                                            'linear-gradient(180deg, color-mix(in srgb, var(--primary) 12%, transparent) 0%, color-mix(in srgb, var(--surface) 96%, transparent) 100%)',
                                    }}
                                >
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <h3 className="text-base font-semibold tracking-tight text-foreground">
                                                {highlight.title || `Highlight ${index + 1}`}
                                            </h3>
                                        </div>
                                        {highlight.description && (
                                            <p className="text-sm leading-relaxed text-muted-foreground/85">
                                                {highlight.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action */}
            <section className="section-padding">
                <div className="glass-panel mx-auto max-w-4xl px-10 py-14 text-center">
                    <h2 className="section-subtitle mb-6 text-foreground">
                        {pageContent.ctaTitle}
                    </h2>
                    <p className="body-large mb-8 text-muted-foreground">
                        {pageContent.ctaDescription}
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href={pageContent.ctaPrimaryButtonLink}
                            className="cta-button"
                        >
                            {pageContent.ctaPrimaryButtonText}
                        </Link>
                        <Link
                            href={pageContent.ctaSecondaryButtonLink}
                            className="cta-button-outline"
                        >
                            {pageContent.ctaSecondaryButtonText}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
