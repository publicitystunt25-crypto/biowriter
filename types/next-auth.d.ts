import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: "free" | "pro";
    } & DefaultSession["user"];
  }

  interface User {
    plan: "free" | "pro";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    plan: "free" | "pro";
  }
}
