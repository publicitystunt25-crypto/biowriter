"use client";

import { useState } from "react";
import Link from "next/link";
import type { Purpose } from "@/lib/bio-prompt";

export interface BioMeta {
  mode: "upgrade" | "create";
  purpose: Purpose;
  genre?: string;
  artistName?: string;
}

export default function BioResult({
  bio,
  onRegenerate,
  regenerating,
  plan,
  meta,
}: {
  bio: string;
  onRegenerate: () => void;
  regenerating: boolean;
  plan: "free" | "pro";
  meta: BioMeta;
}) {
  const [copied, setCopied] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = async () => {
    if (plan !== "pro") {
      setShowUpsell(true);
      return;
    }

    setSaveState("saving");
    try {
      const title =
        meta.mode === "create"
          ? meta.artistName
          : `Bio — ${new Date().toLocaleDateString()}`;

      const res = await fetch("/api/bios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: bio,
          mode: meta.mode,
          purpose: meta.purpose,
          genre: meta.genre,
          title,
        }),
      });
      if (!res.ok) throw new Error();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  };

  const wordCount = bio.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-fuchsia-500/10 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-sm font-semibold uppercase tracking-wide text-transparent">
          Your Bio
        </h2>
        <span className="text-xs text-purple-200/50">{wordCount} words</span>
      </div>
      <p className="whitespace-pre-wrap text-base leading-7 text-purple-50">
        {bio}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {copied ? "Copied!" : "Copy Bio"}
        </button>
        <button
          onClick={onRegenerate}
          disabled={regenerating}
          className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-purple-100 transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          {regenerating ? "Writing a different version..." : "Give Me a Different Version"}
        </button>
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-purple-100 transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          {saveState === "saving"
            ? "Saving..."
            : saveState === "saved"
              ? "Saved ✓"
              : "Save This Bio"}
        </button>
      </div>

      {showUpsell && (
        <div className="mt-4 rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-4">
          <p className="text-sm text-purple-100">
            Saving bios is a Pro feature. Upgrade to Pro for $4.99/mo to save unlimited bios to your account.
          </p>
          <Link
            href="/account"
            className="mt-3 inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}

      {saveState === "error" && (
        <p className="mt-4 text-sm text-red-400">Something went wrong saving this bio. Try again.</p>
      )}
    </div>
  );
}
