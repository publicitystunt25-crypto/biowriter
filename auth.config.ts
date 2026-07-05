import type { NextAuthConfig } from "next-auth";

// Edge-safe config shared by middleware and the full auth.ts.
// No providers/adapters here — anything using bcrypt or the Postgres
// driver must stay out of this file so middleware (Edge runtime) can import it.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.plan = (user as { plan?: "free" | "pro" }).plan ?? "free";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as "free" | "pro";
      }
      return session;
    },
  },
};
