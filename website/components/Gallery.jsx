// components/Gallery.jsx
import Link from 'next/link';
import ImageCard from './ImageCard';

// Helper function to generate contextual photo URLs
function getPhotoUrl(image, context) {
    const slug = image.slug.current;

    switch (context) {
        case 'wildlife':
            return `/portfolio/wildlife/photo/${slug}`;
        case 'landscapes':
            return `/portfolio/landscapes/photo/${slug}`;
        case 'home':
        case 'featured':
            // For home page featured images, use generic photo URL
            return `/photo/${slug}`;
        case 'portfolio':
            // For main portfolio page, use portfolio-specific URL that returns to portfolio
            return `/portfolio/photo/${slug}`;
        default:
            // For other contexts, try to use category-specific URLs
            if (image.category === 'wildlife') {
                return `/portfolio/wildlife/photo/${slug}`;
            } else if (image.category === 'landscape') {
                return `/portfolio/landscapes/photo/${slug}`;
            }
            // Fallback to generic photo URL
            return `/photo/${slug}`;
    }
}

/**
 * Props:
 * - title, description: section heading
 * - images: [{ id, src, alt, title?, subtitle?, species?, location?, href?, blurDataURL? }]
 * - viewAllLink, viewAllText
 * - showLocation, showSpecies
 * - gridCols: e.g. "md:grid-cols-2 lg:grid-cols-4" (used for non-masonry)
 * - masonry: true => CSS columns masonry
 * - backgroundColor: Tailwind bg-* class
 */
export default function Gallery({
    title,
    description,
    images,
    viewAllLink,
    viewAllText = 'View All',
    showLocation = false,
    showSpecies = false,
    gridCols = 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    masonry = false,
    backgroundColor = 'bg-white',
    context = 'portfolio', // 'wildlife', 'landscapes', 'home', or 'portfolio'
}) {
    return (
        <section className={`${backgroundColor} px-6 py-20`}>
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        {title && (
                            <h2 className="mb-3 text-3xl font-bold md:text-4xl">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="max-w-2xl text-gray-600">
                                {description}
                            </p>
                        )}
                    </div>

                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                        >
                            {viewAllText}
                        </Link>
                    )}
                </div>

                {/* Gallery */}
                {masonry ? (
                    /**
                     * Masonry: use CSS columns. Children must:
                     * - be display: block,
                     * - use break-inside-avoid to prevent splitting,
                     * - have natural height (no fixed aspect box).
                     */
                    <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
                        {images.map((image, idx) => (
                            <div key={image._id || image.id || idx} className="mb-6 break-inside-avoid">
                                <ImageCard
                                    image={{
                                        ...image,
                                        href: image.slug?.current ? getPhotoUrl(image, context) : image.href
                                    }}
                                    masonry
                                    showLocation={showLocation}
                                    showSpecies={showSpecies}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /**
                     * Uniform grid for previews / homepage.
                     * Tiles share an aspect ratio and use next/image fill (fast, stable).
                     */
                    <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
                        {images.map((image, idx) => (
                            <ImageCard
                                key={image._id || image.id || idx}
                                image={{
                                    ...image,
                                    href: image.slug?.current ? getPhotoUrl(image, context) : image.href
                                }}
                                showLocation={showLocation}
                                showSpecies={showSpecies}
                                aspectRatio="aspect-[4/3]"
                            />
                        ))}
                    </div>
                )}

                {/* Mobile View All (if you hid it above) */}
                {!masonry && viewAllLink && (
                    <div className="mt-10 text-center sm:hidden">
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
