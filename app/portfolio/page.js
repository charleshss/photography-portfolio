// app/portfolio/page.js
import Link from 'next/link';
import Gallery from '@/components/Gallery';

export const metadata = {
    title: 'Portfolio - Sam\'s Photography',
    description: 'Wildlife and landscape photography portfolio by SamuelSS',
};

export default function Portfolio() {
    // Placeholder images for landscape photography
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
        }
    ];

    // Placeholder images for wildlife photography
    const wildlifeImages = [
        {
            id: 1,
            src: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
            alt: 'Lion in natural habitat',
            title: 'Majestic Lion',
            species: 'African Lion',
            location: 'Masai Mara, Kenya'
        },
        {
            id: 2,
            src: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop',
            alt: 'Eagle in flight',
            title: 'Soaring Eagle',
            species: 'Golden Eagle',
            location: 'Scottish Highlands'
        },
        {
            id: 3,
            src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&h=600&fit=crop',
            alt: 'Fox in winter',
            title: 'Arctic Fox',
            species: 'Red Fox',
            location: 'Yellowstone, USA'
        },
        {
            id: 4,
            src: 'https://images.unsplash.com/photo-1582539436847-485e5d43c2b6?w=800&h=600&fit=crop',
            alt: 'Elephant family',
            title: 'Elephant Family',
            species: 'African Elephant',
            location: 'Serengeti, Tanzania'
        }
    ];

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
            />

            {/* Wildlife Photography Section */}
            <Gallery
                title="Wildlife Photography"
                description="Intimate portraits of wildlife in their natural habitats, showcasing the personality and behavior of nature's most fascinating creatures."
                images={wildlifeImages}
                viewAllLink="/portfolio/wildlife"
                viewAllText="View All Wildlife"
                showLocation={true}
                showSpecies={true}
                backgroundColor="bg-gray-50"
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