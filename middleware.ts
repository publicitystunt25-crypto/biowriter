import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const email = req.auth?.user?.email?.toLowerCase();

  if (pathname.startsWith("/account") && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  if (pathname.startsWith("/admin") && (!req.auth || !email || !ADMIN_EMAILS.includes(email))) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
