import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["en", "ru"] as const;
const DEFAULT_LOCALE = "hy";

const LEGACY_REDIRECTS: Record<string, string> = {
  "/arm": "/",
  "/hy": "/",
  "/eng": "/en",
  "/rus": "/ru",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle legacy path redirects (e.g. /arm → /, /eng → /en)
  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    if (pathname === from || pathname.startsWith(`${from}/`)) {
      const suffix = pathname.slice(from.length);
      const destination = to === "/" ? `/${suffix}`.replace("//", "/") : `${to}${suffix}`;
      const url = request.nextUrl.clone();
      url.pathname = destination || "/";
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // Rewrite paths without a locale prefix to the default locale
  const hasLocalePrefix = SUPPORTED_LOCALES.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocalePrefix) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|robots\\.txt|sitemap\\.xml|public/|.*\\..*).*)",
  ],
};
