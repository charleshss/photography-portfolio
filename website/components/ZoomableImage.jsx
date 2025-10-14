'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { urlFor } from '@/lib/sanity';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

export default function ZoomableImage({ image, alt }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Mobile pinch-to-zoom state
    const [isPinching, setIsPinching] = useState(false);
    const [lastPinchDistance, setLastPinchDistance] = useState(0);
    const [pinchCenter, setPinchCenter] = useState({ x: 0, y: 0 });

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    // Get different sized URLs
    const imageUrl = urlFor(image).width(1200).quality(90).url();
    const highResUrl = urlFor(image).width(2400).quality(95).url();

    const zoomIn = () => {
        setScale((prev) => Math.min(prev * 1.5, 5));
    };

    const zoomOut = () => {
        setScale((prev) => Math.max(prev / 1.5, 0.25));
    };

    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Helper function to calculate distance between two touch points
    const getTouchDistance = (touch1, touch2) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Helper function to get center point between two touches
    const getTouchCenter = (touch1, touch2) => {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2,
        };
    };

    // Constrain position to prevent image from being dragged too far out
    const constrainPosition = useCallback((newX, newY, currentScale) => {
        if (!containerRef.current) return { x: newX, y: newY };

        const container = containerRef.current.getBoundingClientRect();
        const maxOffset = Math.max(
            100,
            (currentScale - 1) *
                Math.min(container.width, container.height) *
                0.5
        );

        return {
            x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
            y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
        };
    }, []);

    const handleMouseDown = (e) => {
        // Allow dragging at any scale level
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
        e.preventDefault(); // Prevent text selection and other default behaviours
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (isDragging) {
                const newX = e.clientX - dragStart.x;
                const newY = e.clientY - dragStart.y;
                const constrainedPosition = constrainPosition(
                    newX,
                    newY,
                    scale
                );
                setPosition(constrainedPosition);
            }
        },
        [isDragging, dragStart, scale, constrainPosition]
    );

    const handleWheel = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();

            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            let pointerX = e.clientX - rect.left;
            let pointerY = e.clientY - rect.top;

            const pointerInside =
                Number.isFinite(pointerX) &&
                Number.isFinite(pointerY) &&
                pointerX >= 0 &&
                pointerX <= rect.width &&
                pointerY >= 0 &&
                pointerY <= rect.height;

            if (!pointerInside) {
                pointerX = centerX;
                pointerY = centerY;
            }

            const imageCoordX = (pointerX - centerX - position.x) / scale;
            const imageCoordY = (pointerY - centerY - position.y) / scale;

            const zoomFactor = Math.exp(-e.deltaY / 300);
            const unclampedScale = scale * zoomFactor;
            const newScale = Math.max(0.25, Math.min(5, unclampedScale));

            if (newScale === scale) {
                return;
            }

            const newPosX = pointerX - centerX - newScale * imageCoordX;
            const newPosY = pointerY - centerY - newScale * imageCoordY;
            const constrained = constrainPosition(newPosX, newPosY, newScale);

            setScale(newScale);
            setPosition(constrained);
        },
        [scale, position, constrainPosition]
    );

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
            container.addEventListener('wheel', handleWheel, {
                passive: false,
            });

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
                document.addEventListener('mousemove', globalMouseMove, {
                    passive: false,
                });
                document.addEventListener('mouseup', globalMouseUp, {
                    passive: false,
                });
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
                    relative overflow-hidden bg-surface/60 rounded-lg select-none
                    ${isFullscreen ? 'h-screen w-screen fixed inset-0 z-50 bg-background rounded-none' : 'aspect-[4/3] md:aspect-[16/10]'}
                    ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                `}
                onMouseDown={handleMouseDown}
                onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (e.touches.length === 1) {
                        // Only allow dragging if zoomed in
                        if (scale > 1) {
                            const touch = e.touches[0];
                            setIsDragging(true);
                            setDragStart({
                                x: touch.clientX - position.x,
                                y: touch.clientY - position.y,
                            });
                        }
                    } else if (e.touches.length === 2) {
                        // Two touches - pinch to zoom
                        setIsDragging(false);
                        setIsPinching(true);

                        const touch1 = e.touches[0];
                        const touch2 = e.touches[1];
                        const distance = getTouchDistance(touch1, touch2);
                        const center = getTouchCenter(touch1, touch2);

                        // Convert touch center to container coordinates
                        const container = containerRef.current;
                        if (container) {
                            const rect = container.getBoundingClientRect();
                            setPinchCenter({
                                x: center.x - rect.left,
                                y: center.y - rect.top,
                            });
                        }

                        setLastPinchDistance(distance);
                    }
                }}
                onTouchMove={(e) => {
                    // Only prevent default and stop propagation when we're actually interacting
                    if ((isDragging && scale > 1) || isPinching) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    if (e.touches.length === 1 && isDragging && !isPinching && scale > 1) {
                        // Single touch drag - only when zoomed in
                        const touch = e.touches[0];
                        const newX = touch.clientX - dragStart.x;
                        const newY = touch.clientY - dragStart.y;
                        const constrainedPosition = constrainPosition(
                            newX,
                            newY,
                            scale
                        );
                        setPosition(constrainedPosition);
                    } else if (e.touches.length === 2 && isPinching) {
                        // Pinch to zoom
                        const touch1 = e.touches[0];
                        const touch2 = e.touches[1];
                        const distance = getTouchDistance(touch1, touch2);

                        if (lastPinchDistance > 0) {
                            const scaleChange = distance / lastPinchDistance;
                            const newScale = Math.max(
                                0.25,
                                Math.min(5, scale * scaleChange)
                            );

                            // Zoom toward pinch center
                            const container = containerRef.current;
                            if (container) {
                                const rect = container.getBoundingClientRect();
                                const centerX = rect.width / 2;
                                const centerY = rect.height / 2;

                                const offsetX =
                                    (pinchCenter.x - centerX) / scale;
                                const offsetY =
                                    (pinchCenter.y - centerY) / scale;

                                const actualScaleChange = newScale / scale;
                                const newX =
                                    position.x -
                                    offsetX * (actualScaleChange - 1) * scale;
                                const newY =
                                    position.y -
                                    offsetY * (actualScaleChange - 1) * scale;
                                const constrainedPosition = constrainPosition(
                                    newX,
                                    newY,
                                    newScale
                                );

                                setScale(newScale);
                                setPosition(constrainedPosition);
                            }
                        }

                        setLastPinchDistance(distance);
                    }
                }}
                onTouchEnd={(e) => {
                    if (e.touches.length === 0) {
                        setIsDragging(false);
                        setIsPinching(false);
                        setLastPinchDistance(0);
                    } else if (e.touches.length === 1 && isPinching) {
                        // Switch from pinch to drag - only if zoomed in
                        setIsPinching(false);
                        setLastPinchDistance(0);

                        if (scale > 1) {
                            const touch = e.touches[0];
                            setIsDragging(true);
                            setDragStart({
                                x: touch.clientX - position.x,
                                y: touch.clientY - position.y,
                            });
                        }
                    }
                }}
                onClick={(e) => {
                    // Only zoom in if not dragging and clicking on the image itself
                    if (
                        !isDragging &&
                        scale === 1 &&
                        (e.target === e.currentTarget ||
                            e.target.tagName === 'IMG')
                    ) {
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
                        transformOrigin: '50% 50%',
                        willChange: isDragging ? 'transform' : 'auto',
                        transition: isDragging
                            ? 'none'
                            : 'transform 0.2s ease-out',
                    }}
                    draggable={false}
                />

                {/* Floating Controls - Bottom right corner */}
                <div
                    className={`absolute bottom-4 right-4 transition-opacity duration-200 z-10 pointer-events-auto ${
                        scale === 1
                            ? 'opacity-60 hover:opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                    }`}
                >
                    <div className="flex items-center gap-2 bg-surface/90 backdrop-blur-sm rounded-lg p-2 pointer-events-auto border border-white/10">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                zoomOut();
                            }}
                            className="p-2 rounded-lg bg-surface-alt hover:bg-primary/20 text-foreground transition-colors"
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
                            className="p-2 rounded-lg bg-surface-alt hover:bg-primary/20 text-foreground transition-colors"
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
                            className="p-2 rounded-lg bg-surface-alt hover:bg-primary/20 text-foreground transition-colors"
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
                            className="p-2 rounded-lg bg-surface-alt hover:bg-primary/20 text-foreground transition-colors"
                            aria-label="Fullscreen"
                        >
                            <Maximize2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Zoom level indicator - Top right corner */}
                {scale !== 1 && (
                    <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                        <div className="text-sm text-foreground font-medium">
                            {Math.round(scale * 100)}%
                        </div>
                    </div>
                )}

                {/* Zoom hint overlay */}
                {scale === 1 && !isDragging && !isPinching && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-surface/5">
                        <div className="bg-surface/90 backdrop-blur-sm px-4 py-3 rounded-lg text-sm text-foreground text-center border border-white/10">
                            <div className="hidden md:block">
                                Click to zoom • Scroll wheel to zoom • Drag when
                                zoomed
                            </div>
                            <div className="md:hidden">
                                Tap to zoom • Pinch to zoom • Drag when zoomed
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
