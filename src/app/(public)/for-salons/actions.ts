"use server";

import { redirect } from "next/navigation";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitSalonLeadAction(formData: FormData) {
  const name = readString(formData, "name");
  const email = readString(formData, "email");

  if (!name || !email) {
    redirect("/for-salons?request=error");
  }

  redirect("/for-salons?request=sent");
}
