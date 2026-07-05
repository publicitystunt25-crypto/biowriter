import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Server is missing STRIPE_WEBHOOK_SECRET." },
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

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      if (checkoutSession.mode === "subscription") {
        const customerId =
          typeof checkoutSession.customer === "string"
            ? checkoutSession.customer
            : checkoutSession.customer?.id;
        const subscriptionId =
          typeof checkoutSession.subscription === "string"
            ? checkoutSession.subscription
            : checkoutSession.subscription?.id;

        if (customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: { plan: "pro", stripeSubscriptionId: subscriptionId ?? null },
          });
        }
      }

      if (checkoutSession.mode === "payment") {
        await prisma.pendingDownload.updateMany({
          where: { stripeSessionId: checkoutSession.id },
          data: { status: "paid" },
        });
      }
      break;
    }

    case "checkout.session.async_payment_failed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      if (checkoutSession.mode === "payment") {
        await prisma.pendingDownload.updateMany({
          where: { stripeSessionId: checkoutSession.id },
          data: { status: "failed" },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

      if (subscription.status === "active" || subscription.status === "trialing") {
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: "pro", stripeSubscriptionId: subscription.id },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

      // Downgrade only — freeBiosGenerated is never reset, so a cancel/re-subscribe
      // loop can't be used to regrant free generations.
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan: "free", stripeSubscriptionId: null },
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
