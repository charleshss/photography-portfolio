'use client';

import { useState } from 'react';
import { urlFor } from '@/lib/sanity';
import { Maximize2 } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function MobileImageViewer({ image, alt, title }) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Get optimized image URLs
    const thumbnailUrl = urlFor(image).width(800).quality(85).url();
    const fullResUrl = urlFor(image).width(3840).quality(95).url();

    return (
        <div className="relative w-full h-full">
            {/* Thumbnail - tap to open lightbox */}
            <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative w-full h-full cursor-pointer bg-gray-900"
            >
                <img
                    src={thumbnailUrl}
                    alt={alt}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Tap to zoom hint - positioned below image */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 shadow-lg">
                    <Maximize2 size={16} />
                    <span>Tap image to zoom</span>
                </div>
            </div>

            {/* Full-screen lightbox with native pinch-to-zoom */}
            <Lightbox
                open={isLightboxOpen}
                close={() => setIsLightboxOpen(false)}
                slides={[
                    {
                        src: fullResUrl,
                        alt: alt,
                        title: title,
                    },
                ]}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null,
                }}
                carousel={{ finite: true }}
                controller={{ closeOnBackdropClick: true }}
            />
        </div>
    );
}
