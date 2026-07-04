export type Purpose = "press" | "streaming" | "social";

export const PURPOSE_LABELS: Record<Purpose, string> = {
  press: "Press kit / media pitch (long-form)",
  streaming: "Streaming platform (Spotify, Apple Music) bio",
  social: "Social media / short bio",
};

const PURPOSE_GUIDANCE: Record<Purpose, string> = {
  press:
    "Write a long-form press bio (300-450 words) suitable for a press kit, media pitch, or festival submission. Use full paragraphs, third person, and a narrative arc.",
  streaming:
    "Write a streaming-platform bio (100-150 words) in the style of a Spotify or Apple Music artist bio. Third person, punchy, highlights sound and standout facts.",
  social:
    "Write a short bio (30-60 words) for social media profiles (Instagram/TikTok bio link page, etc). Punchy, no fluff, can be first or third person.",
};

export interface UpgradeInput {
  mode: "upgrade";
  currentBio: string;
  genre?: string;
  purpose: Purpose;
  notes?: string;
}

export interface CreateInput {
  mode: "create";
  artistName: string;
  genre: string;
  hometown?: string;
  highlights?: string;
  influences?: string;
  upcoming?: string;
  purpose: Purpose;
  notes?: string;
}

export type BioInput = UpgradeInput | CreateInput;

const SYSTEM_PROMPT = `You are a professional music industry bio writer who has written artist bios for record labels, publicists, and streaming platforms. You write clean, engaging, industry-standard artist bios. You never use generic filler phrases like "up-and-coming" or "rising star" unless the artist's own details justify it. You write only the bio itself, with no preamble, no headers, and no explanation before or after.`;

export function buildPrompt(input: BioInput): { system: string; user: string } {
  const guidance = PURPOSE_GUIDANCE[input.purpose];

  if (input.mode === "upgrade") {
    const user = `Rewrite and upgrade the following artist bio into a polished, industry-standard version.

${guidance}

Keep every true fact from the original bio. Improve structure, flow, word choice, and professionalism. Cut clichés and filler. If a genre is given, make sure the tone matches that genre's audience.

Genre: ${input.genre || "not specified"}
Extra notes from the artist: ${input.notes || "none"}

CURRENT BIO:
"""
${input.currentBio}
"""

Return only the rewritten bio text.`;
    return { system: SYSTEM_PROMPT, user };
  }

  const user = `Write a brand new industry-standard artist bio from the details below.

${guidance}

Artist name: ${input.artistName}
Genre: ${input.genre}
Hometown: ${input.hometown || "not specified"}
Career highlights (releases, streams, press, tours, awards): ${input.highlights || "none given"}
Influences / sounds like: ${input.influences || "not specified"}
Upcoming releases or shows to mention: ${input.upcoming || "none"}
Extra notes from the artist: ${input.notes || "none"}

Return only the bio text.`;
  return { system: SYSTEM_PROMPT, user };
}
