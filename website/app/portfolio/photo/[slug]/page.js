// app/portfolio/photo/[slug]/page.js
import { notFound } from 'next/navigation';
import { getPhotoBySlug } from '@/lib/sanity';
import PhotoDetailPage from '@/components/PhotoDetailPage';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const photo = await getPhotoBySlug(slug);

    if (!photo) {
        return {
            title: 'Photo Not Found',
        };
    }

    return {
        title: `${photo.title} - Portfolio - Sam's Photography`,
        description:
            photo.description ||
            `${photo.title} - Portfolio photography by Sam`,
        openGraph: {
            title: photo.title,
            description: photo.description,
            images: [photo.image],
        },
    };
}

export default async function PortfolioPhotoPage({ params }) {
    const { slug } = await params;
    const photo = await getPhotoBySlug(slug);

    if (!photo) {
        notFound();
    }

    return (
        <PhotoDetailPage
            photo={photo}
            backUrl="/portfolio"
            backLabel="Back to Portfolio"
            context="portfolio"
        />
    );
}
