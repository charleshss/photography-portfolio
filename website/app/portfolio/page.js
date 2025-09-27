// app/portfolio/page.js
import Link from 'next/link';
import Gallery from '@/components/Gallery';
import { getImagesByCategory, getPortfolioStats } from '@/lib/sanity';

export const metadata = {
    title: 'Portfolio - Sam\'s Photography',
    description: 'Wildlife and landscape photography portfolio by SamuelSS',
};

export default async function Portfolio() {
    // Get images by category from Sanity (now async)
    const landscapeImages = (await getImagesByCategory('landscape')).slice(0, 4);
    const wildlifeImages = (await getImagesByCategory('wildlife')).slice(0, 4);
    const stats = await getPortfolioStats();

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gray-900 text-white">
                <div className="mx-auto max-w-7xl px-6 py-24 text-center">
                    <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                        Photography Portfolio
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                        Exploring the beauty of nature through wildlife and landscape photography.
                        Each image tells a story of the wild places and creatures that inspire me.
                    </p>

                    {/* Unified Portfolio Stats */}
                    <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div>
                            <h3 className="text-3xl font-bold text-white">{stats.totalImages}</h3>
                            <p className="text-gray-300">Total Images</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white">{stats.locationCount}</h3>
                            <p className="text-gray-300">Unique Locations</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white">{stats.countryCount}</h3>
                            <p className="text-gray-300">Countries</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-white">{stats.speciesCount}</h3>
                            <p className="text-gray-300">Species</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Landscape Photography Section */}
            <Gallery
                title="Landscape Photography"
                description="Capturing the raw beauty and drama of natural landscapes, from towering mountains to serene lakes and everything in between."
                images={landscapeImages}
                viewAllLink="/portfolio/landscapes"
                viewAllText="View All Landscapes"
                showLocation={true}
                showCount={true}
                context="portfolio"
            />

            {/* Wildlife Photography Section */}
            <Gallery
                title="Wildlife Photography"
                description="Intimate portraits of wildlife in their natural habitats, showcasing the personality and behaviour of nature's most fascinating creatures."
                images={wildlifeImages}
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
                        Let&#39;s Capture Something Amazing Together
                    </h2>
                    <p className="mb-8 text-lg text-gray-600">
                        Interested in commissioning a photography session or purchasing prints?
                        I&#39;d love to discuss your vision and bring it to life.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-700"
                    >
                        Get In Touch
                    </Link>
                </div>
            </section>
        </main>
    );
}