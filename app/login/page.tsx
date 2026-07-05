"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-purple-200/30 backdrop-blur-sm outline-none transition-colors focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) throw new Error("Invalid email or password.");

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(251,191,36,0.15),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(217,70,239,0.15),transparent_45%)]" />
      <div className="relative w-full max-w-sm">
        <h1 className="bg-gradient-to-r from-amber-300 to-fuchsia-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Log In
        </h1>
        <p className="mt-2 text-purple-200/70">Welcome back.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-purple-100/90">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-purple-100/90">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/20 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-purple-200/70">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-amber-300 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
