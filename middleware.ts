import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If no token → not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If role not chosen → onboarding
    if (!token.role && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Student routes protection
    if (pathname.startsWith("/student") && token.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Company routes protection
    if (pathname.startsWith("/company") && token.role !== "COMPANY") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/student/:path*",
    "/company/:path*",
    "/onboarding",
  ],
};