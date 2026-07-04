"use server";

export async function subscribeToNewsletter(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return;
  }

  // Placeholder for a future email provider or CRM integration.
  void email;
}
