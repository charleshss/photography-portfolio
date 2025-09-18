// app/page.js
import HeroCarousel from '@/components/HeroCarousel';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
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
            SamuelSS.Photography
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

      {/* My Best Work Section */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">My Best Work</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              A carefully curated selection of my favourite captures from years of
              exploring the natural world
            </p>
          </div>

          {/* Placeholder Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-gray-200"
              >
                <Image
                  src={`https://images.unsplash.com/photo-${i === 1
                    ? '1743431168296-5269fffaa214'
                    : i === 2
                      ? '1564349683136-77e08dba1ef7'
                      : '1441974231531-c6227db76b6e'
                    }?w=800&h=600&fit=crop`}
                  alt={`Best work ${i}`}
                  fill
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Let’s plan your next visual story
          </h2>
          <p className="text-base text-gray-600 sm:text-lg">
            Whether you want to explore nature and search for wildlife together.
            I’d love to collaborate.
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
