'use client';

// components/ImageCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { Expand } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { urlFor, getLocationDisplay } from '@/lib/sanity';
import ImageModal from './ImageModal';

export default function ImageCard({
    image,
    masonry = false,
    showLocation = false,
    showSpecies = false,
    aspectRatio = 'aspect-[4/3]',
    onClick,
    index = 0,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Basic defensive check
    if (!image) {
        return null;
    }

    // Handle both Sanity images and direct URLs
    const imageUrl = image.image
        ? (() => {
              const builder = urlFor(image.image)
                  .quality(masonry ? 85 : 80)
                  .fit('clip');

              if (masonry) {
                  return builder.width(1600).url();
              }

              return builder.width(800).height(600).url();
          })()
        : image.src;

    const resolvedMasonrySrc = masonry
        ? image.resolvedImageUrl || image.src || imageUrl
        : imageUrl;

    // High-res image URL for modal - preserve original aspect ratio
    const highResImageUrl = image.image
        ? urlFor(image.image).width(2048).quality(95).url() // Only specify width, let height scale naturally
        : image.src;

    const altText = image.image?.alt || image.alt || image.title || '';

    const handleExpandClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
    };

    const CardInner = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
                scale: 1.05,
                y: -8,
                zIndex: 50,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                transition: {
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                },
            }}
            className={[
                'group relative overflow-hidden rounded-lg bg-background cursor-pointer shadow-md',
                masonry ? 'h-full' : aspectRatio,
            ].join(' ')}
            style={{
                transformOrigin: 'center center',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform',
                isolation: 'isolate',
            }}
            onClick={onClick}
        >
            {/* Image */}
            {masonry ? (
                <img
                    src={resolvedMasonrySrc}
                    alt={altText}
                    className="block h-full w-full object-contain"
                    loading="lazy"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'scale(1.02) translateZ(0)',
                        willChange: 'transform',
                    }}
                />
            ) : (
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    priority={false}
                    placeholder={image.blurDataURL ? 'blur' : 'empty'}
                    blurDataURL={image.blurDataURL}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'scale(1.02) translateZ(0)',
                        willChange: 'transform',
                    }}
                />
            )}

            {/* Hover veil */}
            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />

            {/* Expand button */}
            <button
                onClick={handleExpandClick}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-black/70 z-10"
                aria-label="View full size image"
            >
                <Expand size={18} />
            </button>

            {/* Overlay content (bottom-left) - ONLY VISIBLE ON HOVER */}
            {(image.title ||
                (showSpecies && image.species) ||
                (showLocation && getLocationDisplay(image))) && (
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="inline-block rounded-md bg-black/60 px-3 py-2 text-left text-white backdrop-blur-sm">
                        {image.title && (
                            <h3 className="text-sm font-semibold leading-tight">
                                {image.title}
                            </h3>
                        )}

                        {/* Wildlife species */}
                        {showSpecies && image.species && (
                            <p className="mt-0.5 text-xs text-gray-200">
                                {Array.isArray(image.species)
                                    ? image.species
                                          .map((s) => s.name)
                                          .join(', ')
                                    : image.species}
                            </p>
                        )}

                        {/* Location */}
                        {showLocation && getLocationDisplay(image) && (
                            <p className="mt-0.5 text-xs text-gray-300">
                                {getLocationDisplay(image)}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );

    // Clickable card if href provided
    return (
        <>
            {image.href ? (
                <Link
                    href={image.href}
                    aria-label={image.title || altText || 'View image'}
                >
                    {CardInner}
                </Link>
            ) : (
                CardInner
            )}

            {/* Image Modal - Still available via expand button */}
            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                imageUrl={highResImageUrl}
                altText={altText}
                title={image.title}
            />
        </>
    );
}
