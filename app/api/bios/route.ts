import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { BioMode, Purpose } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  if (user.plan !== "pro") {
    return NextResponse.json(
      { error: "Saving bios is a Pro feature.", code: "PRO_REQUIRED" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { content, mode, purpose, title, genre } = body as {
    content?: string;
    mode?: BioMode;
    purpose?: Purpose;
    title?: string;
    genre?: string;
  };

  if (!content?.trim() || !mode || !purpose) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const savedBio = await prisma.savedBio.create({
    data: {
      userId: user.id,
      content,
      mode,
      purpose,
      title: title?.trim() || null,
      genre: genre?.trim() || null,
    },
  });

  return NextResponse.json({ savedBio });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const savedBios = await prisma.savedBio.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ savedBios });
}
