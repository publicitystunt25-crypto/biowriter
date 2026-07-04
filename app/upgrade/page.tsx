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

  const inputClass =
    "rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-purple-200/30 backdrop-blur-sm outline-none transition-colors focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50";
  const labelClass = "text-sm font-medium text-purple-100/90";

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(251,191,36,0.15),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(217,70,239,0.15),transparent_45%)]" />
      <div className="relative w-full max-w-2xl">
        <Link href="/" className="text-sm text-purple-300/70 hover:text-amber-300 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-4 bg-gradient-to-r from-amber-300 to-fuchsia-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Upgrade My Bio
        </h1>
        <p className="mt-2 text-purple-200/70">
          Paste your current bio below and tell us where it&apos;ll be used.
        </p>

        {!bio && (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Current bio</span>
              <textarea
                required
                value={currentBio}
                onChange={(e) => setCurrentBio(e.target.value)}
                rows={8}
                placeholder="Paste your existing bio here..."
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Genre (optional)</span>
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Alt-pop, Hip-hop, Country"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Where will this bio be used?</span>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as Purpose)}
                className={inputClass}
              >
                {Object.entries(PURPOSE_LABELS).map(([value, label]) => (
                  <option key={value} value={value} className="bg-[#170f26] text-white">
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>
                Anything specific to keep or emphasize? (optional)
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/20 transition-opacity hover:opacity-90 disabled:opacity-50"
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
              className="text-sm text-purple-300/70 hover:text-amber-300 hover:underline"
            >
              ← Edit inputs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
