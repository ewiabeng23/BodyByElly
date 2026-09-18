// app/logout/actions.ts
// Server Action — ends the session server-side and sends the user to /login.
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();

  // SECURITY (B4): sign out on the server so the session cookie is properly
  // cleared. After this, middleware bounces the user from protected routes.
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
