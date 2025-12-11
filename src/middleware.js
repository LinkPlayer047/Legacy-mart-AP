import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("adminToken");

  if (req.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/products") ||
    req.nextUrl.pathname.startsWith("/categories") ||
    req.nextUrl.pathname.startsWith("/orders") ||
    req.nextUrl.pathname.startsWith("/users")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/categories/:path*",
    "/orders/:path*",
    "/users/:path*",
    "/login",
  ],
};
