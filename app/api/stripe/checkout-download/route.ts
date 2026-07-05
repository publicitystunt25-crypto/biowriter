import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const PENDING_DOWNLOAD_TTL_MS = 30 * 60 * 1000;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_ID_PDF_DOWNLOAD;
  if (!priceId) {
    return NextResponse.json(
      { error: "Server is missing STRIPE_PRICE_ID_PDF_DOWNLOAD." },
      { status: 500 }
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe is not configured.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await request.json();
  const { content, title } = body as { content?: string; title?: string };
  if (!content?.trim()) {
    return NextResponse.json({ error: "content is required." }, { status: 400 });
  }

  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({ email: user.email });
    stripeCustomerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId } });
  }

  const origin = new URL(request.url).origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/api/pdf/download?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/create`,
  });

  await prisma.pendingDownload.create({
    data: {
      stripeSessionId: checkoutSession.id,
      userId: user.id,
      bioContent: content,
      title: title?.trim() || null,
      status: "pending",
      expiresAt: new Date(Date.now() + PENDING_DOWNLOAD_TTL_MS),
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
