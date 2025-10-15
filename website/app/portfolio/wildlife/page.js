// app/portfolio/wildlife/page.js
import Link from 'next/link';
import Gallery from '@/components/Gallery';
import { getImagesByCategory, serverClient } from '@/lib/sanity';

export const metadata = {
    title: "Wildlife Photography - Sam's Photography",
    description:
        'Wildlife photography portfolio capturing animals in their natural habitats',
};

async function getWildlifePageData() {
    try {
        return await serverClient.fetch(
            `*[_type == "wildlifePage"][0]{
                heroTitle,
                heroDescription,
                galleryTitle,
                galleryDescription,
                speciesSectionTitle,
                speciesSectionDescription,
                allSpeciesTitle,
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
            'Sanity CMS not available, using fallback wildlife content',
            error
        );
        return null;
    }
}

export default async function Wildlife() {
    const [pageContentRaw, wildlifeImagesRaw] = await Promise.all([
        getWildlifePageData(),
        getImagesByCategory('wildlife'),
    ]);

    const fallbackContent = {
        heroTitle: 'Wildlife Photography',
        heroDescription:
            'Capturing the raw beauty, personality, and behaviour of wildlife in their natural habitats. Each image tells a story of survival, adaptation, and the delicate balance of nature.',
        galleryTitle: 'Wildlife Collection',
        galleryDescription:
            'Each photograph represents hours of fieldwork, research, and patient observation. These images showcase the incredible diversity of wildlife across different habitats and continents.',
        speciesSectionTitle: 'Species Documented',
        speciesSectionDescription:
            'From apex predators to gentle giants, each species represents a unique photography challenge and conservation story',
        allSpeciesTitle: 'All Species Photographed',
        ctaTitle: 'Wildlife Photography Expeditions',
        ctaDescription:
            'Join me on wildlife photography expeditions or commission specialised wildlife documentation for research or conservation projects.',
        ctaPrimaryButtonText: 'Plan an Expedition',
        ctaPrimaryButtonLink: '/contact',
        ctaSecondaryButtonText: 'View Landscape Portfolio',
        ctaSecondaryButtonLink: '/portfolio/landscapes',
    };

    const pageContent = {
        ...fallbackContent,
        ...pageContentRaw,
    };

    const wildlifeImages = wildlifeImagesRaw || [];

    // Get unique species and locations for wildlife photos
    const wildlifeSpecies = [
        ...new Set(
            wildlifeImages
                .filter((img) => img.species && img.species.length > 0)
                .flatMap((img) => img.species.map((s) => s.name))
        ),
    ];

    const wildlifeLocations = [
        ...new Set(
            wildlifeImages
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
        getUniqueCoordinateLocations(wildlifeImages);

    // Calculate years of photography (from earliest to latest photo)
    const photoYears = wildlifeImages
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

    const wildlifeStats = {
        totalImages: wildlifeImages.length,
        species: wildlifeSpecies.length,
        locations:
            uniqueCoordinateLocations.length > 0
                ? uniqueCoordinateLocations.length
                : wildlifeLocations.length,
        yearsActive: yearsSpan,
    };

    // Get all species with their categories from the images
    const allSpeciesWithCategories = wildlifeImages
        .filter((img) => img.species && img.species.length > 0)
        .flatMap((img) => img.species)
        .filter(
            (species, index, arr) =>
                arr.findIndex((s) => s.name === species.name) === index // Remove duplicates by name
        );

    // Group species by category (dynamically from Sanity data)
    const categoryMap = {
        // Mammals
        'big-cats': 'Big Cats',
        bears: 'Bears',
        canids: 'Canids',
        'large-herbivores': 'Large Herbivores',
        'small-mammals': 'Small Mammals',
        primates: 'Primates',
        'marine-mammals': 'Marine Mammals',
        'hoofed-animals': 'Hoofed Animals',
        marsupials: 'Marsupials',
        bats: 'Bats',
        rodents: 'Rodents',

        // Birds
        'birds-of-prey': 'Birds of Prey',
        waterfowl: 'Waterfowl',
        shorebirds: 'Shorebirds',
        songbirds: 'Songbirds',
        corvids: 'Corvids',
        'game-birds': 'Game Birds',
        seabirds: 'Seabirds',
        hummingbirds: 'Hummingbirds',
        woodpeckers: 'Woodpeckers',
        parrots: 'Parrots & Cockatoos',
        owls: 'Owls',
        'flightless-birds': 'Flightless Birds',

        // Reptiles & Amphibians
        snakes: 'Snakes',
        lizards: 'Lizards',
        turtles: 'Turtles & Tortoises',
        amphibians: 'Frogs & Toads',
        crocodilians: 'Crocodilians',
        salamanders: 'Salamanders & Newts',

        // Aquatic Life
        'freshwater-fish': 'Freshwater Fish',
        'saltwater-fish': 'Saltwater Fish',
        'sharks-rays': 'Sharks & Rays',
        'marine-invertebrates': 'Marine Invertebrates',
        'freshwater-invertebrates': 'Freshwater Invertebrates',

        // Insects & Arthropods
        'butterflies-moths': 'Butterflies & Moths',
        dragonflies: 'Dragonflies & Damselflies',
        'bees-wasps': 'Bees & Wasps',
        beetles: 'Beetles',
        spiders: 'Spiders & Arachnids',
        'insects-other': 'Other Insects',
        ants: 'Ants',

        // Specialized Categories
        'arctic-wildlife': 'Arctic Wildlife',
        'desert-wildlife': 'Desert Wildlife',
        'tropical-wildlife': 'Tropical Wildlife',
        nocturnal: 'Nocturnal Animals',
        endangered: 'Endangered Species',
        domestic: 'Domestic Animals',
        other: 'Other Wildlife',
    };

    const speciesCategories = allSpeciesWithCategories.reduce(
        (acc, species) => {
            const categoryKey = species.category || 'other';
            const categoryLabel = categoryMap[categoryKey] || 'Other';

            if (!acc[categoryLabel]) {
                acc[categoryLabel] = [];
            }
            acc[categoryLabel].push(species.name);
            return acc;
        },
        {}
    );

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
                                {wildlifeStats.totalImages}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Wildlife Images
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-semibold text-foreground">
                                {wildlifeStats.species}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Species Photographed
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-semibold text-foreground">
                                {wildlifeStats.locations}
                            </h3>
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                Locations Visited
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-semibold text-foreground">
                                {wildlifeStats.yearsActive || '—'}
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
                images={wildlifeImages}
                totalCount={wildlifeStats.totalImages}
                showLocation={true}
                showSpecies={true}
                masonry={true}
                context="wildlife"
                backgroundColor="bg-transparent"
            />

            {/* Species Showcase Section */}
            {wildlifeSpecies.length > 0 && (
                <section className="section-padding">
                    <div className="mx-auto max-w-7xl space-y-12">
                        <div className="text-center">
                            <h2 className="section-subtitle mb-6 text-foreground">
                                {pageContent.speciesSectionTitle}
                            </h2>
                            <p className="mx-auto max-w-3xl text-muted-foreground">
                                {pageContent.speciesSectionDescription}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {Object.entries(speciesCategories).map(
                                ([category, species]) =>
                                    species.length > 0 && (
                                        <div
                                            key={category}
                                            className="group rounded-[32px] border border-border/40 bg-surface/55 p-8 backdrop-blur-xl shadow-[var(--shadow-soft)] transition-transform duration-300 ease-out hover:-translate-y-1"
                                            style={{
                                                background:
                                                    'linear-gradient(185deg, color-mix(in srgb, var(--secondary) 12%, transparent) 0%, color-mix(in srgb, var(--surface) 96%, transparent) 60%)',
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/15 text-sm font-semibold text-secondary">
                                                    {String(category[0] ?? '')
                                                        .toUpperCase()}
                                                </span>
                                                <h3 className="text-base font-semibold tracking-tight text-foreground">
                                                    {category}
                                                </h3>
                                            </div>
                                            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground/85">
                                                {species.slice(0, 4).map((speciesName, index) => (
                                                    <li
                                                        key={`${category}-${speciesName}-${index}`}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-secondary/60" />
                                                        <span>{speciesName.split('(')[0].trim()}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {species.length > 4 && (
                                                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-secondary/80">
                                                    +{species.length - 4} more species
                                                </p>
                                            )}
                                        </div>
                                    )
                            )}
                        </div>

                        {/* All Species List */}
                        <div className="space-y-8">
                            <h3 className="text-center text-sm font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                {pageContent.allSpeciesTitle}
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {wildlifeSpecies.map((species, index) => (
                                    <div
                                        key={`species-${species}-${index}`}
                                        className="group rounded-[28px] border border-border/35 bg-surface/60 px-5 py-4 text-center backdrop-blur-xl shadow-[var(--shadow-soft)] transition-transform duration-300 ease-out hover:-translate-y-1"
                                        style={{
                                            background:
                                                'linear-gradient(160deg, color-mix(in srgb, var(--secondary) 10%, transparent) 0%, color-mix(in srgb, var(--surface) 96%, transparent) 65%)',
                                        }}
                                    >
                                        <span className="inline-flex items-center justify-center rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary group-hover:bg-secondary/25">
                                            {species}
                                        </span>
                                    </div>
                                ))}
                            </div>
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
