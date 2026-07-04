"use client";

import { useState } from "react";
import Link from "next/link";
import BioResult from "@/components/BioResult";
import { PURPOSE_LABELS, type Purpose, type UpgradeInput } from "@/lib/bio-prompt";

export default function UpgradePage() {
  const [currentBio, setCurrentBio] = useState("");
  const [genre, setGenre] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("press");
  const [notes, setNotes] = useState("");

  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const input: UpgradeInput = { mode: "upgrade", currentBio, genre, purpose, notes };
      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setBio(data.bio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generate();
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Upgrade My Bio
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Paste your current bio below and tell us where it&apos;ll be used.
        </p>

        {!bio && (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Current bio
              </span>
              <textarea
                required
                value={currentBio}
                onChange={(e) => setCurrentBio(e.target.value)}
                rows={8}
                placeholder="Paste your existing bio here..."
                className="rounded-xl border border-black/10 bg-white p-4 text-sm dark:border-white/10 dark:bg-zinc-900"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Genre (optional)
              </span>
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Alt-pop, Hip-hop, Country"
                className="rounded-xl border border-black/10 bg-white p-3 text-sm dark:border-white/10 dark:bg-zinc-900"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Where will this bio be used?
              </span>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as Purpose)}
                className="rounded-xl border border-black/10 bg-white p-3 text-sm dark:border-white/10 dark:bg-zinc-900"
              >
                {Object.entries(PURPOSE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Anything specific to keep or emphasize? (optional)
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="rounded-xl border border-black/10 bg-white p-3 text-sm dark:border-white/10 dark:bg-zinc-900"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
            >
              {loading ? "Rewriting..." : "Upgrade My Bio"}
            </button>
          </form>
        )}

        {bio && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <BioResult bio={bio} onRegenerate={generate} regenerating={loading} />
            <button
              onClick={() => setBio(null)}
              className="text-sm text-zinc-500 hover:underline"
            >
              ← Edit inputs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
