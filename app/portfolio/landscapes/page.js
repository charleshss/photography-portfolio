// app/portfolio/landscapes/page.js
import Link from 'next/link';
import Gallery from '@/components/Gallery';

export const metadata = {
    title: 'Landscape Photography - Sam\'s Photography',
    description: 'Landscape photography portfolio showcasing natural beauty and dramatic scenery',
};

export default function Landscapes() {
    // Extended landscape portfolio images
    const landscapeImages = [
        {
            id: 1,
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            alt: 'Mountain landscape at sunset',
            title: 'Mountain Peaks',
            location: 'Alps, Switzerland'
        },
        {
            id: 2,
            src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
            alt: 'Forest landscape',
            title: 'Forest Path',
            location: 'Peak District, England'
        },
        {
            id: 3,
            src: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&h=600&fit=crop',
            alt: 'Lake landscape',
            title: 'Serene Lake',
            location: 'Lake District, England'
        },
        {
            id: 4,
            src: 'https://images.unsplash.com/photo-1420593248178-d88870618ca0?w=800&h=600&fit=crop',
            alt: 'Desert landscape',
            title: 'Desert Dunes',
            location: 'Sahara Desert, Morocco'
        },
        {
            id: 5,
            src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop',
            alt: 'Coastline landscape',
            title: 'Rugged Coast',
            location: 'Cornwall, England'
        },
        {
            id: 6,
            src: 'https://images.unsplash.com/photo-1418879003684-a3d861c45d0c?w=800&h=600&fit=crop',
            alt: 'Valley landscape',
            title: 'Golden Valley',
            location: 'Tuscany, Italy'
        },
        {
            id: 7,
            src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
            alt: 'Winter landscape',
            title: 'Winter Silence',
            location: 'Scottish Highlands'
        },
        {
            id: 8,
            src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop',
            alt: 'Canyon landscape',
            title: 'Ancient Canyon',
            location: 'Utah, USA'
        },
        {
            id: 9,
            src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop',
            alt: 'Field landscape',
            title: 'Rolling Hills',
            location: 'Cotswolds, England'
        }
    ];

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
                            From the rugged coastlines of Cornwall to the majestic peaks of the Alps,
                            these landscapes showcase the diverse beauty of our natural world.
                        </p>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="border-b bg-gray-50 px-6 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">50+</h3>
                            <p className="text-gray-600">Locations Captured</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">12</h3>
                            <p className="text-gray-600">Countries Visited</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">200+</h3>
                            <p className="text-gray-600">Hours of Hiking</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">5 Years</h3>
                            <p className="text-gray-600">Experience</p>
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

            {/* Equipment Section */}
            <section className="bg-gray-50 px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        Behind the Lens
                    </h2>
                    <p className="mb-8 text-lg text-gray-600">
                        These landscapes were captured using professional camera equipment,
                        often requiring early morning hikes and patient waiting for the perfect light.
                    </p>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-2 font-semibold">Camera Systems</h3>
                            <p className="text-gray-600">Full-frame mirrorless cameras for maximum detail and dynamic range</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-2 font-semibold">Specialized Lenses</h3>
                            <p className="text-gray-600">Wide-angle lenses to capture expansive vistas and intimate details</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-2 font-semibold">Filters & Accessories</h3>
                            <p className="text-gray-600">Polarizing and ND filters for enhanced colors and long exposures</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        Commission a Landscape Session
                    </h2>
                    <p className="mb-8 text-lg text-gray-600">
                        Have a special location in mind? I offer commissioned landscape photography
                        sessions for personal or commercial use.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white transition hover:bg-gray-700"
                        >
                            Discuss Your Project
                        </Link>
                        <Link
                            href="/portfolio/wildlife"
                            className="inline-flex items-center justify-center rounded-full border-2 border-gray-900 px-8 py-4 text-lg font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
                        >
                            View Wildlife Portfolio
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}