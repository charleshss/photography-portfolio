// website/app/page.js
import HeroCarousel from '@/components/HeroCarousel';
import ImageCard from '@/components/ImageCard';
import Link from 'next/link';
import { getFeaturedImages } from '@/lib/sanity';

export default async function Home() {
  // Fetch featured images from Sanity
  let featuredImages = [];
  try {
    featuredImages = await getFeaturedImages();
    // Featured images fetched successfully
  } catch (error) {
    console.error('Error fetching featured images:', error);
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section with Carousel - Full viewport height */}
      <section className="relative h-screen">
        <HeroCarousel />
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 block text-sm uppercase tracking-[0.3em] text-gray-400">
            Wild Landscapes • Intimate Wildlife
          </span>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            SamuelSS. Photography
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
            Professional photographer based in Essex, England. Specialising in dramatic
            landscapes and compelling wildlife portraits.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              View Portfolio
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border-2 border-gray-900 px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
            >
              Work Together
            </Link>
          </div>
        </div>
      </section>

      {/* My Best Work Section - Now uses Sanity data */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">My Best Work</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              A carefully curated selection of my favourite captures from years of
              exploring the natural world
            </p>
          </div>

          {/* Featured Images Grid - Updated to use Sanity */}
          {featuredImages.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featuredImages.map((image) => (
                <ImageCard
                  key={image._id}
                  image={{
                    ...image,
                    href: image.slug?.current ? `/photo/${image.slug.current}` : `/portfolio/${image.category}`
                  }}
                  aspectRatio="aspect-[4/3]"
                  showLocation={true}
                />
              ))}
            </div>
          ) : (
            // Fallback when no featured images exist
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No featured images yet</div>
              <p className="text-sm text-gray-400">
                Upload some photos in Sanity Studio and mark them as &#34;Featured&#34; to see them here
              </p>
            </div>
          )}

          {/* View All Button */}
          <div className="mt-10 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Let&#39;s plan your next visual story
          </h2>
          <p className="text-base text-gray-600 sm:text-lg">
            Whether you want to explore nature and search for wildlife together.
            I&#39;d love to collaborate.
          </p>
          <a
            href="/contact"
            className="mx-auto inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Start a conversation
          </a>
        </div>
      </section>
    </main>
  );
}