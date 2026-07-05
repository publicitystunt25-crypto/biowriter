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

function computeTitle(meta: BioMeta): string {
  return meta.mode === "create" && meta.artistName
    ? meta.artistName
    : `Bio — ${new Date().toLocaleDateString()}`;
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
  const [showUpsell, setShowUpsell] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [downloadState, setDownloadState] = useState<"idle" | "working" | "error">("idle");
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleSave = async () => {
    if (plan !== "pro") {
      setShowUpsell(true);
      return;
    }

    setSaveState("saving");
    try {
      const res = await fetch("/api/bios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: bio,
          mode: meta.mode,
          purpose: meta.purpose,
          genre: meta.genre,
          title: computeTitle(meta),
        }),
      });
      if (!res.ok) throw new Error();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  };

  const handleDownload = async () => {
    setDownloadState("working");
    setDownloadError(null);
    try {
      if (plan === "pro") {
        const res = await fetch("/api/pdf/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: bio, title: computeTitle(meta) }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Something went wrong.");
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "bio.pdf";
        a.click();
        URL.revokeObjectURL(url);
        setDownloadState("idle");
      } else {
        const res = await fetch("/api/stripe/checkout-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: bio, title: computeTitle(meta) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong.");
        window.location.href = data.url;
      }
    } catch (err) {
      setDownloadState("error");
      setDownloadError(err instanceof Error ? err.message : "Something went wrong.");
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
      <p
        className="whitespace-pre-wrap text-base leading-7 text-purple-50 select-none"
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        {bio}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
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
        <button
          onClick={handleDownload}
          disabled={downloadState === "working"}
          className="rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {downloadState === "working"
            ? plan === "pro"
              ? "Preparing PDF..."
              : "Redirecting to payment..."
            : plan === "pro"
              ? "Download This Bio"
              : "Download This Bio — $1"}
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
      {downloadState === "error" && (
        <p className="mt-4 text-sm text-red-400">{downloadError}</p>
      )}
    </div>
  );
}
