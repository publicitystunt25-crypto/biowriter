"use client";

import { useState } from "react";

export default function BioResult({
  bio,
  onRegenerate,
  regenerating,
}: {
  bio: string;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
      <div className="mt-6 flex gap-3">
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
          {regenerating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>
    </div>
  );
}
