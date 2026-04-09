// proxy.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    /* -------------------------------- */
    /* BLOCK LOGIN / SIGNUP IF LOGGED IN */
    /* -------------------------------- */

    if (token && isAuthPage) {
      if (!token.role) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }

      if (token.role === "STUDENT") {
        return NextResponse.redirect(new URL("/student/dashboard", req.url));
      }

      if (token.role === "COMPANY") {
        return NextResponse.redirect(new URL("/company/dashboard", req.url));
      }
    }

    /* -------------------------------- */
    /* FORCE ONBOARDING IF ROLE MISSING */
    /* -------------------------------- */

    if (token && !token.role && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    /* -------------------------------- */
    /* ROLE BASED PROTECTION */
    /* -------------------------------- */

    if (pathname.startsWith("/student") && token?.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/company") && token?.role !== "COMPANY") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // allow visiting login/signup even if not logged in
        if (pathname === "/login" || pathname === "/signup") {
          return true;
        }

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/onboarding",
    "/student/:path*",
    "/company/:path*",
  ],
};
