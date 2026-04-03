"use server";

import { redirect } from "next/navigation";

import {
  createServerAuthClient,
  isSupabaseAuthConfigured,
  normalizeAdminRedirectPath,
} from "@/lib/auth/supabase-auth";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function buildLoginRedirect(nextPath: string, error?: string) {
  const params = new URLSearchParams();

  if (nextPath !== "/admin") {
    params.set("next", nextPath);
  }

  if (error) {
    params.set("error", error);
  }

  const query = params.toString();
  return query ? `/login?${query}` : "/login";
}

export async function loginAction(formData: FormData) {
  const nextPath = normalizeAdminRedirectPath(readString(formData, "next"));

  if (!isSupabaseAuthConfigured()) {
    redirect(nextPath);
  }

  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    redirect(buildLoginRedirect(nextPath, "Enter your email and password."));
  }

  const client = createServerAuthClient();
  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(buildLoginRedirect(nextPath, error.message));
  }

  redirect(nextPath);
}

export async function logoutAction() {
  if (!isSupabaseAuthConfigured()) {
    redirect("/admin");
  }

  const client = createServerAuthClient();
  await client.auth.signOut();
  redirect("/login");
}

