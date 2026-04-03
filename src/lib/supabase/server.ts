import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnvConfig } from "@/lib/supabase/config";

export function createServerSupabaseClient() {
  const config = getSupabaseEnvConfig();

  if (!config) {
    return null;
  }

  return createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
