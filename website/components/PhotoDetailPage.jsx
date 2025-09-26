'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Camera, Tag, Info, Eye, ChevronDown } from 'lucide-react';
import ZoomableImage from '@/components/ZoomableImage';
import { getCameraData, getLocationDisplay } from '@/lib/sanity';

export default function PhotoDetailPage({
    photo,
    backUrl = '/portfolio',
    backLabel = 'Back to Portfolio',
    context = 'portfolio'
}) {
    const [smartBackUrl, setSmartBackUrl] = useState(backUrl);
    const [smartBackLabel, setSmartBackLabel] = useState(backLabel);
    const [cameraDetailsExpanded, setCameraDetailsExpanded] = useState(false);

    useEffect(() => {
        // Simple context-based navigation - prioritize the passed props since they're route-specific
        if (context === 'wildlife') {
            setSmartBackUrl('/portfolio/wildlife');
            setSmartBackLabel('Back to Wildlife');
        } else if (context === 'landscape') {
            setSmartBackUrl('/portfolio/landscapes');
            setSmartBackLabel('Back to Landscapes');
        } else if (context === 'home') {
            setSmartBackUrl('/');
            setSmartBackLabel('Back to Home');
        } else if (context === 'portfolio') {
            setSmartBackUrl('/portfolio');
            setSmartBackLabel('Back to Portfolio');
        } else {
            // Use provided defaults as fallback
            setSmartBackUrl(backUrl);
            setSmartBackLabel(backLabel);
        }
    }, [context, backUrl, backLabel]);

    if (!photo) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <Camera size={64} className="mx-auto text-gray-400 mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Photo Not Found
                    </h1>
                    <p className="text-gray-600 mb-8">
                        The photo you're looking for doesn't exist or may have been moved.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/portfolio"
                            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                        >
                            Browse Portfolio
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const cameraData = getCameraData(photo.image, photo.cameraData);
    const locationName = getLocationDisplay(photo);

    return (
        <main className="min-h-screen bg-black">
            {/* Header Navigation */}
            <div className="bg-black border-b border-gray-800">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <Link
                        href={smartBackUrl}
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeft size={20} />
                        {smartBackLabel}
                    </Link>
                </div>
            </div>

            {/* Hero Text Section - Black background */}
            <div className="relative">
                <div className="mx-auto max-w-4xl px-6 pt-8 pb-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {photo.title}
                        </h1>
                        {photo.description && (
                            <div className="max-w-3xl mx-auto">
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    {photo.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section - Image and information */}
            <div className="bg-white">
                <div className="mx-auto max-w-4xl px-6 py-12">
                    {/* Large Image - At top of white section */}
                    <div className="mb-16">
                        <div className="mx-auto max-w-5xl">
                            <div className="aspect-[16/10] max-h-[70vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                                <ZoomableImage
                                    image={photo.image}
                                    alt={photo.title}
                                    title={photo.title}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Key Information Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {/* Species Information */}
                        {photo.species && photo.species.length > 0 && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                    <Eye size={20} className="text-blue-600" />
                                    Species
                                </h3>
                                <div className="space-y-3">
                                    {photo.species.map((species, index) => (
                                        <div key={`${species.name}-${index}`}>
                                            <span className="font-medium text-gray-900 block">
                                                {species.name}
                                            </span>
                                            {species.category && (
                                                <span className="text-sm text-blue-700 mt-1 block">
                                                    {species.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Location Information */}
                        {(locationName || photo.locationData) && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                    <MapPin size={20} className="text-green-600" />
                                    Location
                                </h3>
                                <div className="space-y-3">
                                    {locationName && (
                                        <div>
                                            <div className="text-sm text-green-600 font-medium mb-1">Location</div>
                                            <p className="text-gray-900 font-semibold">{locationName}</p>
                                        </div>
                                    )}
                                    {photo.locationData?.country && (
                                        <div>
                                            <div className="text-xs text-green-600 mb-1">Country</div>
                                            <p className="text-gray-900 font-medium">{photo.locationData.country}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {photo.tags && photo.tags.length > 0 && (
                            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                                    <Tag size={20} className="text-purple-600" />
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {photo.tags.slice(0, 4).map((tag, index) => (
                                        <span
                                            key={`${tag.name}-${index}`}
                                            className="px-3 py-1 bg-white text-purple-700 text-sm rounded-full border border-purple-300 font-medium"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                    {photo.tags.length > 4 && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full border border-purple-300">
                                            +{photo.tags.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Camera & Technical Details - Cleaner design */}
                    {cameraData && (
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <button
                                type="button"
                                onClick={() => setCameraDetailsExpanded(prev => !prev)}
                                className="flex w-full items-center justify-between text-left mb-6"
                            >
                                <span className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                                    <Camera size={24} className="text-gray-700" />
                                    Camera & Technical Details
                                </span>
                                <ChevronDown
                                    size={24}
                                    className={`text-gray-500 transition-transform ${cameraDetailsExpanded ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {cameraDetailsExpanded && (
                                <div className="space-y-8">
                                    {/* Camera Equipment */}
                                    {(cameraData.camera || cameraData.lens) && (
                                        <div className="bg-white rounded-xl p-6 shadow-sm">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Camera size={20} className="text-gray-600" />
                                                Equipment
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {cameraData.camera && (
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <div className="text-sm text-gray-500 mb-1">Camera Body</div>
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {cameraData.camera}
                                                        </div>
                                                    </div>
                                                )}
                                                {cameraData.lens && (
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <div className="text-sm text-gray-500 mb-1">Lens</div>
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {cameraData.lens}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Exposure Settings */}
                                    {(cameraData.settings?.aperture || cameraData.settings?.shutterSpeed || cameraData.settings?.iso || cameraData.settings?.focalLength) && (
                                        <div className="bg-white rounded-xl p-6 shadow-sm">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                                Exposure Settings
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {cameraData.settings?.aperture && (
                                                    <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                                        <div className="text-sm text-blue-600 mb-1 font-medium">Aperture</div>
                                                        <div className="text-2xl font-bold text-gray-900">{cameraData.settings.aperture}</div>
                                                    </div>
                                                )}
                                                {cameraData.settings?.shutterSpeed && (
                                                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                                        <div className="text-sm text-green-600 mb-1 font-medium">Shutter</div>
                                                        <div className="text-2xl font-bold text-gray-900">{cameraData.settings.shutterSpeed}</div>
                                                    </div>
                                                )}
                                                {cameraData.settings?.iso && (
                                                    <div className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                                                        <div className="text-sm text-orange-600 mb-1 font-medium">ISO</div>
                                                        <div className="text-2xl font-bold text-gray-900">{cameraData.settings.iso}</div>
                                                    </div>
                                                )}
                                                {cameraData.settings?.focalLength && (
                                                    <div className="text-center bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                                                        <div className="text-sm text-purple-600 mb-1 font-medium">Focal Length</div>
                                                        <div className="text-2xl font-bold text-gray-900">{cameraData.settings.focalLength}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Capture Date */}
                                    {cameraData.captureDate && (
                                        <div className="bg-white rounded-xl p-6 shadow-sm">
                                            <div className="flex items-start gap-4">
                                                <Calendar size={24} className="text-blue-600 mt-1" />
                                                <div>
                                                    <div className="text-lg font-semibold text-gray-900 mb-2">Captured</div>
                                                    <div className="text-gray-600">
                                                        {new Date(cameraData.captureDate).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-gray-500 mt-1">
                                                        {new Date(cameraData.captureDate).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Back */}
                    <div className="text-center pt-8 border-t border-gray-200">
                        <Link
                            href={smartBackUrl}
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <ArrowLeft size={20} />
                            {smartBackLabel}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
