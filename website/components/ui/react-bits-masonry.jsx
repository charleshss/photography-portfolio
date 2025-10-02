'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import clsx from 'clsx';

const queries = [
    '(min-width:1500px)',
    '(min-width:1000px)',
    '(min-width:768px)',
    '(min-width:480px)',
];

const queryValues = [5, 4, 3, 2];

const useMedia = (mediaQueries, values, defaultValue) => {
    const getValue = () => {
        if (typeof window === 'undefined') {
            return defaultValue;
        }

        const index = mediaQueries.findIndex((query) =>
            window.matchMedia(query).matches
        );

        return values[index] ?? defaultValue;
    };

    const [value, setValue] = useState(getValue);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const handler = () => setValue(getValue());
        const mqls = mediaQueries.map((query) => window.matchMedia(query));

        mqls.forEach((mql) => {
            if (mql.addEventListener) {
                mql.addEventListener('change', handler);
            } else if (mql.addListener) {
                mql.addListener(handler);
            }
        });

        handler();

        return () => {
            mqls.forEach((mql) => {
                if (mql.removeEventListener) {
                    mql.removeEventListener('change', handler);
                } else if (mql.removeListener) {
                    mql.removeListener(handler);
                }
            });
        };
    }, [mediaQueries]);

    return value;
};

const useMeasure = () => {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (typeof window === 'undefined' || !ref.current) return undefined;

        const element = ref.current;
        const observer = new ResizeObserver(([entry]) => {
            if (!entry) return;
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return [ref, size];
};

const preloadImages = async (urls = []) => {
    const uniqueUrls = [...new Set(urls.filter(Boolean))];

    if (uniqueUrls.length === 0) return;

    await Promise.all(
        uniqueUrls.map(
            (src) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = img.onerror = () => resolve();
                })
        )
    );
};

const clampAspectRatio = (aspectRatio) => {
    if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) {
        return 1.5; // default ~3:2 ratio
    }

    return aspectRatio;
};

const defaultGetHref = (item) => item.href;

