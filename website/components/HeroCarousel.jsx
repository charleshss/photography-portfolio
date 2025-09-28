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
                            className="relative w-full bg-cover bg-center"
                            style={{
                                height: 'calc(100vh - 64px)',
                                backgroundImage: `url(${urlFor(image.image).width(1920).height(1080).quality(85).url()})`,
                            }}
                        >
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="relative flex h-full items-center justify-center px-4 text-center text-white">
                                <div>
                                    <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                                        {image.title}
                                    </h1>
                                    <p className="text-lg md:text-xl">
                                        {image.description}
                                    </p>
                                    {image.location && (
                                        <p className="mt-2 text-sm text-white/80">
                                            {image.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Modern Pagination Dots */}
                            <div className="absolute inset-x-0 bottom-6 flex justify-center space-x-2">
                                {heroImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => api?.scrollTo(index)}
                                        className={`transition-all duration-300 ease-out hover:scale-110 ${
                                            index === current - 1
                                                ? 'h-2.5 w-8 bg-white shadow-lg' // Active dot - larger and bright
                                                : 'h-2 w-2 bg-white/50 hover:bg-white/70' // Inactive dots - smaller and translucent
                                        } rounded-full backdrop-blur-sm`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
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
