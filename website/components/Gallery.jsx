'use client';

// components/Gallery.jsx
import Link from 'next/link';
import ImageCard from './ImageCard';
import ReactBitsMasonry from '@/components/ui/react-bits-masonry';
import { urlFor } from '@/lib/sanity';

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
 * - totalCount: optional total number of items when `images` is a subset
 * - viewAllLink, viewAllText
 * - showLocation, showSpecies
 * - showCount: show image count in title
 * - gridCols: e.g. "md:grid-cols-2 lg:grid-cols-4" (used for non-masonry)
 * - masonry: true => use React Bits-style animated masonry
 * - backgroundColor: Tailwind bg-* class
 */
export default function Gallery({
    title,
    description,
    images,
    totalCount,
    viewAllLink,
    viewAllText = 'View All',
    showLocation = false,
    showSpecies = false,
    showCount = false,
    gridCols = 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    masonry = false,
    backgroundColor = 'bg-white',
    context = 'portfolio', // 'wildlife', 'landscapes', 'home', or 'portfolio'
}) {
    const resolvedCount =
        typeof totalCount === 'number' ? totalCount : images?.length || 0;

    return (
        <section className={`${backgroundColor} section-padding`}>
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        {title && (
                            <h2 className="mb-3 section-subtitle text-foreground">
                                {title}
                                {showCount && (
                                    <span className="ml-3 text-2xl font-normal text-muted-foreground">
                                        ({resolvedCount})
                                    </span>
                                )}
                            </h2>
                        )}
                        {description && (
                            <p className="max-w-2xl body-large text-muted-foreground">
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
                    <ReactBitsMasonry
                        items={images.map((image, idx) => {
                            const href = image.slug?.current
                                ? getPhotoUrl(image, context)
                                : image.href;
                            const dimensions =
                                image.image?.asset?.metadata?.dimensions;
                            const blurDataURL =
                                image.blurDataURL ||
                                image.image?.asset?.metadata?.lqip;
                            const altText =
                                image.image?.alt || image.alt || image.title || '';

                            const fullImageUrl = image.image
                                ? urlFor(image.image)
                                      .width(1600)
                                      .quality(90)
                                      .url()
                                : image.src;

                            return {
                                id: image._id || image.id || idx,
                                aspectRatio:
                                    dimensions?.aspectRatio ??
                                    (dimensions?.width && dimensions?.height
                                        ? dimensions.width / dimensions.height
                                        : undefined),
                                width: dimensions?.width,
                                height: dimensions?.height,
                                src: fullImageUrl,
                                href,
                                data: {
                                    ...image,
                                    href,
                                    blurDataURL,
                                    alt: altText,
                                    resolvedImageUrl: fullImageUrl,
                                },
                            };
                        })}
                        renderItem={(item, idx) => (
                            <ImageCard
                                image={item.data}
                                masonry
                                showLocation={showLocation}
                                showSpecies={showSpecies}
                                index={idx}
                            />
                        )}
                    />
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
                                    href: image.slug?.current
                                        ? getPhotoUrl(image, context)
                                        : image.href,
                                }}
                                showLocation={showLocation}
                                showSpecies={showSpecies}
                                aspectRatio="aspect-[4/3]"
                                index={idx}
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