export default function ReactBitsMasonry({
    items = [],
    renderItem,
    gap = 24,
    animateFrom = 'bottom',
    ease = 'power3.out',
    duration = 0.6,
    stagger = 0.05,
    scaleOnHover = false,
    hoverScale = 0.97,
    blurToFocus = true,
    className,
    style,
    getHref = defaultGetHref,
}) {
    const columns = useMedia(queries, queryValues, 1);

    const [containerRef, { width }] = useMeasure();
    const [imagesReady, setImagesReady] = useState(false);

    const normalizedItems = useMemo(
        () =>
            items.map((item, index) => {
                const id = item.id ?? item._id ?? index;
                const aspectRatio = clampAspectRatio(
                    item.aspectRatio ??
                        (item.width && item.height
                            ? item.width / item.height
                            : undefined)
                );

                return {
                    ...item,
                    id,
                    aspectRatio,
                    href: getHref(item),
                };
            }),
        [items, getHref]
    );

    useEffect(() => {
        let cancelled = false;

        if (normalizedItems.length === 0) {
            setImagesReady(true);
            return () => {
                cancelled = true;
            };
        }

        setImagesReady(false);

        preloadImages(normalizedItems.map((item) => item.src)).then(() => {
            if (!cancelled) {
                setImagesReady(true);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [normalizedItems]);

    const layout = useMemo(() => {
        if (!width || normalizedItems.length === 0) {
            return {
                positioned: [],
                containerHeight: 0,
            };
        }

        const columnCount = Math.max(1, columns);
        const gapValue = Math.max(0, gap);
        const totalGapWidth = gapValue * (columnCount - 1);
        const columnWidth = (width - totalGapWidth) / columnCount;

        const columnHeights = new Array(columnCount).fill(0);

        const positioned = normalizedItems.map((item) => {
            const height = columnWidth / item.aspectRatio;
            const shortestColumnIndex = columnHeights.indexOf(
                Math.min(...columnHeights)
            );
            const x = (columnWidth + gapValue) * shortestColumnIndex;
            const y = columnHeights[shortestColumnIndex];

            columnHeights[shortestColumnIndex] += height + gapValue;

            return {
                ...item,
                x,
                y,
                width: columnWidth,
                height,
            };
        });

        const containerHeight =
            Math.max(...columnHeights) - (normalizedItems.length > 0 ? gapValue : 0);

        return {
            positioned,
            containerHeight: Number.isFinite(containerHeight)
                ? containerHeight
                : 0,
        };
    }, [width, columns, gap, normalizedItems]);

    const hasMounted = useRef(false);

    const getInitialPosition = (item) => {
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (!containerRect) return { x: item.x, y: item.y };

        let direction = animateFrom;

        if (animateFrom === 'random') {
            const directions = ['top', 'bottom', 'left', 'right'];
            direction = directions[Math.floor(Math.random() * directions.length)];
        }

        switch (direction) {
            case 'top':
                return { x: item.x, y: -200 };
            case 'bottom':
                return { x: item.x, y: window.innerHeight + 200 };
            case 'left':
                return { x: -200, y: item.y };
            case 'right':
                return { x: window.innerWidth + 200, y: item.y };
            case 'center':
                return {
                    x: containerRect.width / 2 - item.width / 2,
                    y: containerRect.height / 2 - item.height / 2,
                };
            default:
                return { x: item.x, y: item.y + 100 };
        }
    };

    useLayoutEffect(() => {
        if (!imagesReady || layout.positioned.length === 0) return undefined;

        const ctx = gsap.context(() => {
            layout.positioned.forEach((item, index) => {
                const selector = `[data-rb-masonry-key="${item.id}"]`;
                const finalState = {
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                };

                if (hasMounted.current) {
                    gsap.to(selector, {
                        ...finalState,
                        duration,
                        ease,
                        overwrite: 'auto',
                    });
                } else {
                    const initialPosition = getInitialPosition(item);
                    const fromState = {
                        opacity: 0,
                        x: initialPosition.x,
                        y: initialPosition.y,
                        width: item.width,
                        height: item.height,
                    };

                    if (blurToFocus) {
                        fromState.filter = 'blur(12px)';
                    }

                    gsap.fromTo(
                        selector,
                        fromState,
                        {
                            opacity: 1,
                            ...finalState,
                            ...(blurToFocus && { filter: 'blur(0px)' }),
                            duration: 0.8,
                            ease: 'power3.out',
                            delay: index * stagger,
                        }
                    );
                }
            });
        }, containerRef);

        hasMounted.current = true;

        return () => ctx.revert();
    }, [layout.positioned, imagesReady, duration, ease, stagger, blurToFocus, animateFrom]);

    useEffect(() => {
        hasMounted.current = false;
    }, [items]);

    const handleMouseEnter = (event, item) => {
        if (!scaleOnHover) return;
        const selector = `[data-rb-masonry-key="${item.id}"]`;
        gsap.to(selector, {
            scale: hoverScale,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = (event, item) => {
        if (!scaleOnHover) return;
        const selector = `[data-rb-masonry-key="${item.id}"]`;
        gsap.to(selector, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    return (
        <div
            ref={containerRef}
            className={clsx('relative w-full', className)}
            style={{
                height:
                    layout.containerHeight > 0
                        ? `${layout.containerHeight}px`
                        : undefined,
                ...style,
            }}
        >
            {layout.positioned.map((item, index) => (
                <div
                    key={item.id}
                    data-rb-masonry-key={item.id}
                    className="absolute left-0 top-0"
                    style={{
                        width: item.width,
                        height: item.height,
                    }}
                    onMouseEnter={(event) => handleMouseEnter(event, item)}
                    onMouseLeave={(event) => handleMouseLeave(event, item)}
                >
                    {renderItem?.(item, index)}
                </div>
            ))}
        </div>
    );
}
