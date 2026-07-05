export type Purpose = "press" | "streaming" | "social";
export type Category = "artist" | "entrepreneur" | "business";

export const CATEGORY_LABELS: Record<Category, string> = {
  artist: "Artist",
  entrepreneur: "Entrepreneur",
  business: "Business",
};

export function getPurposeLabels(category: Category): Record<Purpose, string> {
  return {
    press: "Press kit / media pitch (long-form)",
    streaming:
      category === "artist"
        ? "Streaming platform (Spotify, Apple Music) bio"
        : "Website / About page bio (medium-form)",
    social: "Social media / short bio",
  };
}

function getPurposeGuidance(category: Category, purpose: Purpose): string {
  const subject =
    category === "artist" ? "artist" : category === "entrepreneur" ? "entrepreneur" : "company";

  const guidance: Record<Purpose, string> = {
    press: `Write a long-form press bio (300-450 words) suitable for a press kit, media pitch, or feature submission about this ${subject}. Use full paragraphs, third person, and a narrative arc.`,
    streaming:
      category === "artist"
        ? "Write a streaming-platform bio (100-150 words) in the style of a Spotify or Apple Music artist bio. Third person, punchy, highlights sound and standout facts."
        : `Write a medium-length bio (100-150 words) suitable for a website "About" page. Third person, professional, highlights what makes this ${subject} stand out.`,
    social: `Write a short bio (30-60 words) for social media profiles (Instagram/TikTok/LinkedIn bio, etc) about this ${subject}. Punchy, no fluff, can be first or third person.`,
  };

  return guidance[purpose];
}

export interface CreateFieldLabels {
  name: string;
  category2: string;
  location: string;
  highlights: string;
  influences: string;
  upcoming: string;
}

export function getCreateFieldLabels(category: Category): CreateFieldLabels {
  switch (category) {
    case "entrepreneur":
      return {
        name: "Your name",
        category2: "Industry / field",
        location: "Based in",
        highlights: "Career highlights (optional) — achievements, press, ventures, awards",
        influences: "Inspirations / mentors (optional)",
        upcoming: "Upcoming plans or goals to mention (optional)",
      };
    case "business":
      return {
        name: "Business name",
        category2: "Industry",
        location: "Headquartered in",
        highlights: "Company highlights (optional) — milestones, press, revenue, awards",
        influences: "Comparable brands / positioning (optional)",
        upcoming: "Upcoming launches or milestones to mention (optional)",
      };
    default:
      return {
        name: "Artist / stage name",
        category2: "Genre",
        location: "Hometown",
        highlights: "Career highlights (optional) — releases, streams, press, tours, awards",
        influences: "Influences / sounds like (optional)",
        upcoming: "Upcoming releases or shows to mention (optional)",
      };
  }
}

export interface UpgradeInput {
  mode: "upgrade";
  currentBio: string;
  genre?: string;
  purpose: Purpose;
  notes?: string;
}

export interface CreateInput {
  mode: "create";
  category: Category;
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

const SYSTEM_PROMPT = `You are a professional bio writer who has written bios for musicians, entrepreneurs, and businesses for press kits, publicists, and marketing use. You write clean, engaging, professional bios. You never use generic filler phrases like "up-and-coming" or "rising star" unless the person or company's own details justify it. You write only the bio itself, with no preamble, no headers, and no explanation before or after.`;

export function buildPrompt(input: BioInput): { system: string; user: string } {
  if (input.mode === "upgrade") {
    const guidance = getPurposeGuidance("artist", input.purpose);
    const user = `Rewrite and upgrade the following bio into a polished, professional version.

${guidance}

Keep every true fact from the original bio. Improve structure, flow, word choice, and professionalism. Cut clichés and filler. If a genre or field is given, make sure the tone matches that audience.

Genre / field: ${input.genre || "not specified"}
Extra notes: ${input.notes || "none"}

CURRENT BIO:
"""
${input.currentBio}
"""

Return only the rewritten bio text.`;
    return { system: SYSTEM_PROMPT, user };
  }

  const guidance = getPurposeGuidance(input.category, input.purpose);
  const labels = getCreateFieldLabels(input.category);
  const subject =
    input.category === "artist"
      ? "artist"
      : input.category === "entrepreneur"
        ? "entrepreneur"
        : "business";

  const user = `Write a brand new professional bio for a(n) ${subject} from the details below.

${guidance}

${labels.name}: ${input.artistName}
${labels.category2}: ${input.genre}
${labels.location}: ${input.hometown || "not specified"}
${labels.highlights}: ${input.highlights || "none given"}
${labels.influences}: ${input.influences || "not specified"}
${labels.upcoming}: ${input.upcoming || "none"}
Extra notes: ${input.notes || "none"}

Return only the bio text.`;
  return { system: SYSTEM_PROMPT, user };
}
