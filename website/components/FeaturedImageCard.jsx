'use client';

import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';

export default function FeaturedImageCard({ image }) {
  // Additional defensive check at render time
  if (!image || !image.image || !image._id) {
    return null;
  }

  let imageUrl;
  try {
    imageUrl = urlFor(image.image).width(800).height(600).quality(85).url();
  } catch (error) {
    console.error('Error generating image URL for:', image._id, error);
    return null;
  }

  return (
    <Link
      key={image._id}
      href={`/portfolio/${image.category || 'general'}`}
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-gray-200"
    >
      <Image
        src={imageUrl}
        alt={image.image?.alt || image.title || 'Featured image'}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          console.error('Image failed to load:', imageUrl);
          e.target.style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="inline-block rounded-md bg-black/60 px-3 py-2 text-left text-white backdrop-blur-sm">
          <h3 className="text-sm font-semibold leading-tight">
            {image.title || 'Untitled'}
          </h3>
          {image.location && (
            <p className="mt-0.5 text-xs text-gray-300">{image.location}</p>
          )}
        </div>
      </div>
    </Link>
  );
}