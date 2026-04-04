"use server";

import { redirect } from "next/navigation";

import { createShowcaseLead } from "@/lib/data/showcase";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitSalonLeadAction(formData: FormData) {
  const name = readString(formData, "name");
  const email = readString(formData, "email");

  if (!name || !email || !email.includes("@")) {
    redirect("/for-salons?request=error");
  }

  try {
    const lead = await createShowcaseLead({
      name,
      email,
      salonName: readString(formData, "salon_name") || null,
      currentSetup: readString(formData, "current_setup") || null,
      notes: readString(formData, "notes") || null,
      sourcePage: "/for-salons",
    });

    if (!lead) {
      redirect("/for-salons?request=error");
    }
  } catch {
    redirect("/for-salons?request=error");
  }

  redirect("/for-salons?request=sent");
}
