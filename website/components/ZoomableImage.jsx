'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { urlFor } from '@/lib/sanity';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

export default function ZoomableImage({ image, alt, title }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    // Get different sized URLs
    const imageUrl = urlFor(image).width(1200).quality(90).url();
    const highResUrl = urlFor(image).width(2400).quality(95).url();

    const zoomIn = () => {
        setScale(prev => Math.min(prev * 1.5, 5));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(prev / 1.5, 0.25));
    };

    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        // Allow dragging at any scale level
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        e.preventDefault(); // Prevent text selection and other default behaviors
    };

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            // Direct update without requestAnimationFrame for maximum responsiveness
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            // Much more permissive constraints for smoother feel
            if (scale > 1) {
                // For zoomed images, allow very free movement
                const maxX = 500 * scale;
                const maxY = 500 * scale;

                setPosition({
                    x: Math.max(-maxX, Math.min(maxX, newX)),
                    y: Math.max(-maxY, Math.min(maxY, newY))
                });
            } else {
                // For normal/zoomed out, allow much more freedom
                setPosition({
                    x: Math.max(-300, Math.min(300, newX)),
                    y: Math.max(-300, Math.min(300, newY))
                });
            }
        }
    }, [isDragging, dragStart, scale]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(prev => Math.max(0.25, Math.min(5, prev * delta)));
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Handle fullscreen change
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
        if (!document.fullscreenElement) {
            resetZoom();
        }
    };

    // Add optimised event listeners for better performance
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });

            // Add global mouse move and mouse up for better drag performance
            const globalMouseMove = (e) => {
                if (isDragging) {
                    handleMouseMove(e);
                }
            };

            const globalMouseUp = () => {
                setIsDragging(false);
            };

            if (isDragging) {
                document.addEventListener('mousemove', globalMouseMove, { passive: false });
                document.addEventListener('mouseup', globalMouseUp, { passive: false });
            }

            return () => {
                if (container) {
                    container.removeEventListener('wheel', handleWheel);
                }
                document.removeEventListener('mousemove', globalMouseMove);
                document.removeEventListener('mouseup', globalMouseUp);
            };
        }
    }, [handleWheel, isDragging, handleMouseMove]);

    // Add fullscreen change listener cleanup
    useEffect(() => {
        const fullscreenHandler = handleFullscreenChange;
        document.addEventListener('fullscreenchange', fullscreenHandler);

        return () => {
            document.removeEventListener('fullscreenchange', fullscreenHandler);
        };
    }, [handleFullscreenChange]);

    return (
        <div className="relative group">
            {/* Image Container */}
            <div
                ref={containerRef}
                className={`
                    relative overflow-hidden bg-white rounded-lg select-none
                    ${isFullscreen ? 'h-screen w-screen fixed inset-0 z-50 bg-black rounded-none' : 'aspect-[4/3] md:aspect-[16/10]'}
                    ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                `}
                onMouseDown={handleMouseDown}
                onTouchStart={(e) => {
                    const touch = e.touches[0];
                    setIsDragging(true);
                    setDragStart({
                        x: touch.clientX - position.x,
                        y: touch.clientY - position.y
                    });
                    e.preventDefault();
                }}
                onTouchMove={(e) => {
                    if (isDragging) {
                        const touch = e.touches[0];
                        if (touch) {
                            const newX = touch.clientX - dragStart.x;
                            const newY = touch.clientY - dragStart.y;

                            if (scale > 1) {
                                const maxX = 500 * scale;
                                const maxY = 500 * scale;

                                setPosition({
                                    x: Math.max(-maxX, Math.min(maxX, newX)),
                                    y: Math.max(-maxY, Math.min(maxY, newY))
                                });
                            } else {
                                setPosition({
                                    x: Math.max(-300, Math.min(300, newX)),
                                    y: Math.max(-300, Math.min(300, newY))
                                });
                            }
                        }
                        e.preventDefault();
                    }
                }}
                onTouchEnd={() => setIsDragging(false)}
                onClick={(e) => {
                    // Only zoom in if not dragging and clicking on the image itself
                    if (!isDragging && scale === 1 && (e.target === e.currentTarget || e.target.tagName === 'IMG')) {
                        zoomIn();
                    }
                }}
            >
                <img
                    ref={imageRef}
                    src={scale > 2 ? highResUrl : imageUrl}
                    alt={alt}
                    className="w-full h-full object-contain select-none"
                    style={{
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                        transformOrigin: 'center center',
                        willChange: isDragging ? 'transform' : 'auto',
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    }}
                    draggable={false}
                />

                {/* Floating Controls - Bottom right corner */}
                <div className={`absolute bottom-4 right-4 transition-opacity duration-200 z-10 pointer-events-auto ${
                    scale === 1 ? 'opacity-60 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 pointer-events-auto">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                zoomOut();
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                            aria-label="Zoom out"
                        >
                            <ZoomOut size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                resetZoom();
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                            aria-label="Reset zoom"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                zoomIn();
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                            aria-label="Zoom in"
                        >
                            <ZoomIn size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFullscreen();
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                            aria-label="Fullscreen"
                        >
                            <Maximize2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Zoom level indicator - Top right corner */}
                {scale !== 1 && (
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="text-sm text-white font-medium">
                            {Math.round(scale * 100)}%
                        </div>
                    </div>
                )}

                {/* Zoom hint overlay */}
                {scale === 1 && !isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/5">
                        <div className="bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg text-sm text-white">
                            Click to zoom • Scroll wheel to zoom • Drag when zoomed
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}