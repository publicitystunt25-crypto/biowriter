import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UpgradeButton, ManageBillingButton } from "@/components/AccountActions";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const savedBios =
    user.plan === "pro"
      ? await prisma.savedBio.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        })
      : [];

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(217,70,239,0.18),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(34,211,238,0.15),transparent_45%)]" />
      <div className="relative w-full max-w-2xl">
        <h1 className="bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          My Account
        </h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <p className="text-sm text-purple-200/70">Signed in as</p>
          <p className="text-lg font-medium text-white">{user.email}</p>
          <p className="mt-4 text-sm text-purple-200/70">Plan</p>
          <p className="text-lg font-medium capitalize text-white">{user.plan}</p>
          {user.plan === "pro" ? <ManageBillingButton /> : <UpgradeButton />}
        </div>

        {user.plan === "pro" ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white">Saved Bios</h2>
            {savedBios.length === 0 ? (
              <p className="mt-2 text-sm text-purple-200/70">
                You haven&apos;t saved any bios yet.
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {savedBios.map((saved) => (
                  <div
                    key={saved.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">
                        {saved.title || `${saved.genre ?? "Bio"}`}
                      </p>
                      <span className="text-xs text-purple-200/50">
                        {saved.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-purple-200/70">
                      {saved.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-6">
            <p className="text-sm text-purple-100">
              Upgrade to Pro for $4.99/mo to save unlimited bios and generate without limits.
            </p>
          </div>
        )}

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-purple-100 transition-colors hover:bg-white/10"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
