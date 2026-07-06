import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!session?.user || !email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      email: true,
      plan: true,
      createdAt: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });

  const header = "email,plan,signed_up,stripe_customer_id,stripe_subscription_id";
  const rows = users.map((u) =>
    [
      csvEscape(u.email),
      u.plan,
      u.createdAt.toISOString(),
      u.stripeCustomerId ?? "",
      u.stripeSubscriptionId ?? "",
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="users-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
