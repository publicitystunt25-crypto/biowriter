import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { BioDocument } from "@/lib/pdf/bio-document";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  const pendingDownload = await prisma.pendingDownload.findUnique({
    where: { stripeSessionId: sessionId },
  });
  if (!pendingDownload) {
    return NextResponse.json({ error: "Download not found." }, { status: 404 });
  }
  if (pendingDownload.status === "consumed") {
    return NextResponse.json({ error: "This download link was already used." }, { status: 410 });
  }
  if (pendingDownload.expiresAt < new Date()) {
    return NextResponse.json({ error: "This download link has expired." }, { status: 410 });
  }

  // The webhook is the authoritative writer of "paid" status, but don't make
  // the user wait on webhook delivery — independently verify with Stripe too.
  if (pendingDownload.status !== "paid") {
    let stripe;
    try {
      stripe = getStripe();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Stripe is not configured.";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not confirmed yet. Please wait a moment and refresh." },
        { status: 402 }
      );
    }
  }

  const pdfBuffer = await renderToBuffer(
    <BioDocument
      title={pendingDownload.title?.trim() || "Artist Bio"}
      content={pendingDownload.bioContent}
    />
  );

  await prisma.pendingDownload.update({
    where: { id: pendingDownload.id },
    data: { status: "consumed" },
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="bio.pdf"',
    },
  });
}
