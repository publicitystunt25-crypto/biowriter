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
    <div className="w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Your Bio
        </h2>
        <span className="text-xs text-zinc-400">{wordCount} words</span>
      </div>
      <p className="whitespace-pre-wrap text-base leading-7 text-zinc-800 dark:text-zinc-100">
        {bio}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleCopy}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          {copied ? "Copied!" : "Copy Bio"}
        </button>
        <button
          onClick={onRegenerate}
          disabled={regenerating}
          className="rounded-full border border-black/10 px-5 py-2 text-sm font-medium transition-colors hover:bg-black/[.04] disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/[.08]"
        >
          {regenerating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>
    </div>
  );
}
