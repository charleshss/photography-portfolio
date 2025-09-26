'use client';

import { useEffect, useRef, useState } from 'react';

export default function LocationMap({ coordinates, locationName }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        if (!coordinates || !coordinates.lat || !coordinates.lng || !isMounted) return;

        let mounted = true;

        const initializeMap = async () => {
            if (!mapRef.current || !window.google || !mounted || !isMounted) return;

            try {
                const mapCenter = {
                    lat: parseFloat(coordinates.lat),
                    lng: parseFloat(coordinates.lng)
                };

                if (!mounted || !isMounted) return;

                // Use traditional Google Maps constructor (widely compatible)
                const map = new window.google.maps.Map(mapRef.current, {
                    center: mapCenter,
                    zoom: 12,
                    mapTypeId: 'terrain',
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: true,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: true
                });

                mapInstanceRef.current = map;

                if (!mounted || !isMounted) return;

                let marker;

                // Try to use AdvancedMarkerElement if available (newer API)
                if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                    try {
                        // Create marker element
                        const markerElement = document.createElement('div');
                        markerElement.innerHTML = '📍';
                        markerElement.style.fontSize = '24px';
                        markerElement.style.cursor = 'pointer';

                        marker = new window.google.maps.marker.AdvancedMarkerElement({
                            map: map,
                            position: mapCenter,
                            content: markerElement,
                            title: locationName || 'Photo Location'
                        });

                    } catch (advancedMarkerError) {
                        console.log('AdvancedMarkerElement not available, falling back to regular Marker');
                        // Fallback to regular marker
                        marker = new window.google.maps.Marker({
                            position: mapCenter,
                            map: map,
                            title: locationName || 'Photo Location',
                            icon: {
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <text x="16" y="24" font-family="Arial" font-size="24" text-anchor="middle" fill="#e53e3e">📍</text>
                                    </svg>
                                `),
                                scaledSize: new window.google.maps.Size(32, 32),
                                anchor: new window.google.maps.Point(16, 32)
                            }
                        });
                    }
                } else {
                    // Fallback to regular marker (older API)
                    marker = new window.google.maps.Marker({
                        position: mapCenter,
                        map: map,
                        title: locationName || 'Photo Location',
                        icon: {
                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                    <text x="16" y="24" font-family="Arial" font-size="24" text-anchor="middle" fill="#e53e3e">📍</text>
                                </svg>
                            `),
                            scaledSize: new window.google.maps.Size(32, 32),
                            anchor: new window.google.maps.Point(16, 32)
                        }
                    });
                }

                markerRef.current = marker;

                // Add click handler for info display
                if (locationName && mounted && isMounted) {
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `
                            <div style="padding: 8px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                                <div style="font-weight: 600; margin-bottom: 4px;">${locationName}</div>
                                <div style="font-size: 12px; color: #666;">
                                    ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}
                                </div>
                            </div>
                        `
                    });

                    marker.addListener('click', () => {
                        if (mounted && isMounted) {
                            infoWindow.open(map, marker);
                        }
                    });
                }

                if (mounted && isMounted) {
                    setMapLoaded(true);
                }
            } catch (error) {
                console.error('Error initializing map:', error);
                if (mounted && isMounted) {
                    setMapError(true);
                }
            }
        };

        const loadGoogleMapsAPI = async () => {
            if (!mounted || !isMounted) return;

            // Check if already loaded
            if (window.google && window.google.maps) {
                initializeMap();
                return;
            }

            // Check if already loading
            if (window.googleMapsLoading) {
                const checkInterval = setInterval(() => {
                    if (!mounted || !isMounted) {
                        clearInterval(checkInterval);
                        return;
                    }
                    if (window.google && window.google.maps) {
                        clearInterval(checkInterval);
                        initializeMap();
                    }
                }, 100);
                return;
            }

            // Check API key
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                console.warn('Google Maps API key not found');
                if (mounted && isMounted) {
                    setMapError(true);
                }
                return;
            }

            try {
                window.googleMapsLoading = true;

                // Load with new async loading method
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=marker&v=weekly`;
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    window.googleMapsLoading = false;
                    if (mounted && isMounted) {
                        initializeMap();
                    }
                };

                script.onerror = () => {
                    console.error('Failed to load Google Maps API');
                    window.googleMapsLoading = false;
                    if (mounted && isMounted) {
                        setMapError(true);
                    }
                };

                // Check if script already exists
                const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
                if (!existingScript && mounted && isMounted) {
                    document.head.appendChild(script);
                } else if (existingScript) {
                    // Script exists but may not be loaded yet
                    const checkInterval = setInterval(() => {
                        if (!mounted || !isMounted) {
                            clearInterval(checkInterval);
                            return;
                        }
                        if (window.google && window.google.maps) {
                            clearInterval(checkInterval);
                            window.googleMapsLoading = false;
                            initializeMap();
                        }
                    }, 100);
                }
            } catch (error) {
                console.error('Error loading Google Maps:', error);
                window.googleMapsLoading = false;
                if (mounted && isMounted) {
                    setMapError(true);
                }
            }
        };

        loadGoogleMapsAPI();

        return () => {
            mounted = false;
            try {
                if (markerRef.current) {
                    markerRef.current.map = null;
                    markerRef.current = null;
                }
                if (mapInstanceRef.current) {
                    mapInstanceRef.current = null;
                }
            } catch (error) {
                // Ignore cleanup errors during Fast Refresh
                console.debug('Map cleanup during component unmount:', error.message);
            }
        };
    }, [coordinates, locationName, isMounted]);

    if (!coordinates || !coordinates.lat || !coordinates.lng) {
        return null;
    }

    if (mapError) {
        return (
            <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">Location Coordinates</div>
                <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">
                        📍 Map unavailable
                    </div>
                    <div className="text-xs text-gray-600 font-mono">
                        {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        Location coordinates only
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-3">
            <div className="text-xs text-gray-500 mb-2">Location on Map</div>
            <div
                ref={mapRef}
                className="w-full h-48 rounded-lg border border-gray-200 bg-gray-100"
                style={{ minHeight: '192px' }}
            >
                {!mapLoaded && (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-sm text-gray-500">Loading map...</div>
                    </div>
                )}
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
                {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </div>
        </div>
    );
}