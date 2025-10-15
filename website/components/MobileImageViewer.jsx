'use client';

import { urlFor } from '@/lib/sanity';

export default function MobileImageViewer({ image, alt }) {
    // Get high-quality image URL
    const imageUrl = urlFor(image).width(1200).quality(95).url();

    return (
        <div className="w-full">
            {/* Simple full-width, high-quality image */}
            <img
                src={imageUrl}
                alt={alt}
                className="w-full h-auto object-contain"
            />
        </div>
    );
}