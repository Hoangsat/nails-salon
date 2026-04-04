import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ShowcaseLeadsRow } from "@/types/database";

export type CreateShowcaseLeadInput = {
  name: string;
  email: string;
  salonName?: string | null;
  currentSetup?: string | null;
  notes?: string | null;
  sourcePage?: string;
};

export async function createShowcaseLead(
  input: CreateShowcaseLeadInput,
): Promise<ShowcaseLeadsRow | null> {
  const client = createServerSupabaseClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("showcase_leads")
    .insert({
      name: input.name,
      email: input.email,
      salon_name: input.salonName ?? null,
      current_setup: input.currentSetup ?? null,
      notes: input.notes ?? null,
      source_page: input.sourcePage ?? "/for-salons",
    })
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Unable to save showcase lead.");
  }

  return (data as ShowcaseLeadsRow | null) ?? null;
}
