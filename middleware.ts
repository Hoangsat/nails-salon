import { NextResponse, type NextRequest } from "next/server";

import {
  createMiddlewareAuthClient,
  getAdminAccessDeniedMessage,
  getAdminConfigErrorMessage,
  getAdminLoginRedirect,
  isAdminUserAllowed,
  isSupabaseAuthConfigured,
  normalizeAdminRedirectPath,
  shouldAllowOpenAdminPreview,
} from "@/lib/auth/supabase-auth";

function withResponseCookies(source: NextResponse, target: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie.name, cookie.value, cookie);
  }

  return target;
}

function redirectToLogin(request: NextRequest, response: NextResponse, nextPath?: string, error?: string) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/login";
  redirectUrl.search = "";

  const redirectTarget = getAdminLoginRedirect(nextPath, error);
  const [pathname, query = ""] = redirectTarget.split("?");
  redirectUrl.pathname = pathname;
  redirectUrl.search = query ? `?${query}` : "";

  return withResponseCookies(response, NextResponse.redirect(redirectUrl));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isSupabaseAuthConfigured()) {
    if (pathname.startsWith("/admin") && !shouldAllowOpenAdminPreview()) {
      return redirectToLogin(
        request,
        NextResponse.next({ request }),
        `${pathname}${request.nextUrl.search}`,
        getAdminConfigErrorMessage(),
      );
    }

    return NextResponse.next();
  }

  const response = NextResponse.next({ request });
  const supabase = createMiddlewareAuthClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname === "/login") {
    if (!user || !isAdminUserAllowed(user)) {
      return response;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "";

    return withResponseCookies(response, NextResponse.redirect(redirectUrl));
  }

  if (pathname.startsWith("/admin") && !user) {
    const nextPath = normalizeAdminRedirectPath(`${pathname}${request.nextUrl.search}`);
    return redirectToLogin(request, response, nextPath);
  }

  if (pathname.startsWith("/admin") && user && !isAdminUserAllowed(user)) {
    const nextPath = normalizeAdminRedirectPath(`${pathname}${request.nextUrl.search}`);
    return redirectToLogin(request, response, nextPath, getAdminAccessDeniedMessage());
  }

  return response;
}

export const config = {
  matcher: ["/login", "/admin/:path*"],
};
