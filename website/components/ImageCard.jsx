// components/ImageCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';

export default function ImageCard({
    image,
    masonry = false,
    showLocation = false,
    showSpecies = false,
    aspectRatio = 'aspect-[4/3]',
    onClick,
}) {
    // Basic defensive check
    if (!image) {
        return null;
    }

    // Handle both Sanity images and direct URLs
    const imageUrl = image.image
        ? urlFor(image.image).width(masonry ? 600 : 800).height(masonry ? 400 : 600).quality(80).url()
        : image.src;

    const altText = image.image?.alt || image.alt || image.title || '';

    const CardInner = (
        <div
            className={[
                'group relative overflow-hidden rounded-lg bg-gray-200',
                masonry ? '' : aspectRatio,
            ].join(' ')}
            onClick={onClick}
        >
            {/* Image */}
            {masonry ? (
                <img
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-auto object-cover"
                    loading="lazy"
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
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            )}

            {/* Hover veil */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

            {/* Overlay content (bottom-left) - ONLY VISIBLE ON HOVER */}
            {(image.title || (showSpecies && image.species) || (showLocation && image.location)) && (
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="inline-block rounded-md bg-black/60 px-3 py-2 text-left text-white backdrop-blur-sm">
                        {image.title && (
                            <h3 className="text-sm font-semibold leading-tight">
                                {image.title}
                            </h3>
                        )}

                        {/* Wildlife species */}
                        {showSpecies && image.species && (
                            <p className="mt-0.5 text-xs text-gray-200">{image.species}</p>
                        )}

                        {/* Location */}
                        {showLocation && image.location && (
                            <p className="mt-0.5 text-xs text-gray-300">{image.location}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    // Clickable card if href provided
    return image.href ? (
        <Link href={image.href} aria-label={image.title || altText || 'View image'}>
            {CardInner}
        </Link>
    ) : (
        CardInner
    );
}