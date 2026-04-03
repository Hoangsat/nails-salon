import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnvConfig } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

export function createBrowserSupabaseClient() {
  const config = getSupabaseEnvConfig();

  if (!config) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return browserClient;
}
