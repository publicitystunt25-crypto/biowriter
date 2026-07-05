import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BioDocument } from "@/lib/pdf/bio-document";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.plan !== "pro") {
    return NextResponse.json(
      { error: "Free PDF downloads are a Pro feature.", code: "PRO_REQUIRED" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { content, title } = body as { content?: string; title?: string };
  if (!content?.trim()) {
    return NextResponse.json({ error: "content is required." }, { status: 400 });
  }

  const pdfBuffer = await renderToBuffer(
    <BioDocument title={title?.trim() || "Artist Bio"} content={content} />
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="bio.pdf"',
    },
  });
}
