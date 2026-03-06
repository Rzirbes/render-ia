import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["pt", "en"];
const defaultLocale = "pt";

const publicRoutes = ["/login", "/register"];
const protectedRoutes = ["/home", "/render"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith("/api");
  const isNextInternal =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".");

  if (isApiRoute || isNextInternal) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url),
    );
  }

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  const routePath = `/${segments.slice(1).join("/")}`;

  const token = request.cookies.get("token")?.value;

  const isPublicRoute = publicRoutes.some(
    (route) => routePath === route || routePath.startsWith(`${route}/`),
  );

  const isProtectedRoute = protectedRoutes.some(
    (route) => routePath === route || routePath.startsWith(`${route}/`),
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
