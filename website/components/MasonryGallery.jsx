'use client';

import { motion } from 'framer-motion';
import ImageCard from './ImageCard';
import { getPhotoUrl } from './Gallery';

/**
 * True Masonry Gallery using CSS Grid
 * Images maintain their aspect ratios and align to the top
 */
export default function MasonryGallery({
    images,
    showLocation = false,
    showSpecies = false,
    context = 'portfolio',
    columns = { sm: 1, md: 2, lg: 3, xl: 3 },
}) {
    return (
        <div
            className="masonry-grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns.sm}, 1fr)`,
                gap: '1.5rem',
                gridAutoRows: '10px', // Small row height for fine-grained control
            }}
        >
            <style jsx>{`
                @media (min-width: 768px) {
                    .masonry-grid {
                        grid-template-columns: repeat(${columns.md}, 1fr) !important;
                    }
                }
                @media (min-width: 1024px) {
                    .masonry-grid {
                        grid-template-columns: repeat(${columns.lg}, 1fr) !important;
                    }
                }
                @media (min-width: 1280px) {
                    .masonry-grid {
                        grid-template-columns: repeat(${columns.xl}, 1fr) !important;
                    }
                }
            `}</style>

            {images.map((image, idx) => (
                <MasonryItem
                    key={image._id || image.id || idx}
                    image={image}
                    index={idx}
                    showLocation={showLocation}
                    showSpecies={showSpecies}
                    context={context}
                />
            ))}
        </div>
    );
}

function MasonryItem({ image, index, showLocation, showSpecies, context }) {
    // Calculate aspect ratio and grid row span
    const aspectRatio = image.image?.asset?.metadata?.dimensions
        ? image.image.asset.metadata.dimensions.width /
          image.image.asset.metadata.dimensions.height
        : 1.5; // Default aspect ratio

    // Calculate how many 10px rows this image should span
    // Base height of 300px, adjusted by aspect ratio
    const baseHeight = 300;
    const height = baseHeight / aspectRatio;
    const rowSpan = Math.ceil(height / 10);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
                gridRowEnd: `span ${rowSpan}`,
            }}
        >
            <ImageCard
                image={{
                    ...image,
                    href: image.slug?.current
                        ? getPhotoUrl(image, context)
                        : image.href,
                }}
                masonry
                showLocation={showLocation}
                showSpecies={showSpecies}
                index={index}
            />
        </motion.div>
    );
}

// Helper function - export for use in other components
export { getPhotoUrl };
