import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt, type BioInput } from "@/lib/bio-prompt";

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  let input: BioInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (input.mode === "upgrade" && !input.currentBio?.trim()) {
    return NextResponse.json({ error: "currentBio is required." }, { status: 400 });
  }
  if (input.mode === "create" && (!input.artistName?.trim() || !input.genre?.trim())) {
    return NextResponse.json(
      { error: "artistName and genre are required." },
      { status: 400 }
    );
  }

  const { system, user } = buildPrompt(input);
  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({ bio: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Bio generation failed: ${message}` },
      { status: 502 }
    );
  }
}
