'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function ImageModal({
    isOpen,
    onClose,
    imageUrl,
    altText,
    title,
}) {
    if (!imageUrl) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0 [&>button[data-slot='dialog-close']]:hidden">
                {/* Hidden title for accessibility */}
                <DialogTitle className="sr-only">
                    {title ? `Full size image: ${title}` : 'Full size image'}
                </DialogTitle>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Image container */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src={imageUrl}
                        alt={altText}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="max-w-full max-h-[95vh] w-auto h-auto object-contain"
                        priority
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
