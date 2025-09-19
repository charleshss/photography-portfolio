// components/ImageCard.jsx
import Image from 'next/image';

export default function ImageCard({
    image,
    showLocation = false,
    showSpecies = false,
    aspectRatio = "aspect-[4/3]",
    onClick
}) {
    return (
        <div
            className={`group relative ${aspectRatio} cursor-pointer overflow-hidden rounded-lg bg-gray-200`}
            onClick={onClick}
        >
            <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />

            {/* Overlay content */}
            <div className="absolute bottom-4 left-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="mb-1 font-semibold">{image.title}</h3>

                {/* Show species for wildlife images */}
                {showSpecies && image.species && (
                    <p className="text-sm text-gray-200">{image.species}</p>
                )}

                {/* Show location for both types */}
                {showLocation && image.location && (
                    <p className={`text-xs text-gray-300 ${showSpecies ? 'mt-1' : 'text-sm'}`}>
                        {image.location}
                    </p>
                )}
            </div>
        </div>
    );
}