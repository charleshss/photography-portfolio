'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    MapPin,
    Camera,
    Aperture,
    Gauge,
    Info,
    Clock,
    ChevronDown,
    Globe2,
} from 'lucide-react';
import ZoomableImage from '@/components/ZoomableImage';
import MobileImageViewer from '@/components/MobileImageViewer';
import { useDevice } from '@/contexts/DeviceContext';
import { getCameraData, getLocationDisplay } from '@/lib/sanity';

function MetaChip({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="glass-panel flex items-center gap-3 px-4 py-3 text-left">
            <Icon className="h-4 w-4 text-primary" />
            <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                {label}
                <div className="mt-1 text-sm font-semibold tracking-[0.08em] text-foreground">
                    {value}
                </div>
            </div>
        </div>
    );
}

export default function PhotoDetailPage({
    photo,
    backUrl = '/portfolio',
    backLabel = 'Back to Portfolio',
    context = 'portfolio',
}) {
    const { isMobile } = useDevice();
    const [smartBackUrl, setSmartBackUrl] = useState(backUrl);
    const [smartBackLabel, setSmartBackLabel] = useState(backLabel);
    const [cameraDetailsExpanded, setCameraDetailsExpanded] = useState(false);

    useEffect(() => {
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
            setSmartBackUrl(backUrl);
            setSmartBackLabel(backLabel);
        }
    }, [context, backUrl, backLabel]);

    if (!photo) {
        return (
            <main className="flex min-h-screen items-center justify-center px-6">
                <div className="glass-panel max-w-md space-y-4 px-10 py-12 text-center">
                    <Camera size={40} className="mx-auto text-muted-foreground" />
                    <h1 className="section-subtitle text-foreground">Photo Not Found</h1>
                    <p className="text-sm text-muted-foreground">
                        The photo you were looking for is unavailable. Try browsing the portfolio or return home.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link href="/portfolio" className="cta-button-outline">
                            Browse Portfolio
                        </Link>
                        <Link href="/" className="cta-button-tonal">
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
        <main className="min-h-screen">
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link
                        href={smartBackUrl}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                        <ArrowLeft size={18} />
                        {smartBackLabel}
                    </Link>
                </div>
            </header>

            <section className="section-padding pt-12">
                <div className="mx-auto max-w-6xl space-y-12">
                    <div className="space-y-4">
                        <h1 className="section-title text-foreground">{photo.title}</h1>
                        {photo.description && (
                            <p className="body-large max-w-3xl text-muted-foreground">
                                {photo.description}
                            </p>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-white/5 bg-surface/40 p-3 backdrop-blur-2xl shadow-[var(--shadow-soft)] lg:p-4">
                        <div className={`relative w-full overflow-hidden rounded-3xl bg-background-alt ${isMobile ? '' : 'aspect-[16/10]'}`}>
                            {isMobile ? (
                                <MobileImageViewer
                                    image={photo.image}
                                    alt={photo.title}
                                    title={photo.title}
                                />
                            ) : (
                                <ZoomableImage
                                    image={photo.image}
                                    alt={photo.title}
                                    title={photo.title}
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
                        <div className="space-y-8">
                            {photo.species && photo.species.length > 0 && (
                                <div className="glass-panel px-8 py-10">
                                    <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                                        Species
                                    </h2>
                                    <div className="mt-5 space-y-4 text-left">
                                        {photo.species.map((species, index) => (
                                            <div key={`${species.name}-${index}`} className="rounded-2xl bg-primary/5 px-5 py-4">
                                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground">
                                                    {species.name}
                                                </p>
                                                {species.category && (
                                                    <p className="mt-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                                                        {species.category.replace(/-/g, ' ')}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(locationName || photo.locationData) && (
                                <div className="glass-panel px-8 py-10">
                                    <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                                        Location
                                    </h2>
                                    <div className="mt-5 space-y-4">
                                        {locationName && (
                                            <MetaChip
                                                icon={MapPin}
                                                label="Location"
                                                value={locationName}
                                            />
                                        )}
                                        {photo.locationData?.country && (
                                            <MetaChip
                                                icon={Globe2}
                                                label="Country"
                                                value={photo.locationData.country}
                                            />
                                        )}
                                        {photo.locationData?.locality && (
                                            <MetaChip
                                                icon={Info}
                                                label="Locality"
                                                value={photo.locationData.locality}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                            {photo.tags && photo.tags.length > 0 && (
                                <div className="glass-panel px-8 py-10">
                                    <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                                        Tags
                                    </h2>
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        {photo.tags.slice(0, 6).map((tag, index) => (
                                            <span
                                                key={`${tag.name}-${index}`}
                                                className="tag-capsule bg-primary/10 text-foreground/80"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                        {photo.tags.length > 6 && (
                                            <span className="tag-capsule bg-secondary/10 text-foreground/80">
                                                +{photo.tags.length - 6}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <aside className="space-y-6">
                            {cameraData && (
                                <div className="glass-panel px-6 py-6">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCameraDetailsExpanded((prev) => !prev)
                                        }
                                        className="flex w-full items-center justify-between text-left"
                                    >
                                        <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                                            <Camera size={18} className="text-primary" />
                                            Camera Details
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            className={`text-muted-foreground transition-transform ${cameraDetailsExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {cameraDetailsExpanded && (
                                        <div className="mt-6 space-y-6">
                                            {(cameraData.camera || cameraData.lens) && (
                                                <div className="glass-panel px-5 py-4">
                                                    <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                                        Equipment
                                                    </h3>
                                                    <div className="mt-4 space-y-3 text-sm">
                                                        {cameraData.camera && (
                                                            <div className="flex items-center gap-3">
                                                                <Camera size={16} className="text-secondary" />
                                                                <span className="font-medium text-foreground">
                                                                    {cameraData.camera}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {cameraData.lens && (
                                                            <div className="flex items-center gap-3">
                                                                <Aperture size={16} className="text-accent" />
                                                                <span className="font-medium text-foreground">
                                                                    {cameraData.lens}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {cameraData.settings && (
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    <MetaChip
                                                        icon={Aperture}
                                                        label="Aperture"
                                                        value={cameraData.settings.aperture}
                                                    />
                                                    <MetaChip
                                                        icon={Clock}
                                                        label="Shutter"
                                                        value={cameraData.settings.shutterSpeed}
                                                    />
                                                    <MetaChip
                                                        icon={Gauge}
                                                        label="ISO"
                                                        value={cameraData.settings.iso}
                                                    />
                                                    <MetaChip
                                                        icon={Info}
                                                        label="Focal Length"
                                                        value={cameraData.settings.focalLength}
                                                    />
                                                </div>
                                            )}

                                            {cameraData.captureDate && (
                                                <div className="glass-panel px-5 py-4">
                                                    <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                                                        Captured
                                                    </h3>
                                                    <p className="mt-3 text-sm text-foreground">
                                                        {new Date(cameraData.captureDate).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                                                        {new Date(cameraData.captureDate).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}
