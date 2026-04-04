import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import {
  getAdminAccessDeniedMessage,
  getAdminConfigErrorMessage,
  getAdminLoginRedirect,
  getCurrentAdminUser,
  isAdminUserAllowed,
  isSupabaseAuthConfigured,
  shouldAllowOpenAdminPreview,
} from "@/lib/auth/supabase-auth";

export default async function AdminLayout({ children }: PropsWithChildren) {
  if (!isSupabaseAuthConfigured()) {
    if (!shouldAllowOpenAdminPreview()) {
      redirect(getAdminLoginRedirect("/admin", getAdminConfigErrorMessage()));
    }

    return children;
  }

  const currentUser = await getCurrentAdminUser();

  if (!currentUser) {
    redirect(getAdminLoginRedirect("/admin"));
  }

  if (!isAdminUserAllowed(currentUser)) {
    redirect(getAdminLoginRedirect("/admin", getAdminAccessDeniedMessage()));
  }

  return children;
}
