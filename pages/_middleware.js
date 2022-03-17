import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const middleware = async (req) => {
  // Token will exist if user is logged in
  const token = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  // Allow the request if the following conditions are met:
  // 1) It's a request for next-auth session & provider fetching
  // 2) The token exists
  if (pathname.includes("/api/auth") || token) {
    // If the token exists, and are requesting the login page, redirect to the home page
    if (token && pathname === "/login") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Otherwise, redirect to the login page if no token and are requesting to the protected route
  if (!token && pathname !== "/login") {
    // Need to put absolute url in the redirect url now
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
};
