// app/portfolio/wildlife/page.js
import Link from 'next/link';
import Gallery from '@/components/Gallery';
import { getImagesByCategory, getImagesByLocation, getPortfolioStats } from '@/lib/sanity';

export const metadata = {
    title: 'Wildlife Photography - Sam\'s Photography',
    description: 'Wildlife photography portfolio capturing animals in their natural habitats',
};

export default async function Wildlife() {
    // Get all wildlife images from Sanity (now async)
    const wildlifeImages = await getImagesByCategory('wildlife') || [];
    const stats = await getPortfolioStats() || {};

    // Get unique species and locations for wildlife photos
    const wildlifeSpecies = [...new Set(
        wildlifeImages
            .filter(img => img.species && img.species.length > 0)
            .flatMap(img => img.species.map(s => s.name))
    )];

    const wildlifeLocations = [...new Set(
        wildlifeImages
            .filter(img => img.locationData?.locationName)
            .map(img => img.locationData.locationName)
    )];

    // Helper function to group locations by coordinates for accurate counting
    const getUniqueCoordinateLocations = (images) => {
        const coordinateLocations = images
            .filter(img => img.locationData?.coordinates?.lat && img.locationData?.coordinates?.lng)
            .map(img => {
                // Round coordinates to ~100m precision for grouping nearby locations
                const lat = Math.round(img.locationData.coordinates.lat * 1000) / 1000;
                const lng = Math.round(img.locationData.coordinates.lng * 1000) / 1000;
                return `${lat},${lng}`;
            });

        return [...new Set(coordinateLocations)];
    };

    // Calculate wildlife-specific statistics with coordinate-based counting
    const getCountryFromLocation = (location) => {
        const lower = location.toLowerCase();
        if (lower.includes('whistler') || lower.includes('jasper')) return 'Canada';
        if (lower.includes('scotland')) return 'Scotland/UK';
        if (lower.includes('belgium') || lower.includes('zoo') && lower.includes('belg')) return 'Belgium';
        // Add more mappings as needed
        return location.split(', ').pop(); // fallback to last part of location string
    };

    const uniqueCoordinateLocations = getUniqueCoordinateLocations(wildlifeImages);

    const wildlifeStats = {
        totalImages: wildlifeImages.length,
        species: wildlifeSpecies.length,
        locations: uniqueCoordinateLocations.length > 0 ? uniqueCoordinateLocations.length : wildlifeLocations.length,
        countries: [...new Set(wildlifeLocations.map(loc => getCountryFromLocation(loc)))].length,
        featuredCount: wildlifeImages.filter(img => img.featured).length
    };

    // Get all species with their categories from the images
    const allSpeciesWithCategories = wildlifeImages
        .filter(img => img.species && img.species.length > 0)
        .flatMap(img => img.species)
        .filter((species, index, arr) =>
            arr.findIndex(s => s.name === species.name) === index // Remove duplicates by name
        );

    // Group species by category (dynamically from Sanity data)
    const categoryMap = {
        // Mammals
        'big-cats': 'Big Cats',
        'bears': 'Bears',
        'canids': 'Canids',
        'large-herbivores': 'Large Herbivores',
        'small-mammals': 'Small Mammals',
        'primates': 'Primates',
        'marine-mammals': 'Marine Mammals',
        'hoofed-animals': 'Hoofed Animals',
        'marsupials': 'Marsupials',
        'bats': 'Bats',
        'rodents': 'Rodents',

        // Birds
        'birds-of-prey': 'Birds of Prey',
        'waterfowl': 'Waterfowl',
        'shorebirds': 'Shorebirds',
        'songbirds': 'Songbirds',
        'corvids': 'Corvids',
        'game-birds': 'Game Birds',
        'seabirds': 'Seabirds',
        'hummingbirds': 'Hummingbirds',
        'woodpeckers': 'Woodpeckers',
        'parrots': 'Parrots & Cockatoos',
        'owls': 'Owls',
        'flightless-birds': 'Flightless Birds',

        // Reptiles & Amphibians
        'snakes': 'Snakes',
        'lizards': 'Lizards',
        'turtles': 'Turtles & Tortoises',
        'amphibians': 'Frogs & Toads',
        'crocodilians': 'Crocodilians',
        'salamanders': 'Salamanders & Newts',

        // Aquatic Life
        'freshwater-fish': 'Freshwater Fish',
        'saltwater-fish': 'Saltwater Fish',
        'sharks-rays': 'Sharks & Rays',
        'marine-invertebrates': 'Marine Invertebrates',
        'freshwater-invertebrates': 'Freshwater Invertebrates',

        // Insects & Arthropods
        'butterflies-moths': 'Butterflies & Moths',
        'dragonflies': 'Dragonflies & Damselflies',
        'bees-wasps': 'Bees & Wasps',
        'beetles': 'Beetles',
        'spiders': 'Spiders & Arachnids',
        'insects-other': 'Other Insects',
        'ants': 'Ants',

        // Specialized Categories
        'arctic-wildlife': 'Arctic Wildlife',
        'desert-wildlife': 'Desert Wildlife',
        'tropical-wildlife': 'Tropical Wildlife',
        'nocturnal': 'Nocturnal Animals',
        'endangered': 'Endangered Species',
        'domestic': 'Domestic Animals',
        'other': 'Other Wildlife'
    };

    const speciesCategories = allSpeciesWithCategories.reduce((acc, species) => {
        const categoryKey = species.category || 'other';
        const categoryLabel = categoryMap[categoryKey] || 'Other';

        if (!acc[categoryLabel]) {
            acc[categoryLabel] = [];
        }
        acc[categoryLabel].push(species.name);
        return acc;
    }, {});

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
                            Wildlife Photography
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                            Capturing the raw beauty, personality, and behaviour of wildlife in their natural habitats.
                            Each image tells a story of survival, adaptation, and the delicate balance of nature.
                        </p>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="bg-gray-50 px-6 py-16">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold">Photography Philosophy</h2>
                    <p className="text-lg text-gray-600">
                        &#34;Wildlife photography is about patience, respect, and understanding. I believe in
                        capturing animals as they truly are - wild, free, and magnificent. Every shot is
                        taken with the utmost respect for the animal&#39;s space and natural behaviour,
                        often requiring hours of waiting for the perfect moment.&#34;
                    </p>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="border-b px-6 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{wildlifeStats.totalImages}</h3>
                            <p className="text-gray-600">Wildlife Images</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{wildlifeStats.species}</h3>
                            <p className="text-gray-600">Species Photographed</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{wildlifeStats.locations}</h3>
                            <p className="text-gray-600">Unique Locations</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{wildlifeStats.countries}</h3>
                            <p className="text-gray-600">Countries</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <Gallery
                title="Wildlife Collection"
                description="Each photograph represents hours of fieldwork, research, and patient observation. These images showcase the incredible diversity of wildlife across different habitats and continents."
                images={wildlifeImages}
                showLocation={true}
                showSpecies={true}
                masonry={true}
                context="wildlife"
            />

            {/* Species Showcase Section */}
            {wildlifeSpecies.length > 0 && (
                <section className="bg-gray-50 px-6 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                                Species Documented
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600">
                                From apex predators to gentle giants, each species represents a unique photography challenge and conservation story
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {Object.entries(speciesCategories).map(([category, species]) => (
                                species.length > 0 && (
                                    <div key={category} className="rounded-lg bg-white p-6 shadow-sm">
                                        <h3 className="mb-4 text-xl font-semibold">{category}</h3>
                                        <ul className="space-y-2">
                                            {species.slice(0, 4).map((speciesName, index) => (
                                                <li key={`${category}-${speciesName}-${index}`} className="text-gray-600">
                                                    {speciesName.split('(')[0].trim()}
                                                </li>
                                            ))}
                                        </ul>
                                        {species.length > 4 && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                +{species.length - 4} more species
                                            </p>
                                        )}
                                    </div>
                                )
                            ))}
                        </div>

                        {/* All Species List */}
                        <div className="mt-12">
                            <h3 className="mb-6 text-center text-2xl font-bold">All Species Photographed</h3>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                                {wildlifeSpecies.map((species, index) => (
                                    <div key={`species-${species}-${index}`} className="rounded bg-white p-3 text-center shadow-sm">
                                        <span className="text-sm text-gray-700">{species}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action */}
            <section className="bg-gray-900 px-6 py-20 text-white">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        Wildlife Photography Expeditions
                    </h2>
                    <p className="mb-8 text-lg text-gray-300">
                        Join me on wildlife photography expeditions or commission specialised
                        wildlife documentation for research or conservation projects.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition hover:bg-gray-100"
                        >
                            Plan an Expedition
                        </Link>
                        <Link
                            href="/portfolio/landscapes"
                            className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-gray-900"
                        >
                            View Landscape Portfolio
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}