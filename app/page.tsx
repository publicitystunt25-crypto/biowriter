import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,70,239,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.28),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(34,211,238,0.18),transparent_50%)]" />

      <div className="relative w-full max-w-3xl text-center">
        <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-cyan-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Bio Writer for Artists
        </h1>
        <p className="mt-4 text-lg text-purple-200/80">
          Get a polished, industry-standard artist bio in seconds.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <Link
            href="/upgrade"
            className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-amber-400/20 bg-white/5 p-8 text-left backdrop-blur-sm transition-all hover:border-amber-400/50 hover:bg-white/10"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-500/20 blur-2xl transition-opacity group-hover:opacity-90" />
            <span className="text-3xl">✍️</span>
            <span className="text-xl font-semibold text-white">
              Upgrade My Bio
            </span>
            <span className="text-sm text-purple-200/70">
              Paste your current bio and we&apos;ll rewrite it into a
              professional, industry-standard version.
            </span>
            <span className="mt-auto pt-4 text-sm font-medium text-amber-300 group-hover:underline">
              Start upgrading →
            </span>
          </Link>

          <Link
            href="/create"
            className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-fuchsia-400/20 bg-white/5 p-8 text-left backdrop-blur-sm transition-all hover:border-fuchsia-400/50 hover:bg-white/10"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-fuchsia-500/20 blur-2xl transition-opacity group-hover:opacity-90" />
            <span className="text-3xl">🎤</span>
            <span className="text-xl font-semibold text-white">
              Create a New Bio
            </span>
            <span className="text-sm text-purple-200/70">
              Answer a few quick questions about yourself and we&apos;ll
              write a brand new bio from scratch.
            </span>
            <span className="mt-auto pt-4 text-sm font-medium text-fuchsia-300 group-hover:underline">
              Start from scratch →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
