import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt, type BioInput } from "@/lib/bio-prompt";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const FREE_BIO_LIMIT = 3;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Sign in to generate a bio.", code: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to generate a bio.", code: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  // Atomic reserve-before-generate: avoids a race between two concurrent
  // requests both passing a plain read-then-write cap check.
  if (user.plan === "free") {
    const reserved = await prisma.user.updateMany({
      where: { id: user.id, plan: "free", freeBiosGenerated: { lt: FREE_BIO_LIMIT } },
      data: { freeBiosGenerated: { increment: 1 } },
    });
    if (reserved.count === 0) {
      return NextResponse.json(
        {
          error: "You've used all 3 free bios. Upgrade to Pro for unlimited generations.",
          code: "FREE_LIMIT_REACHED",
        },
        { status: 403 }
      );
    }
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  const { system, user: userPrompt } = buildPrompt(input);
  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userPrompt }],
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
