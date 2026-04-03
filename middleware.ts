import { NextResponse, type NextRequest } from "next/server";

import {
  createMiddlewareAuthClient,
  isSupabaseAuthConfigured,
  normalizeAdminRedirectPath,
} from "@/lib/auth/supabase-auth";

function withResponseCookies(source: NextResponse, target: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie.name, cookie.value, cookie);
  }

  return target;
}

export async function middleware(request: NextRequest) {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });
  const supabase = createMiddlewareAuthClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  if (pathname === "/login") {
    if (!user) {
      return response;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "";

    return withResponseCookies(response, NextResponse.redirect(redirectUrl));
  }

  if (pathname.startsWith("/admin") && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";

    const nextPath = normalizeAdminRedirectPath(`${pathname}${request.nextUrl.search}`);

    if (nextPath !== "/admin") {
      redirectUrl.searchParams.set("next", nextPath);
    }

    return withResponseCookies(response, NextResponse.redirect(redirectUrl));
  }

  return response;
}

export const config = {
  matcher: ["/login", "/admin/:path*"],
};

