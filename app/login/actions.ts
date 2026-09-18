// app/login/actions.ts
// Server Action — authenticates a user server-side, then redirects.
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  // SECURITY (B2): Supabase verifies credentials. A wrong password (or an
  // unconfirmed email, since verify is on) returns an error and no session.
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Refresh cached layout so the UI reflects the now-logged-in state, then go in.
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
