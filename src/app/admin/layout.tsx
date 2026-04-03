import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { getAdminLoginRedirect, getCurrentAdminUser, isSupabaseAuthConfigured } from "@/lib/auth/supabase-auth";

export default async function AdminLayout({ children }: PropsWithChildren) {
  if (isSupabaseAuthConfigured()) {
    const currentUser = await getCurrentAdminUser();

    if (!currentUser) {
      redirect(getAdminLoginRedirect("/admin"));
    }
  }

  return children;
}

