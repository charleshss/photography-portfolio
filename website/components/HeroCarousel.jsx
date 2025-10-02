// website/components/HeroCarousel.jsx
'use client';

import * as React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { getHeroImages, urlFor } from '@/lib/sanity'; // Changed from portfolio-data

export default function HeroCarousel() {
    const [heroImages, setHeroImages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [api, setApi] = React.useState();
    const [current, setCurrent] = React.useState(1);
    const autoplayRef = React.useRef(null);

    // Fetch hero images from Sanity
    React.useEffect(() => {
        async function fetchHeroImages() {
            try {
                const images = await getHeroImages();
                setHeroImages(images);
            } catch (error) {
                console.error('Error fetching hero images:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchHeroImages();
    }, []);

    React.useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
        onSelect();
        api.on('select', onSelect);
        return () => api.off('select', onSelect);
    }, [api]);

    // Add keyboard navigation for left/right arrow keys
    React.useEffect(() => {
        if (!api) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                api.scrollPrev();
            } else if (e.key === 'ArrowRight') {
                api.scrollNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [api]);

    // Initialize autoplay with ref for cleanup
    React.useEffect(() => {
        autoplayRef.current = Autoplay({
            delay: 6000,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
        });
        return () => {
            if (autoplayRef.current) {
                autoplayRef.current.stop();
            }
        };
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="h-screen bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-gray-500">Loading hero images...</div>
            </div>
        );
    }

    // No images state
    if (heroImages.length === 0) {
        return (
            <div className="h-screen bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">No Hero Images</h1>
                    <p>
                        Upload some photos and mark them as "Hero Carousel" in
                        Sanity Studio
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Carousel
            className="w-full h-full"
            plugins={autoplayRef.current ? [autoplayRef.current] : []}
            setApi={setApi}
            opts={{ align: 'start', loop: true }}
        >
            <CarouselContent className="h-full !ml-0 [&>*]:!pl-0">
                {heroImages.map((image) => (
                    <CarouselItem key={image._id} className="h-full basis-full">
                        <div
                            className="relative flex w-full items-center bg-cover bg-center hero-height"
                            style={{
                                backgroundImage: `url(${urlFor(image.image).width(1920).height(1080).quality(95).url()})`,
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                            <div className="relative z-10 flex w-full items-center px-8 md:px-16 lg:px-24">
                                <div className="max-w-2xl animate-fade-in space-y-4 text-left">
                                    <h2 className="text-lg font-semibold uppercase tracking-[0.35em] text-hero-text md:text-xl lg:text-2xl">
                                        {image.title}
                                    </h2>
                                    {image.description && (
                                        <p className="text-sm font-light leading-relaxed text-hero-text/80 md:text-base">
                                            {image.description}
                                        </p>
                                    )}
                                    {image.location && (
                                        <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-hero-text/60">
                                            📍 {image.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-x-0 bottom-8 flex items-center justify-center">
                                <div className="flex gap-2">
                                    {heroImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => api?.scrollTo(index)}
                                            className={`pointer-events-auto rounded-full transition-all duration-300 ease-out hover:scale-110 ${
                                                index === current - 1
                                                    ? 'h-2.5 w-8 bg-white shadow-lg'
                                                    : 'h-2 w-2 bg-white/50 hover:bg-white/70'
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 border-white/30 bg-white/20 text-white hover:bg-white/30" />
            <CarouselNext className="right-4 border-white/30 bg-white/20 text-white hover:bg-white/30" />
        </Carousel>
    );
}
