// components/HeroCarousel.jsx
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

export default function HeroCarousel() {
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
            title: 'Mountain Landscapes',
            subtitle: "Capturing nature's majesty",
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&h=1080&fit=crop',
            title: 'Wildlife Photography',
            subtitle: 'Animals in their natural habitat',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1920&h=1080&fit=crop',
            title: "Nature's Beauty",
            subtitle: 'Moments frozen in time',
        },
    ];

    const [api, setApi] = React.useState();
    const [current, setCurrent] = React.useState(1);
    const count = slides.length;

    React.useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
        onSelect();
        api.on('select', onSelect);
        return () => api.off('select', onSelect);
    }, [api]);

    return (
        <Carousel
            className="w-full h-full"
            plugins={[Autoplay({ delay: 6000, stopOnMouseEnter: true, stopOnInteraction: false, })]}
            setApi={setApi}
            opts={{ align: 'start', loop: true }}
        >
            {/* Carousel Content */}
            <CarouselContent className="h-full !ml-0 [&>*]:!pl-0">
                {slides.map((slide) => (
                    <CarouselItem key={slide.id} className="h-full basis-full">
                        <div
                            className="relative w-full bg-cover bg-center"
                            style={{ height: 'calc(100vh - 64px)', backgroundImage: `url(${slide.image})` }}
                        >
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/40" />

                            {/* Centre caption */}
                            <div className="relative flex h-full items-center justify-center px-4 text-center text-white">
                                <div>
                                    <h1 className="mb-4 text-4xl font-bold md:text-6xl">{slide.title}</h1>
                                    <p className="text-lg md:text-xl">{slide.subtitle}</p>
                                </div>
                            </div>

                            {/* Slide X of Y badge (subtle) */}
                            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
                                <span
                                    className="rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm"
                                    aria-live="polite"
                                >
                                    Slide {current} of {count}
                                </span>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {/* Arrows only */}
            <CarouselPrevious className="left-4 border-white/30 bg-white/20 text-white hover:bg-white/30" />
            <CarouselNext className="right-4 border-white/30 bg-white/20 text-white hover:bg-white/30" />
        </Carousel>
    );
}
