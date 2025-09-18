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

export default function HeroCarousel() {
    // Placeholder images - replace with Sam's photos later
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
            title: 'Mountain Landscapes',
            subtitle: 'Capturing nature\'s majesty',
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
            title: 'Nature\'s Beauty',
            subtitle: 'Moments frozen in time',
        },
    ];

    return (
        <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
                {slides.map((slide) => (
                    <CarouselItem key={slide.id} className="h-full">
                        <div
                            className="relative w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${slide.image})`,
                                height: 'calc(100vh - 64px)' // Accounting for navbar height
                            }}
                        >
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/40" />

                            {/* Content */}
                            <div className="relative h-full flex items-center justify-center">
                                <div className="text-center text-white px-4">
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                        {slide.title}
                                    </h1>
                                    <p className="text-lg md:text-xl">
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
        </Carousel>
    );
}

// Don't forget to import Link at the top!
import Link from 'next/link';