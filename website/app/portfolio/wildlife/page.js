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
        console.log(
            'Sanity CMS not available, using fallback wildlife content'
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

    // Calculate wildlife-specific statistics with coordinate-based counting
    const getCountryFromLocation = (location) => {
        const lower = location.toLowerCase();
        if (lower.includes('whistler') || lower.includes('jasper'))
            return 'Canada';
        if (lower.includes('scotland')) return 'Scotland/UK';
        if (
            lower.includes('belgium') ||
            (lower.includes('zoo') && lower.includes('belg'))
        )
            return 'Belgium';
        // Add more mappings as needed
        return location.split(', ').pop(); // fallback to last part of location string
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
                                            className="glass-panel px-8 py-10 text-left"
                                        >
                                            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                                {category}
                                            </h3>
                                            <ul className="space-y-2">
                                                {species
                                                    .slice(0, 4)
                                                    .map(
                                                        (
                                                            speciesName,
                                                            index
                                                        ) => (
                                                            <li
                                                                key={`${category}-${speciesName}-${index}`}
                                                                className="text-sm uppercase tracking-[0.24em] text-foreground/80"
                                                            >
                                                                {speciesName
                                                                    .split(
                                                                        '('
                                                                    )[0]
                                                                    .trim()}
                                                            </li>
                                                        )
                                                    )}
                                            </ul>
                                            {species.length > 4 && (
                                                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                                                    +{species.length - 4} more
                                                    species
                                                </p>
                                            )}
                                        </div>
                                    )
                            )}
                        </div>

                        {/* All Species List */}
                        <div className="space-y-6">
                            <h3 className="text-center text-sm font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                {pageContent.allSpeciesTitle}
                            </h3>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {wildlifeSpecies.map((species, index) => (
                                    <div
                                        key={`species-${species}-${index}`}
                                        className="glass-panel px-6 py-4 text-center"
                                    >
                                        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
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
                            className="inline-flex items-center justify-center rounded-full bg-background px-8 py-4 text-lg font-semibold text-foreground transition hover:bg-gray-100"
                        >
                            {pageContent.ctaPrimaryButtonText}
                        </Link>
                        <Link
                            href={pageContent.ctaSecondaryButtonLink}
                            className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-background hover:text-foreground"
                        >
                            {pageContent.ctaSecondaryButtonText}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
