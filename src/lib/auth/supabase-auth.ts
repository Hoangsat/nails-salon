import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

import { getSupabaseEnvConfig } from "@/lib/supabase/config";

const DEFAULT_ADMIN_REDIRECT = "/admin";

function setCookieValues(
  target: {
    set: (name: string, value: string, options?: CookieOptions) => void;
  },
  cookiesToSet: { name: string; value: string; options?: CookieOptions }[],
) {
  for (const cookie of cookiesToSet) {
    target.set(cookie.name, cookie.value, cookie.options);
  }
}

export function isSupabaseAuthConfigured() {
  return getSupabaseEnvConfig() !== null;
}

export function normalizeAdminRedirectPath(nextPath?: string | null) {
  if (!nextPath) {
    return DEFAULT_ADMIN_REDIRECT;
  }

  if (!nextPath.startsWith("/admin") || nextPath.startsWith("//")) {
    return DEFAULT_ADMIN_REDIRECT;
  }

  return nextPath;
}

export function getAdminLoginRedirect(nextPath?: string | null) {
  const safeNextPath = normalizeAdminRedirectPath(nextPath);
  return safeNextPath === DEFAULT_ADMIN_REDIRECT
    ? "/login"
    : `/login?next=${encodeURIComponent(safeNextPath)}`;
}

function requireSupabaseAuthConfig() {
  const config = getSupabaseEnvConfig();

  if (!config) {
    throw new Error("Supabase Auth must be configured for admin sign-in.");
  }

  return config;
}

export function createServerAuthClient() {
  const config = requireSupabaseAuthConfig();
  const cookieStore = cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          setCookieValues(cookieStore, cookiesToSet);
        } catch {
          // Server Components can read cookies but may not be able to mutate them.
        }
      },
    },
  });
}

export function createMiddlewareAuthClient(request: NextRequest, response: NextResponse) {
  const config = requireSupabaseAuthConfig();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          request.cookies.set(cookie.name, cookie.value);
        }

        setCookieValues(response.cookies, cookiesToSet);
      },
    },
  });
}

export async function getCurrentAdminUser(): Promise<User | null> {
  if (!isSupabaseAuthConfigured()) {
    return null;
  }

  const client = createServerAuthClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  return user ?? null;
}

