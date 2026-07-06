import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function getRevenueThisMonth(): Promise<string> {
  try {
    const stripe = getStripe();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const charges = await stripe.charges.list({
      created: { gte: Math.floor(startOfMonth.getTime() / 1000) },
      limit: 100,
    });
    const totalCents = charges.data
      .filter((c) => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0);
    return `$${(totalCents / 100).toFixed(2)}`;
  } catch {
    return "N/A";
  }
}

export default async function AdminPage() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!session?.user || !email || !ADMIN_EMAILS.includes(email)) {
    redirect("/");
  }

  const [totalUsers, proUsers, allUsers, savedBios, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "pro" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { email: true, plan: true, createdAt: true, stripeSubscriptionId: true },
    }),
    prisma.savedBio.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      include: { user: { select: { email: true } } },
    }),
    getRevenueThisMonth(),
  ]);

  const freeUsers = totalUsers - proUsers;

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(217,70,239,0.18),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(34,211,238,0.15),transparent_45%)]" />
      <div className="relative w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Admin Dashboard
          </h1>
          <a
            href="/api/admin/export-users"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Export Emails (CSV)
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-purple-200/70">Total Users</p>
            <p className="mt-1 text-2xl font-semibold text-white">{totalUsers}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-purple-200/70">Free</p>
            <p className="mt-1 text-2xl font-semibold text-white">{freeUsers}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-purple-200/70">Pro</p>
            <p className="mt-1 text-2xl font-semibold text-white">{proUsers}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-purple-200/70">Revenue This Month</p>
            <p className="mt-1 text-2xl font-semibold text-white">{revenue}</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white">
            Accounts ({allUsers.length})
          </h2>
          <div className="mt-4 max-h-[480px] overflow-y-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-[#170f26] text-purple-200/70">
                <tr>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Plan</th>
                  <th className="px-4 py-2 font-medium">Signed Up</th>
                  <th className="px-4 py-2 font-medium">Subscription</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.email} className="border-t border-white/10">
                    <td className="px-4 py-2 text-white">{u.email}</td>
                    <td className="px-4 py-2 capitalize text-purple-100">{u.plan}</td>
                    <td className="px-4 py-2 text-purple-200/70">
                      {u.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {u.plan === "pro" && u.stripeSubscriptionId ? (
                        <a
                          href={`https://dashboard.stripe.com/subscriptions/${u.stripeSubscriptionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-300 hover:underline"
                        >
                          Active →
                        </a>
                      ) : (
                        <span className="text-purple-200/50">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white">
            Saved Bios ({savedBios.length})
          </h2>
          {savedBios.length === 0 ? (
            <p className="mt-2 text-sm text-purple-200/70">No saved bios yet.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {savedBios.map((saved) => (
                <div
                  key={saved.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">
                      {saved.title || saved.genre || "Untitled"}
                    </p>
                    <span className="text-xs text-purple-200/50">
                      {saved.user.email} · {saved.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
