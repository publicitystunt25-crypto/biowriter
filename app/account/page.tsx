import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(217,70,239,0.18),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(34,211,238,0.15),transparent_45%)]" />
      <div className="relative w-full max-w-2xl">
        <h1 className="bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          My Account
        </h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <p className="text-sm text-purple-200/70">Signed in as</p>
          <p className="text-lg font-medium text-white">{session.user.email}</p>
          <p className="mt-4 text-sm text-purple-200/70">Plan</p>
          <p className="text-lg font-medium capitalize text-white">{session.user.plan}</p>
        </div>

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
