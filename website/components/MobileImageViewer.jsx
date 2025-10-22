'use client';

import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

export default function MobileImageViewer({ image, alt }) {
    const metadata = image?.asset?.metadata?.dimensions;
    const lqip = image?.asset?.metadata?.lqip;
    const targetWidth = metadata?.width
        ? Math.min(metadata.width, 1200)
        : 1200;
    const aspectRatio =
        metadata?.width && metadata?.height
            ? metadata.height / metadata.width
            : 0.75;
    const targetHeight = Math.round(targetWidth * aspectRatio);

    // Get high-quality image URL scaled to mobile-friendly width
    const imageUrl = urlFor(image).width(targetWidth).quality(95).url();

    return (
        <div className="w-full">
            <Image
                src={imageUrl}
                alt={alt}
                width={targetWidth}
                height={targetHeight}
                sizes="100vw"
                placeholder={lqip ? 'blur' : 'empty'}
                blurDataURL={lqip}
                className="w-full h-auto object-contain"
                priority={false}
            />
        </div>
    );
}
