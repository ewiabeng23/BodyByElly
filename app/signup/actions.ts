// app/signup/actions.ts
// Server Action ("use server") — runs ONLY on the server, never in the browser.
// Handles new-account creation. Because it's server-side, its validation
// can't be bypassed by tampering with the client.
"use server";

import { createClient } from "@/lib/supabase/server";

export async function signUp(_prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // SECURITY (A3): validate on the server. Client-side checks are for UX only;
  // a user can skip them, so these server checks are the real gate.
  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();

  // signUp triggers Supabase to send the email-confirmation link (verify-on).
  // On success, the DB trigger auto-creates the matching profiles row (role=member).
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }
  return { success: "Check your email for a confirmation link to activate your account." };
}
