export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="relative isolate overflow-hidden border-b">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-24 text-center sm:gap-8 sm:py-32">
          <span className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Wild Landscapes • Intimate Wildlife
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Capturing the untamed beauty of the natural world
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            I am a photographer based in the Essex, England. I specialise in dramatic
            landscapes and compelling wildlife portraits. Explore the portfolio to see
            the stories nature reveals when we slow down and pay attention.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              View Portfolio
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-gray-900"
            >
              Work Together
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          <article className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Landscapes</h2>
            <p className="text-sm text-gray-600">
              From rugged coastlines to snow-capped summits, each frame is crafted to
              showcase the atmosphere, light, and mood of the moment.
            </p>
          </article>
          <article className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Wildlife</h2>
            <p className="text-sm text-gray-600">
              Patience and respect guide every encounter, capturing authentic expressions
              and behavior in the animals I photograph.
            </p>
          </article>
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
