'use client';

import * as React from 'react';
import Image from 'next/image';
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
            image:
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&h=1350&fit=crop',
            title: 'Mountain Landscapes',
            subtitle: "Capturing nature's majesty",
        },
        {
            id: 2,
            image:
                'https://images.unsplash.com/photo-1549366021-9f761d450615?w=2400&h=1350&fit=crop',
            title: 'Wildlife Photography',
            subtitle: 'Animals in their natural habitat',
        },
        {
            id: 3,
            image:
                'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=2400&h=1350&fit=crop',
            title: "Nature's Beauty",
            subtitle: 'Moments frozen in time',
        },
    ];

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
    );

    return (
        <div
            className="
        relative w-full overflow-hidden
        h-[60vh] md:h-[70vh] lg:h-[80vh] min-h-[420px]
      "
        >
            <Carousel
                opts={{ align: 'start', loop: true }}
                plugins={[plugin.current]}
                className="h-full w-full"
            >
                <CarouselContent className="h-full !ml-0">
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id} className="h-full basis-full pl-0">
                            <div className="relative h-full w-full">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
                                <div className="relative flex h-full w-full items-end">
                                    <div className="px-6 pb-8 sm:px-10">
                                        <div className="max-w-md rounded-md bg-black/35 px-5 py-4 text-left text-white shadow-lg backdrop-blur-sm">
                                            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                                                {slide.subtitle}
                                            </p>
                                            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                                                {slide.title}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className="hidden md:block">
                    <CarouselPrevious className="left-6 border-white/30 bg-white/20 text-white hover:bg-white/30" />
                    <CarouselNext className="right-6 border-white/30 bg-white/20 text-white hover:bg-white/30" />
                </div>

                {/* simple dots */}
                <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                    {slides.map((s) => (
                        <span key={s.id} className="h-2 w-2 rounded-full bg-white/40" />
                    ))}
                </div>
            </Carousel>
        </div>
    );
}
