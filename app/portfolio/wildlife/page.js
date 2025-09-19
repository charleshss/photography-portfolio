// app/portfolio/wildlife/page.js
import Link from 'next/link';
import Gallery from '@/components/Gallery';

export const metadata = {
    title: 'Wildlife Photography - Sam\'s Photography',
    description: 'Wildlife photography portfolio capturing animals in their natural habitats',
};

export default function Wildlife() {
    // Extended wildlife portfolio images
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
        },
        {
            id: 5,
            src: 'https://images.unsplash.com/photo-1571835782488-c21e3d7cebe0?w=800&h=600&fit=crop',
            alt: 'Brown bear',
            title: 'Forest Guardian',
            species: 'Brown Bear',
            location: 'Alaska, USA'
        },
        {
            id: 6,
            src: 'https://images.unsplash.com/photo-1608664209-b562999e4f0d?w=800&h=600&fit=crop',
            alt: 'Owl portrait',
            title: 'Silent Hunter',
            species: 'Great Horned Owl',
            location: 'British Columbia, Canada'
        },
        {
            id: 7,
            src: 'https://images.unsplash.com/photo-1597550158261-6e5d2c4efa87?w=800&h=600&fit=crop',
            alt: 'Deer in forest',
            title: 'Forest Wanderer',
            species: 'White-tailed Deer',
            location: 'New Forest, England'
        },
        {
            id: 8,
            src: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=600&fit=crop',
            alt: 'Penguin colony',
            title: 'Antarctic Gathering',
            species: 'Emperor Penguin',
            location: 'Antarctica'
        },
        {
            id: 9,
            src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
            alt: 'Wolf pack',
            title: 'Pack Leader',
            species: 'Gray Wolf',
            location: 'Yellowstone, USA'
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
                            Wildlife Photography
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
                            Capturing the raw beauty, personality, and behavior of wildlife in their natural habitats.
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
                        taken with the utmost respect for the animal&#39;s space and natural behavior,
                        often requiring hours of waiting for the perfect moment.&#34;
                    </p>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="border-b px-6 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">150+</h3>
                            <p className="text-gray-600">Species Photographed</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">15</h3>
                            <p className="text-gray-600">Countries Explored</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">500+</h3>
                            <p className="text-gray-600">Hours in the Field</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">8 Years</h3>
                            <p className="text-gray-600">Experience</p>
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
            />

            {/* Equipment & Techniques Section */}
            <section className="bg-gray-50 px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                            Equipment & Techniques
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Wildlife photography demands specialized equipment and techniques to capture
                            animals safely and respectfully from a distance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-3 text-xl font-semibold">Telephoto Lenses</h3>
                            <p className="text-gray-600">
                                400-800mm lenses allow me to capture intimate portraits while maintaining
                                a respectful distance from wildlife subjects.
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-3 text-xl font-semibold">Camouflage & Hides</h3>
                            <p className="text-gray-600">
                                Portable hides and camouflage techniques help me blend into the environment
                                and observe natural behavior.
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-3 text-xl font-semibold">Field Research</h3>
                            <p className="text-gray-600">
                                Extensive research on animal behavior, migration patterns, and seasonal
                                changes ensures successful photography sessions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conservation Message */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        Photography for Conservation
                    </h2>
                    <p className="mb-8 text-lg text-gray-600">
                        Beyond capturing beautiful images, wildlife photography plays a crucial role in
                        conservation awareness. Through these photographs, I hope to inspire others to
                        appreciate and protect the incredible wildlife that shares our planet.
                    </p>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-lg border-2 border-gray-200 p-6">
                            <h3 className="mb-3 text-xl font-semibold">Ethical Practices</h3>
                            <p className="text-gray-600">
                                All wildlife photography follows strict ethical guidelines, ensuring
                                animal welfare is always the top priority.
                            </p>
                        </div>
                        <div className="rounded-lg border-2 border-gray-200 p-6">
                            <h3 className="mb-3 text-xl font-semibold">Conservation Support</h3>
                            <p className="text-gray-600">
                                A portion of all wildlife photography proceeds supports local
                                conservation organizations and wildlife protection efforts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gray-900 px-6 py-20 text-white">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                        Wildlife Photography Expeditions
                    </h2>
                    <p className="mb-8 text-lg text-gray-300">
                        Join me on wildlife photography expeditions or commission specialized
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