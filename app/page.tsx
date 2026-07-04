import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Bio Writer for Artists
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Get a polished, industry-standard artist bio in seconds.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <Link
            href="/upgrade"
            className="group flex flex-col items-start gap-3 rounded-2xl border border-black/10 bg-white p-8 text-left shadow-sm transition-colors hover:border-black/20 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20"
          >
            <span className="text-3xl">✍️</span>
            <span className="text-xl font-semibold text-black dark:text-zinc-50">
              Upgrade My Bio
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Paste your current bio and we&apos;ll rewrite it into a
              professional, industry-standard version.
            </span>
            <span className="mt-auto pt-4 text-sm font-medium text-black underline-offset-4 group-hover:underline dark:text-zinc-50">
              Start upgrading →
            </span>
          </Link>

          <Link
            href="/create"
            className="group flex flex-col items-start gap-3 rounded-2xl border border-black/10 bg-white p-8 text-left shadow-sm transition-colors hover:border-black/20 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20"
          >
            <span className="text-3xl">🎤</span>
            <span className="text-xl font-semibold text-black dark:text-zinc-50">
              Create a New Bio
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Answer a few quick questions about yourself and we&apos;ll
              write a brand new bio from scratch.
            </span>
            <span className="mt-auto pt-4 text-sm font-medium text-black underline-offset-4 group-hover:underline dark:text-zinc-50">
              Start from scratch →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
