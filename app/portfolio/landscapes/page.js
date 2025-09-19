// app/portfolio/landscapes/page.js
import Link from 'next/link';
import Gallery from '@/components/Gallery';
import { getImagesByCategory, getImagesByLocation, getPortfolioStats } from '@/lib/portfolio-data';

export const metadata = {
    title: 'Landscape Photography - Sam\'s Photography',
    description: 'Landscape photography portfolio showcasing natural beauty and dramatic scenery',
};

export default function Landscapes() {
    // Get all landscape images from centralized data
    const landscapeImages = getImagesByCategory('landscape');
    const stats = getPortfolioStats();

    // Get unique locations for landscape photos
    const landscapeLocations = [...new Set(
        landscapeImages
            .filter(img => img.location)
            .map(img => img.location)
    )];

    // Calculate landscape-specific statistics
    const landscapeStats = {
        totalImages: landscapeImages.length,
        locations: landscapeLocations.length,
        countries: [...new Set(landscapeLocations.map(loc => loc.split(', ').pop()))].length,
        featuredCount: landscapeImages.filter(img => img.featured).length
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
                            Landscape Photography
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                            From rugged coastlines to majestic mountain peaks, these landscapes showcase
                            the diverse beauty of our natural world captured during the most dramatic lighting conditions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="border-b bg-gray-50 px-6 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{landscapeStats.totalImages}</h3>
                            <p className="text-gray-600">Landscape Images</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{landscapeStats.locations}</h3>
                            <p className="text-gray-600">Locations Captured</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{landscapeStats.countries}</h3>
                            <p className="text-gray-600">Countries Visited</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{landscapeStats.featuredCount}</h3>
                            <p className="text-gray-600">Featured Images</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <Gallery
                title="Landscape Collection"
                description="Each landscape tells a unique story of time, weather, and natural forces. These images were captured during golden hour and blue hour to showcase the most dramatic lighting conditions."
                images={landscapeImages}
                showLocation={true}
                masonry={true}
            />

            {/* Featured Locations Section */}
            {landscapeLocations.length > 0 && (
                <section className="bg-gray-50 px-6 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                                Captured Locations
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600">
                                Each location offers unique challenges and rewards for landscape photography
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {landscapeLocations.slice(0, 6).map((location, index) => {
                                const locationImages = getImagesByLocation(location.split(', ')[0]);
                                return (
                                    <div key={index} className="rounded-lg bg-white p-6 shadow-sm">
                                        <h3 className="mb-2 font-semibold text-lg">{location}</h3>
                                        <p className="text-gray-600">
                                            {locationImages.length} image{locationImages.length !== 1 ? 's' : ''} captured
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
                        Behind the Lens
                    </h2>
                    <p className="mb-8 text-lg text-gray-600">
                        These landscapes were captured using professional camera equipment,
                        often requiring early morning hikes and patient waiting for the perfect light.
                    </p>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-lg bg-gray-50 p-6">
                            <h3 className="mb-2 font-semibold">Camera Systems</h3>
                            <p className="text-gray-600">Full-frame mirrorless cameras for maximum detail and dynamic range</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-6">
                            <h3 className="mb-2 font-semibold">Specialized Lenses</h3>
                            <p className="text-gray-600">Wide-angle lenses to capture expansive vistas and intimate details</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-6">
                            <h3 className="mb-2 font-semibold">Filters & Accessories</h3>
                            <p className="text-gray-600">Polarizing and ND filters for enhanced colors and long exposures</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gray-900 px-6 py-20 text-white">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        Commission a Landscape Session
                    </h2>
                    <p className="mb-8 text-lg text-gray-300">
                        Have a special location in mind? I offer commissioned landscape photography
                        sessions for personal or commercial use.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition hover:bg-gray-100"
                        >
                            Discuss Your Project
                        </Link>
                        <Link
                            href="/portfolio/wildlife"
                            className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-gray-900"
                        >
                            View Wildlife Portfolio
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}