import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-espresso-950">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-espresso-950 via-espresso-900 to-espresso-800" />
      {/* Decorative circles */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-terracotta-600/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sage-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-terracotta-400">
          UK Third-Wave Coffee
        </p>
        <h1 className="mb-6 text-5xl font-bold leading-tight text-cream-50 sm:text-6xl lg:text-7xl">
          Discover your next
          <br />
          <span className="text-terracotta-400">favourite brew</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-cream-300">
          A curated log of the UK&apos;s finest specialty coffee shops. From
          London&apos;s roasteries to Edinburgh&apos;s hidden gems — find, track
          and savour the best third-wave coffee the country has to offer.
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta-600 px-8 py-4 text-base font-semibold text-cream-50 transition-all hover:bg-terracotta-700 hover:shadow-lg hover:shadow-terracotta-600/25"
        >
          Find your next brew
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
