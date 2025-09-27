// app/portfolio/wildlife/photo/[slug]/page.js
import { notFound } from 'next/navigation';
import { getPhotoBySlug } from '@/lib/sanity';
import PhotoDetailPage from '@/components/PhotoDetailPage';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const photo = await getPhotoBySlug(slug);

    if (!photo || photo.category !== 'wildlife') {
        return {
            title: 'Wildlife Photo Not Found'
        };
    }

    return {
        title: `${photo.title} - Wildlife Photography - Sam's Photography`,
        description: photo.description || `${photo.title} - Wildlife photography by Sam`,
        openGraph: {
            title: photo.title,
            description: photo.description,
            images: [photo.image],
        },
    };
}

export default async function WildlifePhotoPage({ params }) {
    const { slug } = await params;
    const photo = await getPhotoBySlug(slug);

    // Ensure photo exists and belongs to wildlife category
    if (!photo || photo.category !== 'wildlife') {
        notFound();
    }

    return (
        <PhotoDetailPage
            photo={photo}
            backUrl="/portfolio/wildlife"
            backLabel="Back to Wildlife Collection"
            context="wildlife"
        />
    );
}