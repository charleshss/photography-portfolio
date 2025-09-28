// app/portfolio/landscapes/photo/[slug]/page.js
import { notFound } from 'next/navigation';
import { getPhotoBySlug } from '@/lib/sanity';
import PhotoDetailPage from '@/components/PhotoDetailPage';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const photo = await getPhotoBySlug(slug);

    if (!photo || photo.category !== 'landscape') {
        return {
            title: 'Landscape Photo Not Found',
        };
    }

    return {
        title: `${photo.title} - Landscape Photography - Sam's Photography`,
        description:
            photo.description ||
            `${photo.title} - Landscape photography by Sam`,
        openGraph: {
            title: photo.title,
            description: photo.description,
            images: [photo.image],
        },
    };
}

export default async function LandscapePhotoPage({ params }) {
    const { slug } = await params;
    const photo = await getPhotoBySlug(slug);

    // Ensure photo exists and belongs to landscape category
    if (!photo || photo.category !== 'landscape') {
        notFound();
    }

    return (
        <PhotoDetailPage
            photo={photo}
            backUrl="/portfolio/landscapes"
            backLabel="Back to Landscape Collection"
            context="landscape"
        />
    );
}
