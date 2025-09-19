// components/Gallery.jsx
import Link from 'next/link';
import ImageCard from './ImageCard';

export default function Gallery({
    title,
    description,
    images,
    viewAllLink,
    viewAllText = "View All",
    showLocation = false,
    showSpecies = false,
    gridCols = "md:grid-cols-2 lg:grid-cols-4",
    masonry = false,
    backgroundColor = "bg-white"
}) {
    return (
        <section className={`${backgroundColor} px-6 py-20`}>
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            {title}
                        </h2>
                        <p className="max-w-2xl text-gray-600">
                            {description}
                        </p>
                    </div>
                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="hidden md:inline-flex items-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                        >
                            {viewAllText}
                        </Link>
                    )}
                </div>

                {/* Gallery Grid */}
                {masonry ? (
                    // Masonry layout for detailed portfolio pages
                    <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
                        {images.map((image, index) => (
                            <div key={image.id} className="mb-6">
                                <ImageCard
                                    image={image}
                                    showLocation={showLocation}
                                    showSpecies={showSpecies}
                                    aspectRatio={
                                        index % 3 === 0 ? 'aspect-[4/5]' :
                                            index % 3 === 1 ? 'aspect-[4/3]' :
                                                'aspect-square'
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    // Regular grid layout for preview sections
                    <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
                        {images.map((image) => (
                            <ImageCard
                                key={image.id}
                                image={image}
                                showLocation={showLocation}
                                showSpecies={showSpecies}
                            />
                        ))}
                    </div>
                )}

                {/* Mobile View All Button */}
                {viewAllLink && (
                    <div className="mt-8 text-center md:hidden">
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                        >
                            {viewAllText}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}